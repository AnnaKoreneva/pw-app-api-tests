import { test, expect } from "@playwright/test";
import tags from "../data/tags.json";
import { mockArticle } from '../data/article'

test.beforeEach("go to the web-portal", async ({ page }) => {
  await page.route("*/**/api/tags", async (overwrightRoute) => {
    await overwrightRoute.fulfill({
      body: JSON.stringify(tags),
    });
  });

  await page.route("*/**/api/articles*", async (overrideFirstArticle) => {
    const response = await overrideFirstArticle.fetch();
    const responseBody = await response.json();
    responseBody.articles[0].title = mockArticle.title;
    responseBody.articles[0].description = mockArticle.description;
    await overrideFirstArticle.fulfill({
      body: JSON.stringify(responseBody),
    });
  });

  await page.waitForTimeout(500);

  await page.goto("/");
});

test("get started link", async ({ page }) => {
  await expect.soft(page.locator(".navbar-brand")).toHaveText("conduit");
});

test("check mock article title", async ({ page }) => {
  await expect
    .soft(page.locator('app-article-preview h1').first())
    .toHaveText(mockArticle.title);
});

test("check mock article description", async ({ page }) => {
  await expect
    .soft(page.locator('app-article-preview p').first())
    .toHaveText(mockArticle.description);
});
