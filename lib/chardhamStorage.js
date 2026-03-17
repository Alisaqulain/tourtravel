import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

function safeExt(name) {
  const ext = (path.extname(name || '') || '').toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp' || ext === '.gif') return ext;
  return '.jpg';
}

export function getCharDhamStorageRoot() {
  const explicit = process.env.KVM4_STORAGE_PATH || process.env.STORAGE_PATH;
  // default inside project (gitignored is recommended)
  return explicit || path.join(process.cwd(), 'storage');
}

export function getCharDhamUploadsDir() {
  return path.join(getCharDhamStorageRoot(), 'chardham', 'uploads');
}

export async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

export function generateUploadRelPath(originalName = 'image.jpg') {
  const now = new Date();
  const y = String(now.getFullYear());
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = crypto.randomBytes(8).toString('hex');
  const ext = safeExt(originalName);
  return path.join(y, m, d, `${rand}${ext}`);
}

export async function saveUpload(buffer, relPath) {
  const base = getCharDhamUploadsDir();
  const abs = path.join(base, relPath);
  // ensure inside base
  const resolved = path.resolve(abs);
  const baseResolved = path.resolve(base);
  if (!resolved.startsWith(baseResolved)) throw new Error('Invalid upload path');
  await ensureDir(path.dirname(resolved));
  await fs.writeFile(resolved, buffer);
  return relPath.replace(/\\/g, '/');
}

export async function readUpload(relPath) {
  const base = getCharDhamUploadsDir();
  const abs = path.join(base, relPath);
  const resolved = path.resolve(abs);
  const baseResolved = path.resolve(base);
  if (!resolved.startsWith(baseResolved)) throw new Error('Invalid path');
  return fs.readFile(resolved);
}

