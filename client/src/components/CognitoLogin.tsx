import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

interface CognitoLoginProps {
  onLoginSuccess: () => void;
}

export function CognitoLogin({ onLoginSuccess }: CognitoLoginProps) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  // Password reset states
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetStep, setResetStep] = useState<'email' | 'code'>('email');
  
  // Challenge states
  const [showNewPasswordChallenge, setShowNewPasswordChallenge] = useState(false);
  const [challengeNewPassword, setChallengeNewPassword] = useState("");
  const [challengeSession, setChallengeSession] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (credentials: { 
      email: string; 
      password: string; 
      newPassword?: string;
    }) => {
      return apiRequest('/api/auth/cognito-login', {
        method: 'POST',
        body: credentials
      });
    },
    onSuccess: (data) => {
      if (data.challengeRequired === 'NEW_PASSWORD_REQUIRED') {
        setShowNewPasswordChallenge(true);
        setChallengeSession(data.session || '');
        return;
      }
      
      // Store the access token for API requests
      if (data.tokens && data.tokens.accessToken) {
        localStorage.setItem('cognito_access_token', data.tokens.accessToken);
      }
      onLoginSuccess();
    },
    onError: (error: any) => {
      // Reset challenge state on error
      setShowNewPasswordChallenge(false);
    }
  });

  const signupMutation = useMutation({
    mutationFn: async (userData: { 
      email: string; 
      password: string; 
      firstName?: string; 
      lastName?: string; 
    }) => {
      return apiRequest('/api/auth/cognito-signup', {
        method: 'POST',
        body: userData
      });
    },
    onSuccess: () => {
      // After successful signup, automatically try to log in
      loginMutation.mutate({ email: signupEmail, password: signupPassword });
    }
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest('/api/auth/forgot-password', {
        method: 'POST',
        body: { email }
      });
    },
    onSuccess: () => {
      setResetStep('code');
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { 
      email: string; 
      confirmationCode: string; 
      newPassword: string; 
    }) => {
      return apiRequest('/api/auth/reset-password', {
        method: 'POST',
        body: data
      });
    },
    onSuccess: () => {
      setShowResetForm(false);
      setResetStep('email');
      setResetEmail("");
      setResetCode("");
      setNewPassword("");
      // Optionally auto-login with new password
      loginMutation.mutate({ email: resetEmail, password: newPassword });
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email: loginEmail, password: loginPassword });
  };

  const handleNewPasswordChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ 
      email: loginEmail, 
      password: loginPassword,
      newPassword: challengeNewPassword 
    });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate({ 
      email: signupEmail, 
      password: signupPassword, 
      firstName, 
      lastName 
    });
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPasswordMutation.mutate(resetEmail);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    resetPasswordMutation.mutate({
      email: resetEmail,
      confirmationCode: resetCode,
      newPassword: newPassword
    });
  };

  const startPasswordReset = () => {
    setShowResetForm(true);
    setResetEmail(loginEmail); // Pre-fill with login email if available
  };

  const cancelPasswordReset = () => {
    setShowResetForm(false);
    setResetStep('email');
    setResetEmail("");
    setResetCode("");
    setNewPassword("");
  };

  // Show new password challenge form
  if (showNewPasswordChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <svg width="150" height="40" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="150" height="40" rx="6" fill="url(#gradient)"/>
                <text x="75" y="25" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="white">
                  EMME Engage
                </text>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="1" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Set New Password
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Please set a new password for your account
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNewPasswordChallenge} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="challenge-new-password">New Password</Label>
                <Input
                  id="challenge-new-password"
                  type="password"
                  value={challengeNewPassword}
                  onChange={(e) => setChallengeNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                />
              </div>
              
              {loginMutation.error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {loginMutation.error?.message || "Failed to set new password."}
                  </AlertDescription>
                </Alert>
              )}
              
              <Button 
                type="submit" 
                disabled={loginMutation.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                {loginMutation.isPending ? "Setting Password..." : "Set New Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show password reset form
  if (showResetForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <svg width="150" height="40" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="150" height="40" rx="6" fill="url(#gradient)"/>
                <text x="75" y="25" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="white">
                  EMME Engage
                </text>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="1" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Reset Password
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {resetStep === 'email' 
                ? "Enter your email to receive a reset code"
                : "Enter the code sent to your email"
              }
            </p>
          </CardHeader>
          <CardContent>
            {resetStep === 'email' ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                {forgotPasswordMutation.error && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {forgotPasswordMutation.error?.message || "Failed to send reset code."}
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Button 
                    type="submit" 
                    disabled={forgotPasswordMutation.isPending}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    size="lg"
                  >
                    {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Code"}
                  </Button>
                  <Button 
                    type="button" 
                    onClick={cancelPasswordReset}
                    className="w-full"
                    variant="outline"
                  >
                    Back to Login
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-code">Reset Code</Label>
                  <Input
                    id="reset-code"
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="Enter the 6-digit code"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    required
                  />
                </div>
                
                {resetPasswordMutation.error && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {resetPasswordMutation.error?.message || "Failed to reset password."}
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Button 
                    type="submit" 
                    disabled={resetPasswordMutation.isPending}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    size="lg"
                  >
                    {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                  </Button>
                  <Button 
                    type="button" 
                    onClick={cancelPasswordReset}
                    className="w-full"
                    variant="outline"
                  >
                    Back to Login
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <svg width="150" height="40" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="150" height="40" rx="6" fill="url(#gradient)"/>
              <text x="75" y="25" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="white">
                EMME Engage
              </text>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome to EMME Engage
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Strategic Intelligence for Life Sciences
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                {loginMutation.error && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {loginMutation.error?.message || "Login failed. Please check your credentials."}
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  type="submit" 
                  disabled={loginMutation.isPending}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  size="lg"
                >
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
                
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-purple-600 hover:text-purple-800"
                    onClick={startPasswordReset}
                  >
                    Forgot your password?
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                  />
                </div>
                
                {(signupMutation.error || loginMutation.error) && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {signupMutation.error?.message || loginMutation.error?.message || "Signup failed. Please try again."}
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  type="submit" 
                  disabled={signupMutation.isPending || loginMutation.isPending}
                  className="w-full"
                  variant="outline"
                >
                  {signupMutation.isPending ? "Creating Account..." : 
                   loginMutation.isPending ? "Signing in..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="text-center text-sm text-gray-600 mt-6">
            <p>Secure authentication powered by AWS Cognito</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}