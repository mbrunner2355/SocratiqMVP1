import type { Express } from "express";
import { setupAuth as setupReplitAuth, isAuthenticated as replitAuth } from "./replitAuth";
import { setupProductionAuth, isAuthenticated as productionAuth } from "./productionAuth";
import { setupCognitoAuth, isAuthenticated as cognitoAuth } from "./cognitoAuth";

/**
 * Authentication manager that chooses between Replit Auth, AWS Cognito, and Production Auth
 * based on environment configuration
 */

export async function setupAuthentication(app: Express) {
  // Set up dual authentication: Cognito for users + Replit for admins
  if (process.env.AWS_COGNITO_USER_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID) {
    console.log("Setting up dual authentication: AWS Cognito + Replit Admin");
    await setupCognitoAuth(app);
    await setupReplitAuth(app); // Enable Replit auth for admins
    return;
  }
  
  const isProductionDeploy = !process.env.REPLIT_DOMAINS || process.env.NODE_ENV === "production";
  
  if (isProductionDeploy) {
    console.log("Setting up production authentication for AWS Amplify deployment");
    await setupProductionAuth(app);
  } else {
    console.log("Setting up Replit authentication for development");
    await setupReplitAuth(app);
  }
}

export function getAuthMiddleware() {
  // Check for Cognito configuration first
  if (process.env.AWS_COGNITO_USER_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID) {
    return dualAuth; // Use dual authentication middleware
  }
  
  const isProductionDeploy = !process.env.REPLIT_DOMAINS || process.env.NODE_ENV === "production";
  
  if (isProductionDeploy) {
    return productionAuth;
  } else {
    return replitAuth;
  }
}

// Dual authentication middleware that tries Cognito first, then Replit admin
export const dualAuth: any = async (req: any, res: any, next: any) => {
  // First try Cognito authentication for regular users
  cognitoAuth(req, res, (cognitoError?: any) => {
    if (!cognitoError && req.user) {
      // Cognito auth succeeded
      req.user.authMethod = 'cognito';
      return next();
    }
    
    // If Cognito fails, try Replit authentication for admins
    replitAuth(req, res, (replitError?: any) => {
      if (!replitError && req.user) {
        // Replit auth succeeded - mark as admin
        req.user.isAdmin = true;
        req.user.authMethod = 'replit';
        return next();
      }
      
      // Both authentication methods failed
      res.status(401).json({ message: "Authentication required" });
    });
  });
};