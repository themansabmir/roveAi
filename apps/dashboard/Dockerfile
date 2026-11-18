# =============================================================================
# RoVe Agency Dashboard Multi-Stage Dockerfile (React + Vite + Nginx)
# =============================================================================
# Base stage: Node.js 22 with pnpm package manager enabled
FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate

# -----------------------------------------------------------------------------
# Builder stage: Install dependencies, build React + Vite SPA
# -----------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

# Copy monorepo manifests and workspace lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json .npmrc* ./
COPY packages/config-ts/package.json ./packages/config-ts/
COPY packages/ui/package.json ./packages/ui/
COPY apps/dashboard/package.json ./apps/dashboard/

# Install dependencies required by dashboard workspace
RUN pnpm install --frozen-lockfile --filter @rove/dashboard...

# Copy source code for workspace packages consumed by dashboard
COPY packages/config-ts ./packages/config-ts
COPY packages/ui ./packages/ui
COPY apps/dashboard ./apps/dashboard

# Build dashboard production bundle to dist
RUN pnpm --filter @rove/dashboard build

# -----------------------------------------------------------------------------
# Runner stage: Lightweight Nginx Alpine server
# -----------------------------------------------------------------------------
FROM nginx:alpine AS runner

COPY apps/dashboard/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/dashboard/dist /usr/share/nginx/html

EXPOSE 5173

HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5173/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

