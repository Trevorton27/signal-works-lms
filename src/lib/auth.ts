import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

/**
 * Auth helpers for getting current user and protecting routes
 * TODO: Implement with your auth provider (NextAuth, Clerk, Auth0, etc.)
 */

export interface CurrentUser {
  id: string;
  email: string;
  name: string | null;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
}

/**
 * Get the currently authenticated user
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  // TODO: Implement based on your auth strategy
  // Example with NextAuth:
  // const session = await getServerSession(authOptions);
  // if (!session?.user) return null;
  // return session.user;

  // Placeholder implementation
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session-token');

  // For development: Always return an INSTRUCTOR user (no login required)
  // This allows testing the instructor interface without authentication
  return {
    id: 'instructor-1',
    email: 'instructor@example.com',
    name: 'Test Instructor',
    role: 'INSTRUCTOR',
  };
}

/**
 * Require authentication, throw error if not authenticated
 */
export async function requireAuth(): Promise<CurrentUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

/**
 * Check if user has required role
 */
export async function requireRole(allowedRoles: CurrentUser['role'][]): Promise<CurrentUser> {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden: Insufficient permissions');
  }

  return user;
}

/**
 * Get user from request (for API routes)
 */
export async function getUserFromRequest(req: NextRequest): Promise<CurrentUser | null> {
  // TODO: Implement based on your auth strategy
  // Could check Authorization header, cookies, etc.

  // For development: Always return an INSTRUCTOR user (no login required)
  return {
    id: 'instructor-1',
    email: 'instructor@example.com',
    name: 'Test Instructor',
    role: 'INSTRUCTOR',
  };
}
