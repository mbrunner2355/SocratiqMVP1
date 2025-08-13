import { Router } from 'express';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import {
  insertPartnershipSchema,
  insertEmmeModuleSchema,
  insertLicensingAgreementSchema,
  insertCoDevelopmentProjectSchema,
  insertNewcoSpinoutSchema,
  insertPartnershipAnalyticsSchema,
  PartnershipTypes,
  PartnershipModels,
  EMMEModuleTypes,
  LicenseTypes,
  NewCoFundingStages
} from '@shared/schema';

const router = Router();

// =====================================
// SocratIQ EMME™ - Partnership Ecosystem API Routes
// =====================================

// Mock data stores for partnership ecosystem (in production, use database)
const mockPartnerships: any[] = [
  {
    id: "partnership_001",
    partnerName: "Mock5 Strategic Insights",
    partnerType: "STRATEGIC_LICENSING",
    partnershipModel: "BI_DIRECTIONAL_LICENSING",
    status: "active",
    industry: "Pharmaceutical Commercialization",
    region: "North America",
    contractStartDate: new Date("2025-01-01"),
    contractEndDate: new Date("2027-12-31"),
    renewalOptions: {
      automaticRenewal: true,
      renewalTerms: "2 years",
      notificationPeriod: "6 months"
    },
    partnershipTerms: {
      exclusivityLevel: "Non-exclusive",
      performanceThresholds: {
        minimumRevenue: 2500000,
        drugLaunchCount: 3,
        marketPenetration: 15,
        loePreparedness: 90
      },
      supportCommitments: "24/7 technical support with dedicated pharma specialists"
    },
    revenueModel: {
      type: "Revenue Share",
      socratiqShare: 60,
      partnerShare: 40,
      minimumGuarantee: 500000,
      costSavings: {
        competitiveIntelligence: 375000,
        unifiedModeling: 750000,
        integratedPositioning: 450000,
        strategicActionPlan: 750000
      }
    },
    intellectualProperty: {
      sharedIP: true,
      derivativeRights: "Joint ownership",
      improvementRights: "Shared with attribution",
      pharmaFrameworks: true
    },
    brandingRights: {
      cobranding: true,
      whiteLabel: true,
      poweredByRequired: false
    },
    supportLevel: "premium",
    partnerContact: {
      name: "Dr. Sarah Martinez",
      title: "VP Strategic Partnerships & Commercialization",
      email: "s.martinez@mock5.com",
      phone: "+1-555-0123"
    },
    socratiqContact: "partnership_mgr_001",
    performanceMetrics: {
      revenueGrowth: 125,
      drugLaunchesSupported: 8,
      averageTimeToMarket: -18,
      customerSatisfaction: 92,
      loePreparedness: 95
    },
    notes: "Flagship bi-directional partnership focused on pharmaceutical commercialization with EMME Connect™ deep competitive monitoring and LOE line of sight capabilities",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockEmmeModules: any[] = [
  {
    id: "emme_001",
    partnershipId: "partnership_001",
    moduleName: "EMME Connect™",
    moduleType: "COMMERCIALIZATION_PLANNING",
    moduleOwner: "LICENSED_IN",
    deploymentModel: "CORE_PLATFORM",
    version: "2.1.0",
    status: "production",
    capabilities: {
      lineOfSightLOE: true,
      deepCompetitiveMonitoring: true,
      unmetNeedsAssessment: true,
      marketAccessPolicyModeling: true,
      preBuiltGTMFrameworks: true,
      integratedEvidence: true,
      realWorldRelevance: true,
      maSuitorMapping: true,
      competitiveLandscape: true,
      pricingOptimization: true,
      riskAssessment: true,
      messagePrecision: true,
      segmentSpecificMessaging: true,
      contextAwareRecommendations: true,
      realTimeScenarioModeling: true,
      messageTestingValidation: true,
      riskDetection: true,
      biasDetection: true
    },
    targetMarkets: ["Pharmaceutical", "Biotech", "Medical Devices", "Life Sciences", "Oncology"],
    pricingModel: {
      tier: "Enterprise",
      basePricing: 10000,
      userPricing: 150,
      revenueShare: 40,
      costSavingsVsConsultants: {
        competitiveIntelligence: "$250K-$500K",
        unifiedModeling: "$500K-$1M",
        integratedPositioning: "$300K-$600K",
        strategicActionPlan: "$500K-$1M"
      }
    },
    integrationLevel: "CORE_PLATFORM",
    customizations: {
      lifeSciencesWorkflows: true,
      regulatoryCompliance: "FDA, EMA, HC, PMDA",
      drugDevelopmentPhases: true,
      loePreparation: true,
      competitorTracking: true,
      customReporting: true
    },
    deploymentConfig: {
      hosting: "SocratIQ Cloud",
      scalability: "Auto-scaling",
      redundancy: "Multi-region",
      security: "SOC2 Type II, HIPAA compliant"
    },
    brandingConfig: {
      logoPlacement: "Header",
      colorScheme: "Mock5 Brand Colors",
      customDomain: "emme.mock5.com",
      poweredByBranding: "Powered by SocratIQ EMME Connect™"
    },
    accessControls: {
      singleSignOn: true,
      roleBasedAccess: true,
      auditLogging: true,
      dataSegmentation: true
    },
    dataRequirements: {
      patientData: false,
      aggregatedHealthData: true,
      marketData: true,
      competitorData: true,
      regulatoryData: true,
      pricingData: true,
      payerData: true
    },
    complianceFrameworks: ["HIPAA", "GDPR", "SOC2", "FDA 21 CFR Part 11"],
    performanceTargets: {
      uptime: 99.9,
      responseTime: 200,
      userSatisfaction: 90,
      drugLaunchSuccess: 85,
      loeReadiness: 95
    },
    documentation: {
      userGuides: true,
      apiDocumentation: true,
      integrationGuides: true,
      pharmaPlaybooks: true,
      loeStrategies: true
    },
    isActive: true,
    launchDate: new Date("2025-01-15"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "emme_002",
    partnershipId: "partnership_001",
    moduleName: "EMME Engage™",
    moduleType: "GO_TO_MARKET_EXECUTION",
    moduleOwner: "PARTNER",
    deploymentModel: "WHITE_LABEL",
    version: "1.5.0",
    status: "production",
    capabilities: {
      segmentSpecificMessaging: true,
      tailoredContentStrategy: true,
      campaignManagement: true,
      leadGeneration: true,
      salesEnablement: true,
      customerEngagement: true,
      performanceTracking: true,
      messageTestingValidation: true,
      campaignStrengthValidation: true,
      realTimeCourseCorrective: true,
      payerEngagement: true,
      hcpTargeting: true
    },
    targetMarkets: ["Pharmaceutical Commercial", "Medical Affairs", "Payer Strategy", "Medical Education"],
    pricingModel: {
      tier: "Professional",
      basePricing: 5000,
      userPricing: 75,
      revenueShare: 35
    },
    integrationLevel: "BRANDED_DEPLOYMENT",
    customizations: {
      payerWorkflows: true,
      medicalAffairsTools: true,
      hcpPersonas: true,
      marketAccessTools: true
    },
    isActive: true,
    launchDate: new Date("2025-02-01"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "emme_003",
    partnershipId: "partnership_001", 
    moduleName: "EMME Health™",
    moduleType: "HEALTH_EQUITY_SPECIALIZATION",
    moduleOwner: "PARTNER",
    deploymentModel: "WHITE_LABEL",
    version: "1.0.0",
    status: "development",
    capabilities: {
      healthEquityAnalysis: true,
      disparityDetection: true,
      accessibilityAssessment: true,
      outcomeTracking: true,
      policyRecommendations: true,
      biasDetection: true,
      equityAwareness: true,
      populationHealthInsights: true,
      socialDeterminants: true,
      healthSystemOptimization: true
    },
    targetMarkets: ["Public Health", "Healthcare Systems", "Policy Organizations", "Pharmaceutical Health Equity"],
    pricingModel: {
      tier: "Impact",
      basePricing: 15000,
      userPricing: 200,
      revenueShare: 50
    },
    integrationLevel: "WHITE_LABEL",
    customizations: {
      equityFrameworks: true,
      populationAnalytics: true,
      policyModeling: true,
      outcomesPrediction: true
    },
    isActive: false,
    launchDate: new Date("2025-06-01"),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockLicensingAgreements: any[] = [
  {
    id: "license_001",
    partnershipId: "partnership_001",
    emmeModuleId: "emme_001",
    licenseType: "INBOUND_LICENSE",
    licensedAsset: "EMME Connect Commercialization Framework",
    assetType: "FRAMEWORK",
    licensor: "Mock5 Strategic Insights",
    licensee: "SocratIQ",
    exclusivity: "NON_EXCLUSIVE",
    territory: ["United States", "Canada", "European Union"],
    fieldOfUse: ["Healthcare Technology", "Medical Devices", "Digital Health"],
    licenseTerms: {
      duration: "3 years",
      renewalOptions: "Automatic with 6-month notice",
      sublicensingRights: true,
      modificationRights: "With approval"
    },
    royaltyStructure: {
      type: "Revenue Share",
      percentage: 15,
      minimumRoyalty: 50000,
      paymentSchedule: "Quarterly"
    },
    minimumCommitments: {
      annualRevenue: 250000,
      marketingSpend: 100000,
      userAcquisition: 500
    },
    reportingRequirements: {
      frequency: "Monthly",
      metricsRequired: ["Revenue", "Users", "Satisfaction"],
      auditRights: true
    },
    qualityStandards: {
      uptimeRequirement: 99.5,
      supportStandards: "24/7",
      securityCompliance: ["SOC2", "HIPAA"]
    },
    improvementRights: {
      collaborativeImprovement: true,
      shareDerivatives: true,
      jointIPOwnership: true
    },
    terminationConditions: {
      materialBreach: "30 days cure period",
      convenience: "12 months notice",
      immediateTermination: ["Insolvency", "Criminal activity"]
    },
    disputeResolution: "Binding arbitration",
    governingLaw: "Delaware",
    effectiveDate: new Date("2025-01-01"),
    expirationDate: new Date("2027-12-31"),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockCoDevelopmentProjects: any[] = [
  {
    id: "codev_001",
    partnershipId: "partnership_001",
    projectName: "EMME Health Equity Analytics Platform",
    projectType: "JOINT_PRODUCT",
    description: "Development of advanced health equity analytics platform combining SocratIQ's AI capabilities with Mock5's domain expertise",
    objectives: {
      primary: "Launch comprehensive health equity analytics platform",
      secondary: ["Achieve 90% accuracy in disparity detection", "Support 50+ health systems"],
      success: "1M+ population health records analyzed"
    },
    scope: {
      socratiqContributes: ["AI/ML infrastructure", "Data processing", "Platform integration"],
      mock5Contributes: ["Health equity expertise", "Domain knowledge", "Market access"],
      jointEfforts: ["Product design", "Quality assurance", "Go-to-market strategy"]
    },
    timeline: {
      totalDuration: "18 months",
      phase1: "Requirements & Design (3 months)",
      phase2: "Core Development (9 months)", 
      phase3: "Testing & Launch (6 months)"
    },
    resourceAllocation: {
      socratiqTeam: "8 engineers, 2 data scientists, 1 product manager",
      mock5Team: "3 domain experts, 2 clinicians, 1 business analyst",
      sharedResources: "Project management, QA testing"
    },
    ipOwnership: {
      coreAI: "SocratIQ",
      domainFrameworks: "Mock5",
      jointDevelopment: "Shared ownership"
    },
    riskAssessment: {
      technical: "Medium - Complex AI integration",
      market: "Low - Strong demand validated",
      regulatory: "Medium - Health data compliance"
    },
    governanceStructure: {
      steeringCommittee: "Monthly executive reviews",
      workingGroups: "Weekly technical syncs",
      escalationPath: "VP level → C-suite"
    },
    budgetAllocation: {
      totalBudget: 2500000,
      socratiqInvestment: 1500000,
      mock5Investment: 1000000,
      costSharing: "60/40 split"
    },
    deliverables: {
      software: "EMME Health platform",
      documentation: "User guides, technical docs",
      training: "Partner enablement program"
    },
    status: "active",
    progressPercentage: 35,
    startDate: new Date("2025-01-15"),
    endDate: new Date("2026-07-15"),
    projectManager: "pm_001",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockNewcoSpinouts: any[] = [];

// Mock data for partner customers and customer evolution
const mockPartnerCustomers: any[] = [
  {
    id: "partner_customer_001",
    partnershipId: "partnership_001",
    customerName: "Meridian Healthcare Systems",
    customerType: "HEALTHCARE_SYSTEM",
    customerCategory: "LARGE_ENTERPRISE",
    region: "North America",
    industry: "Healthcare",
    contractValue: 150000,
    contractStartDate: new Date("2024-06-01"),
    contractEndDate: new Date("2025-05-31"),
    servicesUsed: ["EMME Engage", "EMME Health"],
    customerContact: {
      name: "Dr. Jennifer Walsh",
      title: "Chief Medical Officer",
      email: "j.walsh@meridianhealthcare.com",
      phone: "+1-555-0187"
    },
    revenueShare: {
      mock5Share: 70,
      socratiqShare: 30
    },
    status: "active",
    satisfactionScore: 4.6,
    partnershipPotential: "HIGH",
    notes: "Potential candidate for strategic partnership evolution",
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date()
  }
];

const mockCustomerEvolutionTracking: any[] = [
  {
    id: "evolution_001",
    customerId: "customer_direct_001",
    partnerCustomerId: "partner_customer_001",
    evolutionStage: "PARTNERSHIP_EVALUATION",
    evolutionStartDate: new Date("2025-01-15"),
    currentStage: "PARTNERSHIP_NEGOTIATION",
    evolutionTriggers: [
      "High usage and satisfaction scores",
      "Request for white-label deployment",
      "Interest in co-development opportunities"
    ],
    partnershipProposal: {
      proposedPartnershipType: "DOMAIN_EXPERT",
      proposedRevenueModel: "REVENUE_SHARE",
      proposedEquityStake: 15,
      proposedModules: ["Build", "EMME Health"]
    },
    milestones: [
      {
        stage: "INITIAL_ENGAGEMENT",
        completedDate: "2024-06-01",
        notes: "Customer onboarded as direct SocratIQ customer"
      },
      {
        stage: "HIGH_VALUE_CUSTOMER", 
        completedDate: "2024-09-15",
        notes: "Achieved high usage and satisfaction thresholds"
      },
      {
        stage: "PARTNERSHIP_EVALUATION",
        completedDate: "2025-01-15",
        notes: "Formal partnership evaluation initiated"
      }
    ],
    projectedPartnershipValue: 2500000,
    riskAssessment: "Low - Strong relationship and proven success",
    nextSteps: [
      "Finalize partnership terms",
      "Develop joint go-to-market strategy",
      "Plan co-development roadmap"
    ],
    assignedPartnershipManager: "partnership_mgr_002",
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date()
  }
];

const mockPartnershipAnalytics: any[] = [
  {
    id: "analytics_001",
    partnershipId: "partnership_001",
    metricType: "REVENUE",
    metricName: "Monthly Recurring Revenue",
    metricValue: 125000,
    metricUnit: "USD",
    measurementPeriod: "MONTHLY",
    targetValue: 100000,
    previousValue: 115000,
    trendDirection: "UP",
    dataSource: "Partnership Revenue System",
    calculationMethod: "Sum of all active subscriptions",
    context: {
      growthRate: 8.7,
      newCustomers: 12,
      churnRate: 2.1
    },
    notes: "Strong growth driven by EMME Connect adoption",
    measuredAt: new Date(),
    createdAt: new Date()
  }
];

// Partnership Routes
router.get('/partnerships', async (req, res) => {
  try {
    const { partnerType, status, partnershipModel } = req.query;
    let partnerships = [...mockPartnerships];
    
    if (partnerType) partnerships = partnerships.filter(p => p.partnerType === partnerType);
    if (status) partnerships = partnerships.filter(p => p.status === status);
    if (partnershipModel) partnerships = partnerships.filter(p => p.partnershipModel === partnershipModel);

    res.json(partnerships);
  } catch (error) {
    console.error('Get partnerships error:', error);
    res.status(500).json({ error: 'Failed to retrieve partnerships' });
  }
});

router.get('/partnerships/:id', async (req, res) => {
  try {
    const partnership = mockPartnerships.find(p => p.id === req.params.id);
    if (!partnership) {
      return res.status(404).json({ error: 'Partnership not found' });
    }
    res.json(partnership);
  } catch (error) {
    console.error('Get partnership error:', error);
    res.status(500).json({ error: 'Failed to retrieve partnership' });
  }
});

router.post('/partnerships', async (req, res) => {
  try {
    const partnershipData = insertPartnershipSchema.parse(req.body);
    
    const partnership = {
      id: randomUUID(),
      ...partnershipData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockPartnerships.push(partnership);
    res.status(201).json({
      message: 'Partnership created successfully',
      partnership
    });
  } catch (error) {
    console.error('Create partnership error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid partnership data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create partnership' });
  }
});

// EMME Module Routes
router.get('/modules', async (req, res) => {
  try {
    const { moduleType, status, partnershipId } = req.query;
    let modules = [...mockEmmeModules];
    
    if (moduleType) modules = modules.filter(m => m.moduleType === moduleType);
    if (status) modules = modules.filter(m => m.status === status);
    if (partnershipId) modules = modules.filter(m => m.partnershipId === partnershipId);

    res.json(modules);
  } catch (error) {
    console.error('Get EMME modules error:', error);
    res.status(500).json({ error: 'Failed to retrieve EMME modules' });
  }
});

router.get('/modules/:id', async (req, res) => {
  try {
    const module = mockEmmeModules.find(m => m.id === req.params.id);
    if (!module) {
      return res.status(404).json({ error: 'EMME module not found' });
    }
    res.json(module);
  } catch (error) {
    console.error('Get EMME module error:', error);
    res.status(500).json({ error: 'Failed to retrieve EMME module' });
  }
});

router.post('/modules', async (req, res) => {
  try {
    const moduleData = insertEmmeModuleSchema.parse(req.body);
    
    const module = {
      id: randomUUID(),
      ...moduleData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockEmmeModules.push(module);
    res.status(201).json({
      message: 'EMME module created successfully',
      module
    });
  } catch (error) {
    console.error('Create EMME module error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid module data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create EMME module' });
  }
});

// Licensing Agreement Routes
router.get('/licensing', async (req, res) => {
  try {
    const { licenseType, partnershipId, isActive } = req.query;
    let agreements = [...mockLicensingAgreements];
    
    if (licenseType) agreements = agreements.filter(a => a.licenseType === licenseType);
    if (partnershipId) agreements = agreements.filter(a => a.partnershipId === partnershipId);
    if (isActive !== undefined) agreements = agreements.filter(a => a.isActive === (isActive === 'true'));

    res.json(agreements);
  } catch (error) {
    console.error('Get licensing agreements error:', error);
    res.status(500).json({ error: 'Failed to retrieve licensing agreements' });
  }
});

router.post('/licensing', async (req, res) => {
  try {
    const agreementData = insertLicensingAgreementSchema.parse(req.body);
    
    const agreement = {
      id: randomUUID(),
      ...agreementData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockLicensingAgreements.push(agreement);
    res.status(201).json({
      message: 'Licensing agreement created successfully',
      agreement
    });
  } catch (error) {
    console.error('Create licensing agreement error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid agreement data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create licensing agreement' });
  }
});

// Co-Development Project Routes
router.get('/co-development', async (req, res) => {
  try {
    const { status, partnershipId, projectType } = req.query;
    let projects = [...mockCoDevelopmentProjects];
    
    if (status) projects = projects.filter(p => p.status === status);
    if (partnershipId) projects = projects.filter(p => p.partnershipId === partnershipId);
    if (projectType) projects = projects.filter(p => p.projectType === projectType);

    res.json(projects);
  } catch (error) {
    console.error('Get co-development projects error:', error);
    res.status(500).json({ error: 'Failed to retrieve co-development projects' });
  }
});

router.post('/co-development', async (req, res) => {
  try {
    const projectData = insertCoDevelopmentProjectSchema.parse(req.body);
    
    const project = {
      id: randomUUID(),
      ...projectData,
      progressPercentage: 0,
      status: 'planning',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockCoDevelopmentProjects.push(project);
    res.status(201).json({
      message: 'Co-development project created successfully',
      project
    });
  } catch (error) {
    console.error('Create co-development project error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid project data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create co-development project' });
  }
});

// NewCo Spin-out Routes
router.get('/newco-spinouts', async (req, res) => {
  try {
    const { status, fundingStage, partnershipId } = req.query;
    let spinouts = [...mockNewcoSpinouts];
    
    if (status) spinouts = spinouts.filter(s => s.status === status);
    if (fundingStage) spinouts = spinouts.filter(s => s.fundingStage === fundingStage);
    if (partnershipId) spinouts = spinouts.filter(s => s.partnershipId === partnershipId);

    res.json(spinouts);
  } catch (error) {
    console.error('Get NewCo spinouts error:', error);
    res.status(500).json({ error: 'Failed to retrieve NewCo spinouts' });
  }
});

router.post('/newco-spinouts', async (req, res) => {
  try {
    const spinoutData = insertNewcoSpinoutSchema.parse(req.body);
    
    const spinout = {
      id: randomUUID(),
      ...spinoutData,
      status: 'planning',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockNewcoSpinouts.push(spinout);
    res.status(201).json({
      message: 'NewCo spinout created successfully',
      spinout
    });
  } catch (error) {
    console.error('Create NewCo spinout error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid spinout data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create NewCo spinout' });
  }
});

// Partner Customers Routes
router.get('/partner-customers', async (req, res) => {
  try {
    const { partnershipId, status, customerType } = req.query;
    let customers = [...mockPartnerCustomers];
    
    if (partnershipId) customers = customers.filter(c => c.partnershipId === partnershipId);
    if (status) customers = customers.filter(c => c.status === status);
    if (customerType) customers = customers.filter(c => c.customerType === customerType);

    res.json(customers);
  } catch (error) {
    console.error('Get partner customers error:', error);
    res.status(500).json({ error: 'Failed to retrieve partner customers' });
  }
});

// Customer Evolution Tracking Routes
router.get('/customer-evolution', async (req, res) => {
  try {
    const { evolutionStage, customerId } = req.query;
    let evolutions = [...mockCustomerEvolutionTracking];
    
    if (evolutionStage) evolutions = evolutions.filter(e => e.evolutionStage === evolutionStage);
    if (customerId) evolutions = evolutions.filter(e => e.customerId === customerId);

    res.json(evolutions);
  } catch (error) {
    console.error('Get customer evolution tracking error:', error);
    res.status(500).json({ error: 'Failed to retrieve customer evolution tracking' });
  }
});

// Partnership Analytics Routes
router.get('/analytics', async (req, res) => {
  try {
    const { metricType, partnershipId, measurementPeriod } = req.query;
    let analytics = [...mockPartnershipAnalytics];
    
    if (metricType) analytics = analytics.filter(a => a.metricType === metricType);
    if (partnershipId) analytics = analytics.filter(a => a.partnershipId === partnershipId);
    if (measurementPeriod) analytics = analytics.filter(a => a.measurementPeriod === measurementPeriod);

    res.json(analytics);
  } catch (error) {
    console.error('Get partnership analytics error:', error);
    res.status(500).json({ error: 'Failed to retrieve partnership analytics' });
  }
});

router.post('/analytics', async (req, res) => {
  try {
    const analyticsData = insertPartnershipAnalyticsSchema.parse(req.body);
    
    const analytics = {
      id: randomUUID(),
      ...analyticsData,
      measuredAt: new Date(),
      createdAt: new Date()
    };
    
    mockPartnershipAnalytics.push(analytics);
    res.status(201).json({
      message: 'Partnership analytics recorded successfully',
      analytics
    });
  } catch (error) {
    console.error('Create partnership analytics error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid analytics data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to record partnership analytics' });
  }
});

// Partnership Ecosystem Overview
router.get('/analytics/overview', async (req, res) => {
  try {
    const overview = {
      totalPartnerships: mockPartnerships.length,
      activePartnerships: mockPartnerships.filter(p => p.status === 'active').length,
      partnershipsByType: mockPartnerships.reduce((acc, p) => {
        acc[p.partnerType] = (acc[p.partnerType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      
      emmeModules: {
        total: mockEmmeModules.length,
        production: mockEmmeModules.filter(m => m.status === 'production').length,
        development: mockEmmeModules.filter(m => m.status === 'development').length,
        byType: mockEmmeModules.reduce((acc, m) => {
          acc[m.moduleType] = (acc[m.moduleType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      },
      
      licensing: {
        totalAgreements: mockLicensingAgreements.length,
        activeAgreements: mockLicensingAgreements.filter(a => a.isActive).length,
        inboundLicenses: mockLicensingAgreements.filter(a => a.licenseType === 'INBOUND_LICENSE').length,
        outboundLicenses: mockLicensingAgreements.filter(a => a.licenseType === 'OUTBOUND_LICENSE').length
      },
      
      coDevelopment: {
        totalProjects: mockCoDevelopmentProjects.length,
        activeProjects: mockCoDevelopmentProjects.filter(p => p.status === 'active').length,
        avgProgress: mockCoDevelopmentProjects.reduce((sum, p) => sum + (p.progressPercentage || 0), 0) / (mockCoDevelopmentProjects.length || 1)
      },
      
      newcoSpinouts: {
        total: mockNewcoSpinouts.length,
        byStage: mockNewcoSpinouts.reduce((acc, s) => {
          acc[s.fundingStage] = (acc[s.fundingStage] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      },
      
      partnerCustomers: {
        total: mockPartnerCustomers.length,
        active: mockPartnerCustomers.filter(c => c.status === 'active').length,
        highPotential: mockPartnerCustomers.filter(c => c.partnershipPotential === 'HIGH').length,
        avgContractValue: mockPartnerCustomers.reduce((sum, c) => sum + c.contractValue, 0) / (mockPartnerCustomers.length || 1)
      },
      
      customerEvolution: {
        totalTracked: mockCustomerEvolutionTracking.length,
        inNegotiation: mockCustomerEvolutionTracking.filter(e => e.currentStage === 'PARTNERSHIP_NEGOTIATION').length,
        avgProjectedValue: mockCustomerEvolutionTracking.reduce((sum, e) => sum + e.projectedPartnershipValue, 0) / (mockCustomerEvolutionTracking.length || 1)
      },
      
      revenueMetrics: {
        monthlyRecurringRevenue: 125000,
        revenueGrowthRate: 8.7,
        totalPartnerRevenue: 850000,
        avgRevenuePerPartner: 850000 / (mockPartnerships.filter(p => p.status === 'active').length || 1)
      }
    };

    res.json(overview);
  } catch (error) {
    console.error('Get partnership overview error:', error);
    res.status(500).json({ error: 'Failed to retrieve partnership overview' });
  }
});

// EMME Module Operations
router.post('/modules/:id/deploy', async (req, res) => {
  try {
    const { environment, configuration } = req.body;
    const module = mockEmmeModules.find(m => m.id === req.params.id);
    
    if (!module) {
      return res.status(404).json({ error: 'EMME module not found' });
    }

    const deployment = {
      id: randomUUID(),
      moduleId: req.params.id,
      environment,
      configuration,
      status: 'deploying',
      deployedAt: new Date(),
      endpoint: `https://${environment}.emme.socratiq.com/${module.moduleName.toLowerCase()}`
    };
    
    // Simulate deployment process
    setTimeout(() => {
      deployment.status = 'active';
    }, 3000);

    res.status(201).json({
      message: 'EMME module deployment initiated successfully',
      deployment
    });
  } catch (error) {
    console.error('Deploy EMME module error:', error);
    res.status(500).json({ error: 'Failed to deploy EMME module' });
  }
});

// Constants Routes
router.get('/constants/partnership-types', (req, res) => {
  res.json(Object.values(PartnershipTypes));
});

router.get('/constants/partnership-models', (req, res) => {
  res.json(Object.values(PartnershipModels));
});

router.get('/constants/module-types', (req, res) => {
  res.json(Object.values(EMMEModuleTypes));
});

router.get('/constants/license-types', (req, res) => {
  res.json(Object.values(LicenseTypes));
});

router.get('/constants/funding-stages', (req, res) => {
  res.json(Object.values(NewCoFundingStages));
});

// EMME AI Chat Endpoint - Powered by Claude on AWS Bedrock
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: "Message is required" });
    }

    const { claudeService } = await import('./services/claudeService');
    const systemPrompt = claudeService.getEmmeSystemPrompt();

    const claudeResponse = await claudeService.sendMessage(message, systemPrompt);

    res.json({
      id: Date.now().toString(),
      type: "assistant",
      content: claudeResponse.content,
      timestamp: new Date().toISOString(),
      confidence: claudeResponse.confidence
    });

  } catch (error) {
    console.error('EMME chat error:', error);
    
    // Fallback response if Claude is unavailable
    const fallbackResponse = "I'm EMME, your pharmaceutical intelligence agent for EMME Connect™. I specialize in market analysis, competitive intelligence, regulatory strategy, and commercial planning. I'm currently experiencing some technical difficulties, but I'm here to help with your pharmaceutical intelligence needs.";
    
    res.json({
      id: Date.now().toString(),
      type: "assistant",
      content: fallbackResponse,
      timestamp: new Date().toISOString(),
      confidence: 0.7
    });
  }
});

export default router;