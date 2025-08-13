import express from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { CognitoIdentityProviderClient, AdminInitiateAuthCommand, AdminCreateUserCommand, AdminSetUserPasswordCommand, InitiateAuthCommand, SignUpCommand, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { createHmac } from "crypto";
import { storage } from "./storage";
import type { Express, RequestHandler } from "express";

// AWS Cognito configuration
const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.VITE_COGNITO_REGION || process.env.VITE_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.VITE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.VITE_SECRET_ACCESS_KEY!,
  },
});

// JWT Verifier for Cognito tokens (initialized only when needed)
let verifier: any = null;

function getVerifier() {
  if (!verifier && process.env.VITE_COGNITO_USER_POOL_ID && process.env.VITE_COGNITO_CLIENT_ID) {
    verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.VITE_COGNITO_USER_POOL_ID!,
      tokenUse: "access",
      clientId: process.env.VITE_COGNITO_CLIENT_ID!,
    });
  }
  return verifier;
}

// Generate SECRET_HASH for Cognito client secret
function generateSecretHash(username: string): string {
  if (!process.env.VITE_COGNITO_CLIENT_SECRET) {
    return ''; // No secret hash needed if no client secret
  }
  
  const message = username + process.env.VITE_COGNITO_CLIENT_ID;
  const hmac = createHmac('sha256', process.env.VITE_COGNITO_CLIENT_SECRET);
  hmac.update(message);
  return hmac.digest('base64');
}

export function getCognitoSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  // Use memory store to avoid database connection issues
  const sessionStore = new session.MemoryStore();
  
  return session({
    secret: process.env.SESSION_SECRET || "fallback-secret-change-in-production",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

// Cognito authentication middleware
export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
  try {
    // Check session first
    if (req.session && req.session.user && (req.session as any).cognitoTokens) {
      // Verify the access token is still valid
      try {
        const tokenVerifier = getVerifier();
        if (tokenVerifier) {
          await tokenVerifier.verify((req.session as any).cognitoTokens.accessToken);
        }
        req.user = {
          claims: {
            sub: req.session.user.id,
            email: req.session.user.email,
            first_name: req.session.user.firstName,
            last_name: req.session.user.lastName,
            profile_image_url: req.session.user.profileImageUrl,
          },
          role: req.session.user.role,
          permissions: req.session.user.permissions,
        };
        return next();
      } catch (tokenError) {
        console.log("Token expired or invalid, clearing session");
        req.session.destroy(() => {});
      }
    }

    // Check Authorization header for JWT token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const tokenVerifier = getVerifier();
        if (!tokenVerifier) {
          throw new Error("JWT verifier not configured");
        }
        const payload = await tokenVerifier.verify(token);
        const user = await storage.getUserByEmail(payload.email || payload.username);
        if (user) {
          req.user = {
            claims: {
              sub: user.id,
              email: user.email,
              first_name: user.firstName,
              last_name: user.lastName,
              profile_image_url: user.profileImageUrl,
            },
            role: user.role,
            permissions: user.permissions,
          };
          return next();
        }
      } catch (tokenError) {
        console.error("JWT verification failed:", tokenError);
      }
    }

    res.status(401).json({ message: "Unauthorized" });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
};

