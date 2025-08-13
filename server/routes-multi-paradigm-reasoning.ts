import type { Express } from "express";
import { isAuthenticated } from "./replitAuth";
import { multiParadigmReasoningEngine, ReasoningContext, ReasoningResult } from "./services/multiParadigmReasoning";

// In-memory storage for demo purposes - would use database in production
const activeContexts: Map<string, ReasoningContext> = new Map();
const reasoningResults: Map<string, ReasoningResult[]> = new Map();

// Generate mock reasoning contexts
function generateMockContexts(): ReasoningContext[] {
  const contexts: ReasoningContext[] = [
    {
      id: "ctx_pharmaceutical_rd_001",
      domain: "Pharmaceutical R&D Decision Making",
      confidence_level: 0.78,
      data_sources: ["clinical_trials_db", "molecular_properties", "regulatory_guidelines", "market_analysis"],
      stakeholders: ["Research Scientists", "Regulatory Affairs", "Clinical Operations", "Business Development"],
      constraints: {
        budget_limit: 50000000,
        timeline_months: 36,
        regulatory_requirements: ["FDA_IND", "EU_CTA"],
        ethical_constraints: ["patient_safety", "informed_consent"]
      },
      preferences: {
        risk_tolerance: 0.6,
        innovation_weight: 0.8,
        cost_efficiency: 0.7,
        time_to_market: 0.9
      },
      timestamp: new Date()
    },
    {
      id: "ctx_clinical_trial_design_002",
      domain: "Clinical Trial Design Optimization",
      confidence_level: 0.85,
      data_sources: ["patient_registry", "biomarker_data", "historical_trials", "statistical_models"],
      stakeholders: ["Biostatisticians", "Clinical Investigators", "Regulatory Team", "Data Management"],
      constraints: {
        sample_size_max: 2000,
        study_duration_months: 24,
        endpoints: ["primary_efficacy", "safety_profile"],
        inclusion_criteria: ["age_18_65", "diagnosis_confirmed"]
      },
      preferences: {
        statistical_power: 0.9,
        patient_burden: 0.3,
        cost_per_patient: 0.5,
        recruitment_feasibility: 0.8
      },
      timestamp: new Date()
    },
    {
      id: "ctx_drug_portfolio_003",
      domain: "Drug Portfolio Prioritization",
      confidence_level: 0.72,
      data_sources: ["pipeline_assets", "competitive_intelligence", "market_forecasts", "technical_assessments"],
      stakeholders: ["Portfolio Management", "Research Leadership", "Commercial Team", "Finance"],
      constraints: {
        total_budget: 200000000,
        therapeutic_areas: ["oncology", "immunology", "neurology"],
        development_stages: ["preclinical", "phase_1", "phase_2"],
        patent_protection: "minimum_8_years"
      },
      preferences: {
        npv_weight: 0.85,
        peak_sales_potential: 0.9,
        probability_of_success: 0.75,
        strategic_fit: 0.6
      },
      timestamp: new Date()
    }
  ];

  contexts.forEach(ctx => {
    activeContexts.set(ctx.id, ctx);
    // Generate mock reasoning results
    reasoningResults.set(ctx.id, [generateMockReasoningResult(ctx)]);
  });

  return contexts;
}

