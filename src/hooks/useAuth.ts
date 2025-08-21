import type { User } from "@shared/schema";

export function useAuth() {
  // DEVELOPMENT MODE: Skip authentication for development
  const mockUser: User = {
    id: 'dev-user',
    email: 'developer@socratiq.com',
    firstName: 'Dev',
    lastName: 'User',
    profileImageUrl: null,
    role: 'admin',
    tenantId: null,
    partnerId: null,
    isActive: true,
    permissions: ['read', 'write', 'admin'],
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return {
    user: mockUser,
    isLoading: false,
    isAuthenticated: true,
    error: null,
  };
}