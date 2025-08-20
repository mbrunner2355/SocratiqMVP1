import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Globe, 
  Building, 
  FileText, 
  Star, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Download,
  Bookmark,
  Eye,
  Zap,
  Shield,
  Target,
  Database
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface FederalPatent {
  id: string;
  title: string;
  patentNumber: string;
  agency: string;
  inventors: string[];
  filed: string;
  status: string;
  abstract: string;
  therapeuticArea: string;
  relevanceScore: number;
  licensingStatus: string;
  estimatedValue: string;
  contactInfo: {
    office: string;
    email: string;
    phone: string;
  };
  keywords: string[];
}

interface FederalAgency {
  id: string;
  name: string;
  acronym: string;
  technologyOffice: string;
  status: string;
  totalPatents: number;
  availablePatents: number;
  partnerships: number;
  focusAreas: string[];
}

interface SearchFilters {
  agency?: string;
  therapeuticArea?: string;
  status?: string;
  relevanceThreshold?: number;
  filedAfter?: string;
}

export function FedScoutManager() {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [selectedPatent, setSelectedPatent] = useState<FederalPatent | null>(null);
  const queryClient = useQueryClient();

  // Fetch federal laboratories
  const { data: laboratoriesData, isLoading: labsLoading } = useQuery({
    queryKey: ['/api/fedscout/laboratories'],
  });

  // Fetch federal patents
  const { data: patentsData, isLoading: patentsLoading } = useQuery({
    queryKey: ['/api/fedscout/patents', searchTerm, filters],
  });

  // Fetch opportunities
  const { data: opportunitiesData, isLoading: opportunitiesLoading } = useQuery({
    queryKey: ['/api/fedscout/opportunities'],
  });

  // Fetch analytics dashboard
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/fedscout/analytics/dashboard'],
  });

  // Mock data for demonstration - in production, these would come from federal APIs
  const mockPatents: FederalPatent[] = [
    {
      id: 'nih_001',
      title: 'Novel CAR-T Cell Enhancement Method for Solid Tumors',
      patentNumber: 'US11,234,567',
      agency: 'NIH/NCI',
      inventors: ['Dr. Sarah Chen', 'Dr. Michael Rodriguez'],
      filed: '2023-03-15',
      status: 'Available',
      abstract: 'A breakthrough method for enhancing CAR-T cell persistence and efficacy in solid tumor microenvironments through engineered cytokine circuits.',
      therapeuticArea: 'Oncology',
      relevanceScore: 0.92,
      licensingStatus: 'Exclusive Available',
      estimatedValue: '$5-15M',
      contactInfo: {
        office: 'NIH Office of Technology Transfer',
        email: 'techtransfer@nih.gov',
        phone: '(301) 496-7057'
      },
      keywords: ['CAR-T', 'Immunotherapy', 'Solid Tumors', 'Cytokine Engineering']
    },
    {
      id: 'fda_002',
      title: 'AI-Driven Drug Repurposing Platform for Rare Diseases',
      patentNumber: 'US11,345,678',
      agency: 'FDA',
      inventors: ['Dr. Jennifer Wu', 'Dr. David Kim'],
      filed: '2022-11-08',
      status: 'Licensed',
      abstract: 'Machine learning platform that identifies repurposing opportunities for approved drugs in rare disease indications.',
      therapeuticArea: 'Rare Diseases',
      relevanceScore: 0.87,
      licensingStatus: 'Non-Exclusive Available',
      estimatedValue: '$2-8M',
      contactInfo: {
        office: 'FDA Technology Transfer Program',
        email: 'techtransfer@fda.hhs.gov',
        phone: '(240) 402-5870'
      },
      keywords: ['Drug Repurposing', 'AI/ML', 'Rare Diseases', '505(b)(2)']
    },
    {
      id: 'darpa_003',
      title: 'Rapid Biomarker Discovery Platform Using Quantum Sensors',
      patentNumber: 'US11,456,789',
      agency: 'DARPA',
      inventors: ['Dr. Lisa Park', 'Dr. James Chen'],
      filed: '2023-07-22',
      status: 'Restricted',
      abstract: 'Quantum sensor technology for ultra-sensitive biomarker detection and validation in early-stage drug development.',
      therapeuticArea: 'Diagnostics',
      relevanceScore: 0.78,
      licensingStatus: 'Government Use Only',
      estimatedValue: 'Classified',
      contactInfo: {
        office: 'DARPA Technology Transition',
        email: 'technology@darpa.mil',
        phone: '(703) 526-6630'
      },
      keywords: ['Quantum Sensors', 'Biomarkers', 'Diagnostics', 'Early Detection']
    }
  ];

  const mockAgencies: FederalAgency[] = [
    {
      id: 'nih',
      name: 'National Institutes of Health',
      acronym: 'NIH',
      technologyOffice: 'NIH Office of Technology Transfer',
      status: 'Connected',
      totalPatents: 1247,
      availablePatents: 423,
      partnerships: 156,
      focusAreas: ['Oncology', 'Neurology', 'Immunology', 'Gene Therapy']
    },
    {
      id: 'fda',
      name: 'Food and Drug Administration',
      acronym: 'FDA',
      technologyOffice: 'FDA Technology Transfer Program',
      status: 'Connected',
      totalPatents: 567,
      availablePatents: 89,
      partnerships: 78,
      focusAreas: ['Drug Development', 'Medical Devices', 'Regulatory Science']
    },
    {
      id: 'darpa',
      name: 'Defense Advanced Research Projects Agency',
      acronym: 'DARPA',
      technologyOffice: 'DARPA Technology Transition',
      status: 'Limited Access',
      totalPatents: 892,
      availablePatents: 23,
      partnerships: 45,
      focusAreas: ['Biotechnology', 'Advanced Materials', 'Quantum Technologies']
    }
  ];

  const filteredPatents = mockPatents.filter(patent => {
    if (searchTerm && !patent.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !patent.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    if (filters.agency && patent.agency !== filters.agency) return false;
    if (filters.therapeuticArea && patent.therapeuticArea !== filters.therapeuticArea) return false;
    if (filters.status && patent.status !== filters.status) return false;
    if (filters.relevanceThreshold && patent.relevanceScore < filters.relevanceThreshold) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Licensed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Restricted':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAgencyStatusColor = (status: string) => {
    switch (status) {
      case 'Connected':
        return 'bg-green-100 text-green-800';
      case 'Limited Access':
        return 'bg-yellow-100 text-yellow-800';
      case 'Disconnected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">FedScout™</h1>
          <p className="text-muted-foreground">
            AI-Powered Federal Lab Technology Discovery for Life Sciences Innovation
          </p>
          <p className="text-sm text-blue-600 mt-1">
            Scanning 300+ Federal Laboratories • Life Sciences Focus • Cross-Domain Applications
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Bookmark className="h-4 w-4 mr-2" />
            Saved Searches
          </Button>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Federal Labs Connected</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.overview?.connectedLabs || '12'}</div>
            <p className="text-xs text-muted-foreground">of 300+ federal labs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Life Sciences Patents</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.overview?.availablePatents || '1,247'}</div>
            <p className="text-xs text-muted-foreground">available for licensing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High-Value Matches</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.overview?.highRelevanceMatches || '47'}</div>
            <p className="text-xs text-muted-foreground">above 85% relevance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.marketValue?.totalEstimatedValue || '$45-120M'}</div>
            <p className="text-xs text-muted-foreground">estimated licensing value</p>
          </CardContent>
        </Card>
      </div>

      {/* Value Proposition Banner */}
      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-emerald-900 mb-3">Federal Lab Technology Advantage</h3>
              <p className="text-emerald-800 mb-4">
                Leverage pre-validated federal technologies to dramatically accelerate life sciences commercialization
                while reducing risk and capital requirements.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <div className="text-2xl font-bold text-emerald-600">55%</div>
                  <div className="text-sm text-emerald-700">Timeline Reduction</div>
                  <div className="text-xs text-emerald-600">2-3+ years faster</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <div className="text-2xl font-bold text-emerald-600">55%</div>
                  <div className="text-sm text-emerald-700">Cost Reduction</div>
                  <div className="text-xs text-emerald-600">Capital efficiency</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <div className="text-2xl font-bold text-emerald-600">20%</div>
                  <div className="text-sm text-emerald-700">Value Enhancement</div>
                  <div className="text-xs text-emerald-600">Higher quality outcomes</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <div className="text-2xl font-bold text-emerald-600">400%</div>
                  <div className="text-sm text-emerald-700">Scale Improvement</div>
                  <div className="text-xs text-emerald-600">More companies created</div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-emerald-900 mb-3">Cross-Domain Discovery Engine</h4>
              <p className="text-emerald-700 text-sm mb-3">
                AI-powered scanning across NASA materials, DOE biotechnology, NIH therapeutics, 
                FDA regulatory science, and DARPA bioengineering for life sciences applications.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Badge variant="outline" className="bg-white text-emerald-700 border-emerald-300 justify-center">Drug Delivery</Badge>
                <Badge variant="outline" className="bg-white text-emerald-700 border-emerald-300 justify-center">Biomarkers</Badge>
                <Badge variant="outline" className="bg-white text-emerald-700 border-emerald-300 justify-center">Therapeutics</Badge>
                <Badge variant="outline" className="bg-white text-emerald-700 border-emerald-300 justify-center">Diagnostics</Badge>
                <Badge variant="outline" className="bg-white text-emerald-700 border-emerald-300 justify-center">Manufacturing</Badge>
                <Badge variant="outline" className="bg-white text-emerald-700 border-emerald-300 justify-center">Regulatory</Badge>
              </div>
              <div className="mt-4 text-center">
                <div className="text-3xl font-bold text-emerald-600">300+</div>
                <div className="text-sm text-emerald-600">Federal Laboratories</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="search">Patent Search</TabsTrigger>
          <TabsTrigger value="agencies">Federal Agencies</TabsTrigger>
          <TabsTrigger value="tracking">Opportunity Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          {/* ROI Comparison Section */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <TrendingUp className="h-5 w-5" />
                Federal Lab Technology ROI vs Traditional Development
              </CardTitle>
              <CardDescription className="text-green-700">
                Dramatic advantages of licensing pre-validated federal technologies for life sciences applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-900">Traditional Development</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                      <span className="text-red-700">Timeline to Market</span>
                      <span className="font-bold text-red-600">60-84 months</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                      <span className="text-red-700">Capital Requirements</span>
                      <span className="font-bold text-red-600">$100-200M</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                      <span className="text-red-700">Technical Risk</span>
                      <span className="font-bold text-red-600">High</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                      <span className="text-red-700">Portfolio Scale</span>
                      <span className="font-bold text-red-600">Limited</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-900">Federal Lab Licensing</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="text-green-700">Timeline to Market</span>
                      <span className="font-bold text-green-600">24-36 months</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="text-green-700">Capital Requirements</span>
                      <span className="font-bold text-green-600">$50-100M</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="text-green-700">Technical Risk</span>
                      <span className="font-bold text-green-600">Pre-Validated</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="text-green-700">Portfolio Scale</span>
                      <span className="font-bold text-green-600">4x More Companies</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Key Metrics Row */}
              <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-green-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">55%</div>
                  <div className="text-sm text-green-700">Faster Timeline</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">55%</div>
                  <div className="text-sm text-green-700">Lower Cost</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">20%</div>
                  <div className="text-sm text-green-700">Higher Value</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">400%</div>
                  <div className="text-sm text-green-700">Better Scale</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Federal Agency Network
                </CardTitle>
                <CardDescription>
                  Real-time connections to federal technology transfer offices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockAgencies.map((agency) => (
                  <div key={agency.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                        <Building className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">{agency.acronym}</div>
                        <div className="text-sm text-muted-foreground">
                          {agency.availablePatents} available patents
                        </div>
                      </div>
                    </div>
                    <Badge className={getAgencyStatusColor(agency.status)}>
                      {agency.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Top Opportunities
                </CardTitle>
                <CardDescription>
                  Highest relevance federal patents for your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockPatents.slice(0, 3).map((patent) => (
                  <div key={patent.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-2">{patent.title}</h4>
                        <p className="text-xs text-muted-foreground">{patent.agency}</p>
                      </div>
                      <Badge className={getStatusColor(patent.status)}>
                        {patent.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs">{Math.round(patent.relevanceScore * 100)}% match</span>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => setSelectedPatent(patent)}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Patent Search</CardTitle>
              <CardDescription>
                Search federal patents with AI-powered relevance matching
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search patents, keywords, therapeutic areas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select onValueChange={(value) => setFilters({...filters, agency: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Agency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NIH/NCI">NIH/NCI</SelectItem>
                    <SelectItem value="FDA">FDA</SelectItem>
                    <SelectItem value="DARPA">DARPA</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={(value) => setFilters({...filters, therapeuticArea: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Therapeutic Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Oncology">Oncology</SelectItem>
                    <SelectItem value="Rare Diseases">Rare Diseases</SelectItem>
                    <SelectItem value="Diagnostics">Diagnostics</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={(value) => setFilters({...filters, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Licensed">Licensed</SelectItem>
                    <SelectItem value="Restricted">Restricted</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Search Results ({filteredPatents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPatents.map((patent) => (
                  <div key={patent.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{patent.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{patent.abstract}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getStatusColor(patent.status)}>
                          {patent.status}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs">{Math.round(patent.relevanceScore * 100)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Agency:</span>
                        <div className="font-medium">{patent.agency}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Patent #:</span>
                        <div className="font-mono text-xs">{patent.patentNumber}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Therapeutic Area:</span>
                        <div>{patent.therapeuticArea}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Est. Value:</span>
                        <div className="font-medium">{patent.estimatedValue}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex flex-wrap gap-1">
                        {patent.keywords.map((keyword, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Bookmark className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" onClick={() => setSelectedPatent(patent)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agencies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Federal Agency Directory</CardTitle>
              <CardDescription>
                Technology transfer offices and licensing capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAgencies.map((agency) => (
                  <div key={agency.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center">
                          <Building className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{agency.name}</h3>
                          <p className="text-sm text-muted-foreground">{agency.technologyOffice}</p>
                        </div>
                      </div>
                      <Badge className={getAgencyStatusColor(agency.status)}>
                        {agency.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">{agency.totalPatents}</div>
                        <div className="text-xs text-gray-600">Total Patents</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">{agency.availablePatents}</div>
                        <div className="text-xs text-gray-600">Available</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-purple-600">{agency.partnerships}</div>
                        <div className="text-xs text-gray-600">Partnerships</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Focus Areas</h4>
                      <div className="flex flex-wrap gap-1">
                        {agency.focusAreas.map((area, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button size="sm" variant="outline">
                        View Patents
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Opportunity Pipeline</CardTitle>
              <CardDescription>
                Track licensing negotiations and opportunity development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Discovery</h4>
                    <div className="text-2xl font-bold text-blue-600">23</div>
                    <div className="text-sm text-muted-foreground">New opportunities</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Under Review</h4>
                    <div className="text-2xl font-bold text-yellow-600">12</div>
                    <div className="text-sm text-muted-foreground">In evaluation</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Active Negotiations</h4>
                    <div className="text-2xl font-bold text-green-600">7</div>
                    <div className="text-sm text-muted-foreground">In progress</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {mockPatents.map((patent) => (
                    <div key={patent.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{patent.title}</div>
                          <div className="text-sm text-muted-foreground">{patent.agency} • {patent.estimatedValue}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {patent.status === 'Available' ? 'Discovery' : 
                           patent.status === 'Licensed' ? 'Under Review' : 'Restricted'}
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Patent Detail Modal */}
      {selectedPatent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">{selectedPatent.title}</h2>
                  <p className="text-muted-foreground">{selectedPatent.patentNumber}</p>
                </div>
                <Button variant="ghost" onClick={() => setSelectedPatent(null)}>
                  ×
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Agency</h4>
                  <p className="text-sm">{selectedPatent.agency}</p>
                </div>
                <div>
                  <h4 className="font-medium">Status</h4>
                  <Badge className={getStatusColor(selectedPatent.status)}>
                    {selectedPatent.status}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium">Filed</h4>
                  <p className="text-sm">{selectedPatent.filed}</p>
                </div>
                <div>
                  <h4 className="font-medium">Estimated Value</h4>
                  <p className="text-sm font-medium">{selectedPatent.estimatedValue}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Abstract</h4>
                <p className="text-sm text-muted-foreground">{selectedPatent.abstract}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Inventors</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedPatent.inventors.map((inventor, idx) => (
                    <Badge key={idx} variant="outline">{inventor}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Contact Information</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Office:</strong> {selectedPatent.contactInfo.office}</p>
                  <p><strong>Email:</strong> {selectedPatent.contactInfo.email}</p>
                  <p><strong>Phone:</strong> {selectedPatent.contactInfo.phone}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button className="flex-1">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save to Pipeline
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}