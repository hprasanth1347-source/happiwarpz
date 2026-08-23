# Architecture Overview

Happiwrapz is built using a modern full-stack JavaScript/TypeScript architecture.

## Tech Stack Diagram

```text
┌─────────────────────────────────────────────────────────┐
│              Next.js Frontend (App Router)             │
│   (React Contexts, Tailwind CSS, Google Auth, Chat UI)   │
└────────────────────────────┬────────────────────────────┘
                             │ HTTP / REST API (fetch client)
                             ▼
┌─────────────────────────────────────────────────────────┐
│             Express.js REST API Backend                 │
│  (Auth, Orders & Order Tracking, Order Chat Service)    │
└────────────────────────────┬────────────────────────────┘
                             │ Prisma Client (MongoDB Provider)
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    MongoDB Database                     │
└─────────────────────────────────────────────────────────┘
```

## Key Principles
- **Clean Responsibilities**: Frontend handles UI & user state; Backend controls authentication, database queries, and payment verifications.
- **Security**: Passwords hashed with bcrypt; JWT stored in HTTP-Only cookies.
- **Beginner Friendly**: Clear naming, small functions, no obscure abstractions.
