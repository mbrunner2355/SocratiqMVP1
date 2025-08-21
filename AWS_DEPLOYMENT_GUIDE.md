# SocratIQ Transform™ AWS Deployment Guide

## Complete AWS Environment Setup for Pharmaceutical Intelligence Platform

This guide provides everything you need to deploy SocratIQ Transform™ with EMME Engage in your AWS environment.

## 📋 Prerequisites

### Required AWS Services
- **AWS Amplify** - Frontend hosting and CI/CD
- **Amazon RDS PostgreSQL** or **Aurora Serverless** - Database
- **Amazon S3** - File storage and static assets
- **AWS Cognito** - User authentication (optional)
- **CloudFront** - CDN (included with Amplify)
- **CloudWatch** - Monitoring and logs

### Required Accounts/Services
- GitHub/GitLab repository
- AWS Account with appropriate permissions
- Domain name (optional, for custom domain)

## 🏗️ Architecture Overview

```
Internet → CloudFront → Amplify (React App) → RDS PostgreSQL
                                      ↓
                                   S3 Bucket (File Storage)
```

## 📦 Step 1: Repository Preparation

### 1.1 Create Git Repository
```bash
# Initialize repository (if not done)
git init
git add .
git commit -m "Initial SocratIQ platform deployment"

# Create production branch
git checkout -b production
git push -u origin main
git push -u origin production
```

### 1.2 Required Files (Already Present)
- ✅ `package.json` - Dependencies and build scripts
- ✅ `vite.config.ts` - Frontend build configuration
- ✅ `amplify.yml` - AWS Amplify build settings
- ✅ `tsconfig.json` - TypeScript configuration

## 🗄️ Step 2: Database Setup (Choose One)

### Option A: Amazon RDS PostgreSQL (Recommended for Production)

#### 2.1 Create RDS Instance
```bash
# Using AWS CLI
aws rds create-db-instance \
  --db-instance-identifier socratiq-prod-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --master-username socratiq_admin \
  --master-user-password 'YourSecurePassword123!' \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-your-security-group \
  --db-subnet-group-name your-subnet-group \
  --backup-retention-period 7 \
  --storage-encrypted
```

#### 2.2 Security Group Configuration
```bash
# Allow PostgreSQL access (port 5432)
aws ec2 authorize-security-group-ingress \
  --group-id sg-your-security-group \
  --protocol tcp \
  --port 5432 \
  --cidr 0.0.0.0/0
```

### Option B: Neon Database (Serverless Alternative)
1. Sign up at https://neon.tech
2. Create new project: "SocratIQ Production"
3. Copy connection string for environment variables

## 🪣 Step 3: S3 Bucket Setup

### 3.1 Create S3 Bucket
```bash
# Create bucket
aws s3 mb s3://socratiq-prod-files --region us-east-1

# Configure CORS for file uploads
aws s3api put-bucket-cors \
  --bucket socratiq-prod-files \
  --cors-configuration file://s3-cors.json
```

### 3.2 S3 CORS Configuration (s3-cors.json)
```json
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["ETag"]
    }
  ]
}
```

### 3.3 IAM Policy for S3 Access
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::socratiq-prod-files/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::socratiq-prod-files"
    }
  ]
}
```

## 🚀 Step 4: AWS Amplify Setup

### 4.1 Connect Repository
1. Go to AWS Amplify Console
2. Click "New app" → "Host web app"
3. Connect your GitHub/GitLab repository
4. Select repository and branches (main for staging, production for prod)
5. Choose "main" branch for initial setup

### 4.2 Build Configuration
Amplify will auto-detect the `amplify.yml` file:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## 🔧 Step 5: Environment Variables Configuration

### 5.1 Production Environment Variables
Set these in AWS Amplify Console → App Settings → Environment Variables:

```bash
# Application
NODE_ENV=production
SESSION_SECRET=your-super-secure-random-session-secret-here

# Database
DATABASE_URL=postgresql://username:password@your-rds-endpoint:5432/socratiq

# AWS S3 Storage
AWS_REGION=us-east-1
S3_BUCKET_NAME=socratiq-prod-files
VITE_ACCESS_KEY_ID=AKIA...
VITE_SECRET_ACCESS_KEY=your-secret-access-key

# Optional: Custom API endpoint
VITE_API_BASE_URL=https://your-api-domain.com

