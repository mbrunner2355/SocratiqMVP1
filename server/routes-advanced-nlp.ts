import type { Express } from "express";
import { advancedNLPService } from "./services/advancedNLP";
import { storage } from "./storage";

export function registerAdvancedNLPRoutes(app: Express) {
  // Process text with advanced NLP models (BERT/BioBERT)
  app.post("/api/advanced-nlp/process", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: "Text content is required" });
      }

      const result = await advancedNLPService.processAdvancedText(text);
      
      res.json({
        success: true,
        result
      });
    } catch (error) {
      console.error("Advanced NLP processing error:", error);
      res.status(500).json({ 
        error: "Failed to process text with advanced NLP",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Reprocess existing document with advanced NLP
  app.post("/api/advanced-nlp/reprocess/:documentId", async (req, res) => {
    try {
      const { documentId } = req.params;
      
      const document = await storage.getDocument(documentId);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      if (!document.content) {
        return res.status(400).json({ error: "Document has no content to process" });
      }

      const advancedResult = await advancedNLPService.processAdvancedText(document.content);
      
      // Create advanced entities in storage
      const advancedEntityInserts = advancedResult.entities.map(entity => ({
        documentId,
        type: entity.type,
        value: entity.value,
        confidence: entity.confidence,
        startPosition: entity.startPosition,
        endPosition: entity.endPosition,
        context: entity.context,
        metadata: { 
          source: 'advanced_nlp_reprocess',
          semanticEnrichment: entity.semanticEnrichment,
          meshConnections: entity.meshConnections
        }
      }));

      await storage.createEntities(advancedEntityInserts);

      // Update document metadata with advanced results
      const existingMetadata = (document.metadata as any) || {};
      await storage.updateDocument(documentId, {
        metadata: {
          ...existingMetadata,
          advancedNLP: {
            domainClassification: advancedResult.domainClassification,
            biomedicalConcepts: advancedResult.biomedicalConcepts,
            bioDomainSentiment: advancedResult.sentiment,
            meshEnrichment: advancedResult.meshEnrichment,
            processingMetrics: advancedResult.processingMetrics,
            reprocessedAt: new Date().toISOString()
          }
        }
      });

      res.json({
        success: true,
        documentId,
        advancedResult
      });
    } catch (error) {
      console.error("Document reprocessing error:", error);
      res.status(500).json({ 
        error: "Failed to reprocess document with advanced NLP",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get domain classification analysis
  app.get("/api/advanced-nlp/domain-analysis/:documentId", async (req, res) => {
    try {
      const { documentId } = req.params;
      
      const document = await storage.getDocument(documentId);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      const advancedMetadata = (document.metadata as any)?.advancedNLP;
      if (!advancedMetadata) {
        return res.status(404).json({ 
          error: "Advanced NLP analysis not found for this document. Process it first with advanced NLP." 
        });
      }

      res.json({
        success: true,
        documentId,
        domainClassification: advancedMetadata.domainClassification,
        biomedicalConcepts: advancedMetadata.biomedicalConcepts,
        bioDomainSentiment: advancedMetadata.bioDomainSentiment
      });
    } catch (error) {
      console.error("Domain analysis error:", error);
      res.status(500).json({ 
        error: "Failed to retrieve domain analysis",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get SocratIQ Mesh™ enrichment results
  app.get("/api/advanced-nlp/mesh-enrichment/:documentId", async (req, res) => {
    try {
      const { documentId } = req.params;
      
      const document = await storage.getDocument(documentId);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      const advancedMetadata = (document.metadata as any)?.advancedNLP;
      if (!advancedMetadata) {
        return res.status(404).json({ 
          error: "Advanced NLP analysis not found for this document." 
        });
      }

      // Get entities with mesh connections
      const entities = await storage.getEntitiesByDocumentId(documentId);
      const meshConnectedEntities = entities.filter((entity: any) => 
        entity.metadata?.meshConnections && 
        Array.isArray(entity.metadata.meshConnections) && 
        entity.metadata.meshConnections.length > 0
      );

      res.json({
        success: true,
        documentId,
        meshEnrichment: advancedMetadata.meshEnrichment,
        connectedEntities: meshConnectedEntities,
        totalEntities: entities.length,
        connectionRate: entities.length > 0 ? meshConnectedEntities.length / entities.length : 0
      });
    } catch (error) {
      console.error("Mesh enrichment error:", error);
      res.status(500).json({ 
        error: "Failed to retrieve mesh enrichment data",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get biomedical sentiment analysis
  app.get("/api/advanced-nlp/biomedical-sentiment/:documentId", async (req, res) => {
    try {
      const { documentId } = req.params;
      
      const document = await storage.getDocument(documentId);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      const advancedMetadata = (document.metadata as any)?.advancedNLP;
      if (!advancedMetadata) {
        return res.status(404).json({ 
          error: "Advanced NLP analysis not found for this document." 
        });
      }

      res.json({
        success: true,
        documentId,
        bioDomainSentiment: advancedMetadata.bioDomainSentiment,
        processingMetrics: advancedMetadata.processingMetrics
      });
    } catch (error) {
      console.error("Biomedical sentiment analysis error:", error);
      res.status(500).json({ 
        error: "Failed to retrieve biomedical sentiment analysis",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get processing metrics and performance data
  app.get("/api/advanced-nlp/metrics/:documentId", async (req, res) => {
    try {
      const { documentId } = req.params;
      
      const document = await storage.getDocument(documentId);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      const advancedMetadata = (document.metadata as any)?.advancedNLP;
      if (!advancedMetadata) {
        return res.status(404).json({ 
          error: "Advanced NLP analysis not found for this document." 
        });
      }

      res.json({
        success: true,
        documentId,
        processingMetrics: advancedMetadata.processingMetrics,
        lastProcessed: advancedMetadata.reprocessedAt || document.createdAt,
        confidence: document.confidence,
        entityCount: (document.metadata as any)?.entityCount || 0
      });
    } catch (error) {
      console.error("Metrics retrieval error:", error);
      res.status(500).json({ 
        error: "Failed to retrieve processing metrics",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Batch process multiple documents with advanced NLP
  app.post("/api/advanced-nlp/batch-process", async (req, res) => {
    try {
      const { documentIds } = req.body;
      
      if (!Array.isArray(documentIds) || documentIds.length === 0) {
        return res.status(400).json({ error: "Document IDs array is required" });
      }

      const results = [];
      const errors = [];

      for (const documentId of documentIds) {
        try {
          const document = await storage.getDocument(documentId);
          if (!document || !document.content) {
            errors.push({ documentId, error: "Document not found or has no content" });
            continue;
          }

          const advancedResult = await advancedNLPService.processAdvancedText(document.content);
          
          // Update document with advanced analysis
          const existingMetadata = (document.metadata as any) || {};
          await storage.updateDocument(documentId, {
            metadata: {
              ...existingMetadata,
              advancedNLP: {
                domainClassification: advancedResult.domainClassification,
                biomedicalConcepts: advancedResult.biomedicalConcepts,
                bioDomainSentiment: advancedResult.sentiment,
                meshEnrichment: advancedResult.meshEnrichment,
                processingMetrics: advancedResult.processingMetrics,
                batchProcessedAt: new Date().toISOString()
              }
            }
          });

          results.push({ 
            documentId, 
            success: true,
            domainClassification: advancedResult.domainClassification,
            entityCount: advancedResult.entities.length
          });

        } catch (error) {
          errors.push({ 
            documentId, 
            error: error instanceof Error ? error.message : "Unknown error" 
          });
        }
      }

      res.json({
        success: true,
        processed: results.length,
        errors: errors.length,
        results,
        errorList: errors
      });
    } catch (error) {
      console.error("Batch processing error:", error);
      res.status(500).json({ 
        error: "Failed to batch process documents",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get advanced NLP statistics across all documents
  app.get("/api/advanced-nlp/statistics", async (req, res) => {
    try {
      const allDocuments = await storage.getAllDocuments();
      
      const advancedNLPDocuments = allDocuments.filter(doc => 
        (doc.metadata as any)?.advancedNLP
      );

      if (advancedNLPDocuments.length === 0) {
        return res.json({
          success: true,
          statistics: {
            totalDocuments: allDocuments.length,
            processedWithAdvancedNLP: 0,
            domainDistribution: {},
            averageConfidence: 0,
            totalBiomedicalConcepts: 0,
            meshConnections: 0
          }
        });
      }

      // Calculate domain distribution
      const domainDistribution: Record<string, number> = {};
      let totalConfidence = 0;
      const allBiomedicalConcepts = new Set<string>();
      let totalMeshConnections = 0;

      advancedNLPDocuments.forEach(doc => {
        const advancedData = (doc.metadata as any)?.advancedNLP;
        if (advancedData) {
          const primaryDomain = advancedData.domainClassification?.primaryDomain || 'unknown';
          domainDistribution[primaryDomain] = (domainDistribution[primaryDomain] || 0) + 1;
          
          totalConfidence += doc.confidence || 0;
          
          if (advancedData.biomedicalConcepts) {
            advancedData.biomedicalConcepts.forEach((concept: string) => allBiomedicalConcepts.add(concept));
          }
          
          totalMeshConnections += advancedData.meshEnrichment?.connectedNodes || 0;
        }
      });

      res.json({
        success: true,
        statistics: {
          totalDocuments: allDocuments.length,
          processedWithAdvancedNLP: advancedNLPDocuments.length,
          domainDistribution,
          averageConfidence: totalConfidence / advancedNLPDocuments.length,
          totalBiomedicalConcepts: allBiomedicalConcepts.size,
          meshConnections: totalMeshConnections,
          processingRate: advancedNLPDocuments.length / allDocuments.length
        }
      });
    } catch (error) {
      console.error("Statistics error:", error);
      res.status(500).json({ 
        error: "Failed to retrieve advanced NLP statistics",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // EMME Agent Question Processing - specifically for agents answering EMME questions
  app.post("/api/advanced-nlp/emme-question", async (req, res) => {
    const startTime = Date.now();
    try {
      const { question, context, agentId } = req.body;
      
      if (!question) {
        return res.status(400).json({ error: "Question is required" });
      }

      const result = await advancedNLPService.processEMMEQuestion(question, context);
      const processingTime = Date.now() - startTime;
      
      // Log for monitoring agent question processing
      console.log(`EMME Question processed by agent ${agentId || 'unknown'}:`, {
        question: question.substring(0, 100) + '...',
        strategy: result.responseStrategy,
        confidence: result.confidenceMetrics.overall,
        riskLevel: result.agentGuidance.riskFactors.length > 0 ? 'elevated' : 'normal',
        processingTime: `${processingTime}ms`
      });

      res.json({
        success: true,
        analysis: result,
        guidance: {
          strategy: result.responseStrategy,
          confidence: result.confidenceMetrics,
          requiredKnowledge: result.requiredKnowledge,
          validationChecks: result.validationChecks,
          keyEntities: result.agentGuidance.keyEntities,
          domainFocus: result.agentGuidance.domainFocus,
          riskFactors: result.agentGuidance.riskFactors,
          responseStructure: result.agentGuidance.responseStructure,
          qualityIndicators: result.agentGuidance.qualityIndicators
        },
        metadata: {
          processedAt: new Date().toISOString(),
          agentId: agentId || 'anonymous',
          processingTime: processingTime
        }
      });
    } catch (error) {
      console.error("EMME question processing error:", error);
      res.status(500).json({ 
        error: "Failed to process EMME question",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
}