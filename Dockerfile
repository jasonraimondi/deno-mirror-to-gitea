FROM hayd/alpine-deno

WORKDIR /app

COPY src /app

RUN deno bundle main.ts bundle.js

ENTRYPOINT ["deno", "run", "--allow-net", "--allow-read", "/app/bundle.js"]
