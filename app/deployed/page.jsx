import { isRazorpayConfigured } from '@/lib/razorpay';
import { connectDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

function row(label, value) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-3 border-b border-border last:border-b-0">
      <span className="text-sm font-medium text-foreground/80">{label}</span>
      <span className="text-sm text-foreground break-all">{value}</span>
    </div>
  );
}

export default async function DeployedPage() {
  const now = new Date();
  const env = process.env.NODE_ENV || 'unknown';

  // Common providers (may be undefined depending on host)
  const buildId =
    process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_ID ||
    process.env.VERCEL_DEPLOYMENT_ID ||
    process.env.VERCEL_BUILD_ID ||
    process.env.BUILD_ID ||
    '—';
  const commit =
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
    process.env.GIT_COMMIT ||
    '—';

  const razorpay = isRazorpayConfigured() ? 'configured' : 'not configured';

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold">Deployment Status</h1>
        <p className="text-muted-foreground mt-2">
          This page confirms the server is running and environment variables are loaded.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          {row('Server time', now.toISOString())}
          {row('Environment', env)}
          {row('Build/Deployment ID', buildId)}
          {row('Git commit', commit)}
          {row('Razorpay', razorpay)}
        </div>

        <DeployedChecks />
      </div>
    </main>
  );
}

async function DeployedChecks() {
  let db = { ok: false, message: 'Not checked' };
  try {
    await connectDB();
    db = { ok: true, message: 'MongoDB connected successfully' };
  } catch (e) {
    db = { ok: false, message: e?.message || 'Database connection failed' };
  }

  return (
    <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Health checks</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Quick checks to confirm key services are reachable.
      </p>

      <div className="mt-4 flex items-center justify-between gap-3 py-3 border-b border-border">
        <span className="text-sm font-medium text-foreground/80">MongoDB</span>
        <span className={db.ok ? 'text-sm font-semibold text-green-600' : 'text-sm font-semibold text-destructive'}>
          {db.ok ? 'OK' : 'FAIL'}
        </span>
      </div>
      <div className="pt-3 text-sm text-foreground/80">{db.message}</div>
      <p className="text-xs text-muted-foreground mt-3">
        Tip: If MongoDB is FAIL in production, check `MONGODB_URI` in hosting env vars.
      </p>
    </div>
  );
}

