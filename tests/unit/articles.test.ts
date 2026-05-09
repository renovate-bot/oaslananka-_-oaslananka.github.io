import { afterEach, describe, expect, it, vi } from "vitest";

import { getArticles } from "@/lib/articles";

describe("article loading", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses the public DEV endpoint and normalizes article data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: 123,
            title: "Post",
            description: "Description",
            cover_image: null,
            url: "https://dev.to/oaslananka/post",
            positive_reactions_count: 7,
            comments_count: 2,
          },
        ],
      })
    );

    await expect(getArticles()).resolves.toMatchObject([
      {
        id: "123",
        title: "Post",
        public_reactions_count: 7,
        comments_count: 2,
      },
    ]);

    expect(fetch).toHaveBeenCalledWith(
      expect.objectContaining({
        href: expect.stringContaining("https://dev.to/api/articles?"),
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
          "User-Agent": "oaslananka.github.io",
        }),
      })
    );
  });

  it("returns an empty list when the public endpoint fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
      })
    );

    await expect(getArticles()).resolves.toEqual([]);
  });
});
