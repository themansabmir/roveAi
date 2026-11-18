# =============================================================================
# RoVe Marketing Website Multi-Stage Dockerfile (Next.js 15)
# =============================================================================
# Base stage: Node.js 22 with pnpm package manager enabled
FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate

# -----------------------------------------------------------------------------
# Builder stage: Install dependencies and build Next.js site
# -----------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json .npmrc* ./
COPY packages/config-ts/package.json ./packages/config-ts/
COPY packages/cms/package.json ./packages/cms/
COPY packages/ui/package.json ./packages/ui/
COPY apps/web/package.json ./apps/web/

RUN pnpm install --frozen-lockfile --filter @rove/web...

COPY packages/config-ts ./packages/config-ts
COPY packages/cms ./packages/cms
COPY packages/ui ./packages/ui
COPY apps/web ./apps/web

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @rove/web build

# -----------------------------------------------------------------------------
# Runner stage: Lightweight Next.js production server
# -----------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app/apps/web

RUN apt-get update && apt-get install -y --no-install-recommends wget && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3001
ENV NEXT_TELEMETRY_DISABLED=1

COPY --chown=node:node --from=builder /app/node_modules /app/node_modules
COPY --chown=node:node --from=builder /app/package.json /app/package.json
COPY --chown=node:node --from=builder /app/packages /app/packages
COPY --chown=node:node --from=builder /app/apps/web/node_modules /app/apps/web/node_modules
COPY --chown=node:node --from=builder /app/apps/web/package.json /app/apps/web/package.json
COPY --chown=node:node --from=builder /app/apps/web/.next /app/apps/web/.next
COPY --chown=node:node --from=builder /app/apps/web/public /app/apps/web/public

USER node

EXPOSE 3001

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3001/ || exit 1

CMD ["pnpm", "start"]

