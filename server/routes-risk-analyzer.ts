import type { Express } from "express";
import { z } from "zod";

const riskAssessmentSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['financial', 'operational', 'regulatory', 'strategic', 'technical', 'clinical']),
  description: z.string().min(1),
  probability: z.number().min(0).max(100),
  impact: z.number().min(0).max(100),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  riskScore: z.number().optional(),
  status: z.enum(['identified', 'analyzing', 'mitigating', 'resolved']).optional(),
  mitigation: z.string().optional(),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional()
});

const updateRiskSchema = z.object({
  status: z.enum(['identified', 'analyzing', 'mitigating', 'resolved']).optional(),
  mitigation: z.string().optional(),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional()
});

// Mock data - in production, this would be in a database
let riskAssessments = [
  {
    id: "risk_001",
    title: "Regulatory Compliance Gap",
    type: "regulatory" as const,
    severity: "critical" as const,
    probability: 85,
    impact: 90,
    riskScore: 76.5,
    status: "identified" as const,
    description: "Potential non-compliance with new FDA guidelines for clinical data management could result in delays and penalties.",
    mitigation: "Implement comprehensive compliance review process and staff training",
    assignedTo: "Legal Team",
    dueDate: "2025-09-01",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()  // 1 day ago
  },
  {
    id: "risk_002", 
    title: "Supply Chain Disruption",
    type: "operational" as const,
    severity: "high" as const,
    probability: 65,
    impact: 75,
    riskScore: 48.75,
    status: "mitigating" as const,
    description: "Key supplier experiencing production delays could impact drug manufacturing timeline and market launch.",
    mitigation: "Identify alternative suppliers and establish backup manufacturing agreements",
    assignedTo: "Supply Chain Team",
    dueDate: "2025-08-15",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 1 week ago
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()  // 2 days ago
  },
  {
    id: "risk_003",
    title: "Clinical Trial Endpoint Risk",
    type: "clinical" as const,
    severity: "high" as const, 
    probability: 70,
    impact: 85,
    riskScore: 59.5,
    status: "analyzing" as const,
    description: "Primary endpoint may not show statistical significance based on interim analysis, requiring protocol amendments.",
    assignedTo: "Clinical Research Team",
    dueDate: "2025-08-30",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()  // 1 day ago
  },
  {
    id: "risk_004",
    title: "Competitive Market Entry",
    type: "strategic" as const,
    severity: "medium" as const,
    probability: 60,
    impact: 55,
    riskScore: 33,
    status: "identified" as const,
    description: "Competitor launching similar product 6 months ahead of schedule could impact market share projections.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "risk_005",
    title: "Data Security Breach",
    type: "technical" as const,
    severity: "medium" as const,
    probability: 30,
    impact: 95,
    riskScore: 28.5,
    status: "resolved" as const,
    description: "Vulnerability in patient data management system could lead to HIPAA violations and data breaches.",
    mitigation: "Implemented multi-factor authentication and enhanced encryption protocols",
    assignedTo: "IT Security Team",
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(), // 2 weeks ago
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()   // 3 days ago
  },
  {
    id: "risk_006",
    title: "Budget Overrun Risk",
    type: "financial" as const,
    severity: "medium" as const,
    probability: 45,
    impact: 60,
    riskScore: 27,
    status: "mitigating" as const,
    description: "R&D costs exceeding budget due to extended clinical trial duration and additional regulatory requirements.",
    mitigation: "Implementing cost control measures and seeking additional funding sources",
    assignedTo: "Finance Team",
    dueDate: "2025-09-15",
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString()   // 4 days ago
  }
];

let nextRiskId = 7;

