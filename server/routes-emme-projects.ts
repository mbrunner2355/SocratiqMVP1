import type { Express } from "express";
import { db } from "./db";
import { emmeProjects, type InsertEmmeProject } from "../shared/schema";
import { eq, desc, and, like, or } from "drizzle-orm";
import { z } from "zod";

// Validation schemas
const createProjectSchema = z.object({
  projectTitle: z.string().min(1, "Project title is required"),
  client: z.string().min(1, "Client is required"),
  team: z.string().min(1, "Team is required"),
  summary: z.string().min(1, "Summary is required"),
  type: z.enum(["campaign", "clinical_trial", "regulatory_submission", "market_access"]),
  status: z.enum(["draft", "active", "completed", "on_hold", "cancelled"]).optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  phase: z.string().optional(),
  therapeuticArea: z.string().optional(),
  indication: z.string().optional(),
  targetMarkets: z.array(z.string()).optional(),
  timeline: z.record(z.any()).optional(),
  budget: z.record(z.any()).optional(),
  stakeholders: z.array(z.any()).optional(),
  documents: z.array(z.any()).optional(),
  risks: z.array(z.any()).optional(),
  milestones: z.array(z.any()).optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
  assignedTo: z.string().optional(),
  startDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
});

const updateProjectSchema = createProjectSchema.partial();

const queryParamsSchema = z.object({
  status: z.string().optional(),
  type: z.string().optional(),
  client: z.string().optional(),
  search: z.string().optional(),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 50),
  offset: z.string().optional().transform(val => val ? parseInt(val) : 0),
});

