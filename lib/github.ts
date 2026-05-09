import { siteConfig } from "@/data/site";
import { Repo, User } from "@/types";

const reposPerPage = 100;

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

async function fetchGithubJson<T>(url: string) {
  const response = await fetch(url, {
    headers: githubHeaders(),
    next: {
      revalidate: 600,
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function getAllRepos(username: string) {
  const allRepos: Repo[] = [];

  for (let page = 1; ; page += 1) {
    const pageRepos = await fetchGithubJson<Repo[]>(
      `https://api.github.com/users/${username}/repos?type=owner&sort=updated&per_page=${reposPerPage}&page=${page}`
    );

    allRepos.push(...pageRepos);

    if (pageRepos.length < reposPerPage) {
      break;
    }
  }

  return allRepos;
}

export async function getGithubData() {
  try {
    const username = siteConfig.github.username;
    const currentRepoName =
      siteConfig.github.repo.split("/").pop()?.toLowerCase() ?? "";
    const excludedRepoNames = new Set([
      username.toLowerCase(),
      currentRepoName,
    ]);

    const [user, allRepos] = await Promise.all([
      fetchGithubJson<User>(`https://api.github.com/users/${username}`),
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