export function registerRiskAnalyzerRoutes(app: Express) {
  // Get all risk assessments
  app.get("/api/risk-analyzer/assessments", async (req, res) => {
    try {
      res.json(riskAssessments);
    } catch (error) {
      console.error("Error fetching risk assessments:", error);
      res.status(500).json({ error: "Failed to fetch risk assessments" });
    }
  });

  // Get risk metrics
  app.get("/api/risk-analyzer/metrics", async (req, res) => {
    try {
      const totalRisks = riskAssessments.length;
      const criticalRisks = riskAssessments.filter(r => r.severity === 'critical').length;
      const highRisks = riskAssessments.filter(r => r.severity === 'high').length;
      const mediumRisks = riskAssessments.filter(r => r.severity === 'medium').length;
      const lowRisks = riskAssessments.filter(r => r.severity === 'low').length;
      
      const oneWeekAgo = new Date(Date.now() - 86400000 * 7);
      const resolvedRisks = riskAssessments.filter(r => 
        r.status === 'resolved' && new Date(r.updatedAt) > oneWeekAgo
      ).length;
      
      const trendsLastWeek = riskAssessments.filter(r => 
        new Date(r.createdAt) > oneWeekAgo
      ).length;
      
      const avgRiskScore = totalRisks > 0 
        ? riskAssessments.reduce((sum, r) => sum + r.riskScore, 0) / totalRisks
        : 0;

      const metrics = {
        totalRisks,
        criticalRisks,
        highRisks,
        mediumRisks,
        lowRisks,
        resolvedRisks,
        avgRiskScore,
        trendsLastWeek
      };

      res.json(metrics);
    } catch (error) {
      console.error("Error calculating risk metrics:", error);
      res.status(500).json({ error: "Failed to calculate risk metrics" });
    }
  });

  // Create new risk assessment
  app.post("/api/risk-analyzer/assessments", async (req, res) => {
    try {
      const validatedData = riskAssessmentSchema.parse(req.body);
      
      const newRisk = {
        id: `risk_${String(nextRiskId++).padStart(3, '0')}`,
        ...validatedData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      riskAssessments.push(newRisk);
      
      res.status(201).json(newRisk);
    } catch (error) {
      console.error("Error creating risk assessment:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid risk assessment data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create risk assessment" });
      }
    }
  });

  // Update risk assessment
  app.patch("/api/risk-analyzer/assessments/:riskId", async (req, res) => {
    try {
      const { riskId } = req.params;
      const validatedUpdates = updateRiskSchema.parse(req.body);
      
      const riskIndex = riskAssessments.findIndex(r => r.id === riskId);
      if (riskIndex === -1) {
        return res.status(404).json({ error: "Risk assessment not found" });
      }

      riskAssessments[riskIndex] = {
        ...riskAssessments[riskIndex],
        ...validatedUpdates,
        updatedAt: new Date().toISOString()
      };

      res.json(riskAssessments[riskIndex]);
    } catch (error) {
      console.error("Error updating risk assessment:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid update data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update risk assessment" });
      }
    }
  });

  // Delete risk assessment
  app.delete("/api/risk-analyzer/assessments/:riskId", async (req, res) => {
    try {
      const { riskId } = req.params;
      
      const riskIndex = riskAssessments.findIndex(r => r.id === riskId);
      if (riskIndex === -1) {
        return res.status(404).json({ error: "Risk assessment not found" });
      }

      riskAssessments.splice(riskIndex, 1);
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting risk assessment:", error);
      res.status(500).json({ error: "Failed to delete risk assessment" });
    }
  });

  // Get risk assessment by ID
  app.get("/api/risk-analyzer/assessments/:riskId", async (req, res) => {
    try {
      const { riskId } = req.params;
      
      const risk = riskAssessments.find(r => r.id === riskId);
      if (!risk) {
        return res.status(404).json({ error: "Risk assessment not found" });
      }

      res.json(risk);
    } catch (error) {
      console.error("Error fetching risk assessment:", error);
      res.status(500).json({ error: "Failed to fetch risk assessment" });
    }
  });

  // Bulk update risk assessments
  app.patch("/api/risk-analyzer/assessments", async (req, res) => {
    try {
      const { riskIds, updates } = req.body;
      const validatedUpdates = updateRiskSchema.parse(updates);
      
      if (!Array.isArray(riskIds)) {
        return res.status(400).json({ error: "riskIds must be an array" });
      }

      const updatedRisks = [];
      
      for (const riskId of riskIds) {
        const riskIndex = riskAssessments.findIndex(r => r.id === riskId);
        if (riskIndex !== -1) {
          riskAssessments[riskIndex] = {
            ...riskAssessments[riskIndex],
            ...validatedUpdates,
            updatedAt: new Date().toISOString()
          };
          updatedRisks.push(riskAssessments[riskIndex]);
        }
      }

      res.json(updatedRisks);
    } catch (error) {
      console.error("Error bulk updating risk assessments:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid update data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to bulk update risk assessments" });
      }
    }
  });

  // Risk assessment analytics endpoint
  app.get("/api/risk-analyzer/analytics", async (req, res) => {
    try {
      const { timeframe = '30d' } = req.query;
      
      // Calculate date range based on timeframe
      let fromDate: Date;
      switch (timeframe) {
        case '7d':
          fromDate = new Date(Date.now() - 86400000 * 7);
          break;
        case '30d':
          fromDate = new Date(Date.now() - 86400000 * 30);
          break;
        case '90d':
          fromDate = new Date(Date.now() - 86400000 * 90);
          break;
        default:
          fromDate = new Date(Date.now() - 86400000 * 30);
      }

      const filteredRisks = riskAssessments.filter(r => 
        new Date(r.createdAt) >= fromDate
      );

      // Risk type distribution
      const typeDistribution = filteredRisks.reduce((acc, risk) => {
        acc[risk.type] = (acc[risk.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Severity trend over time
      const severityTrend = filteredRisks.reduce((acc, risk) => {
        const date = new Date(risk.createdAt).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { critical: 0, high: 0, medium: 0, low: 0 };
        }
        acc[date][risk.severity]++;
        return acc;
      }, {} as Record<string, Record<string, number>>);

      // Status distribution
      const statusDistribution = filteredRisks.reduce((acc, risk) => {
        acc[risk.status] = (acc[risk.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Average resolution time (for resolved risks)
      const resolvedRisks = filteredRisks.filter(r => r.status === 'resolved');
      const avgResolutionTime = resolvedRisks.length > 0
        ? resolvedRisks.reduce((sum, risk) => {
            const created = new Date(risk.createdAt);
            const updated = new Date(risk.updatedAt);
            return sum + (updated.getTime() - created.getTime());
          }, 0) / resolvedRisks.length / (1000 * 60 * 60 * 24) // Convert to days
        : 0;

      res.json({
        timeframe,
        totalRisks: filteredRisks.length,
        typeDistribution,
        severityTrend,
        statusDistribution,
        avgResolutionTime: Math.round(avgResolutionTime * 10) / 10 // Round to 1 decimal
      });
    } catch (error) {
      console.error("Error fetching risk analytics:", error);
      res.status(500).json({ error: "Failed to fetch risk analytics" });
    }
  });
}