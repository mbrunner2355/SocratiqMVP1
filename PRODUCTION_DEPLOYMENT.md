# Production Deployment Guide for AWS Amplify

This guide covers deploying the EMME Engage platform to AWS Amplify for production use.

## Authentication System Changes

### Development vs Production Authentication

The platform now supports two authentication modes:

1. **Development Mode (Replit)**: Uses Replit OpenID Connect authentication
2. **Production Mode (AWS Amplify)**: Uses simplified session-based authentication

The system automatically detects the deployment environment and switches authentication modes:

- **Environment Detection**: If `REPLIT_DOMAINS` environment variable is missing or `NODE_ENV=production`, it uses production auth
- **Development**: Replit Auth with full OIDC flow
- **Production**: Session-based auth with demo user creation

### Environment Variables Required for Production

Set these in AWS Amplify Console for your app:

```bash
# Required for production
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-secure-random-session-secret
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-s3-bucket-name

# Optional - remove or leave empty to trigger production auth
# REPLIT_DOMAINS=""
# REPL_ID=""
# ISSUER_URL=""
```

### Production Authentication Features

1. **Auto-Login for Demo**: Users can click "Continue as Demo User" to automatically log in
2. **Manual Login**: Users can enter email/password (for development, any password works)
3. **Session Management**: Uses PostgreSQL-backed sessions with 1-week expiration
4. **Role-Based Access**: Supports the same 5-tier role system as development

### Default Users Created

On first login, the system creates default users:

- **Demo User**: `emme-user@socratiq.ai` with `analyst` role
- **Admin User**: Any email used for manual login gets `super_admin` role

## Deployment Steps

1. **Push to GitHub**: Ensure your code is in the main branch
2. **AWS Amplify Setup**: Connect your GitHub repository
3. **Environment Variables**: Set the production environment variables above
4. **Build Configuration**: The `amplify.yml` file is already configured
5. **Deploy**: AWS Amplify will automatically build and deploy

## Database Setup

Ensure your PostgreSQL database (Neon, RDS, etc.) has the required tables:

- `sessions` - for session storage
- `users` - for user management
- All other SocratIQ platform tables

The application will automatically create missing tables on startup.

## Security Considerations

1. **Session Secret**: Use a strong, random session secret
2. **Database Security**: Ensure database connections use SSL
3. **HTTPS**: AWS Amplify automatically provides HTTPS
4. **CORS**: Production builds handle CORS automatically

## Testing Production Deployment

1. **Access the App**: Visit your Amplify app URL
2. **Login Test**: Use "Continue as Demo User" or manual login
3. **Feature Test**: Verify project management, document upload, etc.
4. **Role Test**: Check different user roles work correctly

## Monitoring and Logs

- **AWS CloudWatch**: Monitor application performance
- **Database Monitoring**: Monitor PostgreSQL performance
- **Error Tracking**: Check browser console and server logs

The production authentication system is designed to be simple and secure for pharmaceutical intelligence platform deployments.