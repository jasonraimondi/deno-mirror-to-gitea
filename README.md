# Deno Mirror to Gitea

[![Image Size](https://img.shields.io/docker/image-size/jasonraimondi/deno-mirror-to-gitea?style=flat-square)](https://hub.docker.com/r/jasonraimondi/deno-mirror-to-gitea/)
[![Pulls](https://img.shields.io/docker/pulls/jasonraimondi/deno-mirror-to-gitea?style=flat-square)](https://hub.docker.com/r/jasonraimondi/deno-mirror-to-gitea/)
[![Version](https://img.shields.io/docker/v/jasonraimondi/deno-mirror-to-gitea?style=flat-square)](https://hub.docker.com/r/jasonraimondi/deno-mirror-to-gitea/)

Bulk add mirror repositories to a Gitea instance by scraping repositories on GitHub. 

Mirror repositories are kept up to date automatically by Gitea.

## Why?

I am a [data hoarder](https://www.reddit.com/r/DataHoarder/).

## Usage

Pass in the required fields:

* `GITEA_ACCESS_TOKEN`
* `GITHUB_ACCESS_TOKEN`

By default, 

### Runtime options

| Name               | Default Value                 | Description |
|--------------------|-------------------------------| ------------|
|GITHUB_ACCESS_TOKEN | <required>                    | <a href="https://github.com/settings/tokens/new?description=deno-mirror-to-gitea&scopes=public_repo" target="_blank" rel="noopener noreferrer">create a github access token</a>  |
|GITEA_ACCESS_TOKEN  | <required>                    | gitea access token |
|GITEA_API_URL       | http://localhost:3000/api/v1/ | api url |
|STARRED             | false                         | mirror the users starred repos |
|REPOS               | false                         | mirror the users public repos |
|CONTRIBUTED_TO      | false                         | mirror any repo the user has contributed to  |
|FETCH_FOLLOWING     | false                         | grab all users you are following, and fetch STARRED/CONTRIUBTED_TO/REPOS based on enabled fields, only traverses 1 depth|
|DRY_RUN             | true                          | disable sandbox/test-mode and migrate the repos|

For the full list of passable runtime variables are located in [constants.ts](./src/constants.ts)

By passing in a username list of `jasonraimondi adamwathan wesbos`, **deno-mirror-to-gitea** will fetch and add the mirror repos from each user depending on the `--STARRED=true, --REPOS=true, --CONTRIBUTED_TO=true, --FETCH_FOLLOWING=true` flags. In this case, we would be grabbing all of the repos, starred repos, and contributed repos for jasonraimondi, adamwathan, and wesbos. Then we would fetch all of the users that these three are following, and mirror every repo, starred, and contributed to for the users we are following.  

**Note: when using `--FETCH_FOLLOWING=true` in combination with the `--STARRED=true --REPOS=true and --CONTRIBUTED_TO=true`, it is going to exponentially increase the amount of repos you are mirroring**

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
* https://github.com/armcknight/forgery - this project pulls from github to a local filesystem, so if you're not running Gitea, give this one a :eyes:
