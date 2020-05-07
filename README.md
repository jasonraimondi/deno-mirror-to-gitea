# Deno Mirror to Gitea

Bulk add mirror repositories to a Gitea instance by scraping users starred repositories on GitHub. 

Mirror repositories are kept up to date automatically by Gitea.

## Usage

Pass in the required fields `GITEA_ACCESS_TOKEN` and `GITHUB_ACCESS_TOKEN`. The default value for `GITEA_API_URL` is listed below, point to your gitea repository.

```
deno run --allow-net --allow-read main.ts \
    --GITEA_API_URL="http://theserver.localdomain:3000/api/v1/"
    --GITEA_ACCESS_TOKEN=""
    --GITHUB_ACCESS_TOKEN=""
    jasonraimondi adamwathan wesbos
```

Or use docker!

```
docker run --rm jasonraimondi/gitea-sync \
    --GITEA_API_URL="http://theserver.localdomain:3000/api/v1/"
    --GITEA_ACCESS_TOKEN=""
    --GITHUB_ACCESS_TOKEN=""
    jasonraimondi adamwathan wesbos
```

## Similar Projects

* https://github.com/jaedle/mirror-to-gitea
