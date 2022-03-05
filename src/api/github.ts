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
    ${queryType}(first:25,after:$cursor) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          nameWithOwner
          isPrivate
        }
      }
    }
  }
}`
);

const followingQuery =
  `query ($userLogin: String!, $cursor: String) {
  user(login: $userLogin) {
    following(first:25,after:$cursor) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          login
        }
      }
    }
  }
}`;

async function addMirrorForRepo({repoWithUsername, isPrivate}: {repoWithUsername: string, isPrivate: boolean}) {
  const [username, repository] = repoWithUsername.split("/");
  if (env.DRY_RUN.toString() === "false") {
    const response = await createMigrationFromGithub(username, repository, isPrivate);
    return [repoWithUsername, response?.status === 201 ? "success" : "fail"];
  }
  console.log("TEST_MODE", username, repository);
  return [username, repository];
}

export async function* paginateFollowing(username: string | number) {
  let cursor: string | undefined = undefined;
  let hasNextPage = false;

  do {
    const variables = { userLogin: username, cursor };
    const response = await githubClient(followingQuery, variables);
    const jsonResponse = await response.json();

    const { totalCount, pageInfo, edges }: any = jsonResponse?.data?.user?.following;
    console.log({ totalCount });

    const users = edges.map(({ node }: any) => node.login);
    cursor = pageInfo.endCursor;

    for (const user of users) {
      yield user;
    }
    hasNextPage = pageInfo.hasNextPage;
  } while (hasNextPage);
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

    const repositories = edges.map(({ node }: any) => ({
      repoWithUsername: node.nameWithOwner,
      isPrivate: node.isPrivate
    }));
    cursor = pageInfo.endCursor;

    for (const repo of repositories) {
      yield repo;
    }
    hasNextPage = pageInfo.hasNextPage;
    await sleep(2500);
  } while (hasNextPage);
}

export async function spiderGitHubUser(username: string | number) {
  if (env.STARRED.toString() === "true") {
    const queryType = "starredRepositories";
    for await (const repo of paginateRepositories(username, queryType)) {
      await addMirrorForRepo(repo);
    }
  }
  if (env.REPOS.toString() === "true") {
    const queryType = "repositories";
    for await (const repo of paginateRepositories(username, queryType)) {
      await addMirrorForRepo(repo);
    }
  }
  if (env.CONTRIBUTED_TO.toString() === "true") {
    const queryType = "repositoriesContributedTo";
    for await (const repo of paginateRepositories(username, queryType)) {
      await addMirrorForRepo(repo);
    }
  }
}

const sleep = (ms: number) => new Promise((resolve, reject) => setTimeout(resolve, ms));
