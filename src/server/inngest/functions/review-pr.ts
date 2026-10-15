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

export type ReviewCancelledEvent = {
  name: "review/pull-request.cancelled";
  data: {
    reviewId: string;
    repositoryId?: string;
    prNumber?: number;
    userId?: string;
  };
};

export const reviewPullRequest = inngest.createFunction(
  {
    id: "review-pull-request",
    retries: 2,
    cancelOn: [
      {
        event: "review/pull-request.cancelled",
        if: "async.data.reviewId == event.data.reviewId",
      },
    ],
  },
  { event: "review/pull-request.requested" },
  async ({ event, step }) => {
    const { reviewId, repositoryId, prNumber, userId } =
      event.data as ReviewPREvent["data"];

    try {
      await step.run("update-status-to-processing", async () => {
        // Check if review exists before updating
        const review = await db.review.findUnique({
          where: { id: reviewId },
        });

        if (!review) {
          throw new NonRetriableError("Review was deleted prior to processing");
        }

        if (review.status !== "PENDING" && review.status !== "PROCESSING") {
          return { status: review.status };
        }

        await db.review.update({
          where: { id: reviewId },
          data: { status: "PROCESSING" },
        });

        return { status: "PROCESSING" };
      });

      // The access token is fetched inside this step and not returned,
      // so it doesn't get stored in Inngest's step state.
      const prData = await step.run("fetch-pr-data", async () => {
        // Verify review has not been deleted while queued
        const review = await db.review.findUnique({
          where: { id: reviewId },
        });
        if (!review) {
          throw new NonRetriableError("Review was deleted prior to fetching PR data");
        }

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
        // Verify review still exists before invoking AI model
        const review = await db.review.findUnique({
          where: { id: reviewId },
        });
        if (!review) {
          throw new NonRetriableError("Review was deleted prior to AI review generation");
        }

        return reviewCode({
          prTitle: prData.title,
          filesChanged: prData.files,
        });
      });

      const saveResult = await step.run("save-results", async () => {
        // Atomic check: Ensure review exists and is still in PROCESSING status before persisting
        return await db.$transaction(async (tx) => {
          const currentReview = await tx.review.findUnique({
            where: { id: reviewId },
          });

          if (!currentReview) {
            // Review was deleted by user; do not write results or recreate record
            return { saved: false, reason: "Review was deleted" };
          }

          if (currentReview.status !== "PROCESSING") {
            // Status was changed or invalidated
            return { saved: false, reason: `Review status is ${currentReview.status}` };
          }

          await tx.review.update({
            where: { id: reviewId },
            data: {
              status: "COMPLETED",
              summary: reviewResult.summary,
              riskScore: reviewResult.riskScore,
              comments: JSON.parse(JSON.stringify(reviewResult.comments)),
            },
          });

          return { saved: true };
        });
      });

      return { success: true, saved: saveResult.saved };
    } catch (error) {
      // If the error was caused by user deletion, exit cleanly without marking as FAILED
      if (
        error instanceof NonRetriableError &&
        error.message.includes("Review was deleted")
      ) {
        return { cancelled: true, reason: error.message };
      }

      await step.run("mark-failed", async () => {
        const review = await db.review.findUnique({
          where: { id: reviewId },
        });

        // Do not update or recreate if the review was deleted
        if (!review) {
          return { markedFailed: false, reason: "Review was deleted" };
        }

        await db.review.update({
          where: { id: reviewId },
          data: {
            status: "FAILED",
            error: error instanceof Error ? error.message : "Unknown error",
          },
        });

        return { markedFailed: true };
      });
      throw error;
    }
  },
);