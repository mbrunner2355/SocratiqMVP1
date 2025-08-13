# EMME Engage™ Multi-Tenant White-Label Architecture

## Overview

EMME Engage™ is a white-label Software-as-a-Service (SaaS) solution designed for mock5 to offer their pharmaceutical clients. We manage the application infrastructure while mock5 provides branded intelligence platforms to their customers.

## Architecture Components

### 1. Tenant Configuration System
- **File**: `shared/tenant-config.ts`
- **Purpose**: Defines tenant-specific branding, features, and limits
- **Features**: 
  - Custom branding (logos, colors, domains)
  - Feature toggles per tenant
  - Usage limits and quotas
  - Integration configurations (SSO, APIs)

### 2. Tenant Middleware
- **File**: `server/middleware/tenant.ts`
- **Purpose**: Identifies and loads tenant configuration from requests
- **Methods**: 
  - Domain-based tenant identification
  - Header-based tenant routing
  - Access control validation

### 3. Multi-Tenant API Layer
- **File**: `server/routes-tenant.ts`
- **Purpose**: Provides tenant-specific configuration and analytics
- **Endpoints**:
  - `/api/tenant/config` - Get tenant configuration
  - `/api/tenant/usage` - Get usage statistics
  - `/api/tenant/analytics` - Get tenant analytics
  - `/api/tenant/features` - Check feature availability

### 4. Client-Side Tenant Management
- **File**: `client/src/components/TenantProvider.tsx`
- **Purpose**: React context for tenant-aware components
- **Features**:
  - Dynamic styling based on tenant branding
  - Feature flag hooks
  - Tenant-specific configuration access

### 5. White-Label Interface
- **File**: `client/src/components/EMMEEngageWhiteLabel.tsx`
- **Purpose**: Branded interface for mock5's clients
- **Features**:
  - Tenant-specific branding and styling
  - Feature-based conditional rendering
  - Usage monitoring and analytics

## Business Model

### mock5 Partnership
- **Role**: Service provider and customer acquisition
- **Responsibilities**: 
  - Customer relationships and sales
  - Brand customization requirements
  - Feature specifications
  - Support escalation

### Our Platform Role
- **Role**: Technology provider and infrastructure manager
- **Responsibilities**:
  - Application development and maintenance
  - Infrastructure scaling and security
  - Feature development and deployment
  - Technical support and monitoring

## Tenant Configuration Examples

### mock5 Internal Platform
```typescript
{
  tenantId: "mock5",
  tenantName: "mock5 Strategic Intelligence",
  brandName: "Strategic Intelligence Platform",
  primaryColor: "#2563eb",
  features: [
    "project_management",
    "partnership_analytics",
    "market_intelligence",
    "regulatory_insights"
  ]
}
```

### Client Platform (PharmaX)
```typescript
{
  tenantId: "mock5_pharmax",
  tenantName: "PharmaX Intelligence Platform",
  brandName: "PharmaX Strategic Intelligence",
  primaryColor: "#059669",
  features: [
    "project_management",
    "document_intelligence",
    "regulatory_tracking",
    "market_analysis"
  ]
}
```

## Deployment Strategy

### Single Application, Multiple Tenants
- One codebase serves all tenants
- Domain-based tenant routing
- Shared infrastructure with isolated data
- Tenant-specific customization at runtime

### Scaling Considerations
- Horizontal scaling with load balancing
- Database sharding by tenant
- CDN for tenant-specific assets
- Monitoring per tenant usage patterns

## Security & Isolation

### Data Isolation
- Tenant-prefixed database schemas
- Row-level security policies
- API access restrictions by tenant

### Authentication
- Tenant-specific SSO configurations
- Multi-tenant session management
- Role-based access control per tenant

### Compliance
- Tenant-specific audit trails
- Regulatory compliance per tenant requirements
- Data residency controls

## Feature Management

### Feature Flags
- Tenant-specific feature enablement
- A/B testing capabilities
- Gradual feature rollouts
- Usage-based feature access

### Customization Levels
1. **Branding**: Colors, logos, domains
2. **Features**: Module enablement/disabling
3. **Integrations**: SSO, API configurations
4. **Limits**: Usage quotas and restrictions
5. **UI**: Layout and workflow customization

## Monitoring & Analytics

### Tenant Metrics
- Usage statistics per tenant
- Feature adoption rates
- Performance metrics by tenant
- Cost attribution and billing

### Business Intelligence
- Tenant growth and churn analysis
- Feature usage patterns
- Support ticket categorization
- Revenue attribution by tenant

## Future Enhancements

### Planned Features
- Self-service tenant onboarding
- Advanced customization options
- Marketplace for third-party integrations
- White-label mobile applications
- Multi-language support per tenant

### Scalability Improvements
- Microservices architecture
- Container orchestration
- Multi-region deployments
- Edge computing for performance