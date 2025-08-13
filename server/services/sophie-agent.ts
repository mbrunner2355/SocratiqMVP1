import { storage } from "../storage";
import { type Document, type Entity, type GraphNode, type GraphRelationship } from "@shared/schema";
import natural from "natural";
// @ts-ignore
const { SentimentAnalyzer, PorterStemmer, TfIdf } = natural;
import compromise from "compromise";

// Sophie™ Agent - Advanced AI layer for SocratIQ Transform™
export interface SophieQuery {
  query: string;
  context?: string;
  filters?: {
    documentTypes?: string[];
    entityTypes?: string[];
    confidence?: number;
    dateRange?: {
      start: Date;
      end: Date;
    };
  };
}

export interface SophieResponse {
  answer: string;
  confidence: number;
  sources: {
    documents: Document[];
    entities: Entity[];
    relationships: GraphRelationship[];
  };
  insights: {
    keyFindings: string[];
    recommendations: string[];
    riskFactors: string[];
  };
  visualizations?: {
    graphData?: any;
    charts?: any;
  };
}

export interface SophieAnalysis {
  type: 'document_summary' | 'entity_analysis' | 'relationship_mapping' | 'trend_analysis' | 'risk_assessment';
  subject: string;
  findings: string[];
  confidence: number;
  evidence: {
    documentId: string;
    excerpt: string;
    relevance: number;
  }[];
}

export class SophieAgent {
  private stemmer = PorterStemmer;
  private tfidf = new TfIdf();
  
  constructor() {
    // Initialize NLP components
    this.initializeKnowledgeBase();
  }

  private async initializeKnowledgeBase(): Promise<void> {
    // Pre-process documents for faster querying
    const documents = await storage.getAllDocuments();
    documents.forEach(doc => {
      if (doc.content) {
        this.tfidf.addDocument(doc.content);
      }
    });
  }

  // Main query processing endpoint
  async processQuery(sophieQuery: SophieQuery): Promise<SophieResponse> {
    console.log(`Sophie™ processing query: "${sophieQuery.query}"`);
    
    const startTime = Date.now();
    
    // 1. Parse and understand the query
    const queryAnalysis = this.analyzeQuery(sophieQuery.query);
    
    // 2. Search relevant documents and entities
    const relevantData = await this.findRelevantData(queryAnalysis, sophieQuery.filters);
    
    // 3. Generate insights and analysis
    const analysis = await this.generateAnalysis(queryAnalysis, relevantData);
    
    // 4. Formulate comprehensive response
    const response = await this.formulateResponse(queryAnalysis, relevantData, analysis);
    
    const processingTime = Date.now() - startTime;
    console.log(`Sophie™ query processed in ${processingTime}ms`);
    
    return response;
  }

  // Advanced document analysis capabilities
  async analyzeDocument(documentId: string): Promise<SophieAnalysis> {
    const document = await storage.getDocument(documentId);
    if (!document) {
      throw new Error(`Document ${documentId} not found`);
    }

    const entities = await storage.getEntitiesByDocumentId(documentId);
    
    // Perform comprehensive document analysis
    const analysis: SophieAnalysis = {
      type: 'document_summary',
      subject: document.originalName || document.filename,
      findings: [],
      confidence: 0,
      evidence: []
    };

    if (document.content) {
      // Extract key insights using NLP
      const doc = compromise(document.content);
      const sentences = doc.sentences().out('array');
      
      // Identify key findings
      const keyPhrases = this.extractKeyPhrases(document.content);
      analysis.findings = keyPhrases.slice(0, 5);
      
      // Calculate confidence based on entity extraction quality
      const totalEntities = entities.length;
      const highConfidenceEntities = entities.filter(e => (e.confidence || 0) > 0.8).length;
      analysis.confidence = totalEntities > 0 ? highConfidenceEntities / totalEntities : 0;
      
      // Generate evidence snippets
      analysis.evidence = sentences.slice(0, 3).map((sentence: string, index: number) => ({
        documentId,
        excerpt: sentence,
        relevance: 1 - (index * 0.2)
      }));
    }

    return analysis;
  }

