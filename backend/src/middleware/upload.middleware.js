import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { env } from "../config/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../../uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration with cryptographically safe randomized filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const randomBytes = crypto.randomBytes(16).toString("hex");
    const rawExt = path.extname(file.originalname).toLowerCase();
    // Enforce safe allowed extension
    const ext = env.upload.allowedExtensions.includes(rawExt) ? rawExt : ".jpg";
    cb(null, `img-${Date.now()}-${randomBytes}${ext}`);
  },
});

// File filter validating image MIME types and file extensions
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!env.upload.allowedMimeTypes.includes(file.mimetype) || !env.upload.allowedExtensions.includes(ext)) {
    return cb(
      new Error("Invalid file type. Only JPEG, PNG, and WebP image files are permitted.")
    );
  }

  // Reject SVGs and executable extensions explicitly
  if (ext === ".svg" || file.mimetype === "image/svg+xml" || ext === ".html" || ext === ".js" || ext === ".exe" || ext === ".sh") {
    return cb(new Error("File type blocked for security reasons."));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.upload.maxFileSize, // Configurable limit (default 5MB)
    files: 5, // Maximum 5 files per upload
  },
});

/**
 * Validates the file buffer magic bytes to ensure the content matches a true image
 * and not a spoofed script or executable.
 */
export const validateImageSignature = async (req, res, next) => {
  try {
    const files = req.files ? (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()) : req.file ? [req.file] : [];

    for (const file of files) {
      if (!file.path || !fs.existsSync(file.path)) continue;

      const buffer = Buffer.alloc(12);
      const fd = fs.openSync(file.path, "r");
      fs.readSync(fd, buffer, 0, 12, 0);
      fs.closeSync(fd);

      const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
      const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
      const isWebp =
        buffer[0] === 0x52 &&
        buffer[1] === 0x49 &&
        buffer[2] === 0x46 &&
        buffer[3] === 0x46 && // 'RIFF'
        buffer[8] === 0x57 &&
        buffer[9] === 0x45 &&
        buffer[10] === 0x42 &&
        buffer[11] === 0x50; // 'WEBP'

      if (!isJpeg && !isPng && !isWebp) {
        // Delete malicious or fake file immediately
        try {
          fs.unlinkSync(file.path);
        } catch (_) {}

        return res.status(400).json({
          success: false,
          error: "INVALID_FILE_SIGNATURE",
          message: "Uploaded file failed security integrity check. Only genuine image binaries are allowed.",
        });
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
