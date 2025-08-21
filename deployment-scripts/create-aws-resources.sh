#!/bin/bash

# SocratIQ AWS Resource Creation Script
# This script creates all necessary AWS resources for the pharmaceutical intelligence platform

set -e

# Configuration
PROJECT_NAME="socratiq"
ENVIRONMENT=${1:-production}  # production or staging
AWS_REGION=${2:-us-east-1}
DB_PASSWORD=${3:-""}

if [ -z "$DB_PASSWORD" ]; then
    echo "Usage: $0 [environment] [region] [db_password]"
    echo "Example: $0 production us-east-1 MySecurePassword123!"
    exit 1
fi

echo "🚀 Creating AWS resources for SocratIQ $ENVIRONMENT environment"

# Create S3 bucket for file storage
echo "📦 Creating S3 bucket..."
BUCKET_NAME="${PROJECT_NAME}-${ENVIRONMENT}-files"
aws s3 mb s3://$BUCKET_NAME --region $AWS_REGION

# Configure S3 CORS
echo "🔧 Configuring S3 CORS..."
cat > s3-cors-temp.json << EOF
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
EOF

aws s3api put-bucket-cors --bucket $BUCKET_NAME --cors-configuration file://s3-cors-temp.json
rm s3-cors-temp.json

# Create VPC for RDS (if not exists)
echo "🌐 Setting up VPC..."
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=tag:Name,Values=${PROJECT_NAME}-vpc" --query 'Vpcs[0].VpcId' --output text)

if [ "$VPC_ID" = "None" ]; then
    VPC_ID=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 --query 'Vpc.VpcId' --output text)
    aws ec2 create-tags --resources $VPC_ID --tags Key=Name,Value=${PROJECT_NAME}-vpc
    
    # Create subnets
    SUBNET1=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.1.0/24 --availability-zone ${AWS_REGION}a --query 'Subnet.SubnetId' --output text)
    SUBNET2=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.2.0/24 --availability-zone ${AWS_REGION}b --query 'Subnet.SubnetId' --output text)
    
    aws ec2 create-tags --resources $SUBNET1 --tags Key=Name,Value=${PROJECT_NAME}-subnet-1
    aws ec2 create-tags --resources $SUBNET2 --tags Key=Name,Value=${PROJECT_NAME}-subnet-2
    
    # Create DB subnet group
    aws rds create-db-subnet-group \
        --db-subnet-group-name ${PROJECT_NAME}-subnet-group \
        --db-subnet-group-description "SocratIQ database subnet group" \
        --subnet-ids $SUBNET1 $SUBNET2
else
    echo "✅ Using existing VPC: $VPC_ID"
fi

# Create security group for RDS
echo "🔒 Creating security group..."
SG_ID=$(aws ec2 create-security-group \
    --group-name ${PROJECT_NAME}-${ENVIRONMENT}-sg \
    --description "SocratIQ $ENVIRONMENT security group" \
    --vpc-id $VPC_ID \
    --query 'GroupId' --output text)

# Allow PostgreSQL access
aws ec2 authorize-security-group-ingress \
    --group-id $SG_ID \
    --protocol tcp \
    --port 5432 \
    --cidr 0.0.0.0/0

# Create RDS instance
echo "🗄️ Creating RDS PostgreSQL instance..."
DB_INSTANCE_ID="${PROJECT_NAME}-${ENVIRONMENT}-db"

aws rds create-db-instance \
    --db-instance-identifier $DB_INSTANCE_ID \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --engine-version 15.4 \
    --master-username socratiq_admin \
    --master-user-password "$DB_PASSWORD" \
    --allocated-storage 20 \
    --vpc-security-group-ids $SG_ID \
    --db-subnet-group-name ${PROJECT_NAME}-subnet-group \
    --backup-retention-period 7 \
    --storage-encrypted \
    --no-publicly-accessible

echo "⏳ Waiting for RDS instance to be available..."
aws rds wait db-instance-available --db-instance-identifier $DB_INSTANCE_ID

# Get RDS endpoint
DB_ENDPOINT=$(aws rds describe-db-instances \
    --db-instance-identifier $DB_INSTANCE_ID \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text)

# Create IAM user for S3 access
echo "👤 Creating IAM user for S3 access..."
IAM_USER="${PROJECT_NAME}-${ENVIRONMENT}-s3-user"

aws iam create-user --user-name $IAM_USER

# Create and attach S3 policy
cat > s3-policy-temp.json << EOF
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
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::$BUCKET_NAME"
    }
  ]
}
EOF

aws iam put-user-policy \
    --user-name $IAM_USER \
    --policy-name ${PROJECT_NAME}-s3-policy \
    --policy-document file://s3-policy-temp.json

rm s3-policy-temp.json

# Create access keys
echo "🔑 Creating access keys..."
ACCESS_KEYS=$(aws iam create-access-key --user-name $IAM_USER)
ACCESS_KEY_ID=$(echo $ACCESS_KEYS | grep -o '"AccessKeyId":"[^"]*' | cut -d'"' -f4)
SECRET_ACCESS_KEY=$(echo $ACCESS_KEYS | grep -o '"SecretAccessKey":"[^"]*' | cut -d'"' -f4)

# Output environment variables
echo ""
echo "🎉 AWS Resources Created Successfully!"
echo ""
echo "📋 Environment Variables for Amplify:"
echo "======================================"
echo "NODE_ENV=$ENVIRONMENT"
echo "AWS_REGION=$AWS_REGION"
echo "S3_BUCKET_NAME=$BUCKET_NAME"
echo "VITE_ACCESS_KEY_ID=$ACCESS_KEY_ID"
echo "VITE_SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY"
echo "DATABASE_URL=postgresql://socratiq_admin:$DB_PASSWORD@$DB_ENDPOINT:5432/postgres"
echo ""
echo "🔒 Security Information:"
echo "======================="
echo "VPC ID: $VPC_ID"
echo "Security Group ID: $SG_ID"
echo "RDS Instance ID: $DB_INSTANCE_ID"
echo "RDS Endpoint: $DB_ENDPOINT"
echo ""
echo "⚠️  IMPORTANT: Save these credentials securely!"
echo "   The secret access key will not be shown again."
echo ""
echo "Next steps:"
echo "1. Add the environment variables to AWS Amplify"
echo "2. Connect your GitHub repository to Amplify"
echo "3. Deploy your application"

# Save configuration to file
cat > aws-config-$ENVIRONMENT.txt << EOF
# SocratIQ $ENVIRONMENT AWS Configuration
# Generated on $(date)

NODE_ENV=$ENVIRONMENT
AWS_REGION=$AWS_REGION
S3_BUCKET_NAME=$BUCKET_NAME
VITE_ACCESS_KEY_ID=$ACCESS_KEY_ID
VITE_SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY
DATABASE_URL=postgresql://socratiq_admin:$DB_PASSWORD@$DB_ENDPOINT:5432/postgres

# Resource IDs
VPC_ID=$VPC_ID
SECURITY_GROUP_ID=$SG_ID
RDS_INSTANCE_ID=$DB_INSTANCE_ID
RDS_ENDPOINT=$DB_ENDPOINT
IAM_USER=$IAM_USER
EOF

echo "💾 Configuration saved to: aws-config-$ENVIRONMENT.txt"