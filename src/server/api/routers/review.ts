import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { inngest } from "@/server/inngest/client";

export const reviewRouter = createTRPCRouter({
  trigger: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        prNumber: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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

      // Create PENDING review entry in database
      const review = await ctx.db.review.create({
        data: {
          repositoryId: input.repositoryId,
          userId: ctx.user.id,
          prNumber: input.prNumber,
          prTitle: `PR #${input.prNumber}`,
          prUrl: `${repository.htmlUrl}/pull/${input.prNumber}`,
          status: "PENDING",
        },
      });

      // Send event to Inngest
      await inngest.send({
        name: "review/pull-request.requested",
        data: {
          reviewId: review.id,
          repositoryId: repository.id,
          prNumber: input.prNumber,
          userId: ctx.user.id,
        },
      });

      return { reviewId: review.id };
    }),

  getLatestForPR: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        prNumber: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.review.findFirst({
        where: {
          repositoryId: input.repositoryId,
          prNumber: input.prNumber,
          userId: ctx.user.id,
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const review = await ctx.db.review.findUnique({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
        include: { repository: true },
      });

      if (!review) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }

      return review;
    }),
});