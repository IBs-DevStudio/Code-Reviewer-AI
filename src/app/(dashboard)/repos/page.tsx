"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Calendar,
  MoreVertical,
  ExternalLink,
  GitPullRequest,
  LayoutGrid,
  List,
  ChevronDown,
  Check,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
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

interface ConnectedRepo {
  id: string;
  githubId: number;
  name: string;
  fullName: string;
  private: boolean;
  htmlUrl: string;
  createdAt: Date;
  updatedAt: Date;
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

type FilterType = "all" | "public" | "private";
type SortOption = "recent" | "name-asc" | "name-desc" | "oldest";

const sortLabels: Record<SortOption, string> = {
  recent: "Recently connected",
  "name-asc": "Name (A-Z)",
  "name-desc": "Name (Z-A)",
  oldest: "Oldest connected",
};

function formatConnectedDate(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

export default function ReposPage() {
  const [selectedRepos, setSelectedRepos] = useState<Set<number>>(new Set());
  const [showGitHubRepos, setShowGitHubRepos] = useState(false);
  const [importSearchQuery, setImportSearchQuery] = useState("");

  // Toolbar state for Connected Repositories
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // State for repository to disconnect
  const [repoToDisconnect, setRepoToDisconnect] = useState<ConnectedRepo | null>(
    null,
  );

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
      setRepoToDisconnect(null);
    },
  });

  const connectedIds = new Set(
    connectedRepos.data?.map((r) => r.githubId) ?? [],
  );

  const availableRepos = (githubRepos.data ?? []).filter(
    (repo) => !connectedIds.has(repo.githubId),
  );

  const filteredAvailable = availableRepos.filter((repo) => {
    const q = importSearchQuery.toLowerCase();
    return (
      repo.fullName.toLowerCase().includes(q) ||
      (repo.description?.toLowerCase().includes(q) ?? false)
    );
  });

  // Filtered and sorted connected repos
  const filteredAndSortedRepos = useMemo(() => {
    if (!connectedRepos.data) return [];
    let list = [...connectedRepos.data] as ConnectedRepo[];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((r) => r.fullName.toLowerCase().includes(q));
    }

    if (filterType === "public") {
      list = list.filter((r) => !r.private);
    } else if (filterType === "private") {
      list = list.filter((r) => r.private);
    }

    if (sortBy === "recent") {
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sortBy === "oldest") {
      list.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    } else if (sortBy === "name-asc") {
      list.sort((a, b) => a.fullName.localeCompare(b.fullName));
    } else if (sortBy === "name-desc") {
      list.sort((a, b) => b.fullName.localeCompare(a.fullName));
    }

    return list;
  }, [connectedRepos.data, searchQuery, filterType, sortBy]);

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
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Repositories
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect repositories to enable AI code reviews.
          </p>
        </div>
        <Button
          onClick={() => {
            setShowGitHubRepos(!showGitHubRepos);
            setImportSearchQuery("");
            setSelectedRepos(new Set());
          }}
          variant={showGitHubRepos ? "outline" : "default"}
          className={cn(
            "gap-2 shrink-0 font-medium",
            !showGitHubRepos && "bg-blue-600 hover:bg-blue-700 text-white shadow-xs",
            showGitHubRepos && "border-[#cccccc] bg-white text-slate-800"
          )}
        >
          {showGitHubRepos ? (
            <>
              <X className="size-4" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Plus className="size-4" />
              <span>Add Repositories</span>
            </>
          )}
        </Button>
      </div>

      {/* GitHub Repositories Import Drawer/Card */}
      {showGitHubRepos && (
        <Card className="overflow-hidden border-border/80">
          <div className="border-b border-border/60 bg-muted/30 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-foreground">
                  Import GitHub Repositories
                </h2>
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
                <p className="mt-4 font-medium text-foreground">
                  All caught up!
                </p>
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
                      placeholder="Search repositories to import..."
                      value={importSearchQuery}
                      onChange={(e) => setImportSearchQuery(e.target.value)}
                      className="w-full rounded-md border border-input bg-transparent py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
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

      {/* Controls Bar: Search, Filter, Sort, View Toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 bg-white dark:bg-zinc-900 border border-[#cccccc] dark:border-white/15 focus-visible:ring-blue-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 shadow-xs"
            />
          </div>

          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 gap-2 border border-[#cccccc] dark:border-white/15 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 font-normal hover:bg-slate-50 dark:hover:bg-zinc-800 shadow-xs"
                />
              }
            >
              <span className="capitalize">{filterType === "all" ? "All" : filterType}</span>
              <ChevronDown className="size-3.5 text-slate-500 dark:text-zinc-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-36 border border-[#cccccc] dark:border-white/15 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 shadow-md">
              <DropdownMenuItem
                onClick={() => setFilterType("all")}
                className="justify-between cursor-pointer focus:bg-blue-50 dark:focus:bg-zinc-800 focus:text-blue-700 dark:focus:text-blue-300"
              >
                All
                {filterType === "all" && <Check className="size-3.5 text-blue-600 dark:text-blue-400" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterType("public")}
                className="justify-between cursor-pointer focus:bg-blue-50 dark:focus:bg-zinc-800 focus:text-blue-700 dark:focus:text-blue-300"
              >
                Public
                {filterType === "public" && <Check className="size-3.5 text-blue-600 dark:text-blue-400" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterType("private")}
                className="justify-between cursor-pointer focus:bg-blue-50 dark:focus:bg-zinc-800 focus:text-blue-700 dark:focus:text-blue-300"
              >
                Private
                {filterType === "private" && <Check className="size-3.5 text-blue-600 dark:text-blue-400" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 gap-2 border border-[#cccccc] dark:border-white/15 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 font-normal hover:bg-slate-50 dark:hover:bg-zinc-800 shadow-xs"
                />
              }
            >
              <span>Sort by: {sortLabels[sortBy]}</span>
              <ChevronDown className="size-3.5 text-slate-500 dark:text-zinc-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52 border border-[#cccccc] dark:border-white/15 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 shadow-md">
              <DropdownMenuItem
                onClick={() => setSortBy("recent")}
                className="justify-between cursor-pointer focus:bg-blue-50 dark:focus:bg-zinc-800 focus:text-blue-700 dark:focus:text-blue-300"
              >
                Recently connected
                {sortBy === "recent" && <Check className="size-3.5 text-blue-600 dark:text-blue-400" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy("name-asc")}
                className="justify-between cursor-pointer focus:bg-blue-50 dark:focus:bg-zinc-800 focus:text-blue-700 dark:focus:text-blue-300"
              >
                Name (A-Z)
                {sortBy === "name-asc" && <Check className="size-3.5 text-blue-600 dark:text-blue-400" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy("name-desc")}
                className="justify-between cursor-pointer focus:bg-blue-50 dark:focus:bg-zinc-800 focus:text-blue-700 dark:focus:text-blue-300"
              >
                Name (Z-A)
                {sortBy === "name-desc" && <Check className="size-3.5 text-blue-600 dark:text-blue-400" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy("oldest")}
                className="justify-between cursor-pointer focus:bg-blue-50 dark:focus:bg-zinc-800 focus:text-blue-700 dark:focus:text-blue-300"
              >
                Oldest connected
                {sortBy === "oldest" && <Check className="size-3.5 text-blue-600 dark:text-blue-400" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 self-end sm:self-auto rounded-lg border border-[#cccccc] dark:border-white/15 bg-white dark:bg-zinc-900 p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={cn(
              "flex size-8 items-center justify-center rounded-md transition-colors",
              viewMode === "grid"
                ? "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/60 shadow-xs"
                : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800",
            )}
            aria-label="Grid view"
          >
            <LayoutGrid className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={cn(
              "flex size-8 items-center justify-center rounded-md transition-colors",
              viewMode === "list"
                ? "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/60 shadow-xs"
                : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800",
            )}
            aria-label="List view"
          >
            <List className="size-4" />
          </button>
        </div>
      </div>

      {/* Section Header: Connected Repositories count badge and subtitle */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
            Connected Repositories
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cccccc] dark:border-white/15 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
            <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
            {connectedRepos.data ? connectedRepos.data.length : 0}
          </span>
        </div>
        <span className="text-xs italic text-slate-500 dark:text-zinc-400 hidden sm:inline">
          Connected repositories for AI code reviews
        </span>
      </div>

      {/* Connected Repositories Grid or List */}
      <div className="space-y-4">
        {connectedRepos.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : !connectedRepos.data || connectedRepos.data.length === 0 ? (
          <Card className="py-16 text-center border-border/80">
            <CardContent>
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted">
                <FolderGit2 className="size-7 text-muted-foreground" />
              </div>
              <p className="mt-4 font-medium text-foreground">
                No repositories connected
              </p>
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
        ) : filteredAndSortedRepos.length === 0 ? (
          <Card className="py-12 text-center border-border/80">
            <CardContent className="space-y-3">
              <Search className="mx-auto size-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                No repositories found matching your filter or search.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setFilterType("all");
                }}
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredAndSortedRepos.map((repo) => (
              <ConnectedRepoCard
                key={repo.id}
                repo={repo}
                onDisconnectRequest={(r) => setRepoToDisconnect(r)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredAndSortedRepos.map((repo) => (
              <ConnectedRepoListRow
                key={repo.id}
                repo={repo}
                onDisconnectRequest={(r) => setRepoToDisconnect(r)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Disconnect Alert Dialog */}
      <AlertDialog
        open={!!repoToDisconnect}
        onOpenChange={(open) => {
          if (!open) setRepoToDisconnect(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Repository</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect{" "}
              <span className="font-semibold text-foreground">
                {repoToDisconnect?.fullName}
              </span>
              ? This will delete all cached reviews and metadata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setRepoToDisconnect(null)}
              disabled={disconnectMutation.isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (repoToDisconnect) {
                  disconnectMutation.mutate({ id: repoToDisconnect.id });
                }
              }}
              disabled={disconnectMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {disconnectMutation.isPending ? "Disconnecting..." : "Disconnect"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
  onDisconnectRequest,
}: {
  repo: ConnectedRepo;
  onDisconnectRequest: (repo: ConnectedRepo) => void;
}) {
  const router = useRouter();

  return (
    <Card className="group transition-all hover:border-blue-500/60 bg-white dark:bg-zinc-950 border border-[#cccccc] dark:border-white/15 shadow-xs hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3.5">
            {/* GitHub Octocat Icon Box with light blue styling */}
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <FaGithub className="size-6" />
            </div>

            {/* Repo Details */}
            <div className="min-w-0 flex-1 pt-0.5">
              <Link
                href={`/repos/${repo.id}`}
                className="block truncate font-semibold text-slate-900 dark:text-white transition-colors hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                title={repo.fullName}
              >
                {repo.fullName}
              </Link>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cccccc] dark:border-white/15 bg-slate-50 dark:bg-zinc-900 px-2.5 py-0.5 text-xs text-slate-600 dark:text-zinc-400">
                  {repo.private ? (
                    <Lock className="size-3 text-slate-400 dark:text-zinc-500" />
                  ) : (
                    <Globe className="size-3 text-slate-400 dark:text-zinc-500" />
                  )}
                  <span>{repo.private ? "Private" : "Public"}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Three-dots Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="size-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800"
                  aria-label="Repository options"
                />
              }
            >
              <MoreVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 border-[#cccccc] dark:border-white/15 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">
              <DropdownMenuItem
                onClick={() => window.open(repo.htmlUrl, "_blank")}
                className="cursor-pointer gap-2 dark:hover:bg-zinc-800"
              >
                <ExternalLink className="size-4" />
                <span>View on GitHub</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/repos/${repo.id}`)}
                className="cursor-pointer gap-2 dark:hover:bg-zinc-800"
              >
                <GitPullRequest className="size-4" />
                <span>View PRs</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#cccccc] dark:bg-white/10" />
              <DropdownMenuItem
                onClick={() => onDisconnectRequest(repo)}
                variant="destructive"
                className="cursor-pointer gap-2 text-destructive focus:text-destructive dark:text-rose-400 dark:focus:text-rose-300"
              >
                <Trash2 className="size-4" />
                <span>Disconnect</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Footer Area with separator, status, date and View PRs */}
        <div className="mt-5 flex items-center justify-between border-t border-[#cccccc]/70 dark:border-white/10 pt-4 text-xs text-slate-500 dark:text-zinc-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
              <span className="font-medium text-slate-700 dark:text-zinc-200">Connected</span>
            </div>
            <span className="h-3 w-px bg-[#cccccc] dark:bg-white/10" />
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-slate-400 dark:text-zinc-500" />
              <span>{formatConnectedDate(repo.createdAt)}</span>
            </div>
          </div>
          <Link
            href={`/repos/${repo.id}`}
            className="group/btn flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 transition-colors hover:text-blue-700 dark:hover:text-blue-300"
          >
            <span>View PRs</span>
            <ArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function ConnectedRepoListRow({
  repo,
  onDisconnectRequest,
}: {
  repo: ConnectedRepo;
  onDisconnectRequest: (repo: ConnectedRepo) => void;
}) {
  const router = useRouter();

  return (
    <Card className="transition-all hover:border-blue-500/60 bg-white dark:bg-zinc-950 border border-[#cccccc] dark:border-white/15 shadow-xs hover:shadow-md">
      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-blue-100 dark:border-blue-900/50 bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <FaGithub className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Link
                href={`/repos/${repo.id}`}
                className="font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline truncate"
              >
                {repo.fullName}
              </Link>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#cccccc] dark:border-white/15 bg-slate-50 dark:bg-zinc-900 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-zinc-400 shrink-0">
                {repo.private ? (
                  <Lock className="size-2.5 text-slate-400 dark:text-zinc-500" />
                ) : (
                  <Globe className="size-2.5 text-slate-400 dark:text-zinc-500" />
                )}
                <span>{repo.private ? "Private" : "Public"}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end text-xs text-slate-500 dark:text-zinc-400 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#cccccc]/70 dark:border-white/10">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
            <span className="font-medium text-slate-700 dark:text-zinc-200">Connected</span>
          </div>
          <span className="h-3 w-px bg-[#cccccc] dark:bg-white/10" />
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5 text-slate-400 dark:text-zinc-500" />
            <span>{formatConnectedDate(repo.createdAt)}</span>
          </div>
          <Link
            href={`/repos/${repo.id}`}
            className="group/btn flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 transition-colors hover:text-blue-700 dark:hover:text-blue-300 ml-2"
          >
            <span>View PRs</span>
            <ArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="size-7 text-muted-foreground hover:text-foreground"
                  aria-label="Repository options"
                />
              }
            >
              <MoreVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 border border-[#cccccc] dark:border-white/15 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">
              <DropdownMenuItem
                onClick={() => window.open(repo.htmlUrl, "_blank")}
                className="cursor-pointer gap-2 dark:hover:bg-zinc-800"
              >
                <ExternalLink className="size-4" />
                <span>View on GitHub</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/repos/${repo.id}`)}
                className="cursor-pointer gap-2 dark:hover:bg-zinc-800"
              >
                <GitPullRequest className="size-4" />
                <span>View PRs</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#cccccc] dark:bg-white/10" />
              <DropdownMenuItem
                onClick={() => onDisconnectRequest(repo)}
                variant="destructive"
                className="cursor-pointer gap-2 text-destructive focus:text-destructive dark:text-rose-400 dark:focus:text-rose-300"
              >
                <Trash2 className="size-4" />
                <span>Disconnect</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}