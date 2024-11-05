import test, { expect, request } from "@playwright/test";

test.beforeEach('open the portal and login to it', async ({ page }) => {
    await page.goto("/");
})

test('create article', async ({ page, request }) => {
    await page.getByText("New Article").click();
    await page.getByPlaceholder("Article Title").fill('QA Test Article Title');
    await page.getByPlaceholder("What's this article about?").fill("QA Test Article Short Description");
    await page.getByPlaceholder("Write your article (in markdown)").fill("QA Test Article Long Description");
    await page.getByRole("button", { name: "Publish Article" }).click();
    
    const postResponse = await page.waitForResponse(
      "https://conduit-api.bondaracademy.com/api/articles/"
    );
    const postResponseBody = await postResponse.json();
    const articleSlug = await postResponseBody.article.slug;

    expect(await page.locator(".banner h1").textContent()).toEqual('QA Test Article Title');

    await page.getByText('Home').click();
    await page.getByText("Global Feed").click();
    await expect(page.getByText("QA Test Article Title")).toBeVisible();
    const response = await request.post(
    "https://conduit-api.bondaracademy.com/api/users/login",
    {
        data: { user: { email: "pwtest1409@test.com", password: "pwtest1409" } },
    }
    );
    const responseBody = await response.json();
    const accessToken = responseBody.user.token;
    const deleteResponse = await request.delete(
      `https://conduit-api.bondaracademy.com/api/articles/${articleSlug}`,
      {
        headers: { Authorization: `Token ${accessToken}` },
      }
    );
    expect(deleteResponse.status()).toEqual(204)
})
