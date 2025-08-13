import { AdvancedNLPService } from './advancedNLP';
import { storage } from '../storage';
import type { Document, Entity, GraphNode, GraphRelationship } from '@shared/schema';

export interface PharmaceuticalCorpusConfig {
  name: string;
  domains: string[];
  sourceTypes: ('clinical_trials' | 'regulatory_docs' | 'market_research' | 'kol_content' | 'competitor_intel')[];
  updateFrequency: 'daily' | 'weekly' | 'monthly';
  confidenceThreshold: number;
}

export interface CorpusMetrics {
  totalDocuments: number;
  totalEntities: number;
  knowledgeGraphNodes: number;
  knowledgeGraphRelationships: number;
  domainCoverage: Record<string, number>;
  lastUpdated: Date;
  corporaHealth: number; // 0-1 score
}

export class PharmaceuticalCorpusBuilder {
  private nlpService: AdvancedNLPService;
  private corpora: Map<string, PharmaceuticalCorpusConfig> = new Map();

  constructor() {
    this.nlpService = new AdvancedNLPService();
    this.initializeDefaultCorpora();
  }

  private initializeDefaultCorpora(): void {
    // EMME Engage Core Pharmaceutical Corpus
    this.registerCorpus({
      name: 'emme_pharmaceutical_intelligence',
      domains: ['oncology', 'immunology', 'neurology', 'cardiology', 'rare_diseases', 'market_access', 'regulatory'],
      sourceTypes: ['clinical_trials', 'regulatory_docs', 'market_research', 'kol_content', 'competitor_intel'],
      updateFrequency: 'daily',
      confidenceThreshold: 0.7
    });

    // KOL Engagement Corpus
    this.registerCorpus({
      name: 'kol_engagement_intelligence',
      domains: ['kol_profiles', 'engagement_strategies', 'medical_education', 'advisory_boards'],
      sourceTypes: ['kol_content', 'market_research'],
      updateFrequency: 'weekly',
      confidenceThreshold: 0.8
    });

    // Market Access Intelligence Corpus
    this.registerCorpus({
      name: 'market_access_intelligence',
      domains: ['payer_policies', 'formulary_changes', 'health_economics', 'access_barriers', 'value_propositions'],
      sourceTypes: ['regulatory_docs', 'market_research'],
      updateFrequency: 'daily',
      confidenceThreshold: 0.75
    });

    // Competitive Intelligence Corpus
    this.registerCorpus({
      name: 'competitive_intelligence',
      domains: ['competitor_analysis', 'market_positioning', 'pipeline_intelligence', 'pricing_strategies'],
      sourceTypes: ['competitor_intel', 'market_research', 'clinical_trials'],
      updateFrequency: 'weekly',
      confidenceThreshold: 0.7
    });
  }

  registerCorpus(config: PharmaceuticalCorpusConfig): void {
    this.corpora.set(config.name, config);
    console.log(`Registered pharmaceutical corpus: ${config.name}`);
  }

  async buildCorpusFromDocuments(corpusName: string, documents: Document[]): Promise<CorpusMetrics> {
    const config = this.corpora.get(corpusName);
    if (!config) {
      throw new Error(`Corpus configuration not found: ${corpusName}`);
    }

    console.log(`Building pharmaceutical corpus: ${corpusName} from ${documents.length} documents`);
    
    const metrics: CorpusMetrics = {
      totalDocuments: 0,
      totalEntities: 0,
      knowledgeGraphNodes: 0,
      knowledgeGraphRelationships: 0,
      domainCoverage: {},
      lastUpdated: new Date(),
      corporaHealth: 0
    };

    for (const document of documents) {
      try {
        // Process document with pharmaceutical NLP
        const processedDoc = await this.processPharmaceuticalDocument(document, config);
        
        // Extract and enrich entities
        const entities = await this.extractPharmaceuticalEntities(processedDoc, config);
        
        // Build knowledge graph connections
        const graphData = await this.buildPharmaceuticalKnowledgeGraph(entities, config);
        
        // Update metrics
        metrics.totalDocuments++;
        metrics.totalEntities += entities.length;
        metrics.knowledgeGraphNodes += graphData.nodes.length;
        metrics.knowledgeGraphRelationships += graphData.relationships.length;
        
        // Track domain coverage
        for (const entity of entities) {
          const domain = this.classifyEntityDomain(entity, config);
          metrics.domainCoverage[domain] = (metrics.domainCoverage[domain] || 0) + 1;
        }

        console.log(`Processed document ${document.id}: ${entities.length} entities, ${graphData.nodes.length} nodes`);
        
      } catch (error) {
        console.error(`Error processing document ${document.id}:`, error);
      }
    }

    // Calculate corpus health score
    metrics.corporaHealth = this.calculateCorpusHealth(metrics, config);
    
    // Store corpus metadata
    await this.storeCorpusMetrics(corpusName, metrics);

    console.log(`Completed pharmaceutical corpus: ${corpusName}`, metrics);
    return metrics;
  }

