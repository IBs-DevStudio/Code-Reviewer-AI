import { createTRPCRouter, publicProcedure, createCallerFactory } from "./trpc";
import { repositoryRouter } from "@/server/api/routers/repository";

export const appRouter = createTRPCRouter({
  repository: repositoryRouter,
  health: publicProcedure.query(() => {
    return {
      status: "ok",
      timestamp: new Date(),
    };
  }),
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);