  // Entity relationship analysis
  async analyzeEntityRelationships(entityValue: string): Promise<SophieAnalysis> {
    const allNodes = await storage.getAllGraphNodes();
    const targetNode = allNodes.find(node => 
      node.label.toLowerCase().includes(entityValue.toLowerCase())
    );
    
    if (!targetNode) {
      throw new Error(`Entity "${entityValue}" not found in knowledge graph`);
    }

    const relationships = await storage.getRelationshipsByNode(targetNode.id);
    const relatedNodes = [];
    
    for (const rel of relationships) {
      const relatedNodeId = rel.fromNodeId === targetNode.id ? rel.toNodeId : rel.fromNodeId;
      const relatedNode = allNodes.find(n => n.id === relatedNodeId);
      if (relatedNode) {
        relatedNodes.push({
          node: relatedNode,
          relationship: rel,
          strength: rel.strength || 0
        });
      }
    }

    // Sort by relationship strength
    relatedNodes.sort((a, b) => (b.strength || 0) - (a.strength || 0));

    const analysis: SophieAnalysis = {
      type: 'relationship_mapping',
      subject: entityValue,
      findings: relatedNodes.slice(0, 5).map(item => 
        `${item.relationship.relationshipType} ${item.node.label} (strength: ${(item.strength * 100).toFixed(1)}%)`
      ),
      confidence: Math.min(relationships.length / 10, 1), // More relationships = higher confidence
      evidence: relatedNodes.slice(0, 3).map(item => ({
        documentId: item.relationship.sourceDocumentId || '',
        excerpt: `Relationship: ${targetNode.label} → ${item.node.label}`,
        relevance: item.strength || 0
      }))
    };

    return analysis;
  }

  // Risk assessment analysis
  async performRiskAssessment(query: string): Promise<SophieAnalysis> {
    const riskKeywords = ['risk', 'adverse', 'side effect', 'toxicity', 'danger', 'caution', 'warning', 'contraindication'];
    const documents = await storage.getAllDocuments();
    
    const riskDocuments = documents.filter(doc => 
      doc.content && riskKeywords.some(keyword => 
        doc.content!.toLowerCase().includes(keyword)
      )
    );

    const findings = [];
    const evidence = [];

    for (const doc of riskDocuments.slice(0, 5)) {
      if (doc.content) {
        const sentences = compromise(doc.content).sentences().out('array');
        const riskSentences = sentences.filter((sentence: string) =>
          riskKeywords.some(keyword => sentence.toLowerCase().includes(keyword))
        );
        
        if (riskSentences.length > 0) {
          findings.push(`Risk identified in ${doc.originalName}: ${riskSentences[0].substring(0, 100)}...`);
          evidence.push({
            documentId: doc.id,
            excerpt: riskSentences[0],
            relevance: 0.9
          });
        }
      }
    }

    return {
      type: 'risk_assessment',
      subject: query,
      findings,
      confidence: Math.min(findings.length / 5, 1),
      evidence: evidence.slice(0, 3)
    };
  }

  private analyzeQuery(query: string): any {
    const doc = compromise(query);
    return {
      intent: this.determineIntent(query),
      entities: doc.people().out('array').concat(doc.organizations().out('array')),
      keywords: this.extractKeywords(query),
      sentiment: this.calculateSentiment(query)
    };
  }

  private determineIntent(query: string): string {
    const queryLower = query.toLowerCase();
    if (queryLower.includes('risk') || queryLower.includes('safety')) return 'risk_assessment';
    if (queryLower.includes('relationship') || queryLower.includes('connect')) return 'relationship_analysis';
    if (queryLower.includes('summary') || queryLower.includes('overview')) return 'document_summary';
    if (queryLower.includes('trend') || queryLower.includes('pattern')) return 'trend_analysis';
    return 'general_query';
  }

  private extractKeywords(text: string): string[] {
    const words = text.toLowerCase().split(/\W+/);
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    return words.filter(word => word.length > 2 && !stopWords.has(word));
  }

  private extractKeyPhrases(text: string): string[] {
    const doc = compromise(text);
    const phrases = [];
    
    // Extract noun phrases
    phrases.push(...doc.nouns().out('array'));
    
    // Extract important sentences (simplified)
    const sentences = doc.sentences().out('array');
    const importantSentences = sentences.filter((sentence: string) => 
      sentence.split(' ').length > 5 && sentence.split(' ').length < 20
    ).slice(0, 3);
    
    phrases.push(...importantSentences);
    
    return phrases.slice(0, 10);
  }

