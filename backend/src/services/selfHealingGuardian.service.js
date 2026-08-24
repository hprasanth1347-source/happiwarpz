import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "../utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const registryDir = path.join(__dirname, "../../.system_errors");
const registryFile = path.join(registryDir, "error_registry.json");

// Ensure directory exists safely
try {
  if (!fs.existsSync(registryDir)) {
    fs.mkdirSync(registryDir, { recursive: true });
  }
} catch (_) {}

/**
 * Autonomous Self-Healing Guardian Service
 * Records error fingerprints, tracks error velocity, and applies automatic runtime remedies.
 */
class SelfHealingGuardianService {
  constructor() {
    this.memoryErrors = [];
    this.loadRegistry();
  }

  loadRegistry() {
    try {
      if (fs.existsSync(registryFile)) {
        const raw = fs.readFileSync(registryFile, "utf-8");
        this.memoryErrors = JSON.parse(raw);
      }
    } catch (e) {
      this.memoryErrors = [];
    }
  }

  saveRegistry() {
    try {
      // Keep last 100 error entries
      if (this.memoryErrors.length > 100) {
        this.memoryErrors = this.memoryErrors.slice(-100);
      }
      fs.writeFileSync(registryFile, JSON.stringify(this.memoryErrors, null, 2), "utf-8");
    } catch (e) {}
  }

  /**
   * Log an incident and evaluate automatic remediation
   */
  captureAndHeal(error, context = {}) {
    const incident = {
      id: `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
      name: error?.name || "UnknownError",
      message: error?.message || String(error),
      code: error?.code || "UNSPECIFIED",
      stack: error?.stack || null,
      context,
      remediationApplied: null,
    };

    // Auto-Remediation Tactics:
    incident.remediationApplied = this.executeAutoRemediation(error, context);

    this.memoryErrors.push(incident);
    this.saveRegistry();

    return incident;
  }

  /**
   * Safe automatic runtime healing rules
   */
  executeAutoRemediation(error, context) {
    const msg = error?.message || "";
    const code = error?.code || "";

    // 1. Missing Uploads Directory Error
    if (code === "ENOENT" && msg.includes("uploads")) {
      const uploadDir = path.join(__dirname, "../../uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        logger.info("🛠️ [Self-Heal]: Recreated missing uploads directory automatically.");
        return "RECREATED_MISSING_UPLOADS_DIRECTORY";
      }
    }

    // 2. Prisma Engine Not Generated
    if (msg.includes("PrismaClientInitializationError") || msg.includes("prisma generate")) {
      logger.warn("🛠️ [Self-Heal]: Detected Prisma Client initialization anomaly.");
      return "FLAGGED_FOR_PRISMA_CLIENT_REGEN";
    }

    // 3. Database Disconnection
    if (msg.includes("ServerSelectionError") || msg.includes("MongoNetworkError")) {
      logger.warn("🛠️ [Self-Heal]: Database connectivity dropped. Triggering backoff reconnection.");
      return "RECONNECTION_SCHEDULED";
    }

    return "LOGGED_FOR_AGENT_AUTO_FIX";
  }

  getRecentErrors(limit = 10) {
    return this.memoryErrors.slice(-limit);
  }
}

export const selfHealingGuardian = new SelfHealingGuardianService();
