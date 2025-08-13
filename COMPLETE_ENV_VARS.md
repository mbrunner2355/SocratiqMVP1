# Complete Environment Variables for AWS Amplify

## ✅ ALL Environment Variables Required for Production Deployment

Add **ALL** of these to AWS Amplify Console → App Settings → Environment Variables:

```bash
# Database Configuration
DATABASE_URL=your_neon_database_url
PGHOST=your_pg_host  
PGUSER=your_pg_user
PGPASSWORD=your_pg_password
PGDATABASE=your_pg_database
PGPORT=your_pg_port

# AWS Credentials
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key  
AWS_REGION=us-east-1

# Application Security
SESSION_SECRET=your_session_secret
NODE_ENV=production

# Backend Cognito Authentication
COGNITO_USER_POOL_ID=us-east-1_FBeAewbir
COGNITO_CLIENT_ID=20in1ee6g6j5ql9pfcv3avbn2a
COGNITO_REGION=us-east-1
AWS_COGNITO_CLIENT_SECRET=your_cognito_client_secret

# Frontend Vite Environment Variables (REQUIRED for browser access)
VITE_COGNITO_USER_POOL_ID=us-east-1_FBeAewbir
VITE_COGNITO_CLIENT_ID=20in1ee6g6j5ql9pfcv3avbn2a
VITE_COGNITO_REGION=us-east-1
VITE_AWS_REGION=us-east-1
```

## Critical Notes:

1. **VITE_ prefix variables** are essential for frontend authentication to work
2. **Both backend AND frontend** Cognito variables are required
3. Use the **exact same values** from your Replit Secrets
4. **AWS_COGNITO_CLIENT_SECRET** must match your Cognito app client secret

## Quick Copy Template:

```
DATABASE_URL=[copy from Replit]
AWS_ACCESS_KEY_ID=[copy from Replit]
AWS_SECRET_ACCESS_KEY=[copy from Replit]
AWS_COGNITO_CLIENT_SECRET=[copy from Replit]
AWS_REGION=us-east-1
SESSION_SECRET=emme-engage-production-secret-2025
NODE_ENV=production
COGNITO_USER_POOL_ID=us-east-1_FBeAewbir
COGNITO_CLIENT_ID=20in1ee6g6j5ql9pfcv3avbn2a
COGNITO_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=us-east-1_FBeAewbir
VITE_COGNITO_CLIENT_ID=20in1ee6g6j5ql9pfcv3avbn2a
VITE_COGNITO_REGION=us-east-1
VITE_AWS_REGION=us-east-1
```

## After Adding Variables:
1. Save all variables in AWS Amplify
2. Redeploy your application
3. Test authentication in production