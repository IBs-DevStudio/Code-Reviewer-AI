import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  fetchPullRequests,
  fetchPullRequest,
  fetchPullRequestFiles,
  getGitHubAccessToken,
} from "@/server/services/github";

export const pullRequestRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        state: z.enum(["open", "closed", "all"]).default("open"),
      })
    )
    .query(async ({ ctx, input }) => {
      const repository = await ctx.db.repository.findUnique({
        where: {
          id: input.repositoryId,
          userId: ctx.user.id,
        },
      });

      if (!repository) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Repository not found",
        });
      }

      const accessToken = await getGitHubAccessToken(ctx.user.id);
      if (!accessToken) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "GitHub account is not connected",
        });
      }

      const [owner, repo] = repository.fullName.split("/");
      if (!owner || !repo) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid repository name",
        });
      }

      const pullRequests = await fetchPullRequests(
        accessToken,
        owner,
        repo,
        input.state
      );

      // Check existing reviews in database
      const existingReviews = await ctx.db.review.findMany({
        where: {
          repositoryId: repository.id,
          prNumber: {
            in: pullRequests.map((pr) => pr.number),
          },
        },
        select: {
          id: true,
          prNumber: true,
          status: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const reviewMap = new Map(
        existingReviews.map((review) => [review.prNumber, review])
      );

      return pullRequests.map((pr) => ({
        id: pr.id,
        number: pr.number,
        title: pr.title,
        state: pr.state,
        draft: pr.draft,
        htmlUrl: pr.html_url,
        createdAt: pr.created_at,
        user: pr.user,
        head: pr.head.ref,
        base: pr.base.ref,
        additions: pr.additions,
        deletions: pr.deletions,
        changedFiles: pr.changed_files,
        review: reviewMap.get(pr.number) ?? null,
      }));
    }),

  get: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        prNumber: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const repository = await ctx.db.repository.findUnique({
        where: {
          id: input.repositoryId,
          userId: ctx.user.id,
        },
      });

      if (!repository) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Repository not found",
        });
      }

      const accessToken = await getGitHubAccessToken(ctx.user.id);
      if (!accessToken) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "GitHub account is not connected",
        });
      }

      const [owner, repo] = repository.fullName.split("/");
      const pr = await fetchPullRequest(
        accessToken,
        owner,
        repo,
        input.prNumber
      );

      const review = await ctx.db.review.findFirst({
        where: {
          repositoryId: repository.id,
          prNumber: input.prNumber,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        id: pr.id,
        number: pr.number,
        title: pr.title,
        state: pr.state,
        draft: pr.draft,
        htmlUrl: pr.html_url,
        createdAt: pr.created_at,
        user: pr.user,
        head: pr.head,
        base: pr.base,
        additions: pr.additions,
        deletions: pr.deletions,
        changedFiles: pr.changed_files,
        review: review ?? null,
      };
    }),

  files: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        prNumber: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const repository = await ctx.db.repository.findUnique({
        where: {
          id: input.repositoryId,
          userId: ctx.user.id,
        },
      });

      if (!repository) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Repository not found",
        });
      }

      const accessToken = await getGitHubAccessToken(ctx.user.id);
      if (!accessToken) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "GitHub account is not connected",
        });
      }

      const [owner, repo] = repository.fullName.split("/");
      const files = await fetchPullRequestFiles(
        accessToken,
        owner,
        repo,
        input.prNumber
      );

      return files.map((file) => ({
        sha: file.sha,
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes,
        patch: file.patch,
        previousFilename: file.previous_filename,
      }));
    }),
});