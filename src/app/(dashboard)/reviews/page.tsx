"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RotateCw,
  Clock,
  CheckCircle2,
  XCircle,
  FileCode2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DeleteReviewButton } from "@/components/delete-review-dialog";

type ReviewStatusFilter =
  | "ALL"
  | "COMPLETED"
  | "PROCESSING"
  | "PENDING"
  | "FAILED";

const FILTERS: ReviewStatusFilter[] = [
  "ALL",
  "COMPLETED",
  "PROCESSING",
  "PENDING",
  "FAILED",
];

export default function ReviewsPage() {
  const [statusFilter, setStatusFilter] = useState<ReviewStatusFilter>("ALL");

  // Poll every 3s while any review is still running or queued
  const {
    data: reviews,
    isLoading,
    isFetching,
    refetch,
  } = trpc.review.list.useQuery(
    { limit: 50 },
    {
      refetchInterval: (query) => {
        const hasActive = query.state.data?.some(
          (r) => r.status === "PROCESSING" || r.status === "PENDING",
        );
        return hasActive ? 3000 : false;
      },
    },
  );

  const triggerReview = trpc.review.trigger.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const filteredReviews = reviews?.filter(
    (r) => statusFilter === "ALL" || r.status === statusFilter,
  );

  const counts: Record<ReviewStatusFilter, number> = {
    ALL: reviews?.length ?? 0,
    COMPLETED: reviews?.filter((r) => r.status === "COMPLETED").length ?? 0,
    PROCESSING: reviews?.filter((r) => r.status === "PROCESSING").length ?? 0,
    PENDING: reviews?.filter((r) => r.status === "PENDING").length ?? 0,
    FAILED: reviews?.filter((r) => r.status === "FAILED").length ?? 0,
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Reviews</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            {counts.ALL} total {counts.ALL === 1 ? "review" : "reviews"}{" "}
            recorded
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          disabled={isFetching}
          onClick={() => void refetch()}
          className="dark:text-white dark:hover:bg-white/10"
        >
          <RotateCw className={cn("size-4", isFetching && "animate-spin")} />
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex w-fit flex-wrap items-center gap-1.5 rounded-xl border border-[#cccccc] dark:border-white/15 bg-white dark:bg-black p-1 shadow-2xs">
        {FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border",
              statusFilter === status
                ? "bg-blue-50 border-blue-200 text-blue-700 font-semibold shadow-xs dark:bg-white/10 dark:border-white/20 dark:text-white dark:shadow-none"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/10",
            )}
          >
            <span>{status.charAt(0) + status.slice(1).toLowerCase()}</span>
            <span className={cn(
              "text-[10px] tabular-nums font-mono px-1.5 py-0.2 rounded-full",
              statusFilter === status
                ? "bg-blue-100 text-blue-800 dark:bg-white/20 dark:text-white"
                : "bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400"
            )}>
              {counts[status]}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredReviews && filteredReviews.length > 0 ? (
        <div className="space-y-3">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isRetrying={triggerReview.isPending}
              onRetry={() =>
                triggerReview.mutate({
                  repositoryId: review.repositoryId,
                  prNumber: review.prNumber,
                })
              }
            />
          ))}
        </div>
      ) : (
        <Card className="border border-[#cccccc] dark:border-white/15 bg-white dark:bg-zinc-950 shadow-xs">
          <CardContent className="py-16 text-center">
            <FileCode2 className="mx-auto mb-4 size-12 text-slate-400 dark:text-zinc-500" />
            <p className="font-semibold text-slate-800 dark:text-white">No reviews found</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              {statusFilter === "ALL"
                ? "Connect a repository and analyze a pull request to see reviews here."
                : `No reviews currently marked as ${statusFilter.toLowerCase()}.`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

type ReviewItem = {
  id: string;
  repositoryId: string;
  prNumber: number;
  prTitle: string | null;
  status: string;
  summary: string | null;
  riskScore: number | null;
  comments: unknown;
  createdAt: Date;
  repository: { fullName: string } | null;
};

function ReviewCard({
  review,
  onRetry,
  isRetrying,
}: {
  review: ReviewItem;
  onRetry: () => void;
  isRetrying: boolean;
}) {
  const isFailed = review.status === "FAILED";
  const isCompleted = review.status === "COMPLETED";
  const isProcessing = review.status === "PROCESSING";
  const prLink = `/repos/${review.repositoryId}/pr/${review.prNumber}`;

  return (
    <Card className="transition-all hover:border-blue-500/60 dark:hover:border-blue-400/60 bg-white dark:bg-zinc-950 border border-[#cccccc] dark:border-white/15 shadow-xs hover:shadow-md">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          {/* Status icon */}
          <div className="mt-1 shrink-0 rounded-lg bg-slate-100 dark:bg-zinc-900 p-2">
            {isCompleted ? (
              <CheckCircle2 className="size-4 text-emerald-500" />
            ) : isFailed ? (
              <XCircle className="size-4 text-destructive" />
            ) : isProcessing ? (
              <Loader2 className="size-4 animate-spin text-blue-500" />
            ) : (
              <Clock className="size-4 text-amber-500" />
            )}
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={prLink}
                className="truncate font-medium text-slate-900 dark:text-white transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              >
                {review.repository?.fullName ?? "Repository"} #
                {review.prNumber}
              </Link>
              <Badge variant="outline" className="text-[10px]">
                {review.status}
              </Badge>
              {review.riskScore !== null && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px]",
                    review.riskScore > 50
                      ? "border-red-500/30 text-red-500"
                      : "border-emerald-500/30 text-emerald-500",
                  )}
                >
                  Risk: {review.riskScore}/100
                </Badge>
              )}
            </div>

            {review.summary && (
              <p className="line-clamp-1 text-sm text-muted-foreground">
                {review.summary}
              </p>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{new Date(review.createdAt).toLocaleString()}</span>
              {Array.isArray(review.comments) && (
                <>
                  <span>•</span>
                  <span>{review.comments.length} issues detected</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="flex shrink-0 items-center gap-2">
          {isFailed ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={onRetry}
                disabled={isRetrying}
              >
                Retry
              </Button>
              <DeleteReviewButton
                reviewId={review.id}
                repositoryId={review.repositoryId}
                prNumber={review.prNumber}
                status={review.status}
              />
            </>
          ) : isCompleted ? (
            <>
              <Button
                size="sm"
                variant="outline"
                nativeButton={false}
                render={<Link href={prLink} />}
              >
                View Report
              </Button>
              <DeleteReviewButton
                reviewId={review.id}
                repositoryId={review.repositoryId}
                prNumber={review.prNumber}
                status={review.status}
              />
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                nativeButton={false}
                render={<Link href={prLink} />}
              >
                View
              </Button>
              <DeleteReviewButton
                reviewId={review.id}
                repositoryId={review.repositoryId}
                prNumber={review.prNumber}
                status={review.status}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}