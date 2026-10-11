# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate

FROM base AS build
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY apps ./apps
COPY packages ./packages
RUN pnpm install --frozen-lockfile --filter @rove/api...
# prisma.config.ts requires DIRECT_URL. Generate does not open a connection.
RUN DIRECT_URL="postgresql://postgres:postgres@127.0.0.1:5432/rove" \
  pnpm --filter @rove/api prisma:generate
RUN pnpm --filter @rove/api build
RUN set -eu; \
  pnpm --filter @rove/api --prod deploy /prod/api; \
  rm -rf /prod/api/dist /prod/api/prisma; \
  cp -a apps/api/dist /prod/api/dist; \
  cp -a apps/api/prisma /prod/api/prisma; \
  generated=$(find /app/node_modules/.pnpm -type d -path '*/.prisma/client' | head -1); \
  test -n "$generated"; \
  clients=$(find /prod/api/node_modules/.pnpm -type d -path '*/node_modules/@prisma/client'); \
  test -n "$clients"; \
  for client in $clients; do \
    dest="$(dirname "$(dirname "$client")")/.prisma"; \
    rm -rf "$dest/client"; \
    mkdir -p "$dest"; \
    cp -a "$generated" "$dest/client"; \
  done; \
  cd /prod/api && node -e "require('@prisma/client'); require('express'); require('pg-boss')"

FROM node:22-bookworm-slim AS runtime
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /prod/api /app
RUN node -e "require('@prisma/client'); require('express'); require('pg-boss')"
USER node
EXPOSE 3000
CMD ["node", "dist/app.js"]

FROM build AS migrator
WORKDIR /app
CMD ["pnpm", "--filter", "@rove/api", "exec", "prisma", "migrate", "deploy"]

# Browsers in this image match Playwright 1.64. Pin the npm package to 1.64.0
# when an audit plugin installs it. Node in this image is 24; the app allows >= 22.
FROM mcr.microsoft.com/playwright:v1.64.0-noble AS browser
WORKDIR /app
COPY --from=build /prod/api /app
RUN chown -R pwuser:pwuser /app
USER pwuser
ENV NODE_ENV=production
ENV WORKER_ROLE=browser
CMD ["node", "dist/worker.js"]
