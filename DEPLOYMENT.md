# SocratIQ Platform Deployment Guide

## Overview
The SocratIQ pharmaceutical intelligence platform is configured for multi-environment deployment using AWS Amplify with GitHub/GitLab integration.

## Architecture
- **Frontend**: React/Vite build served by Amplify
- **Backend**: Node.js/Express API (containerized or serverless)
- **Database**: Neon PostgreSQL (serverless)
- **Storage**: AWS S3 (socratiqbeta1 bucket)
- **Auth**: Replit Auth (OIDC)

## Deployment Environments

### Staging (main branch)
- **URL**: `https://main.<app-id>.amplifyapp.com`
- **Database**: Staging Neon database
- **S3 Bucket**: `socratiqbeta1-staging/`
- **Auto-deploy**: On push to `main`

### Production (production branch)
- **URL**: `https://production.<app-id>.amplifyapp.com` or custom domain
- **Database**: Production Neon database  
- **S3 Bucket**: `socratiqbeta1-production/`
- **Auto-deploy**: On push to `production` (with approval)

## Setup Instructions

### 1. Repository Setup
```bash
# Initialize if not already done
git init
git add .
git commit -m "Initial SocratIQ platform commit"

# Add your repository remote
git remote add origin <your-repo-url>
git push -u origin main

# Create production branch
git checkout -b production
git push -u origin production
```

### 2. AWS Amplify Setup
1. **Connect Repository**
   - Go to AWS Amplify Console
   - Choose "Host web app"
   - Connect your GitHub/GitLab repository
   - Select branches: `main` (staging) and `production`

2. **Environment Variables** (set in Amplify Console)
   
   **Staging (main branch):**
   ```
   NODE_ENV=staging
   DATABASE_URL=<staging_neon_url>
   AWS_ACCESS_KEY_ID=<aws_key>
   AWS_SECRET_ACCESS_KEY=<aws_secret>
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=socratiqbeta1
   REPL_ID=<replit_app_id>
   SESSION_SECRET=<random_secret>
   ISSUER_URL=https://replit.com/oidc
   ```

   **Production (production branch):**
   ```
   NODE_ENV=production
   DATABASE_URL=<production_neon_url>
   AWS_ACCESS_KEY_ID=<aws_key>
   AWS_SECRET_ACCESS_KEY=<aws_secret>
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=socratiqbeta1
   REPL_ID=<replit_app_id>
   SESSION_SECRET=<strong_random_secret>
   ISSUER_URL=https://replit.com/oidc
   ```

### 3. Database Setup
```bash
# Run migrations on staging
NODE_ENV=staging npm run db:push

# Run migrations on production (manual approval required)
NODE_ENV=production npm run db:push
```

### 4. Custom Domain (Production)
1. In Amplify Console → Domain management
2. Add your domain: `socratiq.com`
3. Configure DNS records as instructed

## Deployment Workflow

### Staging Deployment
```bash
git checkout main
git add .
git commit -m "feat: new feature description"
git push origin main
# Auto-deploys to staging
```

### Production Deployment
```bash
git checkout production
git merge main
git push origin production
# Deploys to production (may require approval)
```

## Admin User Setup (Post-Deployment)

After first deployment, set the initial super admin:

```sql
-- Run this query on production database
UPDATE users 
SET 
  role = 'super_admin',
  permissions = '{"system_admin": true, "user_management": true, "partner_management": true}',
  updated_at = CURRENT_TIMESTAMP
WHERE email = 'your-admin-email@gmail.com';
```

## Monitoring & Logs
- **Amplify Logs**: Available in AWS Amplify Console
- **App Logs**: Configure CloudWatch integration
- **Database**: Neon dashboard monitoring
- **S3**: CloudWatch S3 metrics

## Security Notes
- All secrets stored in AWS Amplify environment variables
- Database connections use SSL
- S3 bucket has proper IAM policies
- Authentication handled by Replit OIDC

## Support
For deployment issues, check:
1. AWS Amplify build logs
2. Neon database connectivity
3. S3 bucket permissions
4. Environment variable configuration