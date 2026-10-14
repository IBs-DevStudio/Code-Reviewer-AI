import { NonRetriableError } from "inngest";
import { inngest } from "@/server/inngest/client";
import { db } from "@/server/db";
import { reviewCode } from "@/server/services/ai";
import {
  fetchPullRequest,
  fetchPullRequestFiles,
  getGitHubAccessToken,
} from "@/server/services/github";

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
  
    const { reviewId, repositoryId, prNumber, userId } =
      event.data as ReviewPREvent["data"];

    try {
      await step.run("update-status-to-processing", async () => {
        await db.review.update({
          where: { id: reviewId },
          data: { status: "PROCESSING" },
        });
      });

      // The access token is fetched inside this step and not returned,
      // so it doesn't get stored in Inngest's step state.
      const prData = await step.run("fetch-pr-data", async () => {
        const repository = await db.repository.findUnique({
          where: { id: repositoryId, userId },
        });
        if (!repository) throw new NonRetriableError("Repository not found");

        const accessToken = await getGitHubAccessToken(userId);
        if (!accessToken) {
          throw new NonRetriableError("GitHub account not connected");
        }

        const [owner, repo] = repository.fullName.split("/");
        if (!owner || !repo) {
          throw new NonRetriableError("Invalid repository full name");
        }

        const pr = await fetchPullRequest(accessToken, owner, repo, prNumber);
        const files = await fetchPullRequestFiles(
          accessToken,
          owner,
          repo,
          prNumber,
        );

        return {
          title: pr.title,
          files: files.map((f) => ({
            filename: f.filename,
            status: f.status,
            additions: f.additions,
            deletions: f.deletions,
            patch: f.patch,
          })),
        };
      });

      const reviewResult = await step.run("generate-review", async () => {
        return reviewCode({
          prTitle: prData.title,
          filesChanged: prData.files,
        });
      });

      await step.run("save-results", async () => {
        await db.review.update({
          where: { id: reviewId },
          data: {
            status: "COMPLETED",
            summary: reviewResult.summary,
            riskScore: reviewResult.riskScore,
            comments: JSON.parse(JSON.stringify(reviewResult.comments)),
          },
        });
      });

      return { success: true };
    } catch (error) {
      await step.run("mark-failed", async () => {
        await db.review.update({
          where: { id: reviewId },
          data: {
            status: "FAILED",
            error: error instanceof Error ? error.message : "Unknown error",
          },
        });
      });
      throw error;
    }
  },
);