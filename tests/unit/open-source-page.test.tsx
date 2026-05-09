import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import OpenSourcePage from "@/app/open-source/page";
import { getGithubData } from "@/lib/github";
import { Repo, User } from "@/types";

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <span aria-label={alt} role="img" />,
}));

vi.mock("@/components/GitHubActivity", () => ({
  default: () => <div data-testid="github-activity" />,
}));

vi.mock("@/components/RepoCard", () => ({
  default: ({ repo }: { repo: Repo }) => <article>{repo.name}</article>,
}));

vi.mock("@/lib/github", () => ({
  getGithubData: vi.fn(),
}));

const user: User = {
  login: "oaslananka",
  avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
  public_repos: 1,
  followers: 42,
};

const repo: Repo = {
  id: 1,
  name: "portfolio-platform",
  description: "Portfolio platform",
  fork: false,
  language: "TypeScript",
  watchers: 3,
  forks: 2,
  stargazers_count: 7,
  html_url: "https://github.com/oaslananka/oaslananka.github.io",
  homepage: "https://oaslananka.dev",
};

describe("OpenSourcePage", () => {
  it("renders live GitHub stats when data is available", async () => {
    vi.mocked(getGithubData).mockResolvedValue({
      user,
      repos: [repo],
      sortedRepos: [repo],
      loadError: false,
    });

    render(await OpenSourcePage());

    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("portfolio-platform")).toBeInTheDocument();
  });

  it("renders an unavailable state instead of false zero stats", async () => {
    vi.mocked(getGithubData).mockResolvedValue({
      user: null,
      repos: [],
      sortedRepos: [],
      loadError: true,
    });

    render(await OpenSourcePage());

    expect(
      screen.getByText(/Live GitHub stats are temporarily unavailable/)
    ).toBeInTheDocument();
    expect(screen.getAllByLabelText("Unavailable")).toHaveLength(4);
    expect(screen.queryByText(/^0$/)).not.toBeInTheDocument();
  });
});
