# Rove API (`@rove/api`) — Technical Architecture Guide

> **Location**: `apps/api/`  
> **Framework**: Express 5 + TypeScript + Prisma 7 + Better Auth  
> **Role**: REST API server, background job dispatcher, and auditing engine.

---

## 1. Architectural Philosophy

The `@rove/api` package is architected around **Dependency Inversion**, **Modular Plugins**, and **Domain-Driven Feature Modules**:

1. **Pluggable Capabilities**: External integrations (Database, Queues, Map Providers, Storage, AI, Email) implement standardized interfaces and register with a centralized `PluginRegistry`.
2. **Dual-Plane RBAC**: Distinguishes between platform-level super admins (`/api/admin/*`) and tenant-level workspace members (`/api/organizations/:id/*`).
3. **Transactional Outbox**: All background tasks are written as `Job` rows inside the initiating database transaction before publishing to queues.
4. **Resilient Error Boundaries**: Errors are typed via custom hierarchy (`AppError`, `NotFoundError`, `ConflictError`, `BudgetExceededError`) and handled uniformly.

---

## 2. Directory Structure

```
apps/api/src/
├── core/                         # Core runtime primitives
│   ├── config.ts                 # Zod-validated environment schema
│   ├── errors.ts                 # Domain error classes & HTTP mapping
│   ├── logger.ts                 # Pino logger instance
│   └── registry.ts               # Inversion of Control PluginRegistry
├── entries/                      # Execution entrypoints
│   ├── crawl.ts                  # Standalone crawl worker
│   ├── discover.ts               # Standalone discovery worker
│   ├── interpret.ts              # Standalone interpretation worker
│   ├── psi.ts                    # Standalone PageSpeed Insights worker
│   ├── push-server.ts            # Cloud Run Pub/Sub push HTTP server
│   ├── run-role.ts               # Worker bootstrapper by role
│   └── sweep.ts                  # Outbox job recovery sweeper
├── features/                     # Domain modules (controllers, routes, services)
│   ├── admin/                    # Platform administration & provider management
│   ├── audits/                   # Analyzers, crawl, psi, interpret, join barrier
│   ├── auth/                     # Better Auth configuration & superadmin boot
│   ├── campaigns/                # Campaign creation, discovery, normalization
│   ├── health/                   # Liveness (/healthz) and readiness (/readyz)
│   ├── invitations/              # Team member invitations & token validation
│   ├── jobs/                     # Outbox dispatcher, distributed locking, sweep
│   ├── me/                       # Current authenticated user & session context
│   ├── organizations/            # Agency workspace management & settings
│   └── workspaces/               # Organization onboarding & active org selection
├── interfaces/                   # Common plugin & service contracts
├── middleware/                   # Express middleware
│   ├── errorHandler.ts           # Global error handler & 404 handler
│   ├── rbac.ts                   # Role-based access control guards
│   ├── requestContext.ts         # Correlation ID & request timing
│   ├── session.ts                # Better Auth cookie session attachment
│   └── validate.ts               # Zod request payload validation
├── plugins/                      # Pluggable service implementations
│   ├── ai/                       # Gemini, OpenAI, and Deterministic LLM providers
│   ├── email/                    # Resend and Local Log providers
│   ├── fetch/                    # SSRF-guarded HTTP fetch & robots.txt parser
│   ├── maps/                     # Apify, Outscraper, SerpAPI, Places, Fixtures
│   ├── pagespeed/                # Google PageSpeed Insights API client
│   ├── prisma/                   # Prisma Client & PostgreSQL adapter
│   ├── queue/                    # pg-boss (local) & Pub/Sub (cloud) queues
│   ├── storage/                  # GCS and Local Disk storage providers
│   └── register-all.ts           # Central plugin registration routine
├── app.ts                        # Local development API bootstrapper
├── server.ts                     # Express app factory (buildApp, startServer)
└── worker.ts                     # Default multi-role background worker
```

---

## 3. The Plugin Lifecycle & Inversion of Control

All external infrastructure services implement the `IPlugin` interface:

```typescript
export interface IPlugin {
  name: string;
  initialize(registry: IPluginRegistry): Promise<void>;
  shutdown?(): Promise<void>;
  isHealthy?(): Promise<boolean>;
}
```

### Registration Order (`src/plugins/register-all.ts`)
When the application starts, plugins initialize sequentially to guarantee dependency resolution:

