# Happiwrapz Backend API (Node.js + Express + Prisma + MongoDB)

This is the REST API backend service for Happiwrapz e-commerce platform.

## 🛠️ Tech Stack & Key Features
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js REST API
- **Database & ORM**: Prisma ORM with MongoDB (`provider = "mongodb"`)
- **Authentication**: JWT in HTTP-Only cookies + Google OAuth 2.0 (`google-auth-library`)
- **Payment Processing**: Razorpay server-side verification SDK
- **Order Tracking & Interaction**: Order timeline history & real-time Customer-Admin Order Chat API

---

## ⚡ Setup & Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and provide your MongoDB connection string (`DATABASE_URL`).

### 3. Generate Prisma Client
```bash
npm run prisma:generate
```

### 4. Run Development Server
```bash
npm run dev
```
Server runs at `http://localhost:5000`. Health check endpoint: `http://localhost:5000/api/health`.
