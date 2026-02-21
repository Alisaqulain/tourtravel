/**
 * Standard JSON response format for all APIs.
 */

import { NextResponse } from 'next/server';

/**
 * @param {any} data
 * @param {string} [message]
 * @param {number} [status]
 */
export function success(data, message = '', status = 200) {
  return NextResponse.json(
    { success: true, data: data ?? null, message },
    { status }
  );
}

/**
 * @param {any[]} data
 * @param {number} total
 * @param {number} page
 * @param {number} totalPages
 * @param {string} [message]
 */
export function successPaginated(data, total, page, totalPages, message = '') {
  return NextResponse.json({
    success: true,
    data: data ?? [],
    total: total ?? 0,
    page: page ?? 1,
    totalPages: totalPages ?? 1,
    message,
  });
}

/**
 * @param {string} message
 * @param {number} [status]
 * @param {object} [extra]
 */
export function error(message, status = 400, extra = {}) {
  return NextResponse.json(
    { success: false, data: null, message, error: message, ...extra },
    { status }
  );
}
