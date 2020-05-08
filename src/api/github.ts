import { githubClient } from "../client.ts";
import { createMigrationFromGithub } from "./gitea.ts";
import { env } from "../constants.ts";

type RepositoryQueryType =
  | "repositories"
  | "repositoriesContributedTo"
  | "starredRepositories";

const repositoryQuery = (queryType: RepositoryQueryType) => (
  `query ($userLogin: String!, $cursor: String) {
  user(login: $userLogin) {
    ${queryType}(first:100,after:$cursor) {
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
}`
);

async function* convertArray(fileArray: string[]) {
  for (let repo of fileArray) {
    const [username, repository] = repo.split("/");
    const response = await createMigrationFromGithub(username, repository);
    yield [repo, response?.status === 201 ? "success" : "fail"];
  }
}

async function* paginateRepositories(
  username: string | number,
  queryType: RepositoryQueryType,
) {
  let cursor: string | undefined = undefined;
  let hasNextPage = false;

  do {
    const query = repositoryQuery(queryType);
    const variables = { userLogin: username, cursor };
    const response = await githubClient(query, variables);
    const jsonResponse = await response.json();

    const { totalCount, pageInfo, edges }: any = jsonResponse?.data?.user?.[queryType];
    console.log({ totalCount });

    const repositories = edges.map(({ node }: any) => node.nameWithOwner);
    cursor = pageInfo.endCursor;

    for await (const result of convertArray(repositories)) {
      yield result;
    }
    hasNextPage = pageInfo.hasNextPage;
  } while (hasNextPage);
}

export async function spiderGitHubUser(username: any) {
  if (env.STARRED === true) {
    const queryType = "starredRepositories";
    for await (const result of paginateRepositories(username, queryType)) {
    }
  }
  if (env.REPOS === true) {
    const queryType = "repositories";
    for await (const result of paginateRepositories(username, queryType)) {
    }
  }
  if (env.CONTRIBUTED_TO === true) {
    const queryType = "repositoriesContributedTo";
    for await (const result of paginateRepositories(username, queryType)) {
    }
  }
}
