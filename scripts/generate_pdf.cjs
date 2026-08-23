const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const htmlContent = \<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Happiwrapz — Project Architecture & File Analysis</title>
  <style>
    @page {
      size: A4;
      margin: 16mm 14mm 16mm 14mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background-color: #ffffff;
      line-height: 1.5;
      font-size: 12.5px;
      margin: 0;
      padding: 0;
    }
    header {
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .header-badge {
      display: inline-block;
      background: #fdf2f8;
      color: #db2777;
      font-weight: 700;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 3px 10px;
      border-radius: 9999px;
      border: 1px solid #fbcfe8;
      margin-bottom: 6px;
    }
    h1 {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 4px 0;
      letter-spacing: -0.02em;
    }
    .subtitle {
      color: #64748b;
      font-size: 12.5px;
      margin: 0;
    }
    h2 {
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 18px;
      margin-bottom: 8px;
      border-bottom: 1.5px solid #f1f5f9;
      padding-bottom: 4px;
    }
    h3 {
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      margin-top: 12px;
      margin-bottom: 6px;
    }
    p {
      margin: 0 0 8px 0;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 12px;
    }
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 12px;
    }
    .card-title {
      font-weight: 700;
      font-size: 12.5px;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .tag {
      display: inline-block;
      font-size: 10px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
      background: #e0f2fe;
      color: #0369a1;
      margin-right: 4px;
      margin-bottom: 4px;
    }
    .tag-purple { background: #f3e8ff; color: #7e22ce; }
    .tag-pink { background: #fce7f3; color: #be185d; }
    .tag-emerald { background: #d1fae5; color: #047857; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      font-size: 11.5px;
    }
    th, td {
      text-align: left;
      padding: 6px 9px;
      border: 1px solid #e2e8f0;
    }
    th {
      background-color: #f1f5f9;
      color: #334155;
      font-weight: 600;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    code {
      font-family: 'Consolas', 'Courier New', monospace;
      background-color: #f1f5f9;
      color: #0f172a;
      padding: 1px 4px;
      border-radius: 4px;
      font-size: 11px;
      border: 1px solid #e2e8f0;
    }
    .code-block {
      background: #0f172a;
      color: #f8fafc;
      padding: 10px 12px;
      border-radius: 6px;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 11px;
      line-height: 1.45;
      margin-bottom: 10px;
    }
    .diagram-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 10px;
      text-align: center;
      margin-bottom: 12px;
    }
    .diagram-flow {
      display: flex;
      justify-content: space-around;
      align-items: center;
      gap: 6px;
    }
    .diagram-node {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      padding: 6px 10px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 11.5px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }
    .diagram-arrow {
      color: #94a3b8;
      font-weight: bold;
      font-size: 13px;
    }
    .page-break {
      page-break-before: always;
    }
    footer {
      margin-top: 18px;
      border-top: 1px solid #e2e8f0;
      padding-top: 6px;
      font-size: 10.5px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>

  <header>
    <div class="header-badge">Full-Stack Codebase Architecture</div>
    <h1>Happiwrapz — Project Analysis & Architecture</h1>
    <p class="subtitle">Comprehensive structural, technical, and architectural documentation for the Happiwrapz platform.</p>
  </header>

  <h2>1. High-Level System Architecture</h2>
  <div class="diagram-box">
    <div class="diagram-flow">
      <div class="diagram-node">🌐 Next.js 14 Frontend<br><span style="color:#64748b; font-size:10px;">React 18 / Tailwind</span></div>
      <div class="diagram-arrow">➔</div>
      <div class="diagram-node">⚙️ Express.js Backend<br><span style="color:#64748b; font-size:10px;">Node.js REST API</span></div>
      <div class="diagram-arrow">➔</div>
      <div class="diagram-node">💎 Prisma ORM<br><span style="color:#64748b; font-size:10px;">Type-Safe Client</span></div>
      <div class="diagram-arrow">➔</div>
      <div class="diagram-node">🍃 MongoDB<br><span style="color:#64748b; font-size:10px;">Database Cluster</span></div>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-title">Frontend Stack</div>
      <div>
        <span class="tag">Next.js 14 App Router</span>
        <span class="tag">TypeScript</span>
        <span class="tag">Tailwind CSS</span>
        <span class="tag tag-purple">Framer Motion</span>
        <span class="tag">Lucide Icons</span>
      </div>
      <p style="margin-top:6px; font-size:11px; color:#475569;">
        Handles customer storefront, custom gift creator, real-time order tracking, and comprehensive admin dashboard.
      </p>
    </div>
    <div class="card">
      <div class="card-title">Backend Stack</div>
      <div>
        <span class="tag tag-emerald">Express 4</span>
        <span class="tag tag-pink">Prisma 5</span>
        <span class="tag">MongoDB</span>
        <span class="tag tag-emerald">Razorpay</span>
        <span class="tag">JWT & Bcrypt</span>
        <span class="tag">Nodemailer</span>
      </div>
      <p style="margin-top:6px; font-size:11px; color:#475569;">
        Provides REST endpoints for authentication, order lifecycles, payment verification, catalog search, and file uploads.
      </p>
    </div>
  </div>

  <h2>2. Root Workspace Files</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 28%;">File / Directory</th>
        <th>Purpose & Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>package.json</code></td>
        <td>Root orchestrator containing scripts (<code>dev:frontend</code>, <code>dev:backend</code>, <code>install:all</code>, <code>auto-fix</code>).</td>
      </tr>
      <tr>
        <td><code>.gitignore</code></td>
        <td>Prevents <code>node_modules</code>, build caches (<code>.next</code>), uploads, and <code>.env</code> credentials from committing.</td>
      </tr>
      <tr>
        <td><code>scripts/auto_heal.js</code></td>
        <td>Automated diagnostic and self-recovery script for validating dependencies, ports, and configuration integrity.</td>
      </tr>
      <tr>
        <td><code>docs/</code></td>
        <td>System architecture specifications, tracking flows, and design requirements.</td>
      </tr>
    </tbody>
  </table>

  <h2>3. Backend Architecture (<code>/backend</code>)</h2>
  
  <h3>A. Database & ORM (Prisma & MongoDB)</h3>
  <p>The schema (<code>backend/prisma/schema.prisma</code>) defines data models and enums with native MongoDB ObjectIDs:</p>
  <ul>
    <li><strong>Core Models</strong>: <code>User</code>, <code>Product</code>, <code>Category</code>, <code>Order</code>, <code>OrderItem</code>, <code>Cart</code>, <code>Wishlist</code>, <code>Review</code>, <code>CustomRequest</code>, <code>Payment</code>.</li>
    <li><strong>Enums</strong>: <code>Role</code> (<code>CUSTOMER</code>, <code>ADMIN</code>), <code>OrderStatus</code>, <code>PaymentStatus</code>, <code>AuthProvider</code>, <code>CustomRequestStatus</code>.</li>
  </ul>

  <h3>B. Backend Source Organization (<code>backend/src/</code>)</h3>
  <table>
    <thead>
      <tr>
        <th style="width: 30%;">Module Directory</th>
        <th>Key Responsibilities & Components</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>src/server.js</code> & <code>src/app.js</code></td>
        <td>Server lifecycle, Helmet security headers, CORS origin management, global error handler, and route aggregation.</td>
      </tr>
      <tr>
        <td><code>src/controllers/</code></td>
        <td>Controller actions for Auth, Orders, Payments (Razorpay), Products, Categories, Cart, Wishlist, Custom Requests, and Admin analytics.</td>
      </tr>
      <tr>
        <td><code>src/routes/</code></td>
        <td>REST API route definitions corresponding to each business domain.</td>
      </tr>
      <tr>
        <td><code>src/middleware/</code></td>
        <td>JWT authentication (<code>auth.middleware.js</code>), Admin RBAC (<code>admin.middleware.js</code>), Rate limiting (<code>rateLimiter.middleware.js</code>), Multer file uploads (<code>upload.middleware.js</code>), Zod validation.</td>
      </tr>
      <tr>
        <td><code>src/services/</code></td>
        <td><code>email.service.js</code> (Nodemailer notifications), <code>payment.service.js</code> (Razorpay orders & webhook verification), <code>selfHealingGuardian.service.js</code>.</td>
      </tr>
      <tr>
        <td><code>src/utils/</code></td>
        <td>JWT signing/decoding, password hashing (Bcrypt), standardized JSON response formatters, logger.</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <h2>4. Frontend Architecture (<code>/frontend</code>)</h2>

  <h3>A. App Pages & Routing (<code>frontend/app/</code>)</h3>
  <table>
    <thead>
      <tr>
        <th style="width: 32%;">Route Path</th>
        <th>Page / Feature Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>/</code> (<code>app/page.tsx</code>)</td>
        <td>Main storefront with hero showcases, featured gift collections, category pills, and social proof.</td>
      </tr>
      <tr>
        <td><code>/shop</code>, <code>/products/[id]</code></td>
        <td>Product listing with price filters, category tabs, sorting, and rich single-product detail page.</td>
      </tr>
      <tr>
        <td><code>/cart</code> & <code>/checkout</code></td>
        <td>Shopping cart checkout flow with address selection and Razorpay checkout modal.</td>
      </tr>
      <tr>
        <td><code>/custom-gifts</code></td>
        <td>Custom wrap builder allowing users to specify preferences and upload inspiration images.</td>
      </tr>
      <tr>
        <td><code>/track-order</code></td>
        <td>Live status tracking visualizer for pending, shipped, and delivered packages.</td>
      </tr>
      <tr>
        <td><code>/account/*</code></td>
        <td>Customer profile dashboard, order history, address manager, and security settings.</td>
      </tr>
      <tr>
        <td><code>/auth/login</code>, <code>/register</code></td>
        <td>Interactive customer authentication and onboarding forms with tab switches and animations.</td>
      </tr>
      <tr>
        <td><code>/admin/*</code></td>
        <td>Administration portal: Analytics dashboard, product catalog management, order processing, custom requests, customer user list, and banner settings.</td>
      </tr>
    </tbody>
  </table>

  <h3>B. Key Shared Components & UI State</h3>
  <div class="grid-2">
    <div class="card">
      <div class="card-title">Shared Components (<code>/components</code>)</div>
      <ul style="padding-left: 16px; margin: 4px 0 0 0; font-size: 11.5px;">
        <li><code>Navbar.tsx</code>: Main responsive header with cart badges & search.</li>
        <li><code>CartDrawer.tsx</code>: Slide-over interactive shopping cart.</li>
        <li><code>ProductCard.tsx</code>: Product display tile with quick-add & wishlist.</li>
        <li><code>SearchModal.tsx</code>: Live modal for instant keyword search.</li>
        <li><code>AdminSidebar.tsx</code>: Navigation bar for administration routes.</li>
        <li><code>InvoiceModal.tsx</code>: Generates and prints order receipts.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title">Context & Utilities (<code>/context</code> & <code>/lib</code>)</div>
      <ul style="padding-left: 16px; margin: 4px 0 0 0; font-size: 11.5px;">
        <li><code>AuthContext.tsx</code>: Global session, JWT storage, login/logout.</li>
        <li><code>CartContext.tsx</code>: Shopping cart state and quantity handling.</li>
        <li><code>WishlistContext.tsx</code>: Saved items persistence.</li>
        <li><code>api.ts</code>: Unified HTTP client with automatic auth headers.</li>
        <li><code>razorpay.ts</code>: Client-side SDK payment trigger.</li>
      </ul>
    </div>
  </div>

  <h2>5. Development & Deployment Reference</h2>
  <div class="code-block">
# 1. Install all dependencies
npm run install:all

# 2. Run backend API server (Port 5000)
npm run dev:backend

# 3. Run frontend Next.js server (Port 3000)
npm run dev:frontend

# 4. Database operations (from backend directory)
npx prisma db push       # Synchronize schema to MongoDB
npx prisma studio        # Launch visual database GUI (Port 5555)
  </div>

  <footer>
    <span>Happiwrapz E-Commerce Platform — Architecture & Codebase Reference</span>
    <span>Generated Documentation</span>
  </footer>

</body>
</html>\;

const htmlPath = path.resolve('c:/Users/ELCOT/Desktop/happiwarpz/docs/project_analysis_report.html');
const pdfPath = path.resolve('c:/Users/ELCOT/Desktop/happiwarpz/docs/Happiwrapz_Project_Analysis.pdf');
const desktopPdfPath = path.resolve('c:/Users/ELCOT/Desktop/Happiwrapz_Project_Analysis.pdf');

fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('HTML created at:', htmlPath);

const edgePath = 'C:\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe';
const cmd = \"\" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="\" "\"\;
console.log('Executing:', cmd);
execSync(cmd);
console.log('PDF successfully created at:', pdfPath);

fs.copyFileSync(pdfPath, desktopPdfPath);
console.log('Copy saved to Desktop at:', desktopPdfPath);
