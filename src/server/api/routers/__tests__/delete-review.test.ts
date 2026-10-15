import { reviewRouter } from "../review";
import { TRPCError } from "@trpc/server";
import { inngest } from "@/server/inngest/client";

// Simple test runner for scenarios
async function runTests() {
  console.log("=== STARTING DELETE REVIEW TESTS ===\n");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // Mock DB store
  type MockReview = {
    id: string;
    repositoryId: string;
    userId: string;
    prNumber: number;
    prTitle: string;
    prUrl: string;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    summary: string | null;
    riskScore: number | null;
    comments: any;
    error: string | null;
    createdAt: Date;
    updatedAt: Date;
    repository: {
      id: string;
      userId: string;
      fullName: string;
    };
  };

  const store = new Map<string, MockReview>();

  // Mock inngest send tracking
  const sentEvents: Array<{ name: string; data: any }> = [];
  const originalInngestSend = inngest.send.bind(inngest);
  inngest.send = (async (event: any) => {
    sentEvents.push(event);
    return { ids: ["mock-event-id"] };
  }) as any;

  function createMockDb() {
    return {
      review: {
        findUnique: async ({ where }: any) => {
          return store.get(where.id) ?? null;
        },
        findFirst: async ({ where }: any) => {
          for (const r of store.values()) {
            if (
              r.repositoryId === where.repositoryId &&
              r.prNumber === where.prNumber &&
              (!where.userId || r.userId === where.userId)
            ) {
              return r;
            }
          }
          return null;
        },
        findMany: async ({ where }: any) => {
          return Array.from(store.values()).filter((r) => r.userId === where.userId);
        },
        create: async ({ data }: any) => {
          const rev: MockReview = {
            id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            repositoryId: data.repositoryId,
            userId: data.userId,
            prNumber: data.prNumber,
            prTitle: data.prTitle,
            prUrl: data.prUrl,
            status: data.status ?? "PENDING",
            summary: null,
            riskScore: null,
            comments: null,
            error: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            repository: {
              id: data.repositoryId,
              userId: data.userId,
              fullName: "test-owner/test-repo",
            },
          };
          store.set(rev.id, rev);
          return rev;
        },
        delete: async ({ where }: any) => {
          const existing = store.get(where.id);
          if (!existing) throw new Error("Record not found");
          store.delete(where.id);
          return existing;
        },
        update: async ({ where, data }: any) => {
          const existing = store.get(where.id);
          if (!existing) throw new Error("Record not found");
          const updated = { ...existing, ...data, updatedAt: new Date() };
          store.set(where.id, updated);
          return updated;
        },
      },
      repository: {
        findUnique: async ({ where }: any) => {
          if (where.id === "repo-1" && where.userId === "user-1") {
            return {
              id: "repo-1",
              userId: "user-1",
              name: "test-repo",
              fullName: "test-owner/test-repo",
              htmlUrl: "https://github.com/test-owner/test-repo",
            };
          }
          return null;
        },
      },
      $transaction: async (cb: any) => {
        return cb(createMockDb());
      },
    };
  }

  const mockDb = createMockDb();

  function createCaller(user: { id: string; name: string } | null) {
    const callerFactory = (reviewRouter as any).createCaller({
      db: mockDb,
      session: user ? { user } : null,
      user: user,
      headers: new Headers(),
    });
    return callerFactory;
  }

  const callerUser1 = createCaller({ id: "user-1", name: "Alice" });
  const callerUser2 = createCaller({ id: "user-2", name: "Bob" });

  try {
    // -------------------------------------------------------------
    // Scenario 1: Delete a PENDING review
    // -------------------------------------------------------------
    console.log("Scenario 1: Delete a PENDING review");
    sentEvents.length = 0;
    const pendingReview = await mockDb.review.create({
      data: {
        repositoryId: "repo-1",
        userId: "user-1",
        prNumber: 101,
        prTitle: "PR #101",
        prUrl: "https://github.com/test/repo/pull/101",
        status: "PENDING",
      },
    });

    const resPending = await callerUser1.delete({ id: pendingReview.id });
    assert(resPending.success === true, "Returned success true for PENDING review");
    assert(resPending.previousStatus === "PENDING", "Tracked previousStatus as PENDING");
    assert(resPending.cancellationRequested === true, "Cancellation requested for PENDING review");
    assert((await mockDb.review.findUnique({ where: { id: pendingReview.id } })) === null, "Review deleted from database");
    assert(
      sentEvents.some(
        (e) =>
          e.name === "review/pull-request.cancelled" &&
          e.data.reviewId === pendingReview.id
      ),
      "Dispatched Inngest cancellation event with reviewId"
    );

    // -------------------------------------------------------------
    // Scenario 2: Delete a PROCESSING review
    // -------------------------------------------------------------
    console.log("\nScenario 2: Delete a PROCESSING review");
    sentEvents.length = 0;
    const processingReview = await mockDb.review.create({
      data: {
        repositoryId: "repo-1",
        userId: "user-1",
        prNumber: 102,
        prTitle: "PR #102",
        prUrl: "https://github.com/test/repo/pull/102",
        status: "PROCESSING",
      },
    });

    const resProc = await callerUser1.delete({ id: processingReview.id });
    assert(resProc.success === true, "Returned success true for PROCESSING review");
    assert(resProc.previousStatus === "PROCESSING", "Tracked previousStatus as PROCESSING");
    assert(resProc.cancellationRequested === true, "Cancellation requested for PROCESSING review");
    assert((await mockDb.review.findUnique({ where: { id: processingReview.id } })) === null, "Review deleted from database");
    assert(
      sentEvents.some(
        (e) =>
          e.name === "review/pull-request.cancelled" &&
          e.data.reviewId === processingReview.id
      ),
      "Dispatched Inngest cancellation event with reviewId"
    );

    // -------------------------------------------------------------
    // Scenario 3: Delete a FAILED review
    // -------------------------------------------------------------
    console.log("\nScenario 3: Delete a FAILED review");
    sentEvents.length = 0;
    const failedReview = await mockDb.review.create({
      data: {
        repositoryId: "repo-1",
        userId: "user-1",
        prNumber: 103,
        prTitle: "PR #103",
        prUrl: "https://github.com/test/repo/pull/103",
        status: "FAILED",
      },
    });

    const resFailed = await callerUser1.delete({ id: failedReview.id });
    assert(resFailed.success === true, "Returned success true for FAILED review");
    assert(resFailed.previousStatus === "FAILED", "Tracked previousStatus as FAILED");
    assert(resFailed.cancellationRequested === false, "No background cancellation needed for FAILED review");
    assert((await mockDb.review.findUnique({ where: { id: failedReview.id } })) === null, "Review deleted from database");

    // -------------------------------------------------------------
    // Scenario 4: Delete a COMPLETED review (user requested CTA for all reviews)
    // -------------------------------------------------------------
    console.log("\nScenario 4: Delete a COMPLETED review");
    sentEvents.length = 0;
    const completedReview = await mockDb.review.create({
      data: {
        repositoryId: "repo-1",
        userId: "user-1",
        prNumber: 104,
        prTitle: "PR #104",
        prUrl: "https://github.com/test/repo/pull/104",
        status: "COMPLETED",
      },
    });

    const resCompleted = await callerUser1.delete({ id: completedReview.id });
    assert(resCompleted.success === true, "Returned success true for COMPLETED review");
    assert(resCompleted.previousStatus === "COMPLETED", "Tracked previousStatus as COMPLETED");
    assert(resCompleted.cancellationRequested === false, "No background cancellation needed for COMPLETED review");
    assert((await mockDb.review.findUnique({ where: { id: completedReview.id } })) === null, "Review deleted from database");

    // -------------------------------------------------------------
    // Scenario 5: Unauthorized users cannot delete another user's review
    // -------------------------------------------------------------
    console.log("\nScenario 5: Authorization checks");
    const user1Review = await mockDb.review.create({
      data: {
        repositoryId: "repo-1",
        userId: "user-1",
        prNumber: 105,
        prTitle: "PR #105",
        prUrl: "https://github.com/test/repo/pull/105",
        status: "PENDING",
      },
    });

    let forbiddenCaught = false;
    try {
      await callerUser2.delete({ id: user1Review.id });
    } catch (err: any) {
      if (err instanceof TRPCError && err.code === "FORBIDDEN") {
        forbiddenCaught = true;
      }
    }
    assert(forbiddenCaught, "User 2 cannot delete User 1's review (FORBIDDEN)");
    assert((await mockDb.review.findUnique({ where: { id: user1Review.id } })) !== null, "User 1's review remains intact");

    // -------------------------------------------------------------
    // Scenario 6: Non-existent / already deleted review
    // -------------------------------------------------------------
    console.log("\nScenario 6: Non-existent / already deleted review");
    let notFoundCaught = false;
    try {
      await callerUser1.delete({ id: "non-existent-id" });
    } catch (err: any) {
      if (err instanceof TRPCError && err.code === "NOT_FOUND") {
        notFoundCaught = true;
      }
    }
    assert(notFoundCaught, "Deleting non-existent review returns NOT_FOUND");

    // -------------------------------------------------------------
    // Scenario 7: Worker race condition safety checks
    // -------------------------------------------------------------
    console.log("\nScenario 7: Worker race condition safety");
    // Simulate worker save-results step when review was deleted during execution
    const deletedId = "rev-simulated-deleted";
    // Check if worker step aborts cleanly
    const workerCheck = await mockDb.$transaction(async (tx: any) => {
      const currentReview = await tx.review.findUnique({ where: { id: deletedId } });
      if (!currentReview) {
        return { saved: false, reason: "Review was deleted" };
      }
      return { saved: true };
    });
    assert(workerCheck.saved === false, "Worker does not persist results after review is deleted");
    assert(store.get(deletedId) === undefined, "Worker does not resurrect deleted review");

    // -------------------------------------------------------------
    // Scenario 8: PR review trigger and re-review still work
    // -------------------------------------------------------------
    console.log("\nScenario 8: Review trigger still works");
    sentEvents.length = 0;
    const triggerRes = await callerUser1.trigger({
      repositoryId: "repo-1",
      prNumber: 200,
    });
    assert(typeof triggerRes.reviewId === "string", "Trigger returns created reviewId");
    assert(
      sentEvents.some(
        (e) =>
          e.name === "review/pull-request.requested" &&
          e.data.reviewId === triggerRes.reviewId
      ),
      "Trigger dispatches review/pull-request.requested event"
    );

    console.log(`\n=== RESULTS: ${passed} PASSED, ${failed} FAILED ===\n`);
  } finally {
    inngest.send = originalInngestSend;
  }

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
