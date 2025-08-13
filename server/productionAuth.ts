import express from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
// import bcrypt from "bcrypt";  // Commented out for now to avoid dependency issues
import { storage } from "./storage";
import type { Express, RequestHandler } from "express";

// Simple production authentication for AWS Amplify deployment
// This replaces Replit Auth for production environments

export function getProductionSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
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

// Simple authentication middleware for production
export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
  if (req.session && req.session.user) {
    // Attach user to request
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
  }
  res.status(401).json({ message: "Unauthorized" });
};

export async function setupProductionAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getProductionSession());

  // Simple login endpoint for production
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      // For EMME Engage, we'll create a default admin user if none exists
      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Auto-create admin user for first login
        user = await storage.createUser({
          email,
          firstName: "Admin",
          lastName: "User", 
          role: "super_admin",
        });
      }

      // For development/demo purposes, allow login with any password
      if (user) {
        (req.session as any).user = user;
        res.json({ success: true, user });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Auto-login for EMME Engage users (development/demo purposes)
  app.get('/api/auth/auto-login', async (req, res) => {
    try {
      let user = await storage.getUserByEmail("emme-user@socratiq.ai");
      
      if (!user) {
        // Create default EMME user
        user = await storage.createUser({
          email: "emme-user@socratiq.ai",
          firstName: "EMME",
          lastName: "User",
          role: "analyst",
        });
      }
      
      (req.session as any).user = user;
      res.json({ success: true, user });
    } catch (error) {
      console.error("Auto-login error:", error);
      res.status(500).json({ message: "Auto-login failed" });
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