import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'knitinfo-secret-key-2024';

export interface AdminTokenPayload {
  username: string;
  role: 'admin';
  iat?: number;
  exp?: number;
}

export function verifyAdminFromRequest(request: NextRequest): {
  isValid: boolean;
  payload?: AdminTokenPayload;
  error?: string;
} {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { isValid: false, error: 'Missing authorization token' };
  }

  const token = authHeader.substring(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AdminTokenPayload;

    if (payload.role !== 'admin') {
      return { isValid: false, error: 'Admin access required' };
    }

    return { isValid: true, payload };
  } catch {
    return { isValid: false, error: 'Invalid or expired token' };
  }
}