export async function setupCognitoAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getCognitoSession());

  // Cognito login endpoint
  app.post('/api/auth/cognito-login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      // Try user-level authentication first (doesn't require admin privileges)
      const authParams: { [key: string]: string } = {
        USERNAME: email,
        PASSWORD: password,
      };
      
      // Add SECRET_HASH if client secret is configured
      if (process.env.VITE_COGNITO_CLIENT_SECRET) {
        authParams.SECRET_HASH = generateSecretHash(email);
      }

      // Use InitiateAuth instead of AdminInitiateAuth to avoid admin privilege requirements
      const authCommand = new InitiateAuthCommand({
        ClientId: process.env.VITE_COGNITO_CLIENT_ID!,
        AuthFlow: "USER_PASSWORD_AUTH",
        AuthParameters: authParams,
      });

      const authResponse = await cognitoClient.send(authCommand);
      
      if (!authResponse.AuthenticationResult) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const { AccessToken, IdToken, RefreshToken } = authResponse.AuthenticationResult;

      // Verify the access token and get user info
      const tokenVerifier = getVerifier();
      if (!tokenVerifier) {
        throw new Error("JWT verifier not configured");
      }
      const payload = await tokenVerifier.verify(AccessToken!);
      
      // Get or create user in our database
      let user = await storage.getUserByEmail(String(payload.email || payload.username));
      if (!user) {
        user = await storage.createUser({
          email: String(payload.email || payload.username),
          firstName: String(payload.given_name || "User"),
          lastName: String(payload.family_name || ""),
          role: "analyst", // Default role for new users
        });
      }

      // Store tokens and user in session
      (req.session as any).user = user;
      (req.session as any).cognitoTokens = {
        accessToken: AccessToken,
        idToken: IdToken,
        refreshToken: RefreshToken,
      };

      res.json({ 
        success: true, 
        user,
        tokens: {
          accessToken: AccessToken,
          idToken: IdToken,
          // Don't send refresh token to client for security
        }
      });
    } catch (error: any) {
      console.error("Cognito login error:", error);
      if (error.name === 'UserNotConfirmedException') {
        res.status(400).json({ message: "User account not confirmed. Please check your email for confirmation link." });
      } else if (error.name === 'NotAuthorizedException') {
        res.status(401).json({ message: "Invalid email or password" });
      } else {
        res.status(500).json({ message: "Login failed" });
      }
    }
  });

  // Cognito signup endpoint
  app.post('/api/auth/cognito-signup', async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      // Use SignUp instead of AdminCreateUser (doesn't require admin privileges)
      const signUpParams: any = {
        ClientId: process.env.VITE_COGNITO_CLIENT_ID!,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "given_name", Value: firstName || "User" },
          { Name: "family_name", Value: lastName || "" },
        ],
      };

      // Add SECRET_HASH if client secret is configured
      if (process.env.VITE_COGNITO_CLIENT_SECRET) {
        signUpParams.SecretHash = generateSecretHash(email);
      }

      const signUpCommand = new SignUpCommand(signUpParams);
      const signUpResponse = await cognitoClient.send(signUpCommand);

      // For development, use admin confirm user to bypass email confirmation
      if (signUpResponse.UserSub && process.env.NODE_ENV === 'development') {
        try {
          const { AdminConfirmSignUpCommand } = await import("@aws-sdk/client-cognito-identity-provider");
          const confirmCommand = new AdminConfirmSignUpCommand({
            UserPoolId: process.env.VITE_COGNITO_USER_POOL_ID!,
            Username: email,
          });
          await cognitoClient.send(confirmCommand);
          console.log("User auto-confirmed for development");
        } catch (confirmError: any) {
          console.log("Auto-confirmation failed, manual email confirmation required:", confirmError.message);
        }
      }

      // Create user in our database
      const user = await storage.createUser({
        email,
        firstName: firstName || "User",
        lastName: lastName || "",
        role: "analyst", // Default role for new users
      });

      res.json({ success: true, message: "User created successfully", user });
    } catch (error: any) {
      console.error("Cognito signup error:", error);
      if (error.name === 'UsernameExistsException') {
        res.status(400).json({ message: "User already exists" });
      } else {
        res.status(500).json({ message: "Signup failed" });
      }
    }
  });

  // Token refresh endpoint
  app.post('/api/auth/refresh-token', async (req, res) => {
    try {
      if (!req.session || !(req.session as any).cognitoTokens) {
        return res.status(401).json({ message: "No refresh token available" });
      }

      // Implementation for token refresh would go here
      // This requires additional Cognito setup for refresh tokens
      res.json({ message: "Token refresh not implemented yet" });
    } catch (error) {
      console.error("Token refresh error:", error);
      res.status(500).json({ message: "Token refresh failed" });
    }
  });

  // Logout endpoint
  app.post('/api/auth/logout', (req, res) => {
    req.session?.destroy(() => {
      res.json({ success: true });
    });
  });

  // Get current user endpoint
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}