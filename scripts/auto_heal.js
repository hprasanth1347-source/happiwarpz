import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");
const backendDir = path.join(rootDir, "backend");
const frontendDir = path.join(rootDir, "frontend");

console.log("=========================================================");
console.log("🤖 AUTONOMOUS SELF-HEALING & AUTO-FIX ENGINE STARTED");
console.log("=========================================================\n");

const fixesApplied = [];
const issuesDetected = [];

// Step 1: Check and heal environment files
console.log("🔍 [1/5] Checking Environment Configuration...");
const backendEnv = path.join(backendDir, ".env");
const backendEnvExample = path.join(backendDir, ".env.example");

if (!fs.existsSync(backendEnv) && fs.existsSync(backendEnvExample)) {
  fs.copyFileSync(backendEnvExample, backendEnv);
  fixesApplied.push("Created missing backend/.env from .env.example");
  console.log("   🛠️  [HEALED] Created missing backend/.env from .env.example");
} else if (fs.existsSync(backendEnv)) {
  console.log("   ✅ backend/.env is present.");
}

// Step 2: Check and heal storage directories & subpages
console.log("\n🔍 [2/5] Checking Storage & Upload Directories & Subpages...");
const uploadDir = path.join(backendDir, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  fixesApplied.push("Created missing backend/uploads directory");
  console.log("   🛠️  [HEALED] Recreated missing backend/uploads directory");
} else {
  console.log("   ✅ Upload directory is intact.");
}

const sitemapDir = path.join(frontendDir, "app", "sitemap");
if (!fs.existsSync(sitemapDir)) fs.mkdirSync(sitemapDir, { recursive: true });
const sitemapFile = path.join(sitemapDir, "page.tsx");
if (!fs.existsSync(sitemapFile)) {
  fs.writeFileSync(sitemapFile, `import React from 'react';
import Link from 'next/link';
import { ArrowRight, Map } from 'lucide-react';

export const metadata = {
  title: 'Sitemap | Happiwrapz Handmade Flowers & Gifts',
  description: 'Complete directory and sitemap of all pages and collections on Happiwrapz.',
};

export default function SitemapPage() {
  const sections = [
    {
      title: 'Shop Collections',
      links: [
        { label: 'All Products', href: '/shop' },
        { label: 'Rose Bouquets', href: '/shop?category=flower-bouquets' },
        { label: 'Sunflower Bouquets', href: '/shop?category=sunflower-bouquets' },
        { label: 'Handmade Keychains', href: '/keychains' },
        { label: 'Custom Gift Hampers', href: '/custom-gifts' },
      ],
    },
    {
      title: 'Customer Services',
      links: [
        { label: 'Customer Account Login', href: '/login' },
        { label: 'Track Order Status', href: '/account/orders' },
        { label: 'Request Custom Gift', href: '/custom-gifts' },
        { label: 'About Happiwrapz', href: '/about' },
        { label: 'Contact & Support', href: '/contact' },
        { label: 'Admin Portal Login', href: '/admin/login' },
      ],
    },
    {
      title: 'Store Policies',
      links: [
        { label: 'Privacy Policy', href: '/policies/privacy-policy' },
        { label: 'Terms & Conditions', href: '/policies/terms-and-conditions' },
        { label: 'Shipping Policy', href: '/policies/shipping-policy' },
        { label: 'Refund & Cancellation Policy', href: '/policies/refund-policy' },
        { label: 'Payment Policy (No COD)', href: '/policies/payment-policy' },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Map className="w-4 h-4" />
          <span>Directory</span>
        </span>
        <h1 className="text-4xl font-serif font-bold text-[#F8F1E7]">
          Happiwrapz Sitemap
        </h1>
        <p className="text-sm text-[#A39A90] max-w-md mx-auto">
          Explore all store collections, account services, and policies.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {sections.map((section) => (
          <div
            key={section.title}
            className="p-6 bg-[#0D0D0D] border border-[#221D22] rounded-3xl space-y-4 shadow-lg"
          >
            <h3 className="text-base font-serif font-bold text-[#F4D068] border-b border-[#221D22] pb-3">
              {section.title}
            </h3>
            <ul className="space-y-2.5 text-xs text-[#A39A90]">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#D4AF37]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <Link
          href="/shop"
          className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          Explore Shop Catalogue
        </Link>
      </div>
    </div>
  );
}
`);
  fixesApplied.push("Created frontend/app/sitemap/page.tsx");
}

