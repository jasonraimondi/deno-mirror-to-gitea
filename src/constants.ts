import { parse } from "flags/mod.ts";

const foo = parse(Deno.args);

console.log({ foo });

export const env = {
  GITHUB_GRAPHQL_URL: "https://api.github.com/graphql",
  GITEA_API_URL: "http://localhost:3000/api/v1",
  GITEA_ACCESS_TOKEN: "",
  GITHUB_ACCESS_TOKEN: "",
  REPOS: false,
  CONTRIBUTED_TO: false,
  STARRED: false,
  FETCH_FOLLOWING: false,
  DRY_RUN: false,
  ...foo,
};
