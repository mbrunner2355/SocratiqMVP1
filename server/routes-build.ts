import { Router } from 'express';
import { storage } from './storage';
import { 
  insertConstructionProjectSchema, 
  insertProjectTaskSchema, 
  insertProjectResourceSchema,
  insertProjectBudgetSchema,
  insertChangeOrderSchema,
  insertRiskAssessmentSchema
} from '@shared/schema';
import { z } from 'zod';
import { randomUUID } from 'crypto';

const router = Router();

// =====================================
// SocratIQ Build™ Module API Routes - Construction Project Intelligence
// =====================================

// Mock data store for construction projects (in production, use database)
const mockConstructionProjects: any[] = [];
const mockProjectTasks: any[] = [];
const mockProjectResources: any[] = [];
const mockProjectBudgets: any[] = [];
const mockChangeOrders: any[] = [];
const mockRiskAssessments: any[] = [];

// Construction Project Management Routes
router.get('/projects', async (req, res) => {
  try {
    const { type, status, projectManager } = req.query;
    let projects = [...mockConstructionProjects];

    if (type) projects = projects.filter(p => p.type === type);
    if (status) projects = projects.filter(p => p.status === status);
    if (projectManager) projects = projects.filter(p => p.projectManager === projectManager);

    res.json(projects);
  } catch (error) {
    console.error('Get construction projects error:', error);
    res.status(500).json({ error: 'Failed to retrieve construction projects' });
  }
});

router.get('/projects/:id', async (req, res) => {
  try {
    const project = mockConstructionProjects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Construction project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Get construction project error:', error);
    res.status(500).json({ error: 'Failed to retrieve construction project' });
  }
});

router.post('/projects', async (req, res) => {
  try {
    const projectData = insertConstructionProjectSchema.parse(req.body);
    const project = {
      id: randomUUID(),
      ...projectData,
      currentCost: 0,
      percentComplete: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockConstructionProjects.push(project);
    res.status(201).json({
      message: 'Construction project created successfully',
      project
    });
  } catch (error) {
    console.error('Create construction project error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid project data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create construction project' });
  }
});

router.put('/projects/:id', async (req, res) => {
  try {
    const projectIndex = mockConstructionProjects.findIndex(p => p.id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Construction project not found' });
    }

    const updates = req.body;
    mockConstructionProjects[projectIndex] = {
      ...mockConstructionProjects[projectIndex],
      ...updates,
      updatedAt: new Date()
    };

    res.json({
      message: 'Construction project updated successfully',
      project: mockConstructionProjects[projectIndex]
    });
  } catch (error) {
    console.error('Update construction project error:', error);
    res.status(500).json({ error: 'Failed to update construction project' });
  }
});

// Project Task Management Routes
router.get('/projects/:projectId/tasks', async (req, res) => {
  try {
    const tasks = mockProjectTasks.filter(t => t.projectId === req.params.projectId);
    res.json(tasks);
  } catch (error) {
    console.error('Get project tasks error:', error);
    res.status(500).json({ error: 'Failed to retrieve project tasks' });
  }
});

router.post('/projects/:projectId/tasks', async (req, res) => {
  try {
    const taskData = insertProjectTaskSchema.parse(req.body);
    const task = {
      id: randomUUID(),
      projectId: req.params.projectId,
      ...taskData,
      actualCost: 0,
      percentComplete: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockProjectTasks.push(task);
    res.status(201).json({
      message: 'Project task created successfully',
      task
    });
  } catch (error) {
    console.error('Create project task error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid task data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create project task' });
  }
});

// Project Resource Management Routes
router.get('/projects/:projectId/resources', async (req, res) => {
  try {
    const resources = mockProjectResources.filter(r => r.projectId === req.params.projectId);
    res.json(resources);
  } catch (error) {
    console.error('Get project resources error:', error);
    res.status(500).json({ error: 'Failed to retrieve project resources' });
  }
});

router.post('/projects/:projectId/resources', async (req, res) => {
  try {
    const resourceData = insertProjectResourceSchema.parse(req.body);
    const resource = {
      id: randomUUID(),
      projectId: req.params.projectId,
      ...resourceData,
      utilization: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockProjectResources.push(resource);
    res.status(201).json({
      message: 'Project resource created successfully',
      resource
    });
  } catch (error) {
    console.error('Create project resource error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid resource data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create project resource' });
  }
});

