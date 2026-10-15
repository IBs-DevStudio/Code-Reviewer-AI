"use client";

import { use, useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  GitPullRequest,
  GitMerge,
  GitBranch,
  XCircle,
  Clock,
  Plus,
  Minus,
  FileText,
  Lock,
  Globe,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { DeleteReviewButton } from "@/components/delete-review-dialog";

type PRState = "open" | "closed" | "all";

interface PRItem {
  id: number;
  number: number;
  title: string;
  state: string;
  draft: boolean;
  createdAt: string;
  mergedAt?: string | null; // add this to your tRPC router output if available
  user: { login: string; avatar_url: string };
  head: string;
  base: string;
  additions: number;
  deletions: number;
  changedFiles: number;
  review: { id?: string; status: string } | null;
}

export default function RepoDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [prState, setPrState] = useState<PRState>("open");

  const reposQuery = trpc.repository.list.useQuery();
  const repo = reposQuery.data?.find((r) => r.id === id);

  // Fetch each state separately so tab counts are always accurate.
  // react-query caches each query, so switching tabs is instant.
  const openPRs = trpc.pullRequest.list.useQuery({
    repositoryId: id,
    state: "open",
  });
  const closedPRs = trpc.pullRequest.list.useQuery({
    repositoryId: id,
    state: "closed",
  });
  const allPRs = trpc.pullRequest.list.useQuery({
    repositoryId: id,
    state: "all",
  });

  const prQuery =
    prState === "open" ? openPRs : prState === "closed" ? closedPRs : allPRs;

  const prCounts = {
    open: openPRs.data?.length ?? 0,
    closed: closedPRs.data?.length ?? 0,
    all: allPRs.data?.length ?? 0,
  };

  if (reposQuery.isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Skeleton className="size-9 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!repo) {
    return (
      <Card className="py-16 text-center">
        <CardContent>
          <p className="text-lg font-medium">Repository not found</p>
          <Button
            variant="outline"
            className="mt-4"
            nativeButton={false}
            render={<Link href="/repos" />}
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to Repositories
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button
            variant="outline"
            size="icon"
            nativeButton={false}
            className="shrink-0"
            render={<Link href="/repos" />}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {repo.fullName}
              </h1>
              <Badge variant="outline" className="gap-1">
                {repo.private ? (
                  <>
                    <Lock className="size-3" /> Private
                  </>
                ) : (
                  <>
                    <Globe className="size-3" /> Public
                  </>
                )}
              </Badge>
            </div>
            <a
              href={repo.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span>View on GitHub</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => prQuery.refetch()}
          disabled={prQuery.isFetching}
        >
          <RefreshCw
            className={cn("size-4", prQuery.isFetching && "animate-spin")}
          />
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-border/60">
        <div className="flex items-center gap-1">
          {(["open", "closed", "all"] as PRState[]).map((state) => {
            const isActive = prState === state;
            return (
              <button
                key={state}
                onClick={() => setPrState(state)}
                className={cn(
                  "relative px-4 py-2.5 text-sm font-medium capitalize transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="flex items-center gap-2">
                  {state === "open" && (
                    <GitPullRequest className="size-4 text-emerald-500" />
                  )}
                  {state === "closed" && (
                    <GitMerge className="size-4 text-purple-500" />
                  )}
                  {state === "all" && (
                    <GitBranch className="size-4 text-muted-foreground" />
                  )}
                  {state}
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 text-xs tabular-nums",
                      isActive
                        ? "bg-foreground/10 text-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {prCounts[state]}
                  </span>
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* PR listing */}
      <div className="space-y-3">
        {prQuery.isLoading ? (
          [...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))
        ) : prQuery.error ? (
          <Card className="border-destructive/50 py-12 text-center">
            <CardContent>
              <XCircle className="mx-auto size-8 text-destructive" />
              <p className="mt-2 font-medium text-destructive">
                Failed to load pull requests
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {prQuery.error.message}
              </p>
            </CardContent>
          </Card>
        ) : !prQuery.data || prQuery.data.length === 0 ? (
          <Card className="py-16 text-center">
            <CardContent>
              <GitPullRequest className="mx-auto size-12 text-muted-foreground" />
              <p className="mt-4 font-medium capitalize">
                No {prState} pull requests found
              </p>
            </CardContent>
          </Card>
        ) : (
          prQuery.data.map((pr) => (
            <PRCard key={pr.id} pr={pr} repositoryId={id} />
          ))
        )}
      </div>
    </div>
  );
}

function PRCard({
  pr,
  repositoryId,
}: {
  pr: PRItem;
  repositoryId: string;
}) {
  const isMerged = pr.state === "closed" && pr.mergedAt != null;
  const isClosed = pr.state === "closed";
  const prHref = `/repos/${repositoryId}/pr/${pr.number}`;

  return (
    <Card className="group transition-all hover:border-border">
      <CardContent className="flex items-start justify-between gap-6 p-5">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="mt-1">
            {isMerged ? (
              <GitMerge className="size-4 text-purple-500" />
            ) : isClosed ? (
              <XCircle className="size-4 text-red-500" />
            ) : (
              <GitPullRequest className="size-4 text-emerald-500" />
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Link
                href={prHref}
                className="truncate font-medium transition-colors hover:text-primary"
              >
                {pr.title}
              </Link>
              {pr.draft && <Badge variant="secondary">Draft</Badge>}
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="font-mono text-xs">#{pr.number}</span>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Avatar className="size-4 ring-1 ring-ring">
                  <AvatarImage src={pr.user.avatar_url} />
                  <AvatarFallback className="text-[10px]">
                    {pr.user.login[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{pr.user.login}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="size-3" />
                <span>{formatDate(pr.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="rounded bg-muted px-2 py-0.5 font-mono text-muted-foreground">
                {pr.base} ← {pr.head}
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-emerald-600">
                  <Plus className="size-3" />
                  {pr.additions}
                </span>
                <span className="flex items-center gap-1 text-red-600">
                  <Minus className="size-3" />
                  {pr.deletions}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <FileText className="size-3" />
                  {pr.changedFiles} files
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {pr.review && <ReviewStatusBadge status={pr.review.status} />}
          {pr.review?.id && (
            <DeleteReviewButton
              reviewId={pr.review.id}
              repositoryId={repositoryId}
              prNumber={pr.number}
              status={pr.review.status}
            />
          )}
          <Button
            variant={pr.review ? "outline" : "default"}
            size="sm"
            nativeButton={false}
            render={<Link href={prHref} />}
          >
            {pr.review ? "View Review" : "Review"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewStatusBadge({ status }: { status: string }) {
  const config = {
    COMPLETED: {
      icon: CheckCircle,
      label: "Reviewed",
      className:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    PROCESSING: {
      icon: Loader2,
      label: "Analyzing",
      className:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      spin: true,
    },
    PENDING: {
      icon: Clock,
      label: "Queued",
      className:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    FAILED: {
      icon: XCircle,
      label: "Failed",
      className:
        "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    },
  }[status] ?? {
    icon: Clock,
    label: "Pending",
    className: "bg-muted text-muted-foreground",
  };

  const Icon = config.icon;

  return (
    <Badge className={config.className}>
      <Icon className={cn("size-3", config.spin && "animate-spin")} />
      {config.label}
    </Badge>
  );
}