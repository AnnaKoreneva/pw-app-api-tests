import { test as setup } from '@playwright/test'
import user from '../.auth/user.json'
import fs from 'fs'

/**
 * This approach requires:
 * 1. auth json files presentness, what might be tricky because it is generated during the authentication 
 * and added to the package-lock.json config.
 * 2. only when web-portal use one-user authentication
 */

const authFile = ".auth/user.json";

setup('setup auth state with the api', async ({request }) => {
  const response = await request.post(
    "https://conduit-api.bondaracademy.com/api/users/login",
    {
      data: {
        user: { email: "pwtest1409@test.com", password: "pwtest1409" },
      },
    }
  );
  const responseBody = await response.json();
  const accessToken = responseBody.user.token;
  user.origins[0].localStorage[0].value = accessToken;
  fs.writeFileSync(authFile, JSON.stringify(user));

  // This is required for being able to re-use access token in the api calls through the framework
  process.env["ACCESS_TOKEN"] = accessToken;
  
  /**
   * Add the config line to the playwright.config.json => use{} object so this token be valid through entire project
    extraHTTPHeaders: {
        'Authorization': `Token ${process.env.ACCESS_TOKEN}`,
    },
  **/
})