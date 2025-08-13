import type { Express } from "express";
import { db } from "./db";
import { 
  transformJobs,
  auditEvents,
  constructionProjects,
  aiAgents,
  agentTasks,
  systemMetrics,
  documents,
  entities,
  type InsertTransformJob,
  type InsertAuditEvent,
  type InsertConstructionProject,
  type InsertAIAgent,
  type InsertAgentTask,
  type InsertSystemMetric
} from "@shared/schema";
import { eq, desc, and, or, sql, count, avg } from "drizzle-orm";
import { isAuthenticated } from "./replitAuth";

export function registerPlatformCoreRoutes(app: Express) {
  // Transform™ - Document Processing Pipeline Routes
  
  // Get all transform jobs with status filtering
  app.get('/api/transform/jobs', isAuthenticated, async (req, res) => {
    try {
      const { status, documentId } = req.query;
      let query = db.select().from(transformJobs);
      
      if (status) {
        query = query.where(eq(transformJobs.status, status as string));
      }
      if (documentId) {
        query = query.where(eq(transformJobs.documentId, documentId as string));
      }
      
      const jobs = await query.orderBy(desc(transformJobs.createdAt));
      res.json(jobs);
    } catch (error) {
      console.error('Error fetching transform jobs:', error);
      res.status(500).json({ error: 'Failed to fetch transform jobs' });
    }
  });

  // Create new transform job (typically called by AI agents)
  app.post('/api/transform/jobs', isAuthenticated, async (req, res) => {
    try {
      const jobData: InsertTransformJob = {
        documentId: req.body.documentId,
        jobType: req.body.jobType,
        inputData: req.body.inputData,
        priority: req.body.priority || 5,
        agentId: req.body.agentId
      };

      const [newJob] = await db.insert(transformJobs).values(jobData).returning();
      res.json(newJob);
    } catch (error) {
      console.error('Error creating transform job:', error);
      res.status(500).json({ error: 'Failed to create transform job' });
    }
  });

  // Update transform job progress/status (called by processing agents)
  app.patch('/api/transform/jobs/:id', isAuthenticated, async (req, res) => {
    try {
      const [updatedJob] = await db
        .update(transformJobs)
        .set({
          status: req.body.status,
          progress: req.body.progress,
          outputData: req.body.outputData,
          errorMessage: req.body.errorMessage,
          processingTimeMs: req.body.processingTimeMs,
          startedAt: req.body.status === 'processing' ? new Date() : undefined,
          completedAt: req.body.status === 'completed' ? new Date() : undefined,
          updatedAt: new Date()
        })
        .where(eq(transformJobs.id, req.params.id))
        .returning();

      res.json(updatedJob);
    } catch (error) {
      console.error('Error updating transform job:', error);
      res.status(500).json({ error: 'Failed to update transform job' });
    }
  });

  // Mesh™ - Knowledge Graph System Routes
  // Note: Knowledge nodes and relationships are handled by existing graph system

  // Trace™ - Audit and Compliance System Routes

  // Get audit events with filtering
  app.get('/api/trace/events', isAuthenticated, async (req, res) => {
    try {
      const { entityType, action, riskLevel, startDate, endDate, limit = 100 } = req.query;
      let query = db.select().from(auditEvents);
      
      const conditions = [];
      if (entityType) conditions.push(eq(auditEvents.entityType, entityType as string));
      if (action) conditions.push(eq(auditEvents.action, action as string));
      if (riskLevel) conditions.push(eq(auditEvents.riskLevel, riskLevel as string));
      if (startDate) conditions.push(sql`${auditEvents.createdAt} >= ${startDate}`);
      if (endDate) conditions.push(sql`${auditEvents.createdAt} <= ${endDate}`);
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const events = await query
        .orderBy(desc(auditEvents.createdAt))
        .limit(parseInt(limit as string));
      
      res.json(events);
    } catch (error) {
      console.error('Error fetching audit events:', error);
      res.status(500).json({ error: 'Failed to fetch audit events' });
    }
  });

  // Create audit event (called by all platform operations)
  app.post('/api/trace/events', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      
      const eventData: InsertAuditEvent = {
        eventType: req.body.eventType,
        entityType: req.body.entityType,
        entityId: req.body.entityId,
        action: req.body.action,
        userId: userId,
        agentId: req.body.agentId,
        sessionId: req.sessionID,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        beforeState: req.body.beforeState || {},
        afterState: req.body.afterState || {},
        metadata: req.body.metadata || {},
        riskLevel: req.body.riskLevel || 'low',
        complianceStatus: req.body.complianceStatus || 'compliant',
        traceHash: req.body.traceHash,
        parentTraceId: req.body.parentTraceId
      };

      const [newEvent] = await db.insert(auditEvents).values(eventData).returning();
      res.json(newEvent);
    } catch (error) {
      console.error('Error creating audit event:', error);
      res.status(500).json({ error: 'Failed to create audit event' });
    }
  });

  // Compliance rules endpoint (placeholder - will use existing compliance tables)
  app.get('/api/trace/compliance-rules', isAuthenticated, async (req, res) => {
    try {
      // This will integrate with existing compliance policies table
      res.json([]);
    } catch (error) {
      console.error('Error fetching compliance rules:', error);
      res.status(500).json({ error: 'Failed to fetch compliance rules' });
    }
  });

  // Build™ - Construction Project Intelligence Routes

  // Get construction projects
  app.get('/api/build/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const { status, projectType } = req.query;
      
      let query = db.select().from(constructionProjects).where(eq(constructionProjects.userId, userId));
      
      if (status) {
        query = query.where(eq(constructionProjects.status, status as string));
      }
      if (projectType) {
        query = query.where(eq(constructionProjects.projectType, projectType as string));
      }
      
      const projects = await query.orderBy(desc(constructionProjects.createdAt));
      res.json(projects);
    } catch (error) {
      console.error('Error fetching construction projects:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  // Create construction project
  app.post('/api/build/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      
      const projectData: InsertConstructionProject = {
        ...req.body,
        userId: userId
      };

      const [newProject] = await db.insert(constructionProjects).values(projectData).returning();
      res.json(newProject);
    } catch (error) {
      console.error('Error creating construction project:', error);
      res.status(500).json({ error: 'Failed to create project' });
    }
  });

  // Get risk assessments for a project (placeholder - will be implemented with Build module)
  app.get('/api/build/projects/:projectId/risks', isAuthenticated, async (req, res) => {
    try {
      // This will be implemented when Build Risk Assessment table is available
      res.json([]);
    } catch (error) {
      console.error('Error fetching project risks:', error);
      res.status(500).json({ error: 'Failed to fetch project risks' });
    }
  });

  // Profile™ - Asset Profiling System Routes
  // Note: Profile system will be implemented with existing user/document profiling

  // AI Agent System Routes

  // Get all AI agents and their status
  app.get('/api/agents', isAuthenticated, async (req, res) => {
    try {
      const { agentType, status } = req.query;
      let query = db.select().from(aiAgents);
      
      if (agentType) {
        query = query.where(eq(aiAgents.agentType, agentType as string));
      }
      if (status) {
        query = query.where(eq(aiAgents.status, status as string));
      }
      
      const agents = await query.orderBy(desc(aiAgents.lastActivity));
      res.json(agents);
    } catch (error) {
      console.error('Error fetching AI agents:', error);
      res.status(500).json({ error: 'Failed to fetch AI agents' });
    }
  });

  // Get agent tasks
  app.get('/api/agents/:agentId/tasks', isAuthenticated, async (req, res) => {
    try {
      const { status, limit = 50 } = req.query;
      let query = db.select().from(agentTasks).where(eq(agentTasks.agentId, req.params.agentId));
      
      if (status) {
        query = query.where(eq(agentTasks.status, status as string));
      }
      
      const tasks = await query
        .orderBy(desc(agentTasks.createdAt))
        .limit(parseInt(limit as string));
      
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching agent tasks:', error);
      res.status(500).json({ error: 'Failed to fetch agent tasks' });
    }
  });

  // Create agent task
  app.post('/api/agents/:agentId/tasks', isAuthenticated, async (req, res) => {
    try {
      const taskData: InsertAgentTask = {
        agentId: req.params.agentId,
        taskType: req.body.taskType,
        taskData: req.body.taskData,
        priority: req.body.priority || 5
      };

      const [newTask] = await db.insert(agentTasks).values(taskData).returning();
      res.json(newTask);
    } catch (error) {
      console.error('Error creating agent task:', error);
      res.status(500).json({ error: 'Failed to create agent task' });
    }
  });

  // System Monitoring Routes

  // Get system metrics
  app.get('/api/system/metrics', isAuthenticated, async (req, res) => {
    try {
      const { metricType, startTime, endTime, limit = 100 } = req.query;
      let query = db.select().from(systemMetrics);
      
      const conditions = [];
      if (metricType) conditions.push(eq(systemMetrics.metricType, metricType as string));
      if (startTime) conditions.push(sql`${systemMetrics.timestamp} >= ${startTime}`);
      if (endTime) conditions.push(sql`${systemMetrics.timestamp} <= ${endTime}`);
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const metrics = await query
        .orderBy(desc(systemMetrics.timestamp))
        .limit(parseInt(limit as string));
      
      res.json(metrics);
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      res.status(500).json({ error: 'Failed to fetch system metrics' });
    }
  });

  // Platform Analytics Dashboard
  app.get('/api/platform/analytics', isAuthenticated, async (req, res) => {
    try {
      // Get comprehensive platform statistics
      const [stats] = await db
        .select({
          totalDocuments: count(sql`DISTINCT ${documents.id}`),
          totalEntities: count(sql`DISTINCT ${entities.id}`),
          activeAgents: count(sql`CASE WHEN ${aiAgents.status} = 'active' THEN 1 END`),
          totalTransformJobs: count(sql`DISTINCT ${transformJobs.id}`),
        })
        .from(documents)
        .leftJoin(entities, eq(documents.id, entities.documentId))

        .leftJoin(aiAgents, sql`true`)
        .leftJoin(transformJobs, sql`true`);

      // Get processing pipeline status
      const [pipelineStats] = await db
        .select({
          queuedJobs: count(sql`CASE WHEN ${transformJobs.status} = 'queued' THEN 1 END`),
          processingJobs: count(sql`CASE WHEN ${transformJobs.status} = 'processing' THEN 1 END`),
          completedJobs: count(sql`CASE WHEN ${transformJobs.status} = 'completed' THEN 1 END`),
          failedJobs: count(sql`CASE WHEN ${transformJobs.status} = 'failed' THEN 1 END`),
          avgProcessingTime: avg(transformJobs.processingTimeMs)
        })
        .from(transformJobs);

      const result = {
        ...stats,
        ...pipelineStats,
        systemHealth: 'healthy', // This would be calculated based on metrics
        lastUpdated: new Date().toISOString()
      };

      res.json(result);
    } catch (error) {
      console.error('Error fetching platform analytics:', error);
      res.status(500).json({ error: 'Failed to fetch platform analytics' });
    }
  });
}