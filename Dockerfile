FROM hayd/alpine-deno:1.0.0

WORKDIR /app

COPY src /app/src
COPY import_map.json /app/

RUN deno bundle --unstable --importmap=import_map.json src/main.ts bundle.js

ENTRYPOINT ["deno", "run", "--allow-net", "--allow-read", "/app/bundle.js"]