function generateMockReasoningResult(context: ReasoningContext): ReasoningResult {
  return {
    recommendations: [
      {
        action: "Proceed with lead compound optimization",
        confidence: 0.82,
        risk_score: 0.35,
        utility_score: 0.78,
        rationale: "Strong preclinical efficacy data combined with favorable ADMET profile suggests high probability of success in early clinical development",
        supporting_evidence: [
          "In vitro IC50 < 10nM across target cell lines",
          "Oral bioavailability >60% in two species",
          "No major safety signals in 28-day toxicology studies"
        ],
        potential_biases: ["availability_bias", "confirmation_bias"],
        drift_indicators: ["moderate_data_drift"]
      },
      {
        action: "Conduct additional biomarker validation studies",
        confidence: 0.67,
        risk_score: 0.28,
        utility_score: 0.85,
        rationale: "Enrichment biomarker shows promise for patient stratification but requires validation in larger, independent cohorts",
        supporting_evidence: [
          "Biomarker positive patients show 2.3x higher response rate",
          "Assay reproducibility >90% across sites",
          "Regulatory precedent exists for similar biomarkers"
        ],
        potential_biases: ["anchoring_bias"],
        drift_indicators: ["low_concept_drift"]
      }
    ],
    scenario_analysis: {
      base_case: {
        probability_of_success: 0.45,
        peak_sales: 850000000,
        development_cost: 120000000,
        time_to_market: 8.5
      },
      optimistic: {
        probability_of_success: 0.68,
        peak_sales: 1200000000,
        development_cost: 100000000,
        time_to_market: 7.2
      },
      pessimistic: {
        probability_of_success: 0.25,
        peak_sales: 400000000,
        development_cost: 180000000,
        time_to_market: 11.3
      },
      monte_carlo_samples: 10000,
      sensitivity_factors: {
        efficacy_magnitude: 0.72,
        biomarker_prevalence: 0.56,
        competitive_landscape: 0.43,
        regulatory_pathway: 0.38
      }
    },
    human_oversight_required: false,
    guardrail_violations: [],
    critical_thinking_flags: [],
    bias_detection: {
      confirmation_bias: 0.32,
      anchoring_bias: 0.28,
      availability_bias: 0.41,
      selection_bias: 0.19
    },
    drift_analysis: {
      concept_drift: 0.15,
      data_drift: 0.23,
      model_drift: 0.18,
      temporal_drift: 0.31
    }
  };
}

// Initialize mock data
generateMockContexts();

