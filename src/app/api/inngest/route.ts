import { serve } from "inngest/next";
import { inngest } from "@/server/inngest/client";
import { reviewPullRequest } from "@/server/inngest/functions/review-pr";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [reviewPullRequest],
});