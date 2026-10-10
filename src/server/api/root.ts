import { createTRPCRouter, publicProcedure, createCallerFactory } from "./trpc";

export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => {
    return {
      status: "ok",
      timestamp: new Date(),
    };
  }),
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);