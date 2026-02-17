import { jwtDecode } from 'jwt-decode';

export enum UserRole {
  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export interface JWTPayload {
  userId: number;
  role: UserRole;
  tenantId?: number;
  exp: number;
  iat: number;
}

export interface AuthUser {
  id: number;
  role: UserRole;
  tenantId?: number;
  firstName: string;
  lastName: string;
  phone: string;
}

const TOKEN_KEY = 'auth_token';

export const authUtils = {
  // Store token in localStorage
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Remove token from localStorage
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Decode JWT and extract role
  decodeToken(token: string): JWTPayload | null {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      
      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        return null;
      }
      
      return decoded;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  },

  // Get current user from token
  getCurrentUser(): JWTPayload | null {
    const token = this.getToken();
    if (!token) return null;
    return this.decodeToken(token);
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    return user !== null;
  },

  // Check if user has specific role
  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  },

  // Check if user has any of the specified roles
  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  },

  // Get redirect path based on role
  getRoleRedirectPath(role: UserRole): string {
    switch (role) {
      case UserRole.PLATFORM_ADMIN:
        return '/super-admin';
      case UserRole.MANAGER:
        return '/manager';
      case UserRole.ADMIN:
        return '/admin';
      case UserRole.TEACHER:
        return '/teacher';
      case UserRole.STUDENT:
        return '/student';
      default:
        return '/login';
    }
  }
};

// Mock function to create JWT token for demo purposes
export function createMockJWT(userId: number, role: UserRole, tenantId?: number): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload: JWTPayload = {
    userId,
    role,
    tenantId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };

  // Create a simple base64 encoded token (NOT SECURE - only for demo)
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa('mock-signature');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}