// Project Budget Management Routes
router.get('/projects/:projectId/budgets', async (req, res) => {
  try {
    const budgets = mockProjectBudgets.filter(b => b.projectId === req.params.projectId);
    res.json(budgets);
  } catch (error) {
    console.error('Get project budgets error:', error);
    res.status(500).json({ error: 'Failed to retrieve project budgets' });
  }
});

router.post('/projects/:projectId/budgets', async (req, res) => {
  try {
    const budgetData = insertProjectBudgetSchema.parse(req.body);
    const budget = {
      id: randomUUID(),
      projectId: req.params.projectId,
      ...budgetData,
      actualAmount: 0,
      variance: 0,
      variancePercent: 0,
      isApproved: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockProjectBudgets.push(budget);
    res.status(201).json({
      message: 'Project budget created successfully',
      budget
    });
  } catch (error) {
    console.error('Create project budget error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid budget data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create project budget' });
  }
});

// Change Order Management Routes
router.get('/projects/:projectId/change-orders', async (req, res) => {
  try {
    const changeOrders = mockChangeOrders.filter(c => c.projectId === req.params.projectId);
    res.json(changeOrders);
  } catch (error) {
    console.error('Get change orders error:', error);
    res.status(500).json({ error: 'Failed to retrieve change orders' });
  }
});

router.post('/projects/:projectId/change-orders', async (req, res) => {
  try {
    const changeOrderData = insertChangeOrderSchema.parse(req.body);
    const changeOrder = {
      id: randomUUID(),
      projectId: req.params.projectId,
      orderNumber: `CO-${Date.now()}`,
      ...changeOrderData,
      status: 'pending',
      requestDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockChangeOrders.push(changeOrder);
    res.status(201).json({
      message: 'Change order created successfully',
      changeOrder
    });
  } catch (error) {
    console.error('Create change order error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid change order data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create change order' });
  }
});

router.put('/change-orders/:id/approve', async (req, res) => {
  try {
    const { approvedBy, notes } = req.body;
    const changeOrderIndex = mockChangeOrders.findIndex(c => c.id === req.params.id);
    
    if (changeOrderIndex === -1) {
      return res.status(404).json({ error: 'Change order not found' });
    }

    mockChangeOrders[changeOrderIndex] = {
      ...mockChangeOrders[changeOrderIndex],
      status: 'approved',
      approvedBy,
      approvalDate: new Date(),
      notes,
      updatedAt: new Date()
    };

    res.json({
      message: 'Change order approved successfully',
      changeOrder: mockChangeOrders[changeOrderIndex]
    });
  } catch (error) {
    console.error('Approve change order error:', error);
    res.status(500).json({ error: 'Failed to approve change order' });
  }
});

// Risk Assessment Management Routes
router.get('/projects/:projectId/risks', async (req, res) => {
  try {
    const risks = mockRiskAssessments.filter(r => r.projectId === req.params.projectId);
    res.json(risks);
  } catch (error) {
    console.error('Get risk assessments error:', error);
    res.status(500).json({ error: 'Failed to retrieve risk assessments' });
  }
});

router.post('/projects/:projectId/risks', async (req, res) => {
  try {
    const riskData = insertRiskAssessmentSchema.parse(req.body);
    const risk = {
      id: randomUUID(),
      projectId: req.params.projectId,
      ...riskData,
      riskScore: riskData.probability * riskData.impact,
      status: 'active',
      identifiedDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockRiskAssessments.push(risk);
    res.status(201).json({
      message: 'Risk assessment created successfully',
      risk
    });
  } catch (error) {
    console.error('Create risk assessment error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid risk data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create risk assessment' });
  }
});

