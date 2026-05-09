import { describe, expect, it } from "vitest";

import { sortReposByStars } from "@/lib/github";
import { Repo } from "@/types";

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

describe("GitHub helpers", () => {
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
});
