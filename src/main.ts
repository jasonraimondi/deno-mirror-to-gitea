import { env } from "src/constants.ts";
import { paginateFollowing, spiderGitHubUser } from "src/api/github.ts";

const deepFetch = async (usernames: string[]) => {
  for (const username of usernames) {
    await spiderGitHubUser(username);

    if (env.FETCH_FOLLOWING.toString() === "true") {
      for await (const user of paginateFollowing(username)) {
        await spiderGitHubUser(username);
      }
    }
  }
};

// deepFetch(env._).then(console.log).catch(console.log);
