# AWS Amplify Environment Variables Setup

## Required Environment Variables for EMME Engage Production Deployment

Add these environment variables in AWS Amplify Console → App Settings → Environment Variables:

### AWS Cognito Authentication
```
COGNITO_USER_POOL_ID=us-east-1_FBeAewbir
COGNITO_CLIENT_ID=20in1ee6g6j5ql9pfcv3avbn2a
AWS_COGNITO_CLIENT_SECRET=[Get from Replit Secrets]
COGNITO_REGION=us-east-1
```

### AWS Credentials
```
AWS_ACCESS_KEY_ID=[Get from Replit Secrets]
AWS_SECRET_ACCESS_KEY=[Get from Replit Secrets]
AWS_REGION=us-east-1
```

### Database Configuration
```
DATABASE_URL=[Your Neon Database URL from Replit Secrets]
```

### Application Security
```
SESSION_SECRET=[Generate a random secure string]
NODE_ENV=production
```

### Optional S3 Configuration (if using object storage)
```
AWS_S3_BUCKET=socratiqbeta1
AWS_S3_REGION=us-east-1
```

## How to Set Environment Variables in AWS Amplify:

1. Open AWS Amplify Console
2. Select your EMME Engage app
3. Go to "App Settings" → "Environment Variables"
4. Click "Manage Variables"
5. Add each variable name and value
6. Save changes
7. Redeploy your application

## Important Security Notes:

- Never commit these values to your repository
- Use the exact same values from your working Replit Secrets
- The AWS_COGNITO_CLIENT_SECRET is critical for authentication
- Generate a strong SESSION_SECRET for production

## Testing After Deployment:

After adding environment variables and redeploying:
1. Visit your Amplify app URL
2. You should see the AWS Cognito login interface
3. Test user registration and login
4. Verify admin access via "Admin Access" link

## Troubleshooting:

If authentication fails after deployment:
1. Verify all environment variables are set correctly
2. Check that your Cognito User Pool allows the authentication flows
3. Ensure the CLIENT_SECRET matches your Cognito app client
4. Check Amplify build logs for any missing variables