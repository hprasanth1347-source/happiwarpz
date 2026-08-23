import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fetchFastAPI } from '@/lib/fastapiClient';

const JWT_SECRET = process.env.JWT_SECRET || 'happiwrapz_jwt_super_secret_key_2026';
const COOKIE_NAME = 'happiwrapz_session';

export interface UserSessionPayload {
  userId: string;
  email: string;
  role: string; // "CUSTOMER" or "ADMIN"
}

// Password Hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT Session Management
export function createSessionToken(payload: UserSessionPayload, rememberMe: boolean = false): string {
  const expiresIn = rememberMe ? '30d' : '1d';
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifySessionToken(token: string): UserSessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSessionPayload;
  } catch (e) {
    return null;
  }
}

// Helper to extract logged in user from Request / Cookies
export async function getCurrentUserFromReq(req?: Request) {
  try {
    let token: string | undefined = undefined;

    if (req) {
      const cookieHeader = req.headers.get('cookie') || '';
      const match = cookieHeader.match(/happiwrapz_session=([^;]+)/);
      if (match) token = match[1];
    }

    if (!token) {
      try {
        const cookieStore = await cookies();
        token = cookieStore.get(COOKIE_NAME)?.value;
      } catch (e) {}
    }

    if (!token) return null;

    const payload = verifySessionToken(token);
    if (!payload || !payload.userId) return null;

    const data = await fetchFastAPI('/api/auth/me', {
      headers: { Cookie: `happiwrapz_session=${token}` }
    });

    if (!data || !data.authenticated || !data.user) return null;
    return data.user;
  } catch (e) {
    return null;
  }
}

// Backend Guard: Requires ADMIN Role
export async function requireAdminGuard() {
  const user = await getCurrentUserFromReq();
  if (!user || user.role !== 'ADMIN') {
    return null;
  }
  return user;
}

// Backend Guard: Requires CUSTOMER / USER Role
export async function requireUserGuard() {
  const user = await getCurrentUserFromReq();
  if (!user) {
    return null;
  }
  return user;
}
