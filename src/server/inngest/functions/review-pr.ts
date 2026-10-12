import { inngest } from "@/server/inngest/client";
import { db } from "@/server/db";
import { fetchPullRequestFiles, getGitHubAccessToken } from "@/server/services/github";

export type ReviewPREvent = {
  name: "review/pull-request.requested";
  data: {
    reviewId: string;
    repositoryId: string;
    prNumber: number;
    userId: string;
  };
};

export const reviewPullRequest = inngest.createFunction(
  { id: "review-pull-request", retries: 2 }, 
  { event: "review/pull-request.requested" },
  async ({ event, step }) => {
    const { reviewId, repositoryId, prNumber, userId } = event.data;

    // Step 1: Update status to PROCESSING
    await step.run("update-status-to-processing", async () => {
      await db.review.update({
        where: { id: reviewId },
        data: { status: "PROCESSING" },
      });
    });

    // Step 2: Fetch Repository
    const repository = await step.run("get-repository", async () => {
      return await db.repository.findUnique({
        where: { id: repositoryId },
      });
    });

    if (!repository) {
      await step.run("mark-failed-no-repo", async () => {
        await db.review.update({
          where: { id: reviewId },
          data: { status: "FAILED", error: "Repository not found" },
        });
      });
      return { success: false, error: "Repository not found" };
    }

    // Step 3: Fetch GitHub Access Token
    const accessToken = await step.run("get-access-token", async () => {
      return await getGitHubAccessToken(userId);
    });

    if (!accessToken) {
      await step.run("mark-failed-no-token", async () => {
        await db.review.update({
          where: { id: reviewId },
          data: { status: "FAILED", error: "GitHub account not connected" },
        });
      });
      return { success: false, error: "GitHub access token not found" };
    }

    const [owner, repo] = repository.fullName.split("/");
    if (!owner || !repo) {
      await step.run("mark-failed-invalid-repo", async () => {
        await db.review.update({
          where: { id: reviewId },
          data: { status: "FAILED", error: "Invalid repository full name" },
        });
      });
      return { success: false, error: "Invalid repository full name" };
    }

    // Step 4: Fetch PR Changed Files
    const files = await step.run("fetch-pr-files", async () => {
      return await fetchPullRequestFiles(accessToken, owner, repo, prNumber);
    });

    // Step 5: Generate Review (Mocked in this chapter, replaced with OpenAI in next chapter)
    const reviewResult = await step.run("generate-review", async () => {
      return {
        summary: "Pull request reviewed successfully with placeholder analysis.",
        riskScore: 25,
        comments: [
          {
            file: files[0]?.filename ?? "README.md",
            line: 1,
            severity: "low",
            category: "style",
            message: "Consider adding more descriptive documentation comments.",
            suggestion: "Add inline JSDoc comments explaining function arguments.",
          },
        ],
      };
    });

    // Step 6: Save Results to Database
    await step.run("save-results", async () => {
      await db.review.update({
        where: { id: reviewId },
        data: {
          status: "COMPLETED",
          summary: reviewResult.summary,
          riskScore: reviewResult.riskScore,
          comments: reviewResult.comments,
        },
      });
    });

    return { success: true };
  }
);