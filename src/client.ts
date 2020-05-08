import { env } from "./constants.ts";

const client = (
  url: string,
  { body, ...customConfig }: RequestInit = {},
): Promise<Response> => {
  const headers: HeadersInit = {
    "content-type": "application/json",
    Authorization: `token ${env.GITEA_ACCESS_TOKEN}`,
  };
  const config: RequestInit = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };
  if (body) {
    config.body = body;
  }
  return fetch(url, config);
};

export const githubClient = (
  query: string,
  variables: { [key: string]: any },
) =>
  client(env.GITHUB_GRAPHQL_URL, {
    headers: {
      Authorization: `bearer ${env.GITHUB_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  });

export const giteaClient = (url: string, request?: RequestInit) =>
  client(`${env.GITEA_API_URL}${url}`, request);
