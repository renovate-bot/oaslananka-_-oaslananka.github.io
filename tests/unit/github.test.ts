import { afterEach, describe, expect, it, vi } from "vitest";

import { getGithubData, sortReposByStars } from "@/lib/github";
import { Repo, User } from "@/types";

const baseRepo: Repo = {
  id: 1,
  name: "repo",
  description: "",
  fork: false,
  language: "TypeScript",
  watchers: 0,
  forks: 0,
  stargazers_count: 0,
  html_url: "https://github.com/oaslananka/repo",
  homepage: "",
};

const baseUser: User = {
  login: "oaslananka",
  avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
  public_repos: 2,
  followers: 42,
};

describe("GitHub helpers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("sorts repositories by stars, forks, then watchers", () => {
    const repos = [
      { ...baseRepo, id: 1, name: "low", stargazers_count: 1 },
      { ...baseRepo, id: 2, name: "popular", stargazers_count: 5 },
      {
        ...baseRepo,
        id: 3,
        name: "popular-forked",
        stargazers_count: 5,
        forks: 3,
      },
    ];

    expect(sortReposByStars(repos).map((repo) => repo.name)).toEqual([
      "popular-forked",
      "popular",
      "low",
    ]);
  });

  it("returns live data when the GitHub API succeeds", async () => {
    const repos = [
      { ...baseRepo, id: 10, name: "portfolio", stargazers_count: 7 },
      { ...baseRepo, id: 11, name: "oaslananka.github.io" },
    ];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string | URL | Request) => {
        const url = String(input);

        if (url.endsWith("/users/oaslananka")) {
          return Response.json(baseUser);
        }

        return Response.json(repos);
      })
    );

    const data = await getGithubData();

    expect(data.loadError).toBe(false);
    expect(data.user?.followers).toBe(42);
    expect(data.repos.map((repo) => repo.name)).toEqual(["portfolio"]);
  });

  it("logs context and returns an unavailable state when the GitHub API fails", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        return new Response("rate limited", {
          status: 403,
          statusText: "Forbidden",
          headers: {
            "x-ratelimit-remaining": "0",
            "x-ratelimit-reset": "1770000000",
            "x-github-request-id": "ABC:123",
          },
        });
      })
    );

    const data = await getGithubData();

    expect(data).toEqual({
      user: null,
      repos: [],
      sortedRepos: [],
      loadError: true,
    });
    expect(warn).toHaveBeenCalledWith(
      "GitHub API request failed",
      expect.objectContaining({
        status: 403,
        remaining: "0",
        reset: "1770000000",
        requestId: "ABC:123",
      })
    );
  });
});