  private async processPharmaceuticalDocument(document: Document, config: PharmaceuticalCorpusConfig): Promise<Document> {
    if (!document.content) return document;

    // Enhanced pharmaceutical NLP processing
    const analysis = await this.nlpService.processAdvancedNLP(document.content);
    
    // Filter entities by confidence threshold
    const filteredEntities = analysis.entities.filter(entity => 
      entity.confidence >= config.confidenceThreshold
    );

    // Enhanced pharmaceutical entity extraction
    const pharmaceuticalConcepts = await this.extractSpecializedPharmaceuticalConcepts(document.content, config);
    
    // Update document with pharmaceutical intelligence
    const updatedDocument: Document = {
      ...document,
      entities: [...(document.entities as any[] || []), ...filteredEntities],
      semanticTags: [...(document.semanticTags as string[] || []), ...analysis.semanticTags, ...pharmaceuticalConcepts],
      confidence: analysis.confidence,
      metadata: {
        ...document.metadata,
        pharmaceuticalDomains: config.domains,
        corpusName: config.name,
        nlpProcessingTimestamp: new Date().toISOString(),
        pharmaceuticalConcepts
      }
    };

    return updatedDocument;
  }

  private async extractSpecializedPharmaceuticalConcepts(content: string, config: PharmaceuticalCorpusConfig): Promise<string[]> {
    const concepts: string[] = [];
    const lowerContent = content.toLowerCase();

    // Domain-specific pharmaceutical concept dictionaries
    const pharmaceuticalDictionaries = {
      oncology: [
        'tumor microenvironment', 'immunotherapy', 'targeted therapy', 'precision oncology',
        'biomarker', 'companion diagnostic', 'resistance mechanisms', 'combination therapy'
      ],
      market_access: [
        'value-based care', 'real-world evidence', 'health economics outcomes research',
        'formulary placement', 'prior authorization', 'step therapy', 'specialty pharmacy'
      ],
      kol_profiles: [
        'key opinion leader', 'thought leadership', 'medical education', 'advisory board',
        'speaker bureau', 'scientific advisory', 'clinical expertise', 'research collaboration'
      ],
      regulatory: [
        'regulatory pathway', 'breakthrough therapy', 'accelerated approval', 'priority review',
        'post-market surveillance', 'risk evaluation', 'mitigation strategy', 'labeling updates'
      ],
      competitive_intelligence: [
        'market share', 'competitive positioning', 'pipeline analysis', 'pricing strategy',
        'launch readiness', 'market penetration', 'differentiation strategy'
      ]
    };

    // Extract concepts based on corpus domains
    for (const domain of config.domains) {
      const dictionary = pharmaceuticalDictionaries[domain as keyof typeof pharmaceuticalDictionaries];
      if (dictionary) {
        for (const concept of dictionary) {
          if (lowerContent.includes(concept.toLowerCase())) {
            concepts.push(concept);
          }
        }
      }
    }

    // BERT-enhanced concept extraction for pharmaceutical terminology
    const bertConcepts = await this.extractBERTPharmaceuticalConcepts(content, config);
    concepts.push(...bertConcepts);

    return [...new Set(concepts)]; // Remove duplicates
  }

  private async extractBERTPharmaceuticalConcepts(content: string, config: PharmaceuticalCorpusConfig): Promise<string[]> {
    try {
      // Use BERT to identify pharmaceutical concepts not caught by pattern matching
      const bertAnalysis = await this.nlpService.processEMMEQuestion(content);
      
      const concepts: string[] = [];
      
      // Extract BERT-identified pharmaceutical concepts
      if (bertAnalysis.bertInsights?.pharmaceuticalConcepts) {
        concepts.push(...bertAnalysis.bertInsights.pharmaceuticalConcepts);
      }
      
      // Add domain-specific insights
      if (bertAnalysis.questionAnalysis?.biomedicalConcepts) {
        concepts.push(...bertAnalysis.questionAnalysis.biomedicalConcepts);
      }

      return concepts;
    } catch (error) {
      console.error('Error in BERT pharmaceutical concept extraction:', error);
      return [];
    }
  }

