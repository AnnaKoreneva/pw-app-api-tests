import { test, expect} from "@playwright/test";
import tags from "../data/tags.json";
import { mockArticle } from '../data/article'

test.beforeEach("go to the web-portal", async ({ page }) => {
    await page.goto("/");
});

test("delete article", async ({ page, request }) => {
    const response =  await request.post(
      "https://conduit-api.bondaracademy.com/api/users/login",
      {
        data: {user: { email: "pwtest1409@test.com", password: "pwtest1409" }},
        });  
    const responseBody = await response.json()
    const accessToken = responseBody.user.token;

    const responseArticleCreation = await request.post("https://conduit-api.bondaracademy.com/api/articles/", {
      data: {
        article: {
          title: "QA Article Demo Title",
          description: "QA Article Demo Topic",
          body: "QA Article Demo Text",
          tagList: ["tag1", "tag2", "tag3"],
        },
      },
      headers: {
        Authorization: `Token ${accessToken}`,
      },
    });
    expect(responseArticleCreation.status()).toEqual(201)
    await page.getByText("Global Feed").click();
    await page.getByText("QA Article Demo Title").click();
    await page
      .locator(".banner")
      .getByRole("button", { name: "Delete Article" })
      .click();
    expect(await page.locator("app-article-preview h1").first().textContent()).not.toContain("QA Article Demo Title");
});