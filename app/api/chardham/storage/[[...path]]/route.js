import path from 'path';
import { NextResponse } from 'next/server';
import { readUpload } from '@/lib/chardhamStorage';

const CONTENT_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

export async function GET(request, { params }) {
  try {
    const parts = params?.path || [];
    const rel = parts.join('/');
    if (!rel) return new NextResponse('Not found', { status: 404 });

    const buf = await readUpload(rel);
    const ext = (path.extname(rel) || '').toLowerCase();
    const ct = CONTENT_TYPES[ext] || 'application/octet-stream';

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': ct,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (e) {
    return new NextResponse('Not found', { status: 404 });
  }
}

