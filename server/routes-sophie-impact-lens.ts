import type { Express } from "express";
import { z } from "zod";

const impactAnalysisSchema = z.object({
  simulationName: z.string().min(1),
  simulationType: z.enum(['AGENT_BASED_CASCADE', 'GRAPH_NEURAL_PROPAGATION', 'MONTE_CARLO', 'MULTI_STAKEHOLDER']),
  triggerAction: z.any(),
  stakeholders: z.array(z.string()).default([]),
  impactDomains: z.array(z.string()).default([]),
  timeHorizon: z.number().default(30),
  propagationRules: z.array(z.any()).default([]),
  confidenceInterval: z.number().default(0.95)
});

const riskLensSchema = z.object({
  riskAnalysisName: z.string().min(1),
  analysisType: z.enum(['BAYESIAN_SIMULATION', 'MONTE_CARLO', 'AGENT_BASED_MODELING', 'SENSITIVITY_ANALYSIS']),
  targetAction: z.any(),
  riskCategories: z.array(z.string()).default([]),
  simulationRuns: z.number().default(10000)
});

const decisionFrameworkSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['scenario_analysis', 'cost_benefit', 'risk_assessment', 'stakeholder_impact']),
  contextAggregation: z.any(),
  scenarioSimulation: z.array(z.any()).default([]),
  optionEvaluation: z.array(z.any()).default([]),
  actionRecommendation: z.any()
});

