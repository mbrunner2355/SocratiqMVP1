# AWS Cognito Authentication Setup Guide

This guide covers setting up AWS Cognito authentication for the EMME Engage platform.

## Prerequisites

1. **AWS Account**: You need an active AWS account
2. **AWS CLI**: Install and configure AWS CLI (optional but recommended)
3. **IAM Permissions**: Ensure you have permissions to create and manage Cognito resources

## Step 1: Create Cognito User Pool

### Using AWS Console

1. Go to **AWS Cognito** in the AWS Management Console
2. Click **Create user pool**
3. Configure the following settings:

#### Step 1 - Authentication providers
- **Provider types**: Cognito user pool
- **Cognito user pool sign-in options**: 
  - ✅ Email
  - ✅ Username (optional)

#### Step 2 - Security requirements
- **Password policy**: Choose your preference (recommend: Cognito defaults)
- **Multi-factor authentication**: Optional (can enable later)
- **User account recovery**: Email only

#### Step 3 - Sign-up experience
- **Self-service sign-up**: Enable
- **Cognito-assisted verification and confirmation**: Email
- **Required attributes**: 
  - ✅ email
  - ✅ given_name
  - ✅ family_name

#### Step 4 - Message delivery
- **Email**: Send email with Cognito (for testing) or SES (for production)

#### Step 5 - Integrate your app
- **User pool name**: `emme-engage-users` (or your preferred name)
- **App client name**: `emme-engage-web-client`
- **Client secret**: Don't generate (keep unchecked for web apps)

#### Step 6 - Review and create
- Review settings and click **Create user pool**

## Step 2: Configure Environment Variables

Add these environment variables to your deployment environment (AWS Amplify, etc.):

```bash
# AWS Cognito Configuration
AWS_COGNITO_REGION=us-east-1
AWS_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
AWS_COGNITO_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX

# AWS Credentials (if not using IAM roles)
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=us-east-1

# Existing variables
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-secure-random-session-secret
S3_BUCKET_NAME=your-s3-bucket-name
```

### How to find your Cognito values:

1. **User Pool ID**: In Cognito console, select your user pool, it's shown in the "User pool overview" section
2. **Client ID**: In your user pool, go to "App integration" tab, scroll down to "App clients and analytics"

## Step 3: Update IAM Permissions

Your AWS credentials need the following Cognito permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "cognito-idp:AdminInitiateAuth",
                "cognito-idp:AdminCreateUser",
                "cognito-idp:AdminSetUserPassword",
                "cognito-idp:AdminGetUser",
                "cognito-idp:ListUsers"
            ],
            "Resource": "arn:aws:cognito-idp:REGION:ACCOUNT:userpool/USER_POOL_ID"
        }
    ]
}
```

## Step 4: Enable Cognito Authentication

The application automatically detects Cognito configuration. When the following environment variables are set, it uses Cognito authentication:

- `AWS_COGNITO_USER_POOL_ID`
- `AWS_COGNITO_CLIENT_ID`

## Step 5: Test the Setup

1. **Deploy your application** with the new environment variables
2. **Visit your app** - you should see the Cognito login page
3. **Create a test account** using the "Sign Up" tab
4. **Sign in** with your new account

## Features Included

✅ **User Registration**: Users can create accounts with email/password
✅ **User Login**: Secure authentication with JWT tokens
✅ **Session Management**: Sessions stored in PostgreSQL database
✅ **Token Verification**: JWT tokens verified on each request
✅ **User Management**: Integration with existing user roles and permissions
✅ **Secure Logout**: Proper session cleanup

## Authentication Flow

1. **User Registration**: New users sign up via `/api/auth/cognito-signup`
2. **User Login**: Authentication via `/api/auth/cognito-login`
3. **Token Storage**: JWT access tokens stored in browser localStorage
4. **API Requests**: Include `Authorization: Bearer <token>` header
5. **Session Management**: Server maintains session with user data
6. **Logout**: Clear tokens and destroy session via `/api/auth/logout`

## Security Features

- **JWT Token Verification**: All API requests verify JWT tokens
- **Session-based Authentication**: Fallback to session cookies
- **Secure Cookies**: HTTPOnly, Secure flags in production
- **Token Expiration**: Access tokens have built-in expiration
- **Password Security**: Cognito handles password complexity and storage

## Troubleshooting

### Common Issues:

1. **"User Pool not found"**: Check your `AWS_COGNITO_USER_POOL_ID`
2. **"Invalid client"**: Verify your `AWS_COGNITO_CLIENT_ID`
3. **"Access denied"**: Check IAM permissions for Cognito actions
4. **"Token verification failed"**: Ensure tokens are valid and not expired

### Debug Steps:

1. Check server logs for Cognito-related errors
2. Verify environment variables are set correctly
3. Test Cognito credentials using AWS CLI
4. Check network connectivity to AWS services

## Production Considerations

1. **Use SES for email**: Configure Cognito to use Amazon SES for email delivery
2. **Enable MFA**: Consider multi-factor authentication for sensitive applications
3. **Monitor usage**: Set up CloudWatch monitoring for Cognito
4. **Backup strategy**: Plan for user data backup and recovery
5. **Compliance**: Ensure GDPR/HIPAA compliance if required

The authentication system is now ready for production use with AWS Cognito!