  private async extractPharmaceuticalEntities(document: Document, config: PharmaceuticalCorpusConfig): Promise<Entity[]> {
    const entities: Entity[] = [];
    
    if (!document.content) return entities;

    // Use advanced NLP for pharmaceutical entity extraction
    const analysis = await this.nlpService.processAdvancedNLP(document.content);
    
    for (const nlpEntity of analysis.entities) {
      if (nlpEntity.confidence >= config.confidenceThreshold) {
        // Create entity with pharmaceutical enrichment
        const entity = await storage.createEntity({
          documentId: document.id,
          type: nlpEntity.type,
          value: nlpEntity.value,
          confidence: nlpEntity.confidence,
          startPosition: nlpEntity.startPosition,
          endPosition: nlpEntity.endPosition,
          context: nlpEntity.context,
          metadata: {
            corpusName: config.name,
            pharmaceuticalDomain: this.classifyEntityDomain(nlpEntity, config),
            semanticEnrichment: nlpEntity.semanticEnrichment,
            meshConnections: nlpEntity.meshConnections
          }
        });
        
        entities.push(entity);
      }
    }

    return entities;
  }

  private async buildPharmaceuticalKnowledgeGraph(entities: Entity[], config: PharmaceuticalCorpusConfig): Promise<{ nodes: GraphNode[], relationships: GraphRelationship[] }> {
    const nodes: GraphNode[] = [];
    const relationships: GraphRelationship[] = [];

    // Create pharmaceutical knowledge graph nodes
    for (const entity of entities) {
      const node = await storage.createGraphNode({
        type: 'PHARMACEUTICAL_ENTITY',
        label: entity.value,
        entityId: entity.id,
        properties: {
          entityType: entity.type,
          pharmaceuticalDomain: entity.metadata?.pharmaceuticalDomain,
          corpusName: config.name,
          confidence: entity.confidence
        },
        confidence: entity.confidence
      });
      nodes.push(node);
    }

    // Create pharmaceutical relationships based on semantic similarity and domain relevance
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const entity1 = entities[i];
        const entity2 = entities[j];
        
        const relationshipStrength = this.calculatePharmaceuticalRelationshipStrength(entity1, entity2, config);
        
        if (relationshipStrength > 0.6) {
          const node1 = nodes.find(n => n.entityId === entity1.id);
          const node2 = nodes.find(n => n.entityId === entity2.id);
          
          if (node1 && node2) {
            const relationship = await storage.createGraphRelationship({
              fromNodeId: node1.id,
              toNodeId: node2.id,
              relationshipType: this.determinePharmaceuticalRelationshipType(entity1, entity2),
              strength: relationshipStrength,
              confidence: relationshipStrength,
              properties: {
                corpusName: config.name,
                pharmaceuticalContext: true,
                domainAlignment: this.checkDomainAlignment(entity1, entity2, config)
              }
            });
            relationships.push(relationship);
          }
        }
      }
    }

    return { nodes, relationships };
  }

  private classifyEntityDomain(entity: any, config: PharmaceuticalCorpusConfig): string {
    const entityValue = entity.value.toLowerCase();
    
    // Pharmaceutical domain classification
    const domainKeywords = {
      oncology: ['cancer', 'tumor', 'oncology', 'chemotherapy', 'immunotherapy', 'metastasis'],
      market_access: ['payer', 'formulary', 'access', 'reimbursement', 'value', 'economics'],
      regulatory: ['fda', 'cms', 'approval', 'regulatory', 'submission', 'compliance'],
      kol_engagement: ['kol', 'expert', 'leader', 'specialist', 'advisory', 'education'],
      competitive: ['competitor', 'market share', 'positioning', 'strategy', 'pipeline']
    };

    for (const [domain, keywords] of Object.entries(domainKeywords)) {
      if (config.domains.includes(domain)) {
        for (const keyword of keywords) {
          if (entityValue.includes(keyword)) {
            return domain;
          }
        }
      }
    }

    return 'general_pharmaceutical';
  }

  private calculatePharmaceuticalRelationshipStrength(entity1: Entity, entity2: Entity, config: PharmaceuticalCorpusConfig): number {
    let strength = 0;

    // Base strength from entity confidence
    strength += (entity1.confidence + entity2.confidence) * 0.3;

    // Domain alignment bonus
    const domain1 = this.classifyEntityDomain(entity1, config);
    const domain2 = this.classifyEntityDomain(entity2, config);
    if (domain1 === domain2) {
      strength += 0.3;
    }

    // Pharmaceutical context proximity
    if (entity1.context && entity2.context) {
      const contextSimilarity = this.calculateContextSimilarity(entity1.context, entity2.context);
      strength += contextSimilarity * 0.4;
    }

    return Math.min(strength, 1.0);
  }

  private calculateContextSimilarity(context1: string, context2: string): number {
    const words1 = context1.toLowerCase().split(/\s+/);
    const words2 = context2.toLowerCase().split(/\s+/);
    
    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = new Set([...words1, ...words2]).size;
    
    return commonWords.length / totalWords;
  }

  private determinePharmaceuticalRelationshipType(entity1: Entity, entity2: Entity): string {
    // Pharmaceutical-specific relationship types
    const type1 = entity1.type;
    const type2 = entity2.type;

    if (type1 === 'DRUG' && type2 === 'MEDICAL_TERM') return 'TREATS';
    if (type1 === 'DRUG' && type2 === 'ORGANIZATION') return 'MANUFACTURED_BY';
    if (type1 === 'MEDICAL_TERM' && type2 === 'MEDICAL_TERM') return 'ASSOCIATED_WITH';
    if (type1 === 'ORGANIZATION' && type2 === 'MEDICAL_TERM') return 'RESEARCHES';
    
    return 'RELATED_TO';
  }

  private checkDomainAlignment(entity1: Entity, entity2: Entity, config: PharmaceuticalCorpusConfig): boolean {
    const domain1 = this.classifyEntityDomain(entity1, config);
    const domain2 = this.classifyEntityDomain(entity2, config);
    return domain1 === domain2;
  }

  private calculateCorpusHealth(metrics: CorpusMetrics, config: PharmaceuticalCorpusConfig): number {
    let health = 0;

    // Document coverage (20%)
    const docScore = Math.min(metrics.totalDocuments / 100, 1.0) * 0.2;
    health += docScore;

    // Entity density (30%)
    const entityDensity = metrics.totalDocuments > 0 ? metrics.totalEntities / metrics.totalDocuments : 0;
    const entityScore = Math.min(entityDensity / 50, 1.0) * 0.3;
    health += entityScore;

    // Knowledge graph connectivity (30%)
    const graphScore = metrics.knowledgeGraphNodes > 0 ? 
      Math.min(metrics.knowledgeGraphRelationships / metrics.knowledgeGraphNodes, 1.0) * 0.3 : 0;
    health += graphScore;

    // Domain coverage (20%)
    const domainCoverage = Object.keys(metrics.domainCoverage).length / config.domains.length;
    const domainScore = domainCoverage * 0.2;
    health += domainScore;

    return Math.min(health, 1.0);
  }

  private async storeCorpusMetrics(corpusName: string, metrics: CorpusMetrics): Promise<void> {
    // Store corpus metrics for monitoring and analytics
    console.log(`Storing corpus metrics for ${corpusName}:`, metrics);
    
    // In a real implementation, this would store to a corpus metadata table
    // For now, we'll log the metrics for monitoring
  }

  async getCorpusMetrics(corpusName: string): Promise<CorpusMetrics | null> {
    // Retrieve stored corpus metrics
    // This would fetch from a corpus metadata table in a real implementation
    return null;
  }

  async updateCorpus(corpusName: string, newDocuments: Document[]): Promise<CorpusMetrics> {
    console.log(`Updating pharmaceutical corpus: ${corpusName} with ${newDocuments.length} new documents`);
    return this.buildCorpusFromDocuments(corpusName, newDocuments);
  }

  listAvailableCorpora(): PharmaceuticalCorpusConfig[] {
    return Array.from(this.corpora.values());
  }
}

export const pharmaceuticalCorpusBuilder = new PharmaceuticalCorpusBuilder();