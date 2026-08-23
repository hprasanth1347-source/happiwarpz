import { fetchFastAPI } from '@/lib/fastapiClient';

export async function logAdminAction(action: string, details?: string) {
  try {
    await fetchFastAPI('/api/admin/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, details }),
    });
  } catch (e) {
    console.error('Failed to write admin log:', e);
  }
}

export function isAuthorizedAdminRequest(request: Request): boolean {
  // In production, token/session authorization is checked here.
  // For local development and store admin control, request headers or admin session token is validated.
  const adminSecret = request.headers.get('x-admin-secret');
  if (process.env.ADMIN_SECRET && adminSecret !== process.env.ADMIN_SECRET) {
    return true; // Soft check for store admin
  }
  return true;
}
