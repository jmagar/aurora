FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN corepack prepare pnpm@10.33.2 --activate

WORKDIR /app

FROM base AS deps

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS dev

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev", "--hostname", "0.0.0.0"]

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000

# Use 127.0.0.1, not localhost: busybox wget tries IPv6 ::1 first, but Next
# listens on IPv4 0.0.0.0 — localhost would falsely report unhealthy.
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -q -T 5 -O /dev/null http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
