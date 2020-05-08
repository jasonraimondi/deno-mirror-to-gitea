import { giteaClient } from "../client.ts";
import { blue, red } from "https://deno.land/std/fmt/colors.ts";

type Fields = {
  repo_name: string;
  clone_addr: string;
  auth_password?: string;
  auth_username?: string;
  description?: string;
};

type CreateMigrationRequest = {
  auth_password: string;
  auth_username: string;
  clone_addr: string;
  description: string;
  issues: boolean;
  labels: boolean;
  milestones: boolean;
  mirror: boolean;
  private: boolean;
  pull_requests: boolean;
  releases: boolean;
  repo_name: string;
  uid: number;
  wiki: boolean;
};

export const mergeBody = (
  createMigrationRequest: Partial<CreateMigrationRequest>,
) => ({
  issues: true,
  labels: true,
  milestones: true,
  mirror: true,
  private: false,
  pull_requests: true,
  releases: true,
  wiki: true,
  uid: 2,
  ...createMigrationRequest,
});

export const createMigrationFromGithub = async (
  user: string,
  repo: string,
): Promise<Response | undefined> => {
  if (await alreadyExists(user, repo)) {
    console.warn(red(`repo exists (${user}/${repo})`));
    return;
  }
  return createMigration(
    {
      repo_name: `${user}__${repo}`,
      clone_addr: `https://github.com/${user}/${repo}`,
    },
  )
    .then((res) => {
      console.log(blue(`repo created (${user}/${repo})`));
      return res;
    })
    .catch((e) => {
      return undefined;
    });
};

const createMigration = (fields: Fields) => {
  const body = JSON.stringify(mergeBody(fields));
  return giteaClient("repos/migrate", { body });
};

const alreadyExists = async (user: string, repo: string) => {
  const response = await giteaClient(`repos/mirrors/${user}__${repo}`).catch(
    () => ({ status: 500 }),
  );
  return response.status === 200;
};
