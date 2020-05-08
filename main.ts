import { env } from "./constants.ts";
import { spiderGitHubUser } from "./github_api.ts";

for (const username of env._) {
  await spiderGitHubUser(username);
}
