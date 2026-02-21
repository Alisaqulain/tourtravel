/**
 * Paginate array and apply limit/offset.
 * @param {any[]} list
 * @param {{ page?: number, limit?: number }}
 * @returns {{ data: any[], total: number, page: number, totalPages: number }}
 */
export function paginate(list, { page = 1, limit = 12 } = {}) {
  const p = Math.max(1, parseInt(String(page), 10) || 1);
  const l = Math.min(50, Math.max(1, parseInt(String(limit), 10) || 12));
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / l));
  const start = (p - 1) * l;
  const data = list.slice(start, start + l);
  return { data, total, page: p, totalPages };
}

/**
 * Sort array by key and order.
 * @param {any[]} list
 * @param {string} sortBy
 * @param {'asc'|'desc'} order
 */
export function sortList(list, sortBy = '', order = 'asc') {
  if (!sortBy || !list.length) return list;
  const dir = order === 'desc' ? -1 : 1;
  return [...list].sort((a, b) => {
    const va = a[sortBy] ?? 0;
    const vb = b[sortBy] ?? 0;
    if (typeof va === 'number' && typeof vb === 'number') return dir * (va - vb);
    return dir * String(va).localeCompare(String(vb));
  });
}
