import express from 'express';
import { z } from 'zod';
import { 
  insertFederalLaboratorySchema,
  insertFederalPatentSchema,
  insertTechnologyOpportunitySchema,
  insertFedscoutSearchSchema,
  insertPatentAnalyticsSchema
} from '@shared/schema';
import { randomUUID } from 'crypto';

const router = express.Router();

// Mock data for federal laboratories with life sciences focus
const mockFederalLabs = [
  {
    id: 'nih_nci',
    name: 'National Cancer Institute',
    acronym: 'NCI',
    agency: 'NIH',
    technologyOffice: 'NCI Technology Transfer Center',
    contactEmail: 'techtransfer@nih.gov',
    contactPhone: '(301) 496-7057',
    website: 'https://www.cancer.gov/about-nci/organization/tech-transfer',
    focusAreas: ['Oncology', 'Immunotherapy', 'CAR-T', 'Cancer Diagnostics', 'Precision Medicine'],
    totalPatents: 847,
    availablePatents: 234,
    activePartnerships: 89,
    connectionStatus: 'connected',
    lastSyncAt: new Date('2025-08-11T08:00:00Z'),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'fda_cder',
    name: 'Center for Drug Evaluation and Research',
    acronym: 'CDER',
    agency: 'FDA',
    technologyOffice: 'FDA Technology Transfer Program',
    contactEmail: 'techtransfer@fda.hhs.gov',
    contactPhone: '(240) 402-5870',
    website: 'https://www.fda.gov/about-fda/technology-transfer-program',
    focusAreas: ['Drug Development', 'Regulatory Science', 'Drug Repurposing', 'Biomarkers', 'Real-World Evidence'],
    totalPatents: 445,
    availablePatents: 67,
    activePartnerships: 34,
    connectionStatus: 'connected',
    lastSyncAt: new Date('2025-08-11T07:30:00Z'),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'darpa_bio',
    name: 'Biological Technologies Office',
    acronym: 'BTO',
    agency: 'DARPA',
    technologyOffice: 'DARPA Technology Transition',
    contactEmail: 'technology@darpa.mil',
    contactPhone: '(703) 526-6630',
    website: 'https://www.darpa.mil/about-us/offices/bto',
    focusAreas: ['Synthetic Biology', 'Bioengineering', 'Biosensors', 'Neural Interfaces', 'Human Performance'],
    totalPatents: 312,
    availablePatents: 23,
    activePartnerships: 12,
    connectionStatus: 'limited',
    lastSyncAt: new Date('2025-08-10T15:00:00Z'),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'doe_ber',
    name: 'Biological and Environmental Research',
    acronym: 'BER',
    agency: 'DOE',
    technologyOffice: 'DOE Office of Technology Transitions',
    contactEmail: 'techtransition@hq.doe.gov',
    contactPhone: '(202) 586-5000',
    website: 'https://www.energy.gov/science/ber',
    focusAreas: ['Systems Biology', 'Biomanufacturing', 'Environmental Health', 'Genomics', 'Metabolomics'],
    totalPatents: 523,
    availablePatents: 134,
    activePartnerships: 67,
    connectionStatus: 'connected',
    lastSyncAt: new Date('2025-08-11T06:45:00Z'),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock federal patents with life sciences applications
const mockFederalPatents = [
  {
    id: 'nih_001',
    labId: 'nih_nci',
    title: 'Enhanced CAR-T Cell Persistence Through Engineered Cytokine Circuits',
    patentNumber: 'US11,234,567',
    applicationNumber: '17/123,456',
    inventors: ['Dr. Sarah Chen', 'Dr. Michael Rodriguez', 'Dr. Lisa Wang'],
    filedDate: new Date('2023-03-15'),
    issuedDate: new Date('2024-11-22'),
    expirationDate: new Date('2043-03-15'),
    abstract: 'Novel engineered cytokine circuits that enhance CAR-T cell persistence and efficacy in solid tumor microenvironments, addressing the major challenge of CAR-T therapy in non-hematologic malignancies.',
    description: 'Complete system for engineering CAR-T cells with enhanced persistence through controlled cytokine release...',
    therapeuticAreas: ['Oncology', 'Immunotherapy', 'Solid Tumors'],
    applicationDomains: ['CAR-T Therapy', 'Cell Engineering', 'Cancer Treatment'],
    keywords: ['CAR-T', 'Immunotherapy', 'Cytokine Engineering', 'Solid Tumors', 'T Cell Persistence'],
    status: 'available',
    licensingStatus: 'exclusive_available',
    estimatedValue: '$5-15M',
    relevanceScore: 0.94,
    crossDomainApplications: [
      'Autoimmune disease treatment',
      'Organ transplant rejection prevention',
      'Vaccine adjuvant development'
    ],
    patentFamily: ['US11,234,568', 'US11,234,569'],
    citationCount: 47,
    licenseInquiries: 12,
    commercialInterest: 0.89,
    contactInfo: {
      office: 'NCI Technology Transfer Center',
      email: 'techtransfer@nih.gov',
      phone: '(301) 496-7057',
      primaryContact: 'Dr. Jennifer Lee, Technology Transfer Specialist'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'fda_002',
    labId: 'fda_cder',
    title: 'AI-Driven Drug Repurposing Platform for Rare Disease Applications',
    patentNumber: 'US11,345,678',
    applicationNumber: '17/234,567',
    inventors: ['Dr. Jennifer Wu', 'Dr. David Kim', 'Dr. Maria Santos'],
    filedDate: new Date('2022-11-08'),
    issuedDate: new Date('2024-08-15'),
    expirationDate: new Date('2042-11-08'),
    abstract: 'Machine learning platform that systematically identifies repurposing opportunities for FDA-approved drugs in rare disease indications, accelerating 505(b)(2) pathways.',
    description: 'Comprehensive AI system that analyzes molecular profiles, safety data, and mechanism of action...',
    therapeuticAreas: ['Rare Diseases', 'Drug Repurposing', 'Orphan Drugs'],
    applicationDomains: ['505(b)(2) Pathway', 'Drug Development', 'Regulatory Science'],
    keywords: ['Drug Repurposing', 'AI/ML', 'Rare Diseases', '505(b)(2)', 'FDA Approved Drugs'],
    status: 'available',
    licensingStatus: 'non_exclusive_available',
    estimatedValue: '$2-8M',
    relevanceScore: 0.87,
    crossDomainApplications: [
      'Personalized medicine optimization',
      'Clinical trial design enhancement',
      'Adverse event prediction'
    ],
    patentFamily: ['US11,345,679', 'US11,345,680'],
    citationCount: 23,
    licenseInquiries: 8,
    commercialInterest: 0.76,
    contactInfo: {
      office: 'FDA Technology Transfer Program',
      email: 'techtransfer@fda.hhs.gov',
      phone: '(240) 402-5870',
      primaryContact: 'Dr. Robert Chen, Senior Technology Transfer Officer'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'darpa_003',
    labId: 'darpa_bio',
    title: 'Quantum-Enhanced Biosensor Array for Ultra-Sensitive Biomarker Detection',
    patentNumber: 'US11,456,789',
    applicationNumber: '17/345,678',
    inventors: ['Dr. Lisa Park', 'Dr. James Chen', 'Dr. Amanda Foster'],
    filedDate: new Date('2023-07-22'),
    issuedDate: new Date('2024-12-10'),
    expirationDate: new Date('2043-07-22'),
    abstract: 'Quantum sensor technology enabling detection of biomarkers at femtomolar concentrations for early disease diagnosis and drug development applications.',
    description: 'Revolutionary quantum sensor array that provides unprecedented sensitivity for biomarker detection...',
    therapeuticAreas: ['Diagnostics', 'Early Detection', 'Biomarkers'],
    applicationDomains: ['Point-of-Care Testing', 'Drug Development', 'Companion Diagnostics'],
    keywords: ['Quantum Sensors', 'Biomarkers', 'Early Detection', 'Ultra-Sensitive', 'Point-of-Care'],
    status: 'restricted',
    licensingStatus: 'government_use_only',
    estimatedValue: 'Under Review',
    relevanceScore: 0.81,
    crossDomainApplications: [
      'Environmental monitoring',
      'Food safety testing',
      'Chemical weapons detection'
    ],
    patentFamily: ['US11,456,790'],
    citationCount: 15,
    licenseInquiries: 3,
    commercialInterest: 0.65,
    contactInfo: {
      office: 'DARPA Technology Transition',
      email: 'technology@darpa.mil',
      phone: '(703) 526-6630',
      primaryContact: 'Dr. Kevin Anderson, Program Manager'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock technology opportunities
const mockOpportunities = [
  {
    id: 'opp_001',
    patentId: 'nih_001',
    opportunityType: 'licensing',
    title: 'CAR-T Enhancement Technology Licensing',
    description: 'Exclusive licensing opportunity for breakthrough CAR-T persistence technology with proven efficacy in solid tumors',
    lifeSciecesApplication: 'Enhanced CAR-T cell therapy for solid tumor treatment, addressing the $47B oncology immunotherapy market',
    marketOpportunity: 'Solid tumor CAR-T market projected to reach $8.2B by 2030. Current CAR-T therapies limited to blood cancers.',
    competitiveAdvantage: 'First-in-class cytokine engineering approach with 3x improved persistence vs current CAR-T technologies',
    developmentTimeline: '24-36 months to IND filing, 60-84 months to potential approval',
    capitalRequirements: '$50-100M for preclinical and Phase I/II development',
    riskFactors: ['Regulatory approval risk', 'Manufacturing complexity', 'Competition from established players'],
    mitigationStrategies: ['NIH collaboration agreement', 'GMP manufacturing partnerships', 'Strong IP portfolio'],
    strategicPartners: ['Gilead Sciences', 'Bristol Myers Squibb', 'Novartis'],
    priorityScore: 0.92,
    stage: 'evaluation',
    assignedTo: 'user_123',
    nextActions: [
      'Schedule NIH technology presentation',
      'Conduct IP freedom-to-operate analysis',
      'Evaluate manufacturing requirements'
    ],
    progressNotes: [
      {
        date: '2025-08-10',
        note: 'Initial contact with NCI established, positive response to technology overview',
        author: 'Dr. Jane Smith'
      }
    ],
    estimatedCloseDate: new Date('2025-12-15'),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Federal Laboratories Routes
router.get('/laboratories', async (req, res) => {
  try {
    const { agency, connectionStatus, focusArea } = req.query;
    
    let labs = [...mockFederalLabs];
    
    // Apply filters
    if (agency) labs = labs.filter(lab => lab.agency === agency);
    if (connectionStatus) labs = labs.filter(lab => lab.connectionStatus === connectionStatus);
    if (focusArea) labs = labs.filter(lab => 
      lab.focusAreas.some(area => area.toLowerCase().includes((focusArea as string).toLowerCase()))
    );
    
    res.json({
      laboratories: labs,
      total: labs.length,
      summary: {
        totalLabs: mockFederalLabs.length,
        connected: mockFederalLabs.filter(lab => lab.connectionStatus === 'connected').length,
        totalPatents: mockFederalLabs.reduce((sum, lab) => sum + lab.totalPatents, 0),
        availablePatents: mockFederalLabs.reduce((sum, lab) => sum + lab.availablePatents, 0)
      }
    });
  } catch (error) {
    console.error('Get laboratories error:', error);
    res.status(500).json({ error: 'Failed to retrieve laboratories' });
  }
});

// Federal Patents Search
router.get('/patents', async (req, res) => {
  try {
    const { 
      search, 
      agency, 
      therapeuticArea, 
      status, 
      minRelevance = 0,
      limit = 20,
      offset = 0 
    } = req.query;
    
    let patents = [...mockFederalPatents];
    
    // Apply search
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      patents = patents.filter(patent => 
        patent.title.toLowerCase().includes(searchTerm) ||
        patent.abstract.toLowerCase().includes(searchTerm) ||
        patent.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
        patent.therapeuticAreas.some(area => area.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply filters
    if (agency) {
      const labsForAgency = mockFederalLabs.filter(lab => lab.agency === agency).map(lab => lab.id);
      patents = patents.filter(patent => labsForAgency.includes(patent.labId));
    }
    if (therapeuticArea) {
      patents = patents.filter(patent => 
        patent.therapeuticAreas.some(area => area.toLowerCase().includes((therapeuticArea as string).toLowerCase()))
      );
    }
    if (status) patents = patents.filter(patent => patent.status === status);
    if (minRelevance) patents = patents.filter(patent => patent.relevanceScore >= Number(minRelevance));
    
    // Sort by relevance score descending
    patents.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    // Apply pagination
    const paginatedPatents = patents.slice(Number(offset), Number(offset) + Number(limit));
    
    // Add lab information
    const enrichedPatents = paginatedPatents.map(patent => ({
      ...patent,
      laboratory: mockFederalLabs.find(lab => lab.id === patent.labId)
    }));
    
    res.json({
      patents: enrichedPatents,
      total: patents.length,
      limit: Number(limit),
      offset: Number(offset),
      filters: { search, agency, therapeuticArea, status, minRelevance }
    });
  } catch (error) {
    console.error('Search patents error:', error);
    res.status(500).json({ error: 'Failed to search patents' });
  }
});

// Patent Details
router.get('/patents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const patent = mockFederalPatents.find(p => p.id === id);
    
    if (!patent) {
      return res.status(404).json({ error: 'Patent not found' });
    }
    
    const laboratory = mockFederalLabs.find(lab => lab.id === patent.labId);
    const opportunities = mockOpportunities.filter(opp => opp.patentId === id);
    
    res.json({
      patent: {
        ...patent,
        laboratory
      },
      opportunities,
      analytics: {
        viewCount: Math.floor(Math.random() * 100) + 10,
        saveCount: Math.floor(Math.random() * 20) + 3,
        inquiryCount: Math.floor(Math.random() * 10) + 1
      }
    });
  } catch (error) {
    console.error('Get patent details error:', error);
    res.status(500).json({ error: 'Failed to retrieve patent details' });
  }
});

// Technology Opportunities
router.get('/opportunities', async (req, res) => {
  try {
    const { stage, priorityThreshold = 0, assignedTo } = req.query;
    
    let opportunities = [...mockOpportunities];
    
    // Apply filters
    if (stage) opportunities = opportunities.filter(opp => opp.stage === stage);
    if (priorityThreshold) opportunities = opportunities.filter(opp => opp.priorityScore >= Number(priorityThreshold));
    if (assignedTo) opportunities = opportunities.filter(opp => opp.assignedTo === assignedTo);
    
    // Sort by priority score descending
    opportunities.sort((a, b) => b.priorityScore - a.priorityScore);
    
    // Add patent information
    const enrichedOpportunities = opportunities.map(opp => ({
      ...opp,
      patent: mockFederalPatents.find(patent => patent.id === opp.patentId)
    }));
    
    res.json({
      opportunities: enrichedOpportunities,
      total: opportunities.length,
      summary: {
        totalOpportunities: mockOpportunities.length,
        byStage: {
          discovery: mockOpportunities.filter(opp => opp.stage === 'discovery').length,
          evaluation: mockOpportunities.filter(opp => opp.stage === 'evaluation').length,
          negotiation: mockOpportunities.filter(opp => opp.stage === 'negotiation').length,
          closed: mockOpportunities.filter(opp => opp.stage === 'closed').length
        }
      }
    });
  } catch (error) {
    console.error('Get opportunities error:', error);
    res.status(500).json({ error: 'Failed to retrieve opportunities' });
  }
});

// Create Technology Opportunity
router.post('/opportunities', async (req, res) => {
  try {
    const opportunityData = insertTechnologyOpportunitySchema.parse(req.body);
    
    const opportunity = {
      id: randomUUID(),
      ...opportunityData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockOpportunities.push(opportunity);
    
    res.status(201).json({
      message: 'Technology opportunity created successfully',
      opportunity
    });
  } catch (error) {
    console.error('Create opportunity error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid opportunity data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create opportunity' });
  }
});

// FedScout Analytics Dashboard
router.get('/analytics/dashboard', async (req, res) => {
  try {
    const analytics = {
      overview: {
        totalLaboratories: mockFederalLabs.length,
        connectedLabs: mockFederalLabs.filter(lab => lab.connectionStatus === 'connected').length,
        totalPatents: mockFederalLabs.reduce((sum, lab) => sum + lab.totalPatents, 0),
        availablePatents: mockFederalLabs.reduce((sum, lab) => sum + lab.availablePatents, 0),
        highRelevanceMatches: mockFederalPatents.filter(patent => patent.relevanceScore > 0.85).length,
        activeOpportunities: mockOpportunities.filter(opp => ['evaluation', 'negotiation'].includes(opp.stage)).length
      },
      valueProposition: {
        timelineReduction: 55, // 55% reduction (2-3+ years faster)
        costReduction: 55, // 55% reduction in capital requirements
        valueEnhancement: 20, // 15-20% value enhancement
        scaleImprovement: 400, // 300-400% scale improvement
        traditionalTimeline: '60-84 months',
        federalLabTimeline: '24-36 months',
        traditionalCost: '$100-200M',
        federalLabCost: '$50-100M',
        riskReduction: 'Pre-validated technologies reduce technical risk',
        competitiveAdvantage: 'Exclusive access to federal innovations'
      },
      patentsByAgency: mockFederalLabs.map(lab => ({
        agency: lab.agency,
        acronym: lab.acronym,
        totalPatents: lab.totalPatents,
        availablePatents: lab.availablePatents,
        connectionStatus: lab.connectionStatus
      })),
      therapeuticAreas: mockFederalPatents.reduce((acc, patent) => {
        patent.therapeuticAreas.forEach(area => {
          acc[area] = (acc[area] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>),
      opportunityPipeline: {
        discovery: mockOpportunities.filter(opp => opp.stage === 'discovery').length,
        evaluation: mockOpportunities.filter(opp => opp.stage === 'evaluation').length,
        negotiation: mockOpportunities.filter(opp => opp.stage === 'negotiation').length,
        closed: mockOpportunities.filter(opp => opp.stage === 'closed').length
      },
      marketValue: {
        totalEstimatedValue: '$45-120M',
        averageOpportunityValue: '$15-40M',
        timeToMarket: '24-60 months'
      }
    };
    
    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to retrieve analytics' });
  }
});

// Advanced Search with AI-powered cross-domain matching
router.post('/search/advanced', async (req, res) => {
  try {
    const { 
      query, 
      therapeuticAreas = [], 
      agencies = [], 
      crossDomainSearch = false,
      minRelevance = 0.7 
    } = req.body;
    
    let patents = [...mockFederalPatents];
    
    // Simulate AI-powered semantic search
    if (query) {
      const searchTerms = query.toLowerCase().split(' ');
      patents = patents.map(patent => {
        let score = 0;
        
        // Title matching
        searchTerms.forEach(term => {
          if (patent.title.toLowerCase().includes(term)) score += 0.3;
        });
        
        // Abstract matching
        searchTerms.forEach(term => {
          if (patent.abstract.toLowerCase().includes(term)) score += 0.2;
        });
        
        // Keywords matching
        patent.keywords.forEach(keyword => {
          searchTerms.forEach(term => {
            if (keyword.toLowerCase().includes(term)) score += 0.4;
          });
        });
        
        // Cross-domain applications (if enabled)
        if (crossDomainSearch) {
          patent.crossDomainApplications.forEach(app => {
            searchTerms.forEach(term => {
              if (app.toLowerCase().includes(term)) score += 0.5;
            });
          });
        }
        
        return { ...patent, searchScore: Math.min(score, 1.0) };
      }).filter(patent => patent.searchScore >= minRelevance);
    }
    
    // Apply filters
    if (therapeuticAreas.length > 0) {
      patents = patents.filter(patent => 
        patent.therapeuticAreas.some(area => therapeuticAreas.includes(area))
      );
    }
    
    if (agencies.length > 0) {
      const labsForAgencies = mockFederalLabs.filter(lab => agencies.includes(lab.agency)).map(lab => lab.id);
      patents = patents.filter(patent => labsForAgencies.includes(patent.labId));
    }
    
    // Sort by combined relevance and search score
    patents.sort((a, b) => {
      const scoreA = (a.relevanceScore * 0.6) + ((a as any).searchScore || 0) * 0.4;
      const scoreB = (b.relevanceScore * 0.6) + ((b as any).searchScore || 0) * 0.4;
      return scoreB - scoreA;
    });
    
    // Add lab information and opportunities
    const enrichedPatents = patents.map(patent => ({
      ...patent,
      laboratory: mockFederalLabs.find(lab => lab.id === patent.labId),
      hasOpportunities: mockOpportunities.some(opp => opp.patentId === patent.id)
    }));
    
    res.json({
      results: enrichedPatents,
      total: patents.length,
      searchMetadata: {
        query,
        crossDomainEnabled: crossDomainSearch,
        minRelevance,
        executionTime: Math.floor(Math.random() * 500) + 100 // Simulated execution time
      }
    });
  } catch (error) {
    console.error('Advanced search error:', error);
    res.status(500).json({ error: 'Failed to execute advanced search' });
  }
});

// Interactive FedScout Chat - Sophie Technology Scout
router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Simulate AI analysis of federal technology databases
    let reply = '';
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('nih') || messageLower.includes('formulation') || messageLower.includes('stability')) {
      reply = `I've identified several NIH technologies for formulation stability. The NIH Formulation Stabilization Technology (Patent US10982357) shows exceptional promise with 40-45% shelf-life extension. This technology has completed Phase 1 clinical validation for monoclonal antibodies and could significantly reduce your cold chain requirements. The technology transfer office at NIH is actively licensing this on a non-exclusive basis. Would you like me to provide contact details or explore additional NIST analytical methods that complement this approach?`;
    } else if (messageLower.includes('nist') || messageLower.includes('analytical') || messageLower.includes('quality')) {
      reply = `The NIST Analytical Quality Control System (Patent US11674762) is highly relevant for your biologics development. This validated prototype reduces batch-to-batch variability by 78% and dramatically improves analytical method reproducibility across manufacturing sites. It's available for exclusive licensing and would address the analytical challenges you're facing. I can connect you with the NIST Technology Transfer Office and provide detailed technical specifications.`;
    } else if (messageLower.includes('patent') || messageLower.includes('licensing') || messageLower.includes('contact')) {
      reply = `I've compiled detailed licensing information for the identified technologies. For the NIH Formulation Technology, contact the NIH Technology Transfer Office directly. The NIST Analytical Platform offers exclusive licensing opportunities. Both technologies have completed initial validation phases and are ready for commercial partnerships. I can generate a comprehensive technology transfer report with all contact details, licensing terms, and technical specifications. Would you like me to prepare this report?`;
    } else if (messageLower.includes('cost') || messageLower.includes('timeline') || messageLower.includes('development')) {
      reply = `Based on federal lab analytics, these technologies can deliver the 55% timeline reduction your project requires. The NIH formulation technology alone accelerates development by 2-3 years by eliminating stability reformulation cycles. Combined with NIST quality systems, you achieve 55% cost reduction through reduced batch failures and faster regulatory approval. The 300+ federal labs in our database show similar technologies delivering 400% scale improvements for comparable biologics programs.`;
    } else {
      reply = `I'm analyzing federal laboratory databases for technologies relevant to your query. Based on my scan of 300+ federal labs, I've identified several promising opportunities. The most relevant technologies come from NIH (formulation stabilization), NIST (analytical quality control), and DARPA (advanced bioengineering platforms). Each offers unique licensing opportunities with strong commercialization potential. What specific aspect would you like me to explore further - technology details, licensing terms, or competitive analysis?`;
    }

    res.json({
      success: true,
      reply,
      confidence: 0.9,
      context: 'federal_technology_scout',
      sources: {
        federalLabs: mockFederalLabs.slice(0, 3).map(lab => lab.name),
        patents: mockFederalPatents.slice(0, 2).map(patent => patent.patentNumber),
        agencies: ['NIH', 'NIST', 'DARPA', 'FDA']
      },
      insights: {
        technologiesFound: mockFederalPatents.length,
        labsSearched: mockFederalLabs.length,
        relevantOpportunities: mockOpportunities.length
      }
    });
  } catch (error) {
    console.error('FedScout chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat request',
      reply: 'I apologize, but I encountered an issue accessing the federal technology database. Please try again, and I\'ll search the 300+ federal labs for relevant opportunities.'
    });
  }
});

export default router;