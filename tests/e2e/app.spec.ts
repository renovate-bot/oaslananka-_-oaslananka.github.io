import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/about",
  "/projects",
  "/articles",
  "/open-source",
  "/contact",
  "/settings",
];

test.describe("portfolio routes", () => {
  for (const route of routes) {
    test(`loads ${route}`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
    });
  }
});

test("command palette navigates by keyboard", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+Shift+P");
  await page.getByLabel("Search commands").fill("contact");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/contact$/);
});

test("command palette traps focus and restores focus on close", async ({
  page,
}) => {
  await page.goto("/");
  const opener = page.getByRole("button", { name: "View" });
  await opener.focus();
  await page.keyboard.press("Enter");

  const search = page.getByLabel("Search commands");
  await expect(search).toBeFocused();
  await expect(search).toHaveAttribute(
    "aria-activedescendant",
    "command-palette-command-go-home"
  );

  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("option", { name: /Change Color Theme/ })
  ).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(search).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(opener).toBeFocused();
});

test("terminal can be opened and closed", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle terminal" }).click();
  await expect(
    page.getByText("Welcome to the interactive terminal!")
  ).toBeVisible();
  await page.getByRole("button", { name: "Close terminal" }).click();
  await expect(
    page.getByText("Welcome to the interactive terminal!")
  ).toBeHidden();
});

test("articles page does not expose operational environment names", async ({
  page,
}) => {
  await page.goto("/articles");
  await expect(page.locator("body")).not.toContainText("DEV_TO_API_KEY");
});

test("metadata routes are generated", async ({ page }) => {
  await page.goto("/robots.txt");
  await expect(page.locator("body")).toContainText("Sitemap");

  await page.goto("/sitemap.xml");
  await expect(page.locator("body")).toContainText("https://oaslananka.dev/");
});

test("security headers include CSP report-only policy", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();

  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["cross-origin-opener-policy"]).toBe("same-origin");
  expect(headers["content-security-policy-report-only"]).toContain(
    "default-src 'self'"
  );
});
