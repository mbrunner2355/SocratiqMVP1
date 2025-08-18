import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

export function useAuth() {
  // DEVELOPMENT MODE: Skip authentication for development
  const mockUser: User = {
    id: 'dev-user',
    email: 'developer@socratiq.com',
    firstName: 'Dev',
    lastName: 'User',
    role: 'admin',
    permissions: ['read', 'write', 'admin']
  };

  return {
    user: mockUser,
    isLoading: false,
    isAuthenticated: true,
    error: null,
  };
}