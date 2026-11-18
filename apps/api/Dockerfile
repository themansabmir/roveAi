# =============================================================================
# RoVe API & Background Workers Multi-Stage Dockerfile
# =============================================================================
# Base stage: Node.js 22 with pnpm package manager enabled
FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate

# -----------------------------------------------------------------------------
# Builder stage: Install dependencies, generate Prisma client, compile TypeScript
# -----------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy root monorepo manifests and workspace lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json .npmrc* ./
COPY packages/config-ts/package.json ./packages/config-ts/
COPY apps/api/package.json ./apps/api/

# Install workspace dependencies needed by @rove/api
RUN pnpm install --frozen-lockfile --filter @rove/api...

# Copy workspace source files needed for API build
COPY packages/config-ts ./packages/config-ts
COPY apps/api ./apps/api

# Generate Prisma Client (dummy DIRECT_URL satisfies prisma.config.ts validation during build)
ENV DIRECT_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN pnpm --filter @rove/api prisma:generate

# Build TypeScript to dist directory
RUN pnpm --filter @rove/api build

# -----------------------------------------------------------------------------
# Runner stage: Lightweight production image for API server and background workers
# -----------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app/apps/api

# Install runtime utilities (wget for HTTP healthchecks, procps for process signals)
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    wget \
    procps \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3000

# Create application storage directory with appropriate non-root permissions
RUN mkdir -p /app/apps/api/.data/objects && chown -R node:node /app

# Copy compiled artifacts, node_modules, and Prisma schemas
COPY --chown=node:node --from=builder /app/node_modules /app/node_modules
COPY --chown=node:node --from=builder /app/package.json /app/package.json
COPY --chown=node:node --from=builder /app/packages/config-ts /app/packages/config-ts
COPY --chown=node:node --from=builder /app/apps/api/node_modules /app/apps/api/node_modules
COPY --chown=node:node --from=builder /app/apps/api/package.json /app/apps/api/package.json
COPY --chown=node:node --from=builder /app/apps/api/prisma /app/apps/api/prisma
COPY --chown=node:node --from=builder /app/apps/api/prisma.config.ts /app/apps/api/prisma.config.ts
COPY --chown=node:node --from=builder /app/apps/api/dist /app/apps/api/dist

USER node

EXPOSE 3000

# Default command runs the REST API; worker containers override CMD with their respective entry points
CMD ["node", "dist/app.js"]