1. **`PrismaPlugin`**: Establishes PostgreSQL connection pool using `@prisma/adapter-pg`.
2. **`QueuePlugin`**: Connects to `pg-boss` tables (or configures Google Cloud Pub/Sub topics).
3. **`MapsPlugin`**: Initializes map discovery providers (Apify by default).
4. **`EmailPlugin`**: Prepares Resend or mock logger.
5. **`FetchPlugin`**: Configures SSRF-protected HTTP client with timeout controls.
6. **`StoragePlugin`**: Mounts local storage directory (`.data/objects`) or connects to GCS/R2.
7. **`PagespeedPlugin`**: Configures Google PageSpeed Insights v5 client.
8. **`AiPlugin`**: Sets up Google Gemini / OpenAI reasoning providers.

### Health Probes (`/healthz` and `/readyz`)
The `healthRouter` verifies plugin status:
- `/healthz`: Liveness check (process running).
- `/readyz`: Readiness check; calls `isHealthy()` on Prisma and Queue plugins before accepting traffic.

---

## 4. HTTP Middleware & Request Lifecycle

Incoming requests to Express pass through a strictly ordered pipeline:

```
Request Received
  │
  ├─▶ 1. disable("x-powered-by"), set("trust proxy", 1)
  ├─▶ 2. helmet(): Adds strict security headers (CSP, HSTS, X-Content-Type-Options)
  ├─▶ 3. cors(): Validates origin against CORS_ORIGINS with credentials support
  ├─▶ 4. requestContext(): Generates x-request-id for end-to-end log tracing
  ├─▶ 5. Better Auth Raw Route: app.all("/api/auth/*splat", toNodeHandler(auth))
  │      (Must run BEFORE express.json because Better Auth parses raw body streams)
  ├─▶ 6. express.json({ limit: config.REQUEST_BODY_LIMIT }): Parses JSON bodies
  ├─▶ 7. cookieParser(): Parses session and tracking cookies
  ├─▶ 8. attachSession(): Validates Better Auth session token; populates req.auth
  ├─▶ 9. Router Dispatch:
  │      ├── /api/me               -> Authenticated user & membership profile
  │      ├── /api/admin/*          -> requireSuperAdmin() guard
  │      ├── /api/organizations/*  -> requireOrgRole() & workspace isolation
  │      └── /healthz, /readyz     -> Diagnostic checks
  ├─▶ 10. notFoundHandler(): Catches 404 routes
  └─▶ 11. errorHandler(): Centralized error mapper (status codes, clean JSON output)
```

---

## 5. Dual-Plane Authorization (`src/middleware/rbac.ts`)

Rove prevents privilege escalation by checking roles at two distinct boundaries:

### 1. Platform Plane (`requireSuperAdmin`)
```typescript
export function requireSuperAdmin() {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth?.user?.isSuperAdmin) {
      throw new ForbiddenError("Super admin access required");
    }
    next();
  };
}
```
Protects platform-wide settings (`PlatformSetting`), cross-organization monitoring, and discovery provider toggles.

### 2. Workspace Plane (`requireOrgRole`)
```typescript
export function requireOrgRole(minimumRole: MembershipRole) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    // Validates that req.auth.user is a member of req.params.organizationId
    // Enforces hierarchy: owner > admin > member
  };
}
```
Ensures agency users can only inspect, create, or modify resources belonging to their verified workspace.

---

## 6. Database Architecture with Prisma 7

Rove uses Prisma 7 with driver adapters:

- **Connection Config (`prisma.config.ts`)**: Connection URLs live outside `schema.prisma`. It reads `DIRECT_URL` for running migrations and CLI tasks.
- **Connection Pooling**: In application runtime, `PrismaPlugin` initializes `@prisma/adapter-pg` using `DATABASE_URL` (pooler host in serverless environments like Neon).
- **Migration Strategy**: Migrations live in `prisma/migrations/` and must be applied with:
  ```bash
  pnpm --filter @rove/api prisma:migrate:deploy
  ```
- **Automated Seeding**: `ensureDefaultSuperAdmin()` guarantees that fresh databases automatically receive an administrative account on startup.

---

## 7. Cloud Run & Pub/Sub Push Architecture

For scalable production deployment on Google Cloud Platform:
1. Set `QUEUE_DRIVER="pubsub"`.
2. The API and workers deploy as Google Cloud Run services.
3. Instead of long-lived polling, Google Cloud Pub/Sub pushes messages to HTTPS endpoints:
   - `POST /push/discover`
   - `POST /push/crawl`
   - `POST /push/psi`
   - `POST /push/interpret`
4. The push server validates Cloud Run OIDC authentication headers before delegating payloads to `AuditHandlers`.

