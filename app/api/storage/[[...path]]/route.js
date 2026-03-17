import { readFile, resolvePath } from '@/lib/storage';
import { NextResponse } from 'next/server';

const MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
};

export async function GET(request, { params }) {
  const pathSegments = params?.path;
  if (!pathSegments || !Array.isArray(pathSegments) || pathSegments.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const urlPath = pathSegments.join('/');
  const buffer = await readFile('/' + urlPath);
  if (!buffer) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const ext = urlPath.slice(urlPath.lastIndexOf('.')).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000',
    },
  });
}
