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
  
  // If we have an error and a token, the token might be invalid - clear it
  if (error && cognitoToken && typeof window !== 'undefined') {
    console.log('Clearing invalid Cognito token due to auth error');
    localStorage.removeItem('cognito_access_token');
    // Force a page refresh after clearing the token to show login screen
    setTimeout(() => window.location.reload(), 100);
  }
  
  console.log('useAuth state:', { user, isLoading, error, hasCognitoToken: !!cognitoToken, isAuthenticated: !!user });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}