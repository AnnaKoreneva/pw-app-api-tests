import { test as setup } from "@playwright/test";
import fs from "fs";

const authFile = '.auth/user.json';
const max_age = 2 * 60 * 60 * 1000  //Auth state expires in 2h. 

const isAuthStateRecent = (): boolean => {
    if (!fs.existsSync(authFile)) return false;

    const stats = fs.statSync(authFile);
    const lastModified = stats.mtime.getTime();
    const now = Date.now();
    const tokenLifeTime = now - lastModified;
    console.log(`Last modified time in ms since midnight 1970: ${lastModified}`)
    console.log(`Now time in ms since midnight 1970: ${now}`);
    console.log(`Token max age in ms: ${max_age}`);
    console.log(`Token age in ms as for now: ${now - lastModified}`);
    console.log(`How much ms token is valid: ${max_age - tokenLifeTime}`);

    return (now - lastModified) < max_age;
}

setup('authentication', async ({ page }) => {
    if (isAuthStateRecent() == false) {
        await page.goto("https://conduit.bondaracademy.com/");
        await page.getByText("Sign In").click();
        await page.getByPlaceholder("Email").fill("pwtest1409@test.com");
        await page.getByPlaceholder("Password").fill("pwtest1409");
        await page.getByRole("button", { name: "Sign in" }).click();

        await page.waitForResponse("*/**/api/articles*");
        await page.context().storageState({ path: authFile });
    }
})
