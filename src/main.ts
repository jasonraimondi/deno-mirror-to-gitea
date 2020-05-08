import { env } from "./constants.ts";
import { spiderGitHubUser } from "./api/github.ts";

for (const username of env._) {
  await spiderGitHubUser(username);
}
