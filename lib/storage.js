/**
 * Local/KVM4 filesystem image storage.
 * Set STORAGE_PATH in .env (e.g. /mnt/kvm4 or ./storage). Default: ./storage in project root.
 */

import fs from 'fs/promises';
import path from 'path';

const DEFAULT_DIR = 'storage';
const UPLOADS_SUBDIR = 'uploads';

function getStorageRoot() {
  const env = process.env.STORAGE_PATH || process.env.KVM4_STORAGE_PATH;
  if (env) return path.isAbsolute(env) ? env : path.join(process.cwd(), env);
  return path.join(process.cwd(), DEFAULT_DIR);
}

/**
 * @returns {string} Absolute path to the uploads directory (e.g. .../storage/uploads)
 */
export function getUploadsDir() {
  return path.join(getStorageRoot(), UPLOADS_SUBDIR);
}

/**
 * Ensure a directory exists (mkdir -p).
 * @param {string} dirPath - Absolute path
 */
export async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

/**
 * Save a file buffer to storage under a relative path (e.g. marketplace/2025/02/abc.jpg).
 * @param {Buffer} buffer
 * @param {string} relativePath - Path under uploads, e.g. marketplace/2025/02/filename.jpg
 * @returns {Promise<string>} Relative URL path to serve the file (e.g. /api/storage/uploads/marketplace/...)
 */
export async function saveFile(buffer, relativePath) {
  const root = getUploadsDir();
  const fullPath = path.join(root, relativePath);
  await ensureDir(path.dirname(fullPath));
  await fs.writeFile(fullPath, buffer);
  const urlPath = path.join(UPLOADS_SUBDIR, relativePath).replace(/\\/g, '/');
  return `/${urlPath}`.replace(/\/+/g, '/');
}

/**
 * Resolve URL path (e.g. uploads/marketplace/... or /uploads/marketplace/...) to absolute filesystem path.
 * @param {string} urlPath - Path under uploads
 * @returns {string|null} Absolute path or null if invalid
 */
export function resolvePath(urlPath) {
  const normalized = urlPath.replace(/^\/+/, '').replace(/\.\./g, '');
  const rel = normalized.startsWith(UPLOADS_SUBDIR + '/')
    ? normalized.slice(UPLOADS_SUBDIR.length + 1)
    : normalized;
  const uploadsDir = getUploadsDir();
  const full = path.join(uploadsDir, rel);
  if (!full.startsWith(uploadsDir)) return null;
  return full;
}

/**
 * Read file from storage. Returns null if not found.
 * @param {string} urlPath - e.g. /uploads/marketplace/2025/02/xyz.jpg
 * @returns {Promise<Buffer|null>}
 */
export async function readFile(urlPath) {
  const abs = resolvePath(urlPath);
  if (!abs) return null;
  try {
    return await fs.readFile(abs);
  } catch {
    return null;
  }
}

/**
 * Generate a unique filename with optional prefix (e.g. hotel, room).
 * @param {string} originalName
 * @param {string} [prefix]
 * @returns {string} Relative path under uploads, e.g. marketplace/2025/02/hotel_abc123.jpg
 */
export function generateUploadPath(originalName, prefix = '') {
  const ext = path.extname(originalName) || '.jpg';
  const safe = `${prefix}${Date.now()}_${Math.random().toString(36).slice(2, 10)}${ext}`;
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return path.join('marketplace', String(year), month, safe).replace(/\\/g, '/');
}