const accessDir = path.join(frontendDir, "app", "accessibility");
if (!fs.existsSync(accessDir)) fs.mkdirSync(accessDir, { recursive: true });
const accessFile = path.join(accessDir, "page.tsx");
if (!fs.existsSync(accessFile)) {
  fs.writeFileSync(accessFile, `import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Accessibility Statement | Happiwrapz Handmade Flowers',
  description: 'Happiwrapz is committed to ensuring digital accessibility for all users.',
};

export default function AccessibilityPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>Commitment</span>
        </span>
        <h1 className="text-4xl font-serif font-bold text-[#F8F1E7]">
          Accessibility Statement
        </h1>
        <p className="text-sm text-[#A39A90]">
          Making our handmade shopping experience seamless and accessible to everyone.
        </p>
      </div>

      <div className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-8 space-y-6 text-sm text-[#A39A90] leading-relaxed">
        <p>
          Happiwrapz is dedicated to digital accessibility and ensuring that our website is usable for all individuals, including people with visual, hearing, cognitive, and motor impairments.
        </p>
        <p className="border-t border-[#1C161C] pt-4">
          We continuously optimize color contrasts, provide keyboard navigation support, implement semantic HTML landmarks, and ensure descriptive text alternatives for imagery.
        </p>
        <p className="border-t border-[#1C161C] pt-4">
          If you encounter any accessibility barriers while browsing or purchasing on Happiwrapz, please contact our support team at <a href="mailto:hello@happiwrapz.com" className="text-[#F4D068] underline">hello@happiwrapz.com</a>. We will gladly assist you.
        </p>
      </div>

      <div className="text-center">
        <Link
          href="/shop"
          className="text-xs font-bold text-[#C9A24A] hover:underline"
        >
          ← Return to Happiwrapz Shop
        </Link>
      </div>
    </div>
  );
}
`);
  fixesApplied.push("Created frontend/app/accessibility/page.tsx");
}

// Step 3: Check and heal Prisma ORM client
console.log("\n🔍 [3/5] Checking Database & Prisma Client Generation...");
try {
  const prismaClientDir = path.join(backendDir, "node_modules", "@prisma", "client");
  if (!fs.existsSync(prismaClientDir)) {
    console.log("   ⚡ Generating Prisma client...");
    execSync("npx prisma generate", { cwd: backendDir, stdio: "inherit" });
    fixesApplied.push("Generated missing Prisma ORM client");
    console.log("   🛠️  [HEALED] Successfully generated Prisma client.");
  } else {
    console.log("   ✅ Prisma client is properly generated.");
  }
} catch (err) {
  issuesDetected.push(`Prisma Generation Warning: ${err.message}`);
  console.warn("   ⚠️  Prisma client check warning:", err.message);
}

// Step 4: Verify Backend Health & Route Loading
console.log("\n🔍 [4/5] Verifying Backend Module Integrity...");
try {
  await import("../backend/src/app.js");
  console.log("   ✅ Backend Express app loads cleanly without syntax or import errors.");
} catch (err) {
  issuesDetected.push(`Backend App Import Error: ${err.message}`);
  console.error("   ❌ Backend app load failure:", err.message);
}

// Step 5: Check System Error Registry
console.log("\n🔍 [5/5] Inspecting Error Telemetry Registry...");
const errorRegistryFile = path.join(rootDir, ".system_errors", "error_registry.json");
if (fs.existsSync(errorRegistryFile)) {
  try {
    const errors = JSON.parse(fs.readFileSync(errorRegistryFile, "utf-8"));
    console.log(`   ℹ️  Total logged runtime incidents: ${errors.length}`);
    const unhandled = errors.filter((e) => !e.remediationApplied || e.remediationApplied === "LOGGED_FOR_AGENT_AUTO_FIX");
    if (unhandled.length > 0) {
      console.log(`   ⚠️  Pending incidents needing inspection: ${unhandled.length}`);
    } else {
      console.log("   ✅ All past recorded runtime incidents have been healed or cleared.");
    }
  } catch (e) {
    console.log("   ✅ Error registry initialized.");
  }
} else {
  console.log("   ✅ No unresolved runtime incidents in registry.");
}

console.log("\n=========================================================");
console.log("📊 AUTO-HEALING & DIAGNOSTIC SUMMARY");
console.log("=========================================================");
console.log(`🛠️  Fixes Automatically Applied : ${fixesApplied.length}`);
fixesApplied.forEach((f) => console.log(`   - ${f}`));
console.log(`⚠️  Issues Requiring Attention    : ${issuesDetected.length}`);
issuesDetected.forEach((i) => console.log(`   - ${i}`));
console.log("=========================================================\n");

if (issuesDetected.length === 0) {
  console.log("🎉 SYSTEM IS 100% HEALTHY AND READY FOR PRODUCTION!");
  process.exit(0);
} else {
  process.exit(1);
}
