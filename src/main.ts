import { env } from "./constants.js";
import { spiderGitHubUser } from "./github_api.js";

for (const username of env._) {
  await spiderGitHubUser(username);
}
