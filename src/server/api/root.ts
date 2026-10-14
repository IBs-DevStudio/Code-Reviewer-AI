import { createTRPCRouter, publicProcedure, createCallerFactory } from "./trpc";
import { repositoryRouter } from "@/server/api/routers/repository";
import { pullRequestRouter } from "@/server/api/routers/pull-request";
import { reviewRouter } from "@/server/api/routers/review";

export const appRouter = createTRPCRouter({
  repository: repositoryRouter,
  pullRequest: pullRequestRouter,
  review: reviewRouter,
  health: publicProcedure.query(() => {
    return {
      status: "ok",
      timestamp: new Date(),
    };
  }),
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);