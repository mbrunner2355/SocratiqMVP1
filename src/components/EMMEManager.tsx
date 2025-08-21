import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Handshake,
  Plus, 
  Building2,
  FileText,
  GitBranch,
  TrendingUp,
  Search,
  Users,
  Globe,
  DollarSign,
  Target,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Activity,
  BarChart3,
  Zap,
  Package,
  Settings,
  Code,
  Brain,
  Lightbulb
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface Partnership {
  id: string;
  partnerName: string;
  partnerType: string;
  partnershipModel: string;
  status: string;
  industry: string;
  region: string;
  contractStartDate: string;
  contractEndDate: string;
  renewalOptions: any;
  partnershipTerms: any;
  revenueModel: any;
  intellectualProperty: any;
  brandingRights: any;
  supportLevel: string;
  partnerContact: any;
  socratiqContact: string;
  performanceMetrics: any;
  notes: string;
  createdAt: string;
}

interface EmmeModule {
  id: string;
  partnershipId: string;
  moduleName: string;
  moduleType: string;
  version: string;
  status: string;
  capabilities: any;
  targetMarkets: string[];
  pricingModel: any;
  integrationLevel: string;
  customizations: any;
  deploymentConfig: any;
  brandingConfig: any;
  accessControls: any;
  dataRequirements: any;
  complianceFrameworks: string[];
  performanceTargets: any;
  documentation: any;
  isActive: boolean;
  launchDate: string;
  createdAt: string;
}

interface LicensingAgreement {
  id: string;
  partnershipId: string;
  emmeModuleId: string;
  licenseType: string;
  licensedAsset: string;
  assetType: string;
  licensor: string;
  licensee: string;
  exclusivity: string;
  territory: string[];
  fieldOfUse: string[];
  licenseTerms: any;
  royaltyStructure: any;
  minimumCommitments: any;
  reportingRequirements: any;
  qualityStandards: any;
  improvementRights: any;
  terminationConditions: any;
  disputeResolution: string;
  governingLaw: string;
  effectiveDate: string;
  expirationDate: string;
  isActive: boolean;
  createdAt: string;
}

interface CoDevelopmentProject {
  id: string;
  partnershipId: string;
  projectName: string;
  projectType: string;
  description: string;
  objectives: any;
  scope: any;
  timeline: any;
  resourceAllocation: any;
  ipOwnership: any;
  riskAssessment: any;
  governanceStructure: any;
  budgetAllocation: any;
  deliverables: any;
  status: string;
  progressPercentage: number;
  startDate: string;
  endDate: string;
  projectManager: string;
  createdAt: string;
}

interface NewcoSpinout {
  id: string;
  partnershipId: string;
  companyName: string;
  businessModel: string;
  fundingStage: string;
  totalFunding: number;
  socratiqEquity: number;
  partnerEquity: number;
  keyPersonnel: any;
  targetMarket: string;
  products: any;
  intellectualProperty: any;
  financialProjections: any;
  fundingHistory: any;
  boardComposition: any;
  exitStrategy: any;
  status: string;
  createdAt: string;
}

