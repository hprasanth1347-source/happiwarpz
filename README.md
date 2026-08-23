# Happiwrapz — Full-Stack E-Commerce Platform

Happiwrapz is a full-stack e-commerce web application for handmade gifts, flowers, custom bouquets, and luxury gift wrapping.

## 🚀 Tech Stack

- **Frontend**: Next.js (App Router), React 19, TypeScript, Tailwind CSS, Lucide React, Framer Motion
- **Backend**: Node.js, Express.js (ES Modules), Prisma ORM, MongoDB
- **Authentication**: JWT (HTTP-Only Secure Cookies), Google OAuth 2.0, Bcryptjs
- **Payment**: Razorpay SDK
- **Order Tracking & Chat**: Visual delivery progress timeline + real-time Customer-Admin Order Chat

---

## 📁 Directory Structure

```text
happiwrapz/
├── frontend/       # Next.js App Router frontend
├── backend/        # Express.js REST API backend with Prisma & MongoDB
├── docs/           # Comprehensive architecture & beginner documentation
├── README.md       # Root project documentation
└── package.json    # Root npm scripts for multi-package management
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment Variables
- Copy `backend/.env.example` to `backend/.env` and update your MongoDB URI (`DATABASE_URL`).
- Copy `frontend/.env.example` to `frontend/.env.local`.

### 3. Run Development Servers
- Backend Server (Port 5000): `npm run dev:backend`
- Frontend Server (Port 3000): `npm run dev:frontend`

---

## 📄 License
Licensed under ISC.
# happy  
