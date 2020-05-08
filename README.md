# Deno Mirror to Gitea

Bulk add mirror repositories to a Gitea instance by scraping repositories on GitHub. 

Mirror repositories are kept up to date automatically by Gitea.

## Usage

Pass in the required fields `GITEA_ACCESS_TOKEN` and `GITHUB_ACCESS_TOKEN`. The default value for `GITEA_API_URL` is listed below, point to your gitea repository.

There are three options for scraping:

* Add `--STARRED=true` to mirror the users starred repos
* Add `--REPOS=true` to mirror the users public repos
* Add `--CONTRIBUTED_TO=true` to mirror any repo the user has contributed to

By passing in a username list of `jasonraimondi adamwathan wesbos`, **deno-mirror-to-gitea** will fetch and add the mirror repos from each user depending on the `--STARRED=true, --REPOS=true, --CONTRIBUTED_TO=true` flags. 

```
deno run --allow-net --allow-read main.ts \
    --GITEA_API_URL="http://localhost:3000/api/v1/" \
    --GITEA_ACCESS_TOKEN="" \
    --GITHUB_ACCESS_TOKEN="" \
    --STARRED=false \
    --REPOS=false \
    --CONTRIBUTED_TO=false \
    jasonraimondi adamwathan wesbos 
```

Or use docker!

```
docker run --rm jasonraimondi/deno-mirror-to-gitea \
    --GITEA_API_URL="http://localhost:3000/api/v1/" \
    --GITEA_ACCESS_TOKEN="" \
    --GITHUB_ACCESS_TOKEN="" \
    --STARRED=false \
    --REPOS=false \
    --CONTRIBUTED_TO=false \
    jasonraimondi adamwathan wesbos
```

## Similar Projects

* https://github.com/jaedle/mirror-to-gitea