export function EMMEManager() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Fetch data
  const { data: partnerships, isLoading: partnershipsLoading } = useQuery<Partnership[]>({
    queryKey: ['/api/emme/partnerships'],
  });

  const { data: modules } = useQuery<EmmeModule[]>({
    queryKey: ['/api/emme/modules'],
  });

  const { data: licensing } = useQuery<LicensingAgreement[]>({
    queryKey: ['/api/emme/licensing'],
  });

  const { data: coDevelopment } = useQuery<CoDevelopmentProject[]>({
    queryKey: ['/api/emme/co-development'],
  });

  const { data: newcoSpinouts } = useQuery<NewcoSpinout[]>({
    queryKey: ['/api/emme/newco-spinouts'],
  });

  const { data: analytics } = useQuery({
    queryKey: ['/api/emme/analytics/overview'],
  });

  // Create partnership mutation
  const createPartnershipMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/emme/partnerships', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emme/partnerships'] });
      queryClient.invalidateQueries({ queryKey: ['/api/emme/analytics/overview'] });
    }
  });

  // Create module mutation
  const createModuleMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/emme/modules', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emme/modules'] });
      queryClient.invalidateQueries({ queryKey: ['/api/emme/analytics/overview'] });
    }
  });

  // Create licensing agreement mutation
  const createLicensingMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/emme/licensing', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emme/licensing'] });
      queryClient.invalidateQueries({ queryKey: ['/api/emme/analytics/overview'] });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': 
      case 'completed':
      case 'production': return 'bg-green-100 text-green-800';
      case 'pending':
      case 'development':
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
      case 'on_hold': return 'bg-orange-100 text-orange-800';
      case 'terminated':
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPartnershipTypeColor = (type: string) => {
    switch (type) {
      case 'STRATEGIC_LICENSING': return 'bg-blue-100 text-blue-800';
      case 'CO_DEVELOPMENT': return 'bg-green-100 text-green-800';
      case 'CHANNEL_PARTNER': return 'bg-purple-100 text-purple-800';
      case 'DOMAIN_EXPERT': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModuleTypeColor = (type: string) => {
    switch (type) {
      case 'COMMERCIALIZATION_PLANNING': return 'bg-blue-100 text-blue-800';
      case 'GO_TO_MARKET_EXECUTION': return 'bg-green-100 text-green-800';
      case 'HEALTH_EQUITY_SPECIALIZATION': return 'bg-purple-100 text-purple-800';
      case 'DOMAIN_SPECIALIZATION': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreatePartnership = () => {
    createPartnershipMutation.mutate({
      partnerName: 'Strategic Innovation Partners',
      partnerType: 'STRATEGIC_LICENSING',
      partnershipModel: 'BI_DIRECTIONAL_LICENSING',
      status: 'active',
      industry: 'Pharmaceutical Commercialization',
      region: 'North America',
      contractStartDate: new Date(),
      contractEndDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000), // 3 years
      renewalOptions: {
        automaticRenewal: true,
        renewalTerms: '2 years',
        notificationPeriod: '6 months'
      },
      partnershipTerms: {
        exclusivityLevel: 'Non-exclusive',
        performanceThresholds: {
          minimumRevenue: 1500000,
          drugLaunchCount: 2,
          marketPenetration: 12,
          loePreparedness: 90
        },
        supportCommitments: '24/7 technical support with pharma specialists'
      },
      revenueModel: {
        type: 'Revenue Share',
        socratiqShare: 65,
        partnerShare: 35,
        minimumGuarantee: 250000,
        consultantCostSavings: {
          competitiveIntelligence: 375000,
          unifiedModeling: 750000,
          integratedPositioning: 450000,
          strategicActionPlan: 750000
        }
      },
      intellectualProperty: {
        sharedIP: true,
        derivativeRights: 'Joint ownership',
        improvementRights: 'Shared with attribution',
        pharmaFrameworks: true
      },
      brandingRights: {
        cobranding: true,
        whiteLabel: false,
        poweredByRequired: true
      },
      supportLevel: 'standard',
      partnerContact: {
        name: 'Dr. Emily Watson',
        title: 'VP of Commercial Strategy',
        email: 'e.watson@strategicinnovation.com',
        phone: '+1-555-0199'
      },
      socratiqContact: 'partnership_mgr_002',
      performanceMetrics: {
        revenueGrowth: 0,
        drugLaunchesSupported: 0,
        averageTimeToMarket: 0,
        customerSatisfaction: 0,
        loePreparedness: 0
      },
      notes: 'New strategic partnership for pharmaceutical commercialization with EMME Connect™ deep competitive monitoring and LOE preparation'
    });
  };

  const handleCreateModule = () => {
    createModuleMutation.mutate({
      partnershipId: partnerships?.[0]?.id || 'partnership_001',
      moduleName: 'EMME Connect™ Advanced',
      moduleType: 'COMMERCIALIZATION_PLANNING',
      version: '1.0.0',
      status: 'development',
      capabilities: {
        lineOfSightLOE: true,
        deepCompetitiveMonitoring: true,
        unmetNeedsAssessment: true,
        marketAccessPolicyModeling: true,
        preBuiltGTMFrameworks: true,
        integratedEvidence: true,
        realWorldRelevance: true,
        maSuitorMapping: true,
        predictiveModeling: true,
        complianceTracking: true,
        reportGeneration: true
      },
      targetMarkets: ['Pharmaceutical', 'Biotech', 'Life Sciences', 'Oncology', 'Rare Disease'],
      pricingModel: {
        tier: 'Professional',
        basePricing: 7500,
        userPricing: 100,
        revenueShare: 40,
        costSavingsVsConsultants: {
          competitiveIntelligence: "$250K-$500K",
          unifiedModeling: "$500K-$1M"
        }
      },
      integrationLevel: 'BRANDED_DEPLOYMENT',
      customizations: {
        pharmaWorkflows: true,
        regulatoryCompliance: 'FDA, EMA, HC, PMDA',
        loePreparation: true,
        competitorTracking: true,
        customReporting: true
      },
      deploymentConfig: {
        hosting: 'SocratIQ Cloud',
        scalability: 'Auto-scaling',
        redundancy: 'Multi-region',
        security: 'SOC2 Type II compliant'
      },
      brandingConfig: {
        logoPlacement: 'Header',
        colorScheme: 'Partner Brand Colors',
        customDomain: 'emme.partner.com',
        poweredByBranding: 'Powered by SocratIQ EMME Connect™'
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
      complianceFrameworks: ['HIPAA', 'GDPR', 'SOC2', 'FDA 21 CFR Part 11'],
      performanceTargets: {
        uptime: 99.9,
        responseTime: 150,
        userSatisfaction: 95,
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
      isActive: false,
      launchDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
    });
  };

  const handleCreateLicensing = () => {
    createLicensingMutation.mutate({
      partnershipId: partnerships?.[0]?.id || 'partnership_001',
      emmeModuleId: modules?.[0]?.id || 'emme_001',
      licenseType: 'OUTBOUND_LICENSE',
      licensedAsset: 'EMME Connect™ Pharmaceutical Commercialization Framework',
      assetType: 'FRAMEWORK',
      licensor: 'SocratIQ',
      licensee: 'Strategic Innovation Partners',
      exclusivity: 'NON_EXCLUSIVE',
      territory: ['United States', 'Canada', 'European Union'],
      fieldOfUse: ['Pharmaceutical Commercialization', 'Drug Launch Strategy', 'Competitive Intelligence', 'LOE Preparation'],
      licenseTerms: {
        duration: '3 years',
        renewalOptions: 'Automatic with 6-month notice',
        sublicensingRights: false,
        modificationRights: 'With approval',
        pharmaSpecific: true
      },
      royaltyStructure: {
        type: 'Revenue Share',
        percentage: 12,
        minimumRoyalty: 125000,
        paymentSchedule: 'Quarterly',
        costSavingsBased: true
      },
      minimumCommitments: {
        annualRevenue: 750000,
        marketingSpend: 250000,
        drugLaunches: 2,
        userAcquisition: 100
      },
      reportingRequirements: {
        frequency: 'Monthly',
        metricsRequired: ['Revenue', 'Drug Launches', 'LOE Preparedness', 'Competitive Intelligence Usage', 'Satisfaction'],
        auditRights: true
      },
      qualityStandards: {
        uptimeRequirement: 99.5,
        supportStandards: '24/7 with pharma specialists',
        securityCompliance: ['SOC2', 'ISO27001', 'HIPAA'],
        dataIntegrity: 'FDA 21 CFR Part 11'
      },
      improvementRights: {
        collaborativeImprovement: true,
        shareDerivatives: true,
        jointIPOwnership: false,
        pharmaEnhancements: true
      },
      terminationConditions: {
        materialBreach: '30 days cure period',
        convenience: '12 months notice',
        immediateTermination: ['Insolvency', 'Criminal activity', 'Regulatory violation']
      },
      disputeResolution: 'Binding arbitration',
      governingLaw: 'Delaware',
      effectiveDate: new Date(),
      expirationDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000), // 3 years
      isActive: true
    });
  };

  if (partnershipsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading EMME Connect™ Partnership Ecosystem...</p>
        </div>
      </div>
    );
  }

  const filteredPartnerships = partnerships?.filter(partnership =>
    partnership.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partnership.partnerType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partnership.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SocratIQ EMME Connect™ - Pharmaceutical Partnership Ecosystem</h1>
          <p className="text-muted-foreground">
            Bi-directional licensing and co-development platform for pharmaceutical commercialization partnerships
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search partnerships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Button onClick={handleCreatePartnership} disabled={createPartnershipMutation.isPending}>
            <Plus className="h-4 w-4 mr-2" />
            New Partnership
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
          <TabsTrigger value="modules">EMME Connect Modules</TabsTrigger>
          <TabsTrigger value="licensing">Licensing</TabsTrigger>
          <TabsTrigger value="co-development">Co-Development</TabsTrigger>
          <TabsTrigger value="newco">NewCo Spinouts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Analytics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Partnerships</CardTitle>
                <Handshake className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(analytics as any)?.activePartnerships || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {(analytics as any)?.totalPartnerships || 0} total partnerships
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">EMME Connect Modules</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(analytics as any)?.emmeModules?.production || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {(analytics as any)?.emmeModules?.total || 0} total modules
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Licensing Agreements</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(analytics as any)?.licensing?.activeAgreements || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {(analytics as any)?.licensing?.totalAgreements || 0} total agreements
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${((analytics as any)?.revenueMetrics?.monthlyRecurringRevenue || 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{((analytics as any)?.revenueMetrics?.revenueGrowthRate || 0).toFixed(1)}% growth
                </p>
              </CardContent>
            </Card>
          </div>

          {/* EMME™ Components */}
          <Card>
            <CardHeader>
              <CardTitle>EMME Connect™ Pharmaceutical Partnership Ecosystem</CardTitle>
              <CardDescription>Bi-directional licensing and co-development framework for pharmaceutical commercialization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Handshake className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Pharma Partnerships</p>
                    <p className="text-sm text-muted-foreground">
                      Strategic pharma commercialization partnerships
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Package className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">EMME Connect™</p>
                    <p className="text-sm text-muted-foreground">
                      Deep competitive monitoring & LOE preparation
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Licensing Framework</p>
                    <p className="text-sm text-muted-foreground">
                      Pharmaceutical IP & framework licensing
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Building2 className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium">NewCo Spin-outs</p>
                    <p className="text-sm text-muted-foreground">
                      Pharma-focused company creation
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Partnerships */}
          {partnerships && partnerships.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Partnerships</CardTitle>
                <CardDescription>Latest strategic partnerships and collaborations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {partnerships.slice(0, 5).map((partnership) => (
                    <div key={partnership.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge className={getPartnershipTypeColor(partnership.partnerType)}>
                          {partnership.partnerType.replace('_', ' ')}
                        </Badge>
                        <div>
                          <p className="font-medium text-sm">{partnership.partnerName}</p>
                          <p className="text-xs text-muted-foreground">
                            {partnership.industry} • {partnership.region}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <Badge className={getStatusColor(partnership.status)}>
                          {partnership.status}
                        </Badge>
                        <p className="text-muted-foreground mt-1">
                          {new Date(partnership.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="partnerships">
          <Card>
            <CardHeader>
              <CardTitle>Strategic Partnerships</CardTitle>
              <CardDescription>Manage bi-directional licensing and co-development partnerships</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPartnerships && filteredPartnerships.length > 0 ? (
                <div className="space-y-4">
                  {filteredPartnerships.map((partnership) => (
                    <Card key={partnership.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Handshake className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium">{partnership.partnerName}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={getPartnershipTypeColor(partnership.partnerType)}>
                                  {partnership.partnerType.replace('_', ' ')}
                                </Badge>
                                <Badge variant="outline">{partnership.partnershipModel.replace('_', ' ')}</Badge>
                                <Badge variant="outline">{partnership.industry}</Badge>
                                <span className="text-sm text-muted-foreground">
                                  {partnership.region}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Revenue Share: {partnership.revenueModel?.socratiqShare || 0}%/{partnership.revenueModel?.partnerShare || 0}%
                                • Support: {partnership.supportLevel}
                              </p>
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <Badge className={getStatusColor(partnership.status)}>
                              {partnership.status}
                            </Badge>
                            <p className="text-muted-foreground mt-1">
                              {new Date(partnership.contractStartDate).toLocaleDateString()} - {new Date(partnership.contractEndDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Handshake className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No partnerships found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'Try adjusting your search terms' : 'Create your first strategic partnership'}
                  </p>
                  {!searchTerm && (
                    <Button onClick={handleCreatePartnership}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Partnership
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules">
          <Card>
            <CardHeader>
              <CardTitle>EMME Connect Modules</CardTitle>
              <CardDescription>Specialized partnership modules for different domains and use cases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium">Active Modules</h3>
                  <p className="text-sm text-muted-foreground">Deploy and manage EMME Connect modules for partners</p>
                </div>
                <Button onClick={handleCreateModule} disabled={createModuleMutation.isPending}>
                  <Package className="h-4 w-4 mr-2" />
                  Deploy Module
                </Button>
              </div>
              {modules && modules.length > 0 ? (
                <div className="space-y-4">
                  {modules.slice(0, 10).map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Package className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium">{module.moduleName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getModuleTypeColor(module.moduleType)}>
                              {module.moduleType.replace('_', ' ')}
                            </Badge>
                            <Badge className={getStatusColor(module.status)}>
                              {module.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              v{module.version}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Markets: {module.targetMarkets?.slice(0, 2).join(', ')}
                            {module.targetMarkets?.length > 2 && ` +${module.targetMarkets.length - 2} more`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <Badge variant={module.isActive ? "default" : "secondary"}>
                          {module.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <p className="text-muted-foreground mt-1">
                          Launch: {new Date(module.launchDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No EMME Connect modules found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="licensing">
          <Card>
            <CardHeader>
              <CardTitle>Licensing Agreements</CardTitle>
              <CardDescription>Bi-directional intellectual property licensing framework</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium">Active Agreements</h3>
                  <p className="text-sm text-muted-foreground">Manage inbound and outbound licenses</p>
                </div>
                <Button onClick={handleCreateLicensing} disabled={createLicensingMutation.isPending}>
                  <FileText className="h-4 w-4 mr-2" />
                  New Agreement
                </Button>
              </div>
              {licensing && licensing.length > 0 ? (
                <div className="space-y-4">
                  {licensing.slice(0, 10).map((agreement) => (
                    <div key={agreement.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="font-medium">{agreement.licensedAsset}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{agreement.licenseType.replace('_', ' ')}</Badge>
                            <Badge variant="outline">{agreement.exclusivity.replace('_', ' ')}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {agreement.licensor} → {agreement.licensee}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Royalty: {agreement.royaltyStructure?.percentage}% • Territory: {agreement.territory?.slice(0, 2).join(', ')}
                            {agreement.territory?.length > 2 && ` +${agreement.territory.length - 2}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <Badge className={getStatusColor(agreement.isActive ? 'active' : 'inactive')}>
                          {agreement.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <p className="text-muted-foreground mt-1">
                          Expires: {new Date(agreement.expirationDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No licensing agreements found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="co-development">
          <Card>
            <CardHeader>
              <CardTitle>Co-Development Projects</CardTitle>
              <CardDescription>Joint development initiatives with strategic partners</CardDescription>
            </CardHeader>
            <CardContent>
              {coDevelopment && coDevelopment.length > 0 ? (
                <div className="space-y-4">
                  {coDevelopment.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <GitBranch className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="font-medium">{project.projectName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{project.projectType.replace('_', ' ')}</Badge>
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {project.progressPercentage}% complete
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Budget: ${project.budgetAllocation?.totalBudget?.toLocaleString()} • 
                            Duration: {project.timeline?.totalDuration}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground">
                          {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No co-development projects found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="newco">
          <Card>
            <CardHeader>
              <CardTitle>NewCo Spin-outs</CardTitle>
              <CardDescription>Partner company spin-outs and investment vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              {newcoSpinouts && newcoSpinouts.length > 0 ? (
                <div className="space-y-4">
                  {newcoSpinouts.map((spinout) => (
                    <div key={spinout.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Building2 className="h-4 w-4 text-orange-600" />
                        <div>
                          <p className="font-medium">{spinout.companyName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{spinout.businessModel.replace('_', ' ')}</Badge>
                            <Badge variant="outline">{spinout.fundingStage.replace('_', ' ')}</Badge>
                            <span className="text-sm text-muted-foreground">
                              SocratIQ: {spinout.socratiqEquity}% • Partner: {spinout.partnerEquity}%
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Funding: ${spinout.totalFunding?.toLocaleString()} • Market: {spinout.targetMarket}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <Badge className={getStatusColor(spinout.status)}>
                          {spinout.status}
                        </Badge>
                        <p className="text-muted-foreground mt-1">
                          {new Date(spinout.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No NewCo spin-outs found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Partnership Analytics</CardTitle>
              <CardDescription>Performance metrics and partnership insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Revenue Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      ${((analytics as any)?.revenueMetrics?.totalPartnerRevenue || 0).toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">Total partner revenue</p>
                    <div className="mt-2">
                      <p className="text-sm">
                        Monthly Recurring: ${((analytics as any)?.revenueMetrics?.monthlyRecurringRevenue || 0).toLocaleString()}
                      </p>
                      <p className="text-sm">
                        Growth Rate: +{((analytics as any)?.revenueMetrics?.revenueGrowthRate || 0).toFixed(1)}%
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Partnership Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries((analytics as any)?.partnershipsByType || {}).map(([type, count]) => (
                        <div key={type} className="flex justify-between">
                          <span className="text-sm">{type.replace('_', ' ')}</span>
                          <span className="text-sm font-medium">{count as number}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Module Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Production Modules</span>
                        <span className="text-sm font-medium">{(analytics as any)?.emmeModules?.production || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Development Modules</span>
                        <span className="text-sm font-medium">{(analytics as any)?.emmeModules?.development || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Average Revenue per Partner</span>
                        <span className="text-sm font-medium">
                          ${((analytics as any)?.revenueMetrics?.avgRevenuePerPartner || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}