import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/", "/projects", "/articles", "/open-source", "/settings"];

for (const route of routes) {
  test(`has no critical accessibility violations on ${route}`, async ({
    page,
  }) => {
    await page.goto(route);
    await expect(page).toHaveTitle(/Osman ASLAN/);
    await expect(page.locator("main")).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const seriousViolations = results.violations.filter((violation) =>
      ["critical", "serious"].includes(violation.impact ?? "")
    );

    expect(seriousViolations).toEqual([]);
  });
}