export function registerEMMEProjectRoutes(app: Express) {
  
  // Get all EMME projects with filtering and pagination
  app.get("/api/emme/projects", async (req, res) => {
    try {
      const query = queryParamsSchema.parse(req.query);
      
      let whereConditions = [];
      
      if (query.status) {
        whereConditions.push(eq(emmeProjects.status, query.status as any));
      }
      
      if (query.type) {
        whereConditions.push(eq(emmeProjects.type, query.type as any));
      }
      
      if (query.client) {
        whereConditions.push(eq(emmeProjects.client, query.client as any));
      }
      
      if (query.search) {
        whereConditions.push(
          or(
            like(emmeProjects.projectTitle, `%${query.search}%` as any),
            like(emmeProjects.summary, `%${query.search}%` as any),
            like(emmeProjects.client, `%${query.search}%` as any),
            like(emmeProjects.team, `%${query.search}%` as any)
          ) as any
        );
      }
      
      const whereClause = whereConditions.length > 0 
        ? and(...whereConditions) 
        : undefined;
      
      const projects = await db
        .select()
        .from(emmeProjects)
        .where(whereClause)
        .orderBy(desc(emmeProjects.lastUpdated))
        .limit(query.limit)
        .offset(query.offset);
      
      // Get total count for pagination
      const totalCount = await db
        .select({ count: emmeProjects.id })
        .from(emmeProjects)
        .where(whereClause);
      
      res.json({
        projects,
        pagination: {
          total: totalCount.length,
          limit: query.limit,
          offset: query.offset,
          hasMore: totalCount.length > query.offset + query.limit
        }
      });
    } catch (error) {
      console.error("Error fetching EMME projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Get specific EMME project by ID
  app.get("/api/emme/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const [project] = await db
        .select()
        .from(emmeProjects)
        .where(eq(emmeProjects.id, id));
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error fetching EMME project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // Create new EMME project
  app.post("/api/emme/projects", async (req, res) => {
    try {
      const validatedData = createProjectSchema.parse(req.body);
      
      // Get user ID from auth context (simplified for now)
      const userId = "emme-user"; // This should come from authentication
      
      const projectData: InsertEmmeProject = {
        ...validatedData,
        createdBy: userId,
        targetMarkets: validatedData.targetMarkets || [],
        timeline: validatedData.timeline || {},
        budget: validatedData.budget || {},
        stakeholders: validatedData.stakeholders || [],
        documents: validatedData.documents || [],
        risks: validatedData.risks || [],
        milestones: validatedData.milestones || [],
        tags: validatedData.tags || [],
        metadata: validatedData.metadata || {},
      };
      
      const [newProject] = await db
        .insert(emmeProjects)
        .values(projectData)
        .returning();
      
      res.status(201).json(newProject);
    } catch (error) {
      console.error("Error creating EMME project:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  // Update EMME project
  app.put("/api/emme/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updateProjectSchema.parse(req.body);
      
      // Remove undefined values
      const updateData = Object.fromEntries(
        Object.entries(validatedData).filter(([_, value]) => value !== undefined)
      );
      
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "No valid fields to update" });
      }
      
      const [updatedProject] = await db
        .update(emmeProjects)
        .set({ ...updateData, lastUpdated: new Date() })
        .where(eq(emmeProjects.id, id))
        .returning();
      
      if (!updatedProject) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      res.json(updatedProject);
    } catch (error) {
      console.error("Error updating EMME project:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  // Delete EMME project
  app.delete("/api/emme/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const [deletedProject] = await db
        .delete(emmeProjects)
        .where(eq(emmeProjects.id, id))
        .returning();
      
      if (!deletedProject) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting EMME project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Get project analytics/dashboard data
  app.get("/api/emme/projects/analytics/overview", async (req, res) => {
    try {
      // Get project counts by status
      const statusCounts = await db
        .select({
          status: emmeProjects.status,
          count: emmeProjects.id
        })
        .from(emmeProjects);
      
      // Get project counts by type
      const typeCounts = await db
        .select({
          type: emmeProjects.type,
          count: emmeProjects.id
        })
        .from(emmeProjects);
      
      // Get recent projects
      const recentProjects = await db
        .select()
        .from(emmeProjects)
        .orderBy(desc(emmeProjects.lastUpdated))
        .limit(5);
      
      // Calculate analytics
      const totalProjects = statusCounts.length;
      const activeProjects = statusCounts.filter(p => p.status === 'active').length;
      const completedProjects = statusCounts.filter(p => p.status === 'completed').length;
      const draftProjects = statusCounts.filter(p => p.status === 'draft').length;
      
      res.json({
        summary: {
          totalProjects,
          activeProjects,
          completedProjects,
          draftProjects,
          completionRate: totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0
        },
        statusDistribution: statusCounts,
        typeDistribution: typeCounts,
        recentProjects
      });
    } catch (error) {
      console.error("Error fetching EMME project analytics:", error);
      res.status(500).json({ error: "Failed to fetch project analytics" });
    }
  });

  // Get unique clients for dropdown
  app.get("/api/emme/projects/clients", async (req, res) => {
    try {
      const clients = await db
        .selectDistinct({ client: emmeProjects.client })
        .from(emmeProjects)
        .orderBy(emmeProjects.client);
      
      res.json(clients.map(c => c.client));
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  // Get unique teams for dropdown
  app.get("/api/emme/projects/teams", async (req, res) => {
    try {
      const teams = await db
        .selectDistinct({ team: emmeProjects.team })
        .from(emmeProjects)
        .orderBy(emmeProjects.team);
      
      res.json(teams.map(t => t.team));
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ error: "Failed to fetch teams" });
    }
  });

  // Migration endpoint to import projects from localStorage backup
  app.post("/api/emme/projects/import-backup", async (req, res) => {
    try {
      const { projects } = req.body;
      
      if (!projects || !Array.isArray(projects)) {
        return res.status(400).json({ error: "Projects array is required" });
      }

      const importResults = [];
      
      for (const project of projects) {
        try {
          // Map localStorage project structure to database schema
          const projectData: InsertEmmeProject = {
            projectTitle: project.name || project.projectTitle || 'Imported Project',
            client: project.client || 'Unknown Client',
            team: project.team || 'Unknown Team',
            summary: project.summary || 'Imported from localStorage backup',
            type: project.organizationType === 'pharmaceutical' ? 'campaign' : 'campaign',
            status: project.status || 'draft',
            therapeuticArea: project.therapeuticArea,
            createdBy: 'import-user',
            metadata: {
              importedFromLocalStorage: true,
              importDate: new Date().toISOString(),
              originalData: project
            },
            targetMarkets: [],
            timeline: {},
            budget: {},
            stakeholders: [],
            documents: [],
            risks: [],
            milestones: [],
            tags: []
          };

          const [newProject] = await db
            .insert(emmeProjects)
            .values(projectData)
            .returning();

          importResults.push({
            success: true,
            originalId: project.id,
            newId: newProject.id,
            projectName: project.name || project.projectTitle
          });
        } catch (error) {
          console.error('Error importing individual project:', error);
          importResults.push({
            success: false,
            originalId: project.id,
            error: error instanceof Error ? error.message : 'Unknown error',
            projectName: project.name || project.projectTitle
          });
        }
      }

      res.json({
        message: `Import completed. ${importResults.filter(r => r.success).length} of ${projects.length} projects imported successfully.`,
        results: importResults
      });
    } catch (error) {
      console.error("Error importing projects backup:", error);
      res.status(500).json({ error: "Failed to import projects backup" });
    }
  });
}