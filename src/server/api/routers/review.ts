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
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.review.findMany({
        where: { userId: ctx.user.id },
        orderBy: { createdAt: "desc" },
        take: input.limit,
        include: {
          repository: { select: { fullName: true } },
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "Review ID is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Fetch review and verify existence and repository relation
      const review = await ctx.db.review.findUnique({
        where: { id: input.id },
        include: { repository: true },
      });

      if (!review) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found or has already been deleted",
        });
      }

      // 2. Authorization check: review must belong to user or repository owned by user
      const isReviewOwner = review.userId === ctx.user.id;
      const isRepoOwner = review.repository.userId === ctx.user.id;
      if (!isReviewOwner && !isRepoOwner) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to delete this review",
        });
      }

      const previousStatus = review.status;
      let cancellationRequested = false;

      // 3. Request background execution cancellation for active/queued reviews
      if (previousStatus === "PENDING" || previousStatus === "PROCESSING") {
        try {
          await inngest.send({
            name: "review/pull-request.cancelled",
            data: {
              reviewId: review.id,
              repositoryId: review.repositoryId,
              prNumber: review.prNumber,
              userId: ctx.user.id,
            },
          });
          cancellationRequested = true;
        } catch (err) {
          // Inngest send failure should not prevent DB deletion, but should be logged
          console.error("Failed to send Inngest review cancellation event:", err);
        }
      }

      // 4. Delete the review within a Prisma transaction
      await ctx.db.$transaction(async (tx) => {
        // Re-check existence to handle concurrent deletion attempts safely
        const toDelete = await tx.review.findUnique({
          where: { id: input.id },
        });

        if (!toDelete) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Review has already been deleted",
          });
        }

        await tx.review.delete({
          where: { id: input.id },
        });
      });

      return {
        success: true,
        reviewId: review.id,
        repositoryId: review.repositoryId,
        prNumber: review.prNumber,
        previousStatus,
        cancellationRequested,
      };
    }),
});