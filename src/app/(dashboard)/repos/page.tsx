"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  X,
  Search,
  RefreshCw,
  FolderGit2,
  Lock,
  Globe,
  Star,
  Trash2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConnectGitHub } from "@/components/connect-github";

interface RepoItem {
  githubId: number;
  name: string;
  fullName: string;
  private: boolean;
  htmlUrl: string;
  description: string | null;
  language: string | null;
  stars: number;
  updatedAt: string;
}

const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  Python: "bg-green-500",
  Rust: "bg-orange-500",
  Go: "bg-cyan-500",
  HTML: "bg-red-500",
  CSS: "bg-purple-500",
};

export default function ReposPage() {
  const [selectedRepos, setSelectedRepos] = useState<Set<number>>(new Set());
  const [showGitHubRepos, setShowGitHubRepos] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const connectedRepos = trpc.repository.list.useQuery();

  const githubRepos = trpc.repository.fetchFromGitHub.useQuery(undefined, {
    enabled: showGitHubRepos,
  });

  const connectMutation = trpc.repository.connect.useMutation({
    onSuccess: () => {
      connectedRepos.refetch();
      setSelectedRepos(new Set());
      setShowGitHubRepos(false);
    },
  });

  const disconnectMutation = trpc.repository.disconnect.useMutation({
    onSuccess: () => {
      connectedRepos.refetch();
    },
  });

  const connectedIds = new Set(
    connectedRepos.data?.map((r) => r.githubId) ?? [],
  );

  const availableRepos = (githubRepos.data ?? []).filter(
    (repo) => !connectedIds.has(repo.githubId),
  );

  const filteredAvailable = availableRepos.filter((repo) => {
    const q = searchQuery.toLowerCase();
    return (
      repo.fullName.toLowerCase().includes(q) ||
      (repo.description?.toLowerCase().includes(q) ?? false)
    );
  });

  const toggleRepo = (githubId: number) => {
    const next = new Set(selectedRepos);
    if (next.has(githubId)) {
      next.delete(githubId);
    } else {
      next.add(githubId);
    }
    setSelectedRepos(next);
  };

  const handleConnect = () => {
    const reposToConnect = availableRepos
      .filter((r) => selectedRepos.has(r.githubId))
      .map((r) => ({
        githubId: r.githubId,
        name: r.name,
        fullName: r.fullName,
        private: r.private,
        htmlUrl: r.htmlUrl,
      }));

    connectMutation.mutate({ repos: reposToConnect });
  };

  const handleSelectAll = () => {
    setSelectedRepos(new Set(filteredAvailable.map((r) => r.githubId)));
  };

  const handleClearSelection = () => {
    setSelectedRepos(new Set());
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Repositories
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect repositories to enable AI code reviews.
          </p>
        </div>
        <Button
          onClick={() => {
            setShowGitHubRepos(!showGitHubRepos);
            setSearchQuery("");
            setSelectedRepos(new Set());
          }}
          variant={showGitHubRepos ? "outline" : "default"}
        >
          {showGitHubRepos ? (
            <>
              <X className="mr-2 size-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="mr-2 size-4" />
              Add Repositories
            </>
          )}
        </Button>
      </div>

      {showGitHubRepos && (
        <Card className="overflow-hidden">
          <div className="border-b border-border/60 bg-muted/30 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Import GitHub Repositories</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Select repositories to import from your GitHub account.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => githubRepos.refetch()}
                disabled={githubRepos.isFetching}
              >
                <RefreshCw
                  className={cn(
                    "size-4",
                    githubRepos.isFetching && "animate-spin",
                  )}
                />
              </Button>
            </div>
          </div>

          <CardContent className="p-0">
            {githubRepos.isLoading ? (
              <div className="space-y-3 p-6">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : githubRepos.error ? (
              <div className="p-6">
                {githubRepos.error.data?.code === "PRECONDITION_FAILED" ? (
                  <ConnectGitHub />
                ) : (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-center">
                    <p className="text-sm text-destructive">
                      {githubRepos.error.message}
                    </p>
                  </div>
                )}
              </div>
            ) : availableRepos.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle2 className="size-6 text-emerald-500" />
                </div>
                <p className="mt-4 font-medium">All caught up!</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  All your repositories are already connected.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 border-b border-border/60 px-6 py-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search repositories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-md border bg-transparent py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <button
                      onClick={handleSelectAll}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Select all
                    </button>
                    {selectedRepos.size > 0 && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <button
                          onClick={handleClearSelection}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          Clear
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="max-h-[400px] divide-y divide-border/60 overflow-y-auto">
                  {filteredAvailable.length === 0 ? (
                    <div className="py-12 text-center text-sm text-muted-foreground">
                      No repositories match your search.
                    </div>
                  ) : (
                    filteredAvailable.map((repo) => (
                      <RepoSelectItem
                        key={repo.githubId}
                        repo={repo}
                        selected={selectedRepos.has(repo.githubId)}
                        onToggle={() => toggleRepo(repo.githubId)}
                      />
                    ))
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-border/60 bg-muted/60 px-6 py-4">
                  <p className="text-sm text-muted-foreground">
                    {selectedRepos.size} of {availableRepos.length} selected
                  </p>
                  <Button
                    onClick={handleConnect}
                    disabled={
                      selectedRepos.size === 0 || connectMutation.isPending
                    }
                  >
                    {connectMutation.isPending ? (
                      <>
                        <RefreshCw className="mr-2 size-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      `Connect (${selectedRepos.size})`
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Connected Repositories
          </h2>
          {connectedRepos.data && connectedRepos.data.length > 0 && (
            <Badge variant="secondary">{connectedRepos.data.length}</Badge>
          )}
        </div>

        {connectedRepos.isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : !connectedRepos.data || connectedRepos.data.length === 0 ? (
          <Card className="py-16 text-center">
            <CardContent>
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted">
                <FolderGit2 className="size-7 text-muted-foreground" />
              </div>
              <p className="mt-4 font-medium">No repositories connected</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                Connect your first repository from GitHub to begin automatic
                code reviews.
              </p>
              <Button onClick={() => setShowGitHubRepos(true)} className="mt-6">
                <Plus className="mr-2 size-4" />
                Connect Repository
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {connectedRepos.data.map((repo) => (
              <ConnectedRepoCard
                key={repo.id}
                repo={repo}
                onDisconnect={() => disconnectMutation.mutate({ id: repo.id })}
                isDisconnecting={
                  disconnectMutation.isPending &&
                  disconnectMutation.variables?.id === repo.id
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RepoSelectItem({
  repo,
  selected,
  onToggle,
}: {
  repo: RepoItem;
  selected: boolean;
  onToggle: () => void;
}) {
  const langColor = repo.language
    ? (languageColors[repo.language] ?? "bg-zinc-400")
    : null;

  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-4 px-6 py-4 transition-colors",
        selected ? "bg-primary/5" : "hover:bg-muted/50",
      )}
    >
      <Checkbox checked={selected} onCheckedChange={onToggle} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">{repo.fullName}</span>
          {repo.private ? (
            <Lock className="size-3 shrink-0 text-muted-foreground" />
          ) : null}
        </div>
        {repo.description && (
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {repo.description}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-4">
        {repo.stars > 0 && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3" />
            {repo.stars}
          </span>
        )}
        {repo.language && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={cn("size-2 shrink-0 rounded-full", langColor)} />
            <span>{repo.language}</span>
          </div>
        )}
      </div>
    </label>
  );
}

function ConnectedRepoCard({
  repo,
  onDisconnect,
  isDisconnecting,
}: {
  repo: {
    id: string;
    fullName: string;
    private: boolean;
    createdAt: Date;
  };
  onDisconnect: () => void;
  isDisconnecting: boolean;
}) {
  return (
    <Card className="group transition-all hover:border-primary/50 hover:shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/repos/${repo.id}`}
            className="flex min-w-0 flex-1 items-start gap-3"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
              {repo.private ? (
                <Lock className="size-4 text-amber-500" />
              ) : (
                <Globe className="size-4 text-emerald-500" />
              )}
            </div>
            <div className="min-w-0">
              <span className="block truncate font-medium transition-colors group-hover:text-primary">
                {repo.fullName}
              </span>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
                  {repo.private ? "Private" : "Public"}
                </Badge>
              </div>
            </div>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isDisconnecting}
                  className="size-8 shrink-0 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                />
              }
            >
              <Trash2 className="size-4" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Disconnect Repository</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to disconnect{" "}
                  <span className="font-semibold text-foreground">
                    {repo.fullName}
                  </span>
                  ? This will delete all cached reviews and metadata.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDisconnect}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Disconnect
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
          <span>Connected {new Date(repo.createdAt).toLocaleDateString()}</span>
          <Link
            href={`/repos/${repo.id}`}
            className="flex items-center gap-1 font-medium hover:text-foreground"
          >
            View PRs
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}