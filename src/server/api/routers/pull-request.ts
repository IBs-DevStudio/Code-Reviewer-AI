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
      }),
    )
    .query(async ({ ctx, input }) => {
      const repository = await ctx.db.repository.findUnique({
        where: { id: input.repositoryId, userId: ctx.user.id },
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
        input.state,
      );

      const existingReviews = await ctx.db.review.findMany({
        where: {
          repositoryId: repository.id,
          prNumber: { in: pullRequests.map((p) => p.number) },
        },
        select: { prNumber: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });

      const reviewMap = new Map(existingReviews.map((r) => [r.prNumber, r]));

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
        additions: pr.additions ?? 0,
        deletions: pr.deletions ?? 0,
        changedFiles: pr.changed_files ?? 0,
        review: reviewMap.get(pr.number) ?? null,
      }));
    }),

  get: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        prNumber: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const repository = await ctx.db.repository.findUnique({
        where: { id: input.repositoryId, userId: ctx.user.id },
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

      const pr = await fetchPullRequest(
        accessToken,
        owner,
        repo,
        input.prNumber,
      );

      const review = await ctx.db.review.findFirst({
        where: { repositoryId: repository.id, prNumber: input.prNumber },
        orderBy: { createdAt: "desc" },
      });

      return { ...pr, review };
    }),

  files: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        prNumber: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const repository = await ctx.db.repository.findUnique({
        where: { id: input.repositoryId, userId: ctx.user.id },
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

      const files = await fetchPullRequestFiles(
        accessToken,
        owner,
        repo,
        input.prNumber,
      );

      return files.map((f) => ({
        sha: f.sha,
        filename: f.filename,
        status: f.status,
        additions: f.additions,
        deletions: f.deletions,
        changes: f.changes,
        patch: f.patch,
        previousFilename: f.previous_filename,
      }));
    }),
});