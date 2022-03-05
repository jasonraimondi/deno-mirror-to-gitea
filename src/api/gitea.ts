import { giteaClient } from "../client.ts";
import { env } from "../constants.ts";
import { blue, red } from "https://deno.land/std@0.52.0/fmt/colors.ts";

type Fields = {
  repo_name: string;
  clone_addr: string;
  uid: number|string;
  private: boolean;
  auth_password?: string;
  auth_username?: string;
  description?: string;
};

// type CreateMigrationRequest = {
//   auth_password: string;
//   auth_username: string;
//   clone_addr: string;
//   description: string;
//   issues: boolean;
//   labels: boolean;
//   milestones: boolean;
//   mirror: boolean;
//   private: boolean;
//   pull_requests: boolean;
//   releases: boolean;
//   repo_name: string;
//   uid: number;
//   wiki: boolean;
// };

export const createMigrationFromGithub = async (user: string, repo: string, isPrivate: boolean): Promise<Response | undefined> => {
  if (await doesRepoExist(user, repo)) {
    console.warn(red(`repo already exists (${user}/${repo})`));
    return;
  }

  let uid = await getOrg(user) ?? await getUser(user);

  if (!uid) {
    uid = await createOrg(user);
  }

  if (!uid) {
    console.error(red(`something went wrong creating (${user})`));
    return;
  }

  return createMigration(
    {
      uid,
      repo_name: `${repo}`,
      clone_addr: `https://github.com/${user}/${repo}`,
      private: isPrivate,
    },
  )
    .then((res) => {
      console.log(blue(`repo created (${user}/${repo})`));
      return res;
    })
    .catch((_: any) => {
      return undefined;
    });
};

export const createMigration = (fields: Fields) => {
  return giteaClient("repos/migrate", {
    body: JSON.stringify({
      issues: true,
      labels: true,
      milestones: true,
      mirror: true,
      pull_requests: true,
      releases: true,
      wiki: true,
      auth_token: env.GITHUB_ACCESS_TOKEN,
      ...fields,
    }),
  });
};

export const doesRepoExist = async (user: string, repo: string): Promise<boolean> => {
  const response = await giteaClient(`repos/${user}/${repo}`).catch(
    () => ({ status: 500 }),
  );
  return response.status === 200;
};

export const createOrg = async (org: string): Promise<string | undefined> => {
  const response = await giteaClient(`orgs`, {
    body: JSON.stringify({
      description: `mirrored repositories for github user ${org}`,
      username: org,
      visibility: "public",
      website: `https://github.com/${org}`,
    }),
  });
  const { id } = await response.json().catch((e: any) => {
    console.log(red(e.message));
    console.log(red(`Skipping ${org}`))
    return { id: undefined };
  });
  return id;
};

export const getOrg = async (org: string): Promise<string | undefined> => {
  const response = await giteaClient(`orgs/${org}`);
  const { id } = await response.json();
  return id;
};

export const getUser = async (org: string): Promise<string | undefined> => {
  const response = await giteaClient(`users/${org}`);
  const { id } = await response.json();
  return id;
};
