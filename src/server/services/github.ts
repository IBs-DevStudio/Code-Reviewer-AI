import { db } from "@/server/db";

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  state: string;
  draft: boolean;
  html_url: string;
  created_at: string;
  user: GitHubUser;
  head: {
    ref: string;
  };
  base: {
    ref: string;
  };
  additions: number;
  deletions: number;
  changed_files: number;
}

export interface GitHubPullRequestFile {
  sha: string;
  filename: string;
  status:
    | "added"
    | "removed"
    | "modified"
    | "renamed"
    | "copied"
    | "changed"
    | "unchanged";
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
  previous_filename?: string;
}

export async function getGitHubAccessToken(
  userId: string
): Promise<string | null> {
  const account = await db.account.findFirst({
    where: {
      userId,
      providerId: "github",
    },
    select: {
      accessToken: true,
    },
  });

  return account?.accessToken ?? null;
}

export async function fetchGitHubRepos(
  accessToken: string
): Promise<GitHubRepo[]> {
  let repos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const response = await fetch(
      `https://api.github.com/user/repos?per_page=${perPage}&page=${page}&sort=updated`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub repos: ${response.statusText}`);
    }

    const data: GitHubRepo[] = await response.json();
    repos = repos.concat(data);

    if (data.length < perPage) {
      break;
    }
    page++;
  }

  return repos;
}

export async function fetchPullRequest(
  accessToken: string,
  owner: string,
  repo: string,
  pullNumber: number
): Promise<GitHubPullRequest> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch pull request: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchPullRequests(
  accessToken: string,
  owner: string,
  repo: string,
  state: "open" | "closed" | "all" = "open"
): Promise<GitHubPullRequest[]> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls?state=${state}&per_page=30&sort=updated&direction=desc`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch pull requests: ${response.statusText}`);
  }

  const pulls: GitHubPullRequest[] = await response.json();

  // The list endpoint doesn't include additions/deletions,
  // so we fetch each PR individually in parallel (as shown around 04:44:08):
  const detailed = await Promise.all(
    pulls.map((pr) => fetchPullRequest(accessToken, owner, repo, pr.number))
  );

  return detailed;
}

export async function fetchPullRequestFiles(
  accessToken: string,
  owner: string,
  repo: string,
  pullNumber: number
): Promise<GitHubPullRequestFile[]> {
  let files: GitHubPullRequestFile[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/files?per_page=${perPage}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch pull request files: ${response.statusText}`
      );
    }

    const data: GitHubPullRequestFile[] = await response.json();
    files = files.concat(data);

    if (data.length < perPage) {
      break;
    }
    page++;
  }

  return files;
}