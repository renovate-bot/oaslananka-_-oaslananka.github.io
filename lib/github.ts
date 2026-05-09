import { siteConfig } from "@/data/site";
import { Repo, User } from "@/types";

const reposPerPage = 100;

export interface GithubData {
  user: User | null;
  repos: Repo[];
  sortedRepos: Repo[];
  loadError: boolean;
}

export function sortReposByStars(repos: Repo[]) {
  return [...repos].sort((a, b) => {
    if (b.stargazers_count !== a.stargazers_count) {
      return b.stargazers_count - a.stargazers_count;
    }

    if (b.forks !== a.forks) {
      return b.forks - a.forks;
    }

    return b.watchers - a.watchers;
  });
}

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": siteConfig.github.apiVersion,
    "User-Agent": siteConfig.github.userAgent,
  };
  const token = process.env.GITHUB_API_KEY || process.env.GITHUB_TOKEN;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function assertGithubOk(
  response: Response,
  context: string
): Promise<void> {
  if (response.ok) return;

  const remaining = response.headers.get("x-ratelimit-remaining");
  const reset = response.headers.get("x-ratelimit-reset");
  const requestId = response.headers.get("x-github-request-id");

  console.warn("GitHub API request failed", {
    context,
    status: response.status,
    statusText: response.statusText,
    remaining,
    reset,
    requestId,
  });

  throw new Error(
    `GitHub API failed for ${context}: ${response.status} ${response.statusText}`
  );
}

async function fetchGithubJson<T>(url: string, context: string) {
  let response: Response;

  try {
    response = await fetch(url, {
      headers: githubHeaders(),
      next: {
        revalidate: 600,
      },
    });
  } catch (error) {
    console.warn("GitHub API request failed", {
      context,
      status: "network_error",
      statusText: error instanceof Error ? error.message : "Unknown error",
      remaining: null,
      reset: null,
      requestId: null,
    });
    throw error;
  }

  await assertGithubOk(response, context);

  return response.json() as Promise<T>;
}

async function getAllRepos(username: string) {
  const allRepos: Repo[] = [];

  for (let page = 1; ; page += 1) {
    const pageRepos = await fetchGithubJson<Repo[]>(
      `https://api.github.com/users/${username}/repos?type=owner&sort=updated&per_page=${reposPerPage}&page=${page}`,
      `repository page ${page}`
    );

    allRepos.push(...pageRepos);

    if (pageRepos.length < reposPerPage) {
      break;
    }
  }

  return allRepos;
}

export async function getGithubData(): Promise<GithubData> {
  try {
    const username = siteConfig.github.username;
    const currentRepoName =
      siteConfig.github.repo.split("/").pop()?.toLowerCase() ?? "";
    const excludedRepoNames = new Set([
      username.toLowerCase(),
      currentRepoName,
    ]);

    const [user, allRepos] = await Promise.all([
      fetchGithubJson<User>(
        `https://api.github.com/users/${username}`,
        "user profile"
      ),
      getAllRepos(username),
    ]);

    const openSourceRepos = allRepos.filter(
      (repo) => !repo.fork && !excludedRepoNames.has(repo.name.toLowerCase())
    );
    const repos = openSourceRepos.length > 0 ? openSourceRepos : allRepos;
    const sortedRepos = sortReposByStars(repos);

    return { user, repos, sortedRepos, loadError: false };
  } catch {
    return {
      user: null,
      repos: [],
      sortedRepos: [],
      loadError: true,
    };
  }
}
