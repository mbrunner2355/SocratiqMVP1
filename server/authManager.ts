import type { Express } from "express";
import { setupAuth as setupReplitAuth, isAuthenticated as replitAuth } from "./replitAuth";
import { setupProductionAuth, isAuthenticated as productionAuth } from "./productionAuth";
import { setupCognitoAuth, isAuthenticated as cognitoAuth } from "./cognitoAuth";

/**
 * Authentication manager that chooses between Replit Auth, AWS Cognito, and Production Auth
 * based on environment configuration
 */

export async function setupAuthentication(app: Express) {
  // Use only AWS Cognito authentication
  if (process.env.COGNITO_USER_POOL_ID && process.env.COGNITO_CLIENT_ID) {
    console.log("Setting up AWS Cognito authentication");
    await setupCognitoAuth(app);
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
  if (process.env.COGNITO_USER_POOL_ID && process.env.COGNITO_CLIENT_ID) {
    return cognitoAuth; // Use only Cognito authentication
  }
  
  const isProductionDeploy = !process.env.REPLIT_DOMAINS || process.env.NODE_ENV === "production";
  
  if (isProductionDeploy) {
    return productionAuth;
  } else {
    return replitAuth;
  }
}

// Single Cognito authentication - simplified
// Removed dual auth complexity