  private calculateSentiment(text: string): number {
    // Simple sentiment calculation
    const positiveWords = ['good', 'great', 'excellent', 'positive', 'effective', 'beneficial'];
    const negativeWords = ['bad', 'poor', 'negative', 'risk', 'adverse', 'danger'];
    
    const words = text.toLowerCase().split(/\W+/);
    let score = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 1;
      if (negativeWords.includes(word)) score -= 1;
    });
    
    return score / words.length;
  }

  private async findRelevantData(queryAnalysis: any, filters?: any): Promise<any> {
    const documents = await storage.getAllDocuments();
    const entities: Entity[] = [];
    const relationships: GraphRelationship[] = [];

    // Simple relevance scoring based on keyword matching
    const relevantDocuments = documents.filter(doc => {
      if (!doc.content) return false;
      const contentLower = doc.content.toLowerCase();
      return queryAnalysis.keywords.some((keyword: string) => 
        contentLower.includes(keyword.toLowerCase())
      );
    }).slice(0, 5);

    // Get entities from relevant documents
    for (const doc of relevantDocuments) {
      const docEntities = await storage.getEntitiesByDocumentId(doc.id);
      entities.push(...docEntities);
    }

    return {
      documents: relevantDocuments,
      entities: entities.slice(0, 20),
      relationships: relationships
    };
  }

  private async generateAnalysis(queryAnalysis: any, relevantData: any): Promise<any> {
    const insights = {
      keyFindings: [] as string[],
      recommendations: [] as string[],
      riskFactors: [] as string[]
    };

    // Generate key findings based on entities
    if (relevantData.entities.length > 0) {
      const entityTypes = relevantData.entities.reduce((acc: any, entity: Entity) => {
        acc[entity.type] = (acc[entity.type] || 0) + 1;
        return acc;
      }, {});

      insights.keyFindings.push(`Found ${relevantData.entities.length} relevant entities across ${Object.keys(entityTypes).length} categories`);
      
      Object.entries(entityTypes).forEach(([type, count]) => {
        insights.keyFindings.push(`${count} ${type} entities identified`);
      });
    }

    // Generate recommendations
    if (queryAnalysis.intent === 'risk_assessment') {
      insights.recommendations.push('Conduct thorough safety review of identified compounds');
      insights.recommendations.push('Consult regulatory guidelines for risk mitigation strategies');
    } else if (queryAnalysis.intent === 'relationship_analysis') {
      insights.recommendations.push('Explore deeper connections between identified entities');
      insights.recommendations.push('Consider cross-domain relationships for comprehensive analysis');
    }

    return insights;
  }

  private async formulateResponse(queryAnalysis: any, relevantData: any, analysis: any): Promise<SophieResponse> {
    let answer = '';
    
    if (relevantData.documents.length === 0) {
      answer = 'I could not find relevant documents for your query. Please try rephrasing or check if documents are properly processed.';
    } else {
      answer = `Based on analysis of ${relevantData.documents.length} documents and ${relevantData.entities.length} entities, `;
      
      if (queryAnalysis.intent === 'risk_assessment') {
        answer += 'I have identified potential risk factors and safety considerations. ';
      } else if (queryAnalysis.intent === 'relationship_analysis') {
        answer += 'I have mapped entity relationships and connections. ';
      } else {
        answer += 'I have gathered comprehensive insights from the knowledge base. ';
      }
      
      answer += 'Please review the detailed findings and recommendations provided.';
    }

    return {
      answer,
      confidence: Math.min(relevantData.documents.length / 5, 1),
      sources: {
        documents: relevantData.documents,
        entities: relevantData.entities,
        relationships: relevantData.relationships
      },
      insights: analysis,
      visualizations: {
        graphData: this.prepareGraphVisualization(relevantData),
        charts: null
      }
    };
  }

  private prepareGraphVisualization(relevantData: any): any {
    return {
      nodes: relevantData.entities.map((entity: Entity) => ({
        id: entity.id,
        label: entity.value,
        type: entity.type,
        confidence: entity.confidence
      })),
      relationships: relevantData.relationships
    };
  }
}

export const sophieAgent = new SophieAgent();