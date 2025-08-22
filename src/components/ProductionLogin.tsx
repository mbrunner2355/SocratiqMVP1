import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
// import emmeEngageLogo from "@/assets/emme-engage-logo.png";

interface ProductionLoginProps {
  onLoginSuccess: () => void;
}

export function ProductionLogin({ onLoginSuccess }: ProductionLoginProps) {
  const [email, setEmail] = useState("emme-user@socratiq.ai");
  const [password, setPassword] = useState("demo");

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return apiRequest('/api/auth/login', {
        method: 'POST',
        body: credentials
      });
    },
    onSuccess: () => {
      onLoginSuccess();
    }
  });

  const autoLoginMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/auth/auto-login', {
        method: 'GET'
      });
    },
    onSuccess: () => {
      onLoginSuccess();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  const handleAutoLogin = () => {
    autoLoginMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/api/placeholder/150/50" 
              alt="EMME Engage"
              className="h-12 w-auto object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome to EMME Engage
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Strategic Intelligence for Life Sciences
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Demo Auto-Login Button */}
          <Button 
            onClick={handleAutoLogin}
            disabled={autoLoginMutation.isPending}
            className="w-full bg-purple-600 hover:bg-purple-700"
            size="lg"
          >
            {autoLoginMutation.isPending ? "Signing in..." : "Continue as Demo User"}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or sign in with credentials</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            
            {(loginMutation.error || autoLoginMutation.error) && (
              <Alert variant="destructive">
                <AlertDescription>
                  {loginMutation.error?.message || autoLoginMutation.error?.message || "Login failed. Please try again."}
                </AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit" 
              disabled={loginMutation.isPending}
              className="w-full"
              variant="outline"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="text-center text-sm text-gray-600 mt-4">
            <p>Demo credentials: emme-user@socratiq.ai / demo</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}