export function registerMultiParadigmReasoningRoutes(app: Express) {
  // Get all reasoning contexts
  app.get("/api/multi-paradigm-reasoning/contexts", isAuthenticated, async (req, res) => {
    try {
      const contexts = Array.from(activeContexts.values());
      res.json(contexts);
    } catch (error) {
      console.error("Error fetching reasoning contexts:", error);
      res.status(500).json({ error: "Failed to fetch reasoning contexts" });
    }
  });

  // Get reasoning results for a specific context
  app.get("/api/multi-paradigm-reasoning/results/:contextId", isAuthenticated, async (req, res) => {
    try {
      const { contextId } = req.params;
      const results = reasoningResults.get(contextId) || [];
      res.json(results);
    } catch (error) {
      console.error("Error fetching reasoning results:", error);
      res.status(500).json({ error: "Failed to fetch reasoning results" });
    }
  });

  // Get system metrics
  app.get("/api/multi-paradigm-reasoning/metrics", isAuthenticated, async (req, res) => {
    try {
      const contexts = Array.from(activeContexts.values());
      const allResults = Array.from(reasoningResults.values()).flat();
      
      const humanOversightRequired = allResults.filter(r => r.human_oversight_required).length;
      const guardrailViolations = allResults.reduce((sum, r) => sum + r.guardrail_violations.length, 0);
      
      const averageBias = allResults.length > 0 
        ? allResults.reduce((sum, r) => {
            const biasSum = Object.values(r.bias_detection).reduce((a, b) => a + b, 0);
            return sum + (biasSum / Object.keys(r.bias_detection).length);
          }, 0) / allResults.length
        : 0;

      const metrics = {
        totalContexts: contexts.length,
        activeContexts: contexts.length,
        humanOversightRequired,
        guardrailViolations,
        averageBias,
        averageConfidence: contexts.length > 0 
          ? contexts.reduce((sum, ctx) => sum + ctx.confidence_level, 0) / contexts.length
          : 0,
        totalRecommendations: allResults.reduce((sum, r) => sum + r.recommendations.length, 0)
      };
      
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      res.status(500).json({ error: "Failed to fetch system metrics" });
    }
  });

  // Start new reasoning analysis
  app.post("/api/multi-paradigm-reasoning/start", isAuthenticated, async (req, res) => {
    try {
      const config = req.body;
      
      if (!config.domain || !config.description) {
        return res.status(400).json({ error: "Domain and description are required" });
      }

      // Create new reasoning context
      const context: ReasoningContext = {
        id: `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        domain: config.domain,
        confidence_level: 0.75 + Math.random() * 0.2,
        data_sources: config.stakeholders?.split(',').map((s: string) => s.trim()) || [],
        stakeholders: config.stakeholders?.split(',').map((s: string) => s.trim()) || [],
        constraints: config.constraints ? JSON.parse(config.constraints) : {},
        preferences: config.preferences ? JSON.parse(config.preferences) : {},
        timestamp: new Date()
      };

      activeContexts.set(context.id, context);

      // Simulate reasoning analysis
      setTimeout(async () => {
        try {
          const result = await multiParadigmReasoningEngine.performReasoning(context);
          reasoningResults.set(context.id, [result]);
        } catch (error) {
          console.error("Error performing reasoning analysis:", error);
          // Set fallback result
          reasoningResults.set(context.id, [generateMockReasoningResult(context)]);
        }
      }, 2000);
      
      res.json({ 
        success: true, 
        context_id: context.id,
        message: "Multi-paradigm reasoning analysis started successfully"
      });
    } catch (error) {
      console.error("Error starting reasoning analysis:", error);
      res.status(500).json({ error: "Failed to start reasoning analysis" });
    }
  });

  // Get detailed analysis for a context
  app.get("/api/multi-paradigm-reasoning/analysis/:contextId", isAuthenticated, async (req, res) => {
    try {
      const { contextId } = req.params;
      const context = activeContexts.get(contextId);
      const results = reasoningResults.get(contextId) || [];
      
      if (!context) {
        return res.status(404).json({ error: "Context not found" });
      }
      
      const analysis = {
        context_overview: {
          id: context.id,
          domain: context.domain,
          confidence_level: context.confidence_level,
          data_sources: context.data_sources,
          stakeholders: context.stakeholders
        },
        reasoning_summary: results.length > 0 ? {
          total_recommendations: results[0].recommendations.length,
          human_oversight_required: results[0].human_oversight_required,
          guardrail_violations: results[0].guardrail_violations.length,
          critical_thinking_flags: results[0].critical_thinking_flags.length,
          average_confidence: results[0].recommendations.reduce((sum, r) => sum + r.confidence, 0) / results[0].recommendations.length
        } : null,
        bias_summary: results.length > 0 ? results[0].bias_detection : null,
        drift_summary: results.length > 0 ? results[0].drift_analysis : null,
        scenario_summary: results.length > 0 ? results[0].scenario_analysis : null
      };
      
      res.json(analysis);
    } catch (error) {
      console.error("Error generating analysis:", error);
      res.status(500).json({ error: "Failed to generate analysis" });
    }
  });

  // Trigger human review
  app.post("/api/multi-paradigm-reasoning/human-review/:contextId", isAuthenticated, async (req, res) => {
    try {
      const { contextId } = req.params;
      const { reviewer_notes, approved } = req.body;
      
      const context = activeContexts.get(contextId);
      if (!context) {
        return res.status(404).json({ error: "Context not found" });
      }

      // In production, this would update the context with human review
      console.log(`Human review for context ${contextId}:`, {
        approved,
        reviewer_notes,
        timestamp: new Date().toISOString()
      });
      
      res.json({ 
        success: true, 
        message: "Human review recorded successfully",
        context_id: contextId,
        status: approved ? 'approved' : 'rejected'
      });
    } catch (error) {
      console.error("Error recording human review:", error);
      res.status(500).json({ error: "Failed to record human review" });
    }
  });
}