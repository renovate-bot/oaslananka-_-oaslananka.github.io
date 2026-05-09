import { describe, expect, it } from "vitest";

import { absoluteUrl, createPageMetadata, indexedRoutes } from "@/lib/metadata";

describe("metadata helpers", () => {
  it("creates absolute canonical URLs from route paths", () => {
    expect(absoluteUrl("/projects")).toBe("https://oaslananka.dev/projects");
  });

  it("keeps indexed routes unique", () => {
    const paths = indexedRoutes.map((route) => route.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("creates page-specific canonical metadata", () => {
    const metadata = createPageMetadata({
      title: "Open Source",
      path: "/open-source",
    });

    expect(metadata.alternates?.canonical).toBe(
      "https://oaslananka.dev/open-source"
    );
    expect(metadata.openGraph?.url).toBe("https://oaslananka.dev/open-source");
  });
});
