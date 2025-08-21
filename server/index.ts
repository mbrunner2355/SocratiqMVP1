import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// Set Cognito environment variables from AWS configuration
process.env.COGNITO_USER_POOL_ID = "us-east-1_FBeAewbir";
process.env.COGNITO_CLIENT_ID = "20in1ee6g6j5ql9pfcv3avbn2a";
process.env.COGNITO_REGION = "us-east-1";

// Set Vite environment variables for frontend access using AWS values
process.env.VITE_COGNITO_USER_POOL_ID = "us-east-1_FBeAewbir";
process.env.VITE_COGNITO_CLIENT_ID = "20in1ee6g6j5ql9pfcv3avbn2a";
process.env.VITE_COGNITO_REGION = "us-east-1";
process.env.VITE_AWS_REGION = "us-east-1";

// Set AWS credentials from environment variables for dual deployment compatibility
if (process.env.VITE_ACCESS_KEY_ID) {
  process.env.VITE_ACCESS_KEY_ID = process.env.VITE_ACCESS_KEY_ID;
}
if (process.env.VITE_SECRET_ACCESS_KEY) {
  process.env.VITE_SECRET_ACCESS_KEY = process.env.VITE_SECRET_ACCESS_KEY;
}

// Override to serve React app instead of Express API
process.env.VITE_API_BASE_URL = "http://localhost:5000";

// Set server environment variables for Cognito authentication
process.env.VITE_COGNITO_CLIENT_SECRET = process.env.VITE_COGNITO_CLIENT_SECRET || process.env.COGNITO_CLIENT_SECRET;

const app = express();

// CORS middleware to allow frontend-backend communication
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
