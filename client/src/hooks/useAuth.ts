import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    throwOnError: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Check if we have a Cognito token as fallback authentication indicator
  const cognitoToken = typeof window !== 'undefined' ? localStorage.getItem('cognito_access_token') : null;
  
  console.log('useAuth state:', { user, isLoading, error, hasCognitoToken: !!cognitoToken });

  return {
    user,
    isLoading,
    isAuthenticated: !!user || !!cognitoToken,
    error,
  };
}