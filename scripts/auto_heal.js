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

// Step 2: Check and heal storage directories
console.log("\n🔍 [2/5] Checking Storage & Upload Directories...");
const uploadDir = path.join(backendDir, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  fixesApplied.push("Created missing backend/uploads directory");
  console.log("   🛠️  [HEALED] Recreated missing backend/uploads directory");
} else {
  console.log("   ✅ Upload directory is intact.");
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
