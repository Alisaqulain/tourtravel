/**
 * Password hashing and comparison. Uses bcrypt for secure one-way hashing.
 */

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * @param {string} plainPassword
 * @returns {Promise<string>} Hashed password
 */
export async function hashPassword(plainPassword) {
  if (!plainPassword || typeof plainPassword !== 'string') {
    throw new Error('Password is required');
  }
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * @param {string} plainPassword
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
export async function comparePassword(plainPassword, hashedPassword) {
  if (!plainPassword || !hashedPassword) return false;
  return bcrypt.compare(plainPassword, hashedPassword);
}
