FROM node:22-slim

WORKDIR /app

COPY infra/selfhost/intake-api/package.json ./package.json

# better-sqlite3 requires native build toolchain.
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

RUN npm install --omit=dev

COPY infra/selfhost/intake-api/server.mjs ./server.mjs

ENV PORT=3010
EXPOSE 3010

CMD ["node", "server.mjs"]