// Mock data for Sophie Impact Lens™ - Sophie Ripple™ Impact Simulations
let impactSimulations = [
  {
    id: "sim_001",
    simulationName: "Clinical Trial Protocol Amendment Impact",
    simulationType: "AGENT_BASED_CASCADE",
    triggerAction: {
      action: "protocol_amendment",
      details: "Modify primary endpoint measurement from 6 months to 12 months"
    },
    stakeholders: ["clinical_team", "regulatory_affairs", "data_management", "biostatistics"],
    impactDomains: ["timeline", "budget", "regulatory_compliance", "data_quality"],
    cascadeEffects: [
      {
        level: 1,
        effects: ["Timeline extension: +6 months", "Budget increase: 15%", "Regulatory submission delay"]
      },
      {
        level: 2, 
        effects: ["Resource reallocation required", "Patient retention challenges", "Competitive positioning impact"]
      }
    ],
    timeHorizon: 365,
    propagationRules: [
      "Timeline changes propagate to dependent activities",
      "Budget impacts cascade to resource allocation",
      "Regulatory changes affect submission timeline"
    ],
    simulationResults: {
      probabilityOfSuccess: 0.78,
      expectedTimelineDelay: 180,
      budgetImpactRange: [12, 18],
      riskFactors: ["patient_dropout", "regulatory_complexity", "resource_constraints"]
    },
    probabilisticOutcomes: [
      { scenario: "Best Case", probability: 0.25, timelineImpact: 90, budgetImpact: 8 },
      { scenario: "Most Likely", probability: 0.50, timelineImpact: 180, budgetImpact: 15 },
      { scenario: "Worst Case", probability: 0.25, timelineImpact: 270, budgetImpact: 25 }
    ],
    riskMetrics: {
      overallRiskScore: 6.8,
      timelineRisk: 7.2,
      budgetRisk: 6.5,
      complianceRisk: 4.3
    },
    mitigationOptions: [
      {
        strategy: "Parallel enrollment expansion",
        impact: "Reduce timeline delay by 30%",
        cost: "Additional $200K",
        feasibility: 0.85
      },
      {
        strategy: "Digital endpoint collection",
        impact: "Improve data quality and reduce visits",
        cost: "Additional $150K",
        feasibility: 0.90
      }
    ],
    confidenceInterval: 0.88,
    status: "completed",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: "sim_002",
    simulationName: "Regulatory Submission Strategy Change",
    simulationType: "MULTI_STAKEHOLDER",
    triggerAction: {
      action: "submission_strategy_change",
      details: "Switch from accelerated approval to standard BLA pathway"
    },
    stakeholders: ["regulatory_affairs", "clinical_development", "commercial_team", "medical_affairs"],
    impactDomains: ["market_access", "competitive_positioning", "revenue_projections", "patient_access"],
    cascadeEffects: [
      {
        level: 1,
        effects: ["Additional Phase 3 study required", "Market entry delay: 18-24 months", "Increased development costs"]
      }
    ],
    timeHorizon: 730,
    simulationResults: {
      probabilityOfSuccess: 0.92,
      marketDelayMonths: 21,
      additionalDevelopmentCost: 45000000,
      competitiveRisk: "medium"
    },
    riskMetrics: {
      overallRiskScore: 5.4,
      marketRisk: 7.1,
      competitiveRisk: 6.8,
      financialRisk: 4.2
    },
    confidenceInterval: 0.91,
    status: "completed",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

// Mock data for Sophie Risk Lens™ 
let riskAnalyses = [
  {
    id: "risk_001",
    riskAnalysisName: "Drug-Drug Interaction Risk Assessment",
    analysisType: "BAYESIAN_SIMULATION",
    targetAction: {
      action: "drug_combination_study",
      details: "Evaluate safety of new oncology drug with standard of care"
    },
    riskCategories: ["safety", "efficacy", "regulatory", "commercial"],
    probabilisticModels: ["bayesian_network", "monte_carlo_simulation"],
    bayesianNetworks: [
      {
        nodes: ["drug_concentration", "metabolic_pathway", "adverse_events", "efficacy_outcome"],
        edges: ["drug_concentration -> adverse_events", "metabolic_pathway -> drug_concentration"]
      }
    ],
    simulationRuns: 50000,
    riskQuantification: {
      safetyRisk: { probability: 0.15, severity: "moderate", confidence: 0.87 },
      efficacyRisk: { probability: 0.08, severity: "low", confidence: 0.92 },
      regulatoryRisk: { probability: 0.25, severity: "high", confidence: 0.78 }
    },
    costProjections: {
      expectedCost: 12500000,
      costRange: [8000000, 18000000],
      contingencyReserve: 2500000
    },
    timelineImpacts: {
      baselineTimeline: 18,
      riskAdjustedTimeline: 24,
      criticalPathRisks: ["regulatory_review_delay", "safety_signal_investigation"]
    },
    mitigationStrategies: [
      {
        strategy: "Enhanced safety monitoring protocol",
        riskReduction: 0.35,
        implementationCost: 500000,
        timelineImpact: 0
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];

// Mock data for Decision Frameworks
let decisionFrameworks = [
  {
    id: "framework_001",
    name: "Clinical Development Path Selection",
    type: "scenario_analysis",
    contextAggregation: {
      clinicalData: "Phase 2 results show 65% response rate",
      marketConditions: "Competitive landscape analysis",
      regulatoryGuidance: "FDA breakthrough therapy designation received"
    },
    scenarioSimulation: [
      {
        scenario: "Accelerated Approval Path",
        probability: 0.70,
        timeline: 24,
        cost: 85000000,
        marketRisk: "high"
      },
      {
        scenario: "Standard Approval Path", 
        probability: 0.95,
        timeline: 36,
        cost: 125000000,
        marketRisk: "low"
      }
    ],
    optionEvaluation: [
      {
        option: "Accelerated Path",
        pros: ["Faster market entry", "First-mover advantage", "Lower development cost"],
        cons: ["Higher regulatory risk", "Post-market commitments", "Limited clinical data"]
      },
      {
        option: "Standard Path",
        pros: ["Higher approval probability", "Comprehensive safety data", "Strong commercial position"],
        cons: ["Longer timeline", "Higher cost", "Competitive risk"]
      }
    ],
    actionRecommendation: {
      primaryRecommendation: "Pursue accelerated approval pathway with robust post-market studies",
      rationale: "Strong Phase 2 data and breakthrough designation reduce regulatory risk",
      keySuccessFactors: ["FDA alignment", "post-market study execution", "commercial readiness"]
    },
    timelineProjections: {
      acceleratedPath: { optimistic: 18, realistic: 24, pessimistic: 30 },
      standardPath: { optimistic: 30, realistic: 36, pessimistic: 42 }
    },
    stakeholderImpact: [
      { stakeholder: "patients", impact: "Earlier access to therapy", sentiment: "positive" },
      { stakeholder: "investors", impact: "Faster ROI but higher risk", sentiment: "neutral" },
      { stakeholder: "regulators", impact: "Enhanced post-market surveillance required", sentiment: "neutral" }
    ],
    recommendedAction: "Pursue accelerated approval pathway with robust post-market studies",
    alternativeActions: [
      "Standard approval with expanded Phase 3",
      "Conditional approval in EU first",
      "Partnership for risk sharing"
    ],
    confidenceLevel: 0.82,
    implementationPlan: {
      phase1: "FDA Type B meeting for pathway confirmation",
      phase2: "Post-market study protocol development", 
      phase3: "BLA submission preparation"
    },
    monitoringPlan: {
      metrics: ["regulatory_milestone_achievement", "competitive_developments", "safety_signals"],
      frequency: "monthly",
      escalationTriggers: ["major_safety_signal", "competitive_approval", "regulatory_feedback"]
    },
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
  }
];

let nextSimId = 3;
let nextRiskId = 2;
let nextFrameworkId = 2;

export function registerSophieImpactLensRoutes(app: Express) {
  // Sophie Ripple™ Impact Simulations
  
  // Get all impact simulations
  app.get("/api/sophie-impact-lens/simulations", async (req, res) => {
    try {
      res.json(impactSimulations);
    } catch (error) {
      console.error("Error fetching impact simulations:", error);
      res.status(500).json({ error: "Failed to fetch impact simulations" });
    }
  });

  // Create new impact simulation
  app.post("/api/sophie-impact-lens/simulations", async (req, res) => {
    try {
      const validatedData = impactAnalysisSchema.parse(req.body);
      
      const newSimulation = {
        id: `sim_${String(nextSimId++).padStart(3, '0')}`,
        ...validatedData,
        cascadeEffects: [],
        simulationResults: {},
        probabilisticOutcomes: [],
        riskMetrics: {},
        mitigationOptions: [],
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      impactSimulations.push(newSimulation);
      
      res.status(201).json(newSimulation);
    } catch (error) {
      console.error("Error creating impact simulation:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid simulation data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create impact simulation" });
      }
    }
  });

  // Run impact simulation
  app.post("/api/sophie-impact-lens/simulations/:simId/run", async (req, res) => {
    try {
      const { simId } = req.params;
      
      const simIndex = impactSimulations.findIndex(s => s.id === simId);
      if (simIndex === -1) {
        return res.status(404).json({ error: "Simulation not found" });
      }

      // Simulate running the analysis
      impactSimulations[simIndex] = {
        ...impactSimulations[simIndex],
        status: "running",
        updatedAt: new Date().toISOString()
      };

      // Simulate completion after a delay
      setTimeout(() => {
        const completedIndex = impactSimulations.findIndex(s => s.id === simId);
        if (completedIndex !== -1) {
          impactSimulations[completedIndex] = {
            ...impactSimulations[completedIndex],
            status: "completed",
            simulationResults: {
              probabilityOfSuccess: Math.random() * 0.3 + 0.7,
              expectedImpact: Math.random() * 50 + 25,
              riskScore: Math.random() * 4 + 3
            },
            confidenceInterval: Math.random() * 0.2 + 0.8,
            updatedAt: new Date().toISOString()
          };
        }
      }, 2000);

      res.json({ message: "Simulation started", simulationId: simId });
    } catch (error) {
      console.error("Error running simulation:", error);
      res.status(500).json({ error: "Failed to run simulation" });
    }
  });

  // Sophie Risk Lens™ Probabilistic Risk Quantification

  // Get all risk analyses
  app.get("/api/sophie-impact-lens/risk-analyses", async (req, res) => {
    try {
      res.json(riskAnalyses);
    } catch (error) {
      console.error("Error fetching risk analyses:", error);
      res.status(500).json({ error: "Failed to fetch risk analyses" });
    }
  });

  // Create new risk analysis
  app.post("/api/sophie-impact-lens/risk-analyses", async (req, res) => {
    try {
      const validatedData = riskLensSchema.parse(req.body);
      
      const newAnalysis = {
        id: `risk_${String(nextRiskId++).padStart(3, '0')}`,
        ...validatedData,
        probabilisticModels: [],
        bayesianNetworks: [],
        riskQuantification: {},
        costProjections: {},
        timelineImpacts: {},
        mitigationStrategies: [],
        createdAt: new Date().toISOString()
      };

      riskAnalyses.push(newAnalysis);
      
      res.status(201).json(newAnalysis);
    } catch (error) {
      console.error("Error creating risk analysis:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid risk analysis data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create risk analysis" });
      }
    }
  });

  // Decision Frameworks

  // Get all decision frameworks
  app.get("/api/sophie-impact-lens/frameworks", async (req, res) => {
    try {
      res.json(decisionFrameworks);
    } catch (error) {
      console.error("Error fetching decision frameworks:", error);
      res.status(500).json({ error: "Failed to fetch decision frameworks" });
    }
  });

  // Create new decision framework
  app.post("/api/sophie-impact-lens/frameworks", async (req, res) => {
    try {
      const validatedData = decisionFrameworkSchema.parse(req.body);
      
      const newFramework = {
        id: `framework_${String(nextFrameworkId++).padStart(3, '0')}`,
        ...validatedData,
        timelineProjections: {},
        stakeholderImpact: [],
        recommendedAction: "",
        alternativeActions: [],
        confidenceLevel: 0.8,
        implementationPlan: {},
        monitoringPlan: {},
        createdAt: new Date().toISOString()
      };

      decisionFrameworks.push(newFramework);
      
      res.status(201).json(newFramework);
    } catch (error) {
      console.error("Error creating decision framework:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid framework data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create decision framework" });
      }
    }
  });

  // Get simulation by ID
  app.get("/api/sophie-impact-lens/simulations/:simId", async (req, res) => {
    try {
      const { simId } = req.params;
      
      const simulation = impactSimulations.find(s => s.id === simId);
      if (!simulation) {
        return res.status(404).json({ error: "Simulation not found" });
      }

      res.json(simulation);
    } catch (error) {
      console.error("Error fetching simulation:", error);
      res.status(500).json({ error: "Failed to fetch simulation" });
    }
  });

  // Get analytics for Sophie Impact Lens™
  app.get("/api/sophie-impact-lens/analytics", async (req, res) => {
    try {
      const totalSimulations = impactSimulations.length;
      const completedSimulations = impactSimulations.filter(s => s.status === 'completed').length;
      const activeAnalyses = riskAnalyses.length;
      const activeFrameworks = decisionFrameworks.length;

      const avgConfidence = completedSimulations > 0
        ? impactSimulations
            .filter(s => s.status === 'completed')
            .reduce((sum, s) => sum + s.confidenceInterval, 0) / completedSimulations
        : 0;

      const analytics = {
        totalSimulations,
        completedSimulations,
        activeAnalyses,
        activeFrameworks,
        avgConfidence,
        simulationTypes: {
          AGENT_BASED_CASCADE: impactSimulations.filter(s => s.simulationType === 'AGENT_BASED_CASCADE').length,
          GRAPH_NEURAL_PROPAGATION: impactSimulations.filter(s => s.simulationType === 'GRAPH_NEURAL_PROPAGATION').length,
          MONTE_CARLO: impactSimulations.filter(s => s.simulationType === 'MONTE_CARLO').length,
          MULTI_STAKEHOLDER: impactSimulations.filter(s => s.simulationType === 'MULTI_STAKEHOLDER').length
        }
      };

      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });
}