// Construction Analytics and Intelligence Routes
router.get('/analytics', async (req, res) => {
  try {
    const projects = mockConstructionProjects;
    const tasks = mockProjectTasks;
    const budgets = mockProjectBudgets;
    const risks = mockRiskAssessments;

    const analytics = {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      projectsByType: projects.reduce((acc, p) => {
        acc[p.type] = (acc[p.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      criticalPathTasks: tasks.filter(t => t.isCriticalPath).length,
      
      totalBudget: budgets.reduce((sum, b) => sum + (b.budgetedAmount || 0), 0),
      actualSpend: budgets.reduce((sum, b) => sum + (b.actualAmount || 0), 0),
      budgetVariance: budgets.reduce((sum, b) => sum + (b.variance || 0), 0),
      
      riskCount: risks.length,
      highRisks: risks.filter(r => r.riskScore > 0.7).length,
      activeRisks: risks.filter(r => r.status === 'active').length,
      
      // Schedule optimization metrics
      schedulePerformance: {
        onTimeProjects: projects.filter(p => p.percentComplete >= 90 && p.status === 'active').length,
        delayedProjects: projects.filter(p => p.percentComplete < 50 && p.status === 'active').length,
        avgCompletion: projects.reduce((sum, p) => sum + (p.percentComplete || 0), 0) / Math.max(projects.length, 1)
      },
      
      // Cost management metrics  
      costPerformance: {
        underBudgetProjects: projects.filter(p => p.currentCost < p.plannedBudget * 0.95).length,
        overBudgetProjects: projects.filter(p => p.currentCost > p.plannedBudget * 1.05).length,
        avgCostVariance: budgets.reduce((sum, b) => sum + Math.abs(b.variancePercent || 0), 0) / Math.max(budgets.length, 1)
      }
    };

    res.json(analytics);
  } catch (error) {
    console.error('Get construction analytics error:', error);
    res.status(500).json({ error: 'Failed to retrieve construction analytics' });
  }
});

// Schedule Optimization Routes
router.post('/projects/:projectId/optimize-schedule', async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = mockConstructionProjects.find(p => p.id === projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const tasks = mockProjectTasks.filter(t => t.projectId === projectId);
    const resources = mockProjectResources.filter(r => r.projectId === projectId);

    // Mock schedule optimization analysis
    const optimization = {
      currentSchedule: {
        totalDays: 180,
        criticalPathDays: 160,
        slackDays: 20
      },
      optimizedSchedule: {
        totalDays: 165,
        criticalPathDays: 150,
        slackDays: 15,
        improvementDays: 15
      },
      recommendations: [
        {
          type: 'RESOURCE_REALLOCATION',
          description: 'Reallocate skilled labor from non-critical tasks to critical path',
          impact: '8 days schedule reduction',
          priority: 'HIGH'
        },
        {
          type: 'PARALLEL_EXECUTION',
          description: 'Execute foundation and site prep tasks in parallel',
          impact: '5 days schedule reduction',
          priority: 'MEDIUM'
        },
        {
          type: 'EARLY_PROCUREMENT',
          description: 'Order steel materials 2 weeks earlier to avoid delays',
          impact: '2 days buffer increase',
          priority: 'MEDIUM'
        }
      ],
      riskFactors: [
        {
          factor: 'Weather delays',
          probability: 0.3,
          impact: '5-10 days',
          mitigation: 'Build weather contingency into schedule'
        },
        {
          factor: 'Material delivery delays',
          probability: 0.2,
          impact: '3-7 days',
          mitigation: 'Establish backup suppliers'
        }
      ]
    };

    res.json({
      message: 'Schedule optimization analysis completed',
      optimization
    });
  } catch (error) {
    console.error('Schedule optimization error:', error);
    res.status(500).json({ error: 'Failed to optimize schedule' });
  }
});

// Cost Variance Analysis Routes
router.get('/projects/:projectId/cost-analysis', async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = mockConstructionProjects.find(p => p.id === projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const budgets = mockProjectBudgets.filter(b => b.projectId === projectId);
    
    const costAnalysis = {
      summary: {
        totalBudget: project.plannedBudget,
        actualCost: project.currentCost,
        variance: project.currentCost - project.plannedBudget,
        variancePercent: ((project.currentCost - project.plannedBudget) / project.plannedBudget) * 100,
        forecastAtCompletion: project.plannedBudget * 1.08 // Mock forecast
      },
      categoryBreakdown: budgets.map(budget => ({
        category: budget.category,
        budgeted: budget.budgetedAmount,
        actual: budget.actualAmount,
        variance: budget.variance,
        variancePercent: budget.variancePercent
      })),
      trends: [
        { month: 'Jan', budgeted: 100000, actual: 98000 },
        { month: 'Feb', budgeted: 150000, actual: 155000 },
        { month: 'Mar', budgeted: 200000, actual: 210000 },
        { month: 'Apr', budgeted: 180000, actual: 175000 }
      ],
      alerts: [
        {
          type: 'OVERRUN_WARNING',
          message: 'Labor costs exceeding budget by 8%',
          severity: 'MEDIUM',
          recommendation: 'Review labor allocation and productivity'
        }
      ]
    };

    res.json(costAnalysis);
  } catch (error) {
    console.error('Cost analysis error:', error);
    res.status(500).json({ error: 'Failed to generate cost analysis' });
  }
});

export default router;