# Security
CORS_ORIGIN=https://your-domain.com
```

### 5.2 Staging Environment Variables
For staging branch (same as production but different database/bucket):

```bash
NODE_ENV=staging
DATABASE_URL=postgresql://username:password@your-staging-rds:5432/socratiq_staging
S3_BUCKET_NAME=socratiq-staging-files
# ... other variables same as production
```

## 🔐 Step 6: Authentication Setup (Optional)

### Option A: AWS Cognito Integration
```bash
# Create Cognito User Pool
aws cognito-idp create-user-pool \
  --pool-name SocratIQ-Users \
  --policies '{
    "PasswordPolicy": {
      "MinimumLength": 8,
      "RequireUppercase": true,
      "RequireLowercase": true,
      "RequireNumbers": true,
      "RequireSymbols": false
    }
  }'
```

### Option B: Simple Session-Based Auth (Current)
The platform includes built-in session authentication that works automatically.

## 📊 Step 7: Database Migration

### 7.1 Run Initial Migration
```bash
# Set your production database URL
export DATABASE_URL="postgresql://username:password@your-rds-endpoint:5432/socratiq"

# Push schema to database
npm run db:push
```

### 7.2 Create Initial Admin User
Connect to your database and run:

```sql
-- Create initial super admin user
INSERT INTO users (id, email, name, role, permissions) 
VALUES (
  'admin-001',
  'your-admin@company.com',
  'System Administrator',
  'super_admin',
  '{"system_admin": true, "user_management": true, "partner_management": true}'
);
```

## 🌐 Step 8: Custom Domain (Optional)

### 8.1 Add Domain in Amplify
1. Amplify Console → Domain management
2. Add domain: `socratiq.yourcompany.com`
3. Create DNS records as instructed

### 8.2 SSL Certificate
AWS Amplify automatically provisions SSL certificates via ACM.

## 🔍 Step 9: Monitoring & Logging

### 9.1 CloudWatch Integration
```bash
# Create log group
aws logs create-log-group --log-group-name /aws/amplify/socratiq
```

### 9.2 RDS Monitoring
- Enable Performance Insights
- Configure CloudWatch alarms for CPU/memory

## 🚀 Step 10: Deployment Process

### 10.1 Deploy to Staging
```bash
git checkout main
git add .
git commit -m "feat: deploy to staging"
git push origin main
# Auto-deploys to staging environment
```

### 10.2 Deploy to Production
```bash
git checkout production
git merge main
git push origin production
# Deploys to production environment
```

## 📋 Step 11: Post-Deployment Verification

### 11.1 Health Checks
1. **Frontend**: Verify https://your-amplify-url loads
2. **Database**: Test login and data persistence
3. **File Upload**: Test PDF/DOCX upload to S3
4. **EMME Features**: Verify pharmaceutical intelligence modules

### 11.2 Performance Testing
- Run load tests on key endpoints
- Monitor RDS performance metrics
- Check S3 upload/download speeds

## 💰 Cost Estimation

### Monthly AWS Costs (Estimated)
- **Amplify**: $5-15/month (depending on traffic)
- **RDS t3.micro**: $15-25/month
- **S3 Storage**: $5-20/month (depending on file volume)
- **Data Transfer**: $10-50/month (depending on usage)

**Total Estimated**: $35-110/month for production environment

## 🔒 Security Best Practices

### 11.1 Database Security
- Enable SSL connections
- Use IAM database authentication
- Regular security patches
- Backup encryption

### 11.2 Application Security
- Environment variables in AWS Secrets Manager
- WAF protection via CloudFront
- Regular dependency updates
- SSL/TLS encryption

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs in Amplify Console
# Verify all dependencies in package.json
# Check node version compatibility
```

#### Database Connection Issues
```bash
# Verify security group allows port 5432
# Check DATABASE_URL format
# Test connection from local machine
```

#### File Upload Issues
```bash
# Verify S3 bucket permissions
# Check CORS configuration
# Verify AWS credentials
```

## 📞 Support Contacts

- **AWS Support**: Your AWS support plan
- **Database Issues**: RDS/Neon support
- **DNS/Domain**: Your domain provider
- **Application Issues**: Your development team

## 📝 Deployment Checklist

- [ ] Repository created and pushed to GitHub/GitLab
- [ ] RDS PostgreSQL instance created and configured
- [ ] S3 bucket created with proper permissions
- [ ] Amplify app connected to repository
- [ ] Environment variables configured
- [ ] Database schema migrated
- [ ] Initial admin user created
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Backup strategy implemented

---

**Ready for deployment!** Your SocratIQ Transform™ pharmaceutical intelligence platform is now configured for AWS production deployment.

For specific issues or advanced configurations, refer to individual AWS service documentation or contact your AWS solutions architect.