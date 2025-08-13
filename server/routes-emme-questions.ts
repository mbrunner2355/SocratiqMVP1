import type { Express } from "express";
import { emmeQuestions, emmeQuestionResults, type InsertEmmeQuestion, type InsertEmmeQuestionResult } from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, and } from "drizzle-orm";
import { insertEmmeQuestionSchema, insertEmmeQuestionResultSchema } from "@shared/schema";
import { AdvancedNLPService } from "./services/advancedNLP";

export function registerEMMEQuestionRoutes(app: Express) {
  // Get all EMME questions with optional filtering
  app.get("/api/emme/questions", async (req, res) => {
    try {
      const { 
        search, 
        questionType, 
        domain, 
        priority, 
        riskLevel, 
        isActive = "true",
        limit = "50",
        offset = "0" 
      } = req.query;

      let query = db.select().from(emmeQuestions);
      const conditions = [];

      // Build where conditions
      if (isActive !== "all") {
        conditions.push(eq(emmeQuestions.isActive, isActive === "true"));
      }
      
      if (questionType) {
        conditions.push(eq(emmeQuestions.questionType, questionType as string));
      }
      
      if (domain) {
        conditions.push(eq(emmeQuestions.domain, domain as string));
      }
      
      if (priority) {
        conditions.push(eq(emmeQuestions.priority, priority as string));
      }
      
      if (riskLevel) {
        conditions.push(eq(emmeQuestions.riskLevel, riskLevel as string));
      }
      
      if (search) {
        conditions.push(like(emmeQuestions.questionText, `%${search}%`));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      const questions = await query
        .orderBy(desc(emmeQuestions.createdAt))
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));

      res.json({
        success: true,
        questions,
        pagination: {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          total: questions.length
        }
      });
    } catch (error) {
      console.error("Error fetching EMME questions:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch EMME questions" 
      });
    }
  });

  // Get EMME questions statistics
  app.get("/api/emme/questions/stats", async (req, res) => {
    try {
      // This would typically use proper aggregation queries
      // For now, we'll use basic queries
      const totalQuestions = await db.select().from(emmeQuestions);
      const activeQuestions = totalQuestions.filter(q => q.isActive);
      const processedQuestions = await db.select().from(emmeQuestionResults);

      const stats = {
        total: totalQuestions.length,
        active: activeQuestions.length,
        inactive: totalQuestions.length - activeQuestions.length,
        processed: processedQuestions.length,
        byType: {},
        byDomain: {},
        byRiskLevel: {},
        recentActivity: processedQuestions
          .sort((a, b) => new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime())
          .slice(0, 10)
      };

      // Group by categories
      for (const question of totalQuestions) {
        stats.byType[question.questionType] = (stats.byType[question.questionType] || 0) + 1;
        stats.byDomain[question.domain] = (stats.byDomain[question.domain] || 0) + 1;
        stats.byRiskLevel[question.riskLevel] = (stats.byRiskLevel[question.riskLevel] || 0) + 1;
      }

      res.json({
        success: true,
        stats
      });
    } catch (error) {
      console.error("Error fetching EMME questions stats:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch stats" 
      });
    }
  });

  // Get a specific EMME question by ID
  app.get("/api/emme/questions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const [question] = await db
        .select()
        .from(emmeQuestions)
        .where(eq(emmeQuestions.id, id));

      if (!question) {
        return res.status(404).json({ 
          success: false, 
          error: "Question not found" 
        });
      }

      // Also get processing results for this question
      const results = await db
        .select()
        .from(emmeQuestionResults)
        .where(eq(emmeQuestionResults.questionId, id))
        .orderBy(desc(emmeQuestionResults.processedAt));

      res.json({
        success: true,
        question,
        processingResults: results
      });
    } catch (error) {
      console.error("Error fetching EMME question:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch EMME question" 
      });
    }
  });

  // Create a new EMME question
  app.post("/api/emme/questions", async (req, res) => {
    try {
      const validatedData = insertEmmeQuestionSchema.parse(req.body);
      
      const [newQuestion] = await db
        .insert(emmeQuestions)
        .values(validatedData)
        .returning();

      res.status(201).json({
        success: true,
        question: newQuestion
      });
    } catch (error) {
      console.error("Error creating EMME question:", error);
      res.status(400).json({ 
        success: false, 
        error: "Failed to create EMME question",
        details: error.message 
      });
    }
  });

  // Update an EMME question
  app.put("/api/emme/questions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertEmmeQuestionSchema.partial().parse(req.body);
      
      const [updatedQuestion] = await db
        .update(emmeQuestions)
        .set({ ...validatedData, updatedAt: new Date() })
        .where(eq(emmeQuestions.id, id))
        .returning();

      if (!updatedQuestion) {
        return res.status(404).json({ 
          success: false, 
          error: "Question not found" 
        });
      }

      res.json({
        success: true,
        question: updatedQuestion
      });
    } catch (error) {
      console.error("Error updating EMME question:", error);
      res.status(400).json({ 
        success: false, 
        error: "Failed to update EMME question",
        details: error.message 
      });
    }
  });

  // Delete an EMME question (soft delete by setting isActive to false)
  app.delete("/api/emme/questions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const [deletedQuestion] = await db
        .update(emmeQuestions)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(emmeQuestions.id, id))
        .returning();

      if (!deletedQuestion) {
        return res.status(404).json({ 
          success: false, 
          error: "Question not found" 
        });
      }

      res.json({
        success: true,
        message: "Question deactivated successfully"
      });
    } catch (error) {
      console.error("Error deleting EMME question:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to delete EMME question" 
      });
    }
  });

  // Process an EMME question with advanced NLP
  app.post("/api/emme/questions/:id/process", async (req, res) => {
    try {
      const { id } = req.params;
      const { agentId, context } = req.body;
      
      // Get the question
      const [question] = await db
        .select()
        .from(emmeQuestions)
        .where(eq(emmeQuestions.id, id));

      if (!question) {
        return res.status(404).json({ 
          success: false, 
          error: "Question not found" 
        });
      }

      if (!question.isActive) {
        return res.status(400).json({ 
          success: false, 
          error: "Question is not active" 
        });
      }

      // Initialize advanced NLP service
      const nlpService = new AdvancedNLPService();
      await nlpService.initialize();

      // Process the question with context
      const startTime = Date.now();
      const analysis = await nlpService.processEMMEQuestion(
        question.questionText, 
        context || question.context
      );
      const processingTime = Date.now() - startTime;

      // Store the processing result
      const resultData: InsertEmmeQuestionResult = {
        questionId: id,
        agentId: agentId || 'system',
        processingTime,
        confidence: analysis.agentGuidance.confidence.overall,
        responseStrategy: analysis.responseStrategy,
        extractedEntities: analysis.questionAnalysis.entities,
        domainClassification: analysis.questionAnalysis.domainClassification,
        qualityMetrics: analysis.agentGuidance.qualityIndicators,
        riskAssessment: analysis.agentGuidance.riskFactors,
        recommendedActions: analysis.agentGuidance.validationChecks,
        processingMetadata: {
          processingTime,
          agentId,
          context: context || question.context
        },
        nlpAnalysis: analysis.questionAnalysis,
        meshEnrichment: analysis.questionAnalysis.meshEnrichment
      };

      const [result] = await db
        .insert(emmeQuestionResults)
        .values(resultData)
        .returning();

      // Update question processing history
      const updatedHistory = [
        ...(question.processingHistory as any[] || []),
        {
          processedAt: new Date().toISOString(),
          agentId: agentId || 'system',
          resultId: result.id,
          confidence: analysis.agentGuidance.confidence.overall,
          strategy: analysis.responseStrategy
        }
      ];

      await db
        .update(emmeQuestions)
        .set({ 
          processingHistory: updatedHistory,
          updatedAt: new Date() 
        })
        .where(eq(emmeQuestions.id, id));

      res.json({
        success: true,
        analysis,
        result,
        processingTime
      });

    } catch (error) {
      console.error("Error processing EMME question:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to process EMME question",
        details: error.message 
      });
    }
  });

  // Get processing results for a question
  app.get("/api/emme/questions/:id/results", async (req, res) => {
    try {
      const { id } = req.params;
      const { limit = "10", offset = "0" } = req.query;

      const results = await db
        .select()
        .from(emmeQuestionResults)
        .where(eq(emmeQuestionResults.questionId, id))
        .orderBy(desc(emmeQuestionResults.processedAt))
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));

      res.json({
        success: true,
        results,
        pagination: {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          total: results.length
        }
      });
    } catch (error) {
      console.error("Error fetching processing results:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch processing results" 
      });
    }
  });

  // Bulk process multiple questions
  app.post("/api/emme/questions/bulk-process", async (req, res) => {
    try {
      const { questionIds, agentId, context } = req.body;

      if (!Array.isArray(questionIds) || questionIds.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: "questionIds must be a non-empty array" 
        });
      }

      // Initialize advanced NLP service
      const nlpService = new AdvancedNLPService();
      await nlpService.initialize();

      const results = [];
      const errors = [];

      for (const questionId of questionIds) {
        try {
          // Get the question
          const [question] = await db
            .select()
            .from(emmeQuestions)
            .where(eq(emmeQuestions.id, questionId));

          if (!question || !question.isActive) {
            errors.push({ questionId, error: "Question not found or not active" });
            continue;
          }

          // Process the question
          const startTime = Date.now();
          const analysis = await nlpService.processEMMEQuestion(
            question.questionText, 
            context || question.context
          );
          const processingTime = Date.now() - startTime;

          // Store the result
          const resultData: InsertEmmeQuestionResult = {
            questionId,
            agentId: agentId || 'bulk_system',
            processingTime,
            confidence: analysis.agentGuidance.confidence.overall,
            responseStrategy: analysis.responseStrategy,
            extractedEntities: analysis.questionAnalysis.entities,
            domainClassification: analysis.questionAnalysis.domainClassification,
            qualityMetrics: analysis.agentGuidance.qualityIndicators,
            riskAssessment: analysis.agentGuidance.riskFactors,
            recommendedActions: analysis.agentGuidance.validationChecks,
            processingMetadata: {
              processingTime,
              agentId: agentId || 'bulk_system',
              context: context || question.context,
              bulkProcess: true
            },
            nlpAnalysis: analysis.questionAnalysis,
            meshEnrichment: analysis.questionAnalysis.meshEnrichment
          };

          const [result] = await db
            .insert(emmeQuestionResults)
            .values(resultData)
            .returning();

          results.push({
            questionId,
            result,
            analysis: {
              confidence: analysis.agentGuidance.confidence.overall,
              strategy: analysis.responseStrategy,
              entities: analysis.questionAnalysis.entities.length
            }
          });

        } catch (error) {
          errors.push({ 
            questionId, 
            error: error.message 
          });
        }
      }

      res.json({
        success: true,
        processed: results.length,
        errors: errors.length,
        results,
        errors
      });

    } catch (error) {
      console.error("Error in bulk processing:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to bulk process questions",
        details: error.message 
      });
    }
  });


}