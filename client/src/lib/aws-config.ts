// AWS Configuration for Production Deployment
export const awsConfig = {
  // S3 Configuration
  s3: {
    bucket: 'socratiqbeta1',
    region: 'us-east-1',
    accessKeyId: import.meta.env.VITE_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_SECRET_ACCESS_KEY,
  },
  
  // Cognito Configuration
  cognito: {
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    clientSecret: import.meta.env.VITE_COGNITO_CLIENT_SECRET,
    region: 'us-east-1',
  },
  
  // API Gateway Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_GATEWAY_URL || 'https://api.socratiq.com',
    region: 'us-east-1',
  },
  
  // Lambda Functions
  lambda: {
    documentProcessor: 'socratiq-document-processor',
    nlpAnalyzer: 'socratiq-nlp-analyzer', 
    knowledgeGraph: 'socratiq-knowledge-graph',
  },
  
  // Database Configuration (RDS/Aurora)
  database: {
    host: import.meta.env.VITE_DATABASE_HOST,
    port: 5432,
    database: 'socratiq_production',
    ssl: true,
  }
}

// Environment Detection
export const isProduction = import.meta.env.PROD
export const isDevelopment = import.meta.env.DEV

// API Base URL Selection
export const getApiBaseUrl = () => {
  if (isProduction) {
    return awsConfig.api.baseUrl
  }
  return 'http://localhost:3000' // React dev server
}

// AWS Service URLs
export const getS3Url = (key: string) => {
  return `https://${awsConfig.s3.bucket}.s3.${awsConfig.s3.region}.amazonaws.com/${key}`
}

export const getCognitoUrl = () => {
  return `https://cognito-idp.${awsConfig.cognito.region}.amazonaws.com/`
}