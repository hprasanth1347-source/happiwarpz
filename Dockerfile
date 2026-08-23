# 1. Base Image
FROM node:20-alpine AS base

# 2. Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/
COPY backend/prisma ./backend/prisma/
RUN npm run install:all || (npm install && cd frontend && npm install && cd ../backend && npm install)

# 3. Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN cd backend && npx prisma generate
RUN cd frontend && npm run build

# 4. Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 8080
ENV HOSTNAME "0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/static ./frontend/.next/static
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/node_modules ./node_modules

USER nextjs

EXPOSE 8080

CMD ["node", "backend/src/server.js"]
