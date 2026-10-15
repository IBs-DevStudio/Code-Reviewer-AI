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
          <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {counts.ALL} total {counts.ALL === 1 ? "review" : "reviews"}{" "}
            recorded
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          disabled={isFetching}
          onClick={() => void refetch()}
        >
          <RotateCw className={cn("size-4", isFetching && "animate-spin")} />
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex w-fit flex-wrap items-center gap-2 rounded-lg bg-muted/50 p-1">
        {FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              statusFilter === status
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span>{status.charAt(0) + status.slice(1).toLowerCase()}</span>
            <span className="text-[10px] tabular-nums text-muted-foreground/70">
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
        <Card>
          <CardContent className="py-16 text-center">
            <FileCode2 className="mx-auto mb-4 size-12 text-muted-foreground/40" />
            <p className="font-medium">No reviews found</p>
            <p className="mt-1 text-sm text-muted-foreground">
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
    <Card className="transition-colors hover:border-primary/50">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          {/* Status icon */}
          <div className="mt-1 shrink-0 rounded-lg bg-muted p-2">
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
                className="truncate font-medium transition-colors hover:text-primary"
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