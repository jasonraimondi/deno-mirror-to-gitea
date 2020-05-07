import { createMigrationFromGithub } from "./gitea_api.ts";
import { githubClient } from "./client.ts";
import { env } from "./constants.ts";

const isURL = (s: string) => {
  try {
    new URL(s);
    return true;
  } catch (_) {
    return false;
  }
};

export async function* convertArray(fileArray: string[]) {
  for (let repo of fileArray) {
    if (isURL(repo)) {
      repo = repo.replace("https://github.com/", "");
    }
    const [username, repository] = repo.split("/");
    const response = await createMigrationFromGithub(username, repository);
    yield [repo, response?.status === 201 ? "success" : "fail"];
  }
}

const query = `
query ($userLogin: String!, $cursor: String) {
  user(login: $userLogin) {
    starredRepositories(first:100,after:$cursor) {
      totalCount
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          nameWithOwner
        }
      }
    }
  }
}`;


for (const username of env._) {
  let cursor: string | undefined = undefined;
  let hasNextPage = false;

  do {
    const response = await githubClient(query, { userLogin: username, cursor });
    const jsonResponse = await response.json();

    const { totalCount, pageInfo, edges }: any = jsonResponse?.data?.user?.starredRepositories;
    console.log({ totalCount });

    const repositories = edges.map(({ node }: any) => node.nameWithOwner);
    cursor = pageInfo.endCursor;

    for await (const result of convertArray(repositories)) {
      console.log(result);
    }
    hasNextPage = pageInfo.hasNextPage;
    console.log({ hasNextPage });
  } while (hasNextPage);
}
