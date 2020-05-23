FROM hayd/alpine-deno:1.0.0

WORKDIR /app

COPY src /app

RUN deno bundle main.ts bundle.js

ENTRYPOINT ["deno", "run", "--allow-net", "--allow-read", "/app/bundle.js"]
