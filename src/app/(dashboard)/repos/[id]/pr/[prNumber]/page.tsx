"use client";

import { use, useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReviewResult } from "@/components/review-result";
import {
  ArrowLeft,
  ExternalLink,
  GitPullRequest,
  GitMerge,
  XCircle,
  Clock,
  Plus,
  Minus,
  FileCode2,
  GitBranch,
  ArrowRight,
  Sparkles,
  Wand2,
  Loader2,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { DiffViewer } from "@/components/diff-viewer";
import { DeleteReviewButton } from "@/components/delete-review-dialog";

export default function PRDetailsPage({
  params,
}: {
  params: Promise<{ id: string; prNumber: string }>;
}) {
  const { id, prNumber } = use(params);
  const num = parseInt(prNumber, 10);
  const [activeTab, setActiveTab] = useState<"files" | "review">("review");

  const prQuery = trpc.pullRequest.get.useQuery(
    { repositoryId: id, prNumber: num },
    { enabled: !isNaN(num) },
  );

  const filesQuery = trpc.pullRequest.files.useQuery(
    { repositoryId: id, prNumber: num },
    { enabled: !isNaN(num) },
  );

  // Latest review, polled every 2s while the background job is running
  const { data: latestReview, refetch: refetchReview } =
    trpc.review.getLatestForPR.useQuery(
      { repositoryId: id, prNumber: num },
      {
        enabled: !isNaN(num),
        refetchInterval: (query) =>
          query.state.data?.status === "PROCESSING" ||
          query.state.data?.status === "PENDING"
            ? 2000
            : false,
      },
    );

  const triggerReview = trpc.review.trigger.useMutation({
    onSuccess: () => {
      void refetchReview();
      setActiveTab("review");
    },
  });

  const runReview = () =>
    triggerReview.mutate({ repositoryId: id, prNumber: num });

  const isReviewing =
    latestReview?.status === "PENDING" || latestReview?.status === "PROCESSING";

  if (prQuery.isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-96" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (prQuery.error || !prQuery.data) {
    return (
      <Card className="py-16 text-center">
        <CardContent>
          <XCircle className="mx-auto size-12 text-destructive" />
          <p className="mt-4 font-medium text-destructive">
            {prQuery.error?.message ?? "Pull request not found"}
          </p>
          <Button
            variant="outline"
            className="mt-6"
            nativeButton={false}
            render={<Link href={`/repos/${id}`} />}
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to repository
          </Button>
        </CardContent>
      </Card>
    );
  }

  const pr = prQuery.data;
  const isMerged = pr.state === "closed";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button
          variant="outline"
          size="icon"
          className="mt-1 shrink-0"
          nativeButton={false}
          render={<Link href={`/repos/${id}`} />}
        >
          <ArrowLeft className="size-4" />
        </Button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className={cn(
                    "shrink-0 rounded-lg p-2",
                    isMerged
                      ? "bg-purple-500/10 text-purple-500"
                      : "bg-emerald-500/10 text-emerald-500",
                  )}
                >
                  {isMerged ? (
                    <GitMerge className="size-5" />
                  ) : (
                    <GitPullRequest className="size-5" />
                  )}
                </div>

                <h1 className="truncate text-2xl font-semibold tracking-tight">
                  {pr.title}
                </h1>
                <span className="font-mono text-sm text-muted-foreground">
                  #{pr.number}
                </span>
                {pr.draft && <Badge variant="secondary">Draft</Badge>}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Avatar className="size-5 ring-1 ring-border">
                    <AvatarImage src={pr.user.avatar_url} />
                    <AvatarFallback className="text-[10px]">
                      {pr.user.login[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">
                    {pr.user.login}
                  </span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="size-3.5" />
                  <span>{formatDate(pr.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {latestReview?.id && (
                <DeleteReviewButton
                  reviewId={latestReview.id}
                  repositoryId={id}
                  prNumber={num}
                  status={latestReview.status}
                />
              )}

              <Button
                size="sm"
                disabled={isReviewing || triggerReview.isPending}
                onClick={runReview}
              >
                {isReviewing ? (
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                ) : (
                  <Wand2 className="mr-1.5 size-3.5" />
                )}
                {isReviewing
                  ? "Analyzing..."
                  : latestReview?.status === "COMPLETED"
                    ? "Re-review"
                    : "AI Review"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                nativeButton={false}
                render={
                  <a href={pr.htmlUrl} target="_blank" rel="noreferrer" />
                }
              >
                <span>GitHub</span>
                <ExternalLink className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center divide-x divide-border/60">
            <div className="flex flex-1 items-center gap-3 p-4">
              <div className="shrink-0 rounded-lg bg-muted p-2">
                <GitBranch className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="mb-1 text-xs text-muted-foreground">
                  Merge path
                </p>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="truncate rounded bg-secondary px-2 py-0.5">
                    {pr.head.ref}
                  </span>
                  <ArrowRight className="size-3 shrink-0 text-muted-foreground" />
                  <span className="truncate rounded bg-secondary px-2 py-0.5">
                    {pr.base.ref}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-6 px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="rounded bg-emerald-500/10 p-1.5 text-emerald-600 dark:text-emerald-400">
                  <Plus className="size-3.5" />
                </div>
                <span className="text-sm font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {pr.additions ?? 0}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded bg-red-500/10 p-1.5 text-red-600 dark:text-red-400">
                  <Minus className="size-3.5" />
                </div>
                <span className="text-sm font-semibold tabular-nums text-red-600 dark:text-red-400">
                  {pr.deletions ?? 0}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded bg-muted p-1.5 text-muted-foreground">
                  <FileCode2 className="size-3.5" />
                </div>
                <span className="text-sm font-semibold tabular-nums">
                  {pr.changedFiles ?? 0}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border/60">
        <button
          onClick={() => setActiveTab("review")}
          className={cn(
            "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors",
            activeTab === "review"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Sparkles className="size-4" />
          <span>AI Review</span>
          {latestReview?.status === "COMPLETED" && (
            <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">
              {Array.isArray(latestReview.comments)
                ? latestReview.comments.length
                : 0}
            </Badge>
          )}
          {activeTab === "review" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("files")}
          className={cn(
            "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors",
            activeTab === "files"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <FileCode2 className="size-4" />
          <span>Files Changed</span>
          {filesQuery.data && (
            <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">
              {filesQuery.data.length}
            </Badge>
          )}
          {activeTab === "files" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "review" && (
        <div>
          {latestReview ? (
            <ReviewResult
              review={{
                ...latestReview,
                repositoryId: id,
                prNumber: num,
              }}
              onRetry={runReview}
              isRetrying={triggerReview.isPending}
            />
          ) : (
            <Card className="py-16 text-center">
              <CardContent>
                <Sparkles className="mx-auto mb-4 size-12 text-muted-foreground" />
                <p className="font-medium">No review yet</p>
                <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                  Click &quot;Run AI Review&quot; to analyze this pull request
                  for bugs, security issues, and improvements.
                </p>
                <Button
                  className="mt-6"
                  onClick={runReview}
                  disabled={triggerReview.isPending}
                >
                  Run AI Review
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "files" && (
        <div>
          {filesQuery.isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : filesQuery.error ? (
            <Card className="border-destructive/50 py-12 text-center">
              <CardContent>
                <XCircle className="mx-auto size-8 text-destructive" />
                <p className="mt-2 font-medium text-destructive">
                  Failed to load diff files
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {filesQuery.error.message}
                </p>
              </CardContent>
            </Card>
          ) : (
            <DiffViewer files={filesQuery.data ?? []} />
          )}
        </div>
      )}
    </div>
  );
}