import { 
  type Document, type InsertDocument, 
  type Entity, type InsertEntity,
  type User, type UpsertUser, type Partner, type UpsertPartner,
  type GraphNode, type InsertGraphNode,
  type GraphRelationship, type InsertGraphRelationship,
  type GraphCluster, type InsertGraphCluster,
  type GraphPath, type GraphNeighborhood, type GraphMetrics,
  type GraphPathQuery, type GraphNeighborQuery, type GraphSearchQuery,
  type ConstructionProject, type InsertConstructionProject,
  type ProjectTask, type InsertProjectTask,
  type ProjectResource, type InsertProjectResource,
  type ProjectBudget, type InsertProjectBudget,
  type ChangeOrder, type InsertChangeOrder,
  type RiskAssessment, type InsertRiskAssessment,
  type UserProfile, type InsertUserProfile,
  type DocumentProfile, type InsertDocumentProfile,
  type EntityProfile, type InsertEntityProfile,
  type SystemProfile, type InsertSystemProfile
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Document operations
  getDocument(id: string): Promise<Document | undefined>;
  getAllDocuments(): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: string, updates: Partial<Document>): Promise<Document>;
  deleteDocument(id: string): Promise<void>;
  
  // Entity operations
  getEntitiesByDocumentId(documentId: string): Promise<Entity[]>;
  createEntity(entity: InsertEntity): Promise<Entity>;
  createEntities(entities: InsertEntity[]): Promise<Entity[]>;
  
  // Analytics
  getEntityStats(): Promise<{ [key: string]: number }>;
  getProcessingStats(): Promise<{
    totalDocuments: number;
    processingQueue: number;
    avgProcessingTime: number;
    avgAccuracy: number;
  }>;
  
  // SocratIQ Mesh™ - Knowledge Graph Operations
  // Node operations
  getGraphNode(id: string): Promise<GraphNode | undefined>;
  getAllGraphNodes(): Promise<GraphNode[]>;
  createGraphNode(node: InsertGraphNode): Promise<GraphNode>;
  updateGraphNode(id: string, updates: Partial<GraphNode>): Promise<GraphNode>;
  deleteGraphNode(id: string): Promise<void>;
  searchGraphNodes(query: GraphSearchQuery): Promise<GraphNode[]>;
  
  // Relationship operations
  getGraphRelationship(id: string): Promise<GraphRelationship | undefined>;
  getAllGraphRelationships(): Promise<GraphRelationship[]>;
  getRelationshipsByNode(nodeId: string): Promise<GraphRelationship[]>;
  createGraphRelationship(relationship: InsertGraphRelationship): Promise<GraphRelationship>;
  updateGraphRelationship(id: string, updates: Partial<GraphRelationship>): Promise<GraphRelationship>;
  deleteGraphRelationship(id: string): Promise<void>;
  
  // Graph traversal and analysis
  findShortestPath(query: GraphPathQuery): Promise<GraphPath | null>;
  getNeighborhood(query: GraphNeighborQuery): Promise<GraphNeighborhood>;
  getGraphMetrics(): Promise<GraphMetrics>;
  
  // Clustering operations
  getGraphCluster(id: string): Promise<GraphCluster | undefined>;
  getAllGraphClusters(): Promise<GraphCluster[]>;
  createGraphCluster(cluster: InsertGraphCluster): Promise<GraphCluster>;
  
  // Graph building from entities
  buildGraphFromEntities(documentId?: string): Promise<{ nodes: GraphNode[]; relationships: GraphRelationship[] }>;
  
  // Build™ Module Operations
  // Pipeline operations
  getPipelines(filters?: { type?: string; status?: string; createdBy?: string }): Promise<Pipeline[]>;
  getPipeline(id: string): Promise<Pipeline | undefined>;
  createPipeline(pipeline: InsertPipeline): Promise<Pipeline>;
  updatePipeline(id: string, updates: Partial<Pipeline>): Promise<Pipeline | undefined>;
  deletePipeline(id: string): Promise<void>;
  executePipeline(id: string, params: { inputData?: any; executedBy: string }): Promise<PipelineExecution>;
  getPipelineExecutions(pipelineId: string): Promise<PipelineExecution[]>;
  getPipelineExecution(id: string): Promise<PipelineExecution | undefined>;
  
  // Builder operations
  getBuilders(filters?: { type?: string; isPublic?: boolean; createdBy?: string }): Promise<Builder[]>;
  getBuilder(id: string): Promise<Builder | undefined>;
  createBuilder(builder: InsertBuilder): Promise<Builder>;
  
  // Template operations
  getTemplates(filters?: { category?: string; isOfficial?: boolean }): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  incrementTemplateDownload(id: string): Promise<void>;
  
  // Build analytics
  getBuildAnalytics(): Promise<any>;
  
  // Profile™ Module Operations
  // User profile operations
  getUserProfiles(filters?: { role?: string; isActive?: boolean }): Promise<UserProfile[]>;
  getUserProfileByUserId(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined>;
  recordUserActivity(userId: string, action: string, metadata?: any): Promise<void>;
  
  // Document profile operations
  getDocumentProfiles(filters?: { qualityThreshold?: number; complexityThreshold?: number }): Promise<DocumentProfile[]>;
  getDocumentProfile(documentId: string): Promise<DocumentProfile | undefined>;
  createDocumentProfile(profile: InsertDocumentProfile): Promise<DocumentProfile>;
  updateDocumentProfile(documentId: string, updates: Partial<DocumentProfile>): Promise<DocumentProfile | undefined>;
  addDocumentAnnotation(documentId: string, annotation: any, userId: string): Promise<void>;
  getRelatedDocuments(documentId: string, limit: number): Promise<Document[]>;
  
  // Entity profile operations
  getEntityProfiles(filters?: { category?: string; verificationStatus?: string; importanceThreshold?: number }): Promise<EntityProfile[]>;
  getEntityProfile(entityId: string): Promise<EntityProfile | undefined>;
  createEntityProfile(profile: InsertEntityProfile): Promise<EntityProfile>;
  updateEntityProfile(entityId: string, updates: Partial<EntityProfile>): Promise<EntityProfile | undefined>;
  verifyEntity(entityId: string, status: string, verifiedBy: string, notes?: string): Promise<void>;
  getEntityRelationships(entityId: string): Promise<any[]>;
  
  // System profile operations
  getSystemProfiles(filters?: { type?: string; environment?: string; isActive?: boolean }): Promise<SystemProfile[]>;
  getSystemProfile(id: string): Promise<SystemProfile | undefined>;
  createSystemProfile(profile: InsertSystemProfile): Promise<SystemProfile>;
  updateSystemHealth(id: string, healthData: any): Promise<void>;
  
  // Profile analytics
  getUserAnalytics(): Promise<any>;
  getDocumentAnalytics(): Promise<any>;
  getEntityAnalytics(): Promise<any>;
  
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(insertUser: any): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private graphNodes: Map<string, GraphNode>;
  private graphRelationships: Map<string, GraphRelationship>;
  private graphClusters: Map<string, GraphCluster>;
  private documents: Map<string, Document>;
  private entities: Map<string, Entity>;
  private users: Map<string, User>;
  
  // Build™ Module Storage
  private pipelines: Map<string, Pipeline>;
  private pipelineExecutions: Map<string, PipelineExecution>;
  private builders: Map<string, Builder>;
  private templates: Map<string, Template>;
  
  // Profile™ Module Storage
  private userProfiles: Map<string, UserProfile>;
  private documentProfiles: Map<string, DocumentProfile>;
  private entityProfiles: Map<string, EntityProfile>;
  private systemProfiles: Map<string, SystemProfile>;

  constructor() {
    this.documents = new Map();
    this.entities = new Map();
    this.users = new Map();
    this.graphNodes = new Map();
    this.graphRelationships = new Map();
    this.graphClusters = new Map();
    
    // Initialize Build module storage
    this.pipelines = new Map();
    this.pipelineExecutions = new Map();
    this.builders = new Map();
    this.templates = new Map();
    
    // Initialize Profile module storage
    this.userProfiles = new Map();
    this.documentProfiles = new Map();
    this.entityProfiles = new Map();
    this.systemProfiles = new Map();
  }

  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getAllDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const now = new Date();
    const document: Document = { 
      ...insertDocument, 
      id,
      createdAt: now,
      updatedAt: now,
      metadata: insertDocument.metadata || {},
      content: insertDocument.content || null,
      status: insertDocument.status || "processing"
    };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
    const existing = this.documents.get(id);
    if (!existing) {
      throw new Error(`Document ${id} not found`);
    }
    
    const updated: Document = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.documents.set(id, updated);
    return updated;
  }

  async deleteDocument(id: string): Promise<void> {
    this.documents.delete(id);
    // Also delete associated entities
    Array.from(this.entities.entries()).forEach(([entityId, entity]) => {
      if (entity.documentId === id) {
        this.entities.delete(entityId);
      }
    });
  }

  async getEntitiesByDocumentId(documentId: string): Promise<Entity[]> {
    return Array.from(this.entities.values()).filter(e => e.documentId === documentId);
  }

  async createEntity(insertEntity: InsertEntity): Promise<Entity> {
    const id = randomUUID();
    const entity: Entity = { 
      ...insertEntity, 
      id,
      metadata: insertEntity.metadata || {},
      startPosition: insertEntity.startPosition || null,
      endPosition: insertEntity.endPosition || null,
      context: insertEntity.context || null
    };
    this.entities.set(id, entity);
    return entity;
  }

  async createEntities(insertEntities: InsertEntity[]): Promise<Entity[]> {
    const entities: Entity[] = [];
    for (const insertEntity of insertEntities) {
      const entity = await this.createEntity(insertEntity);
      entities.push(entity);
    }
    return entities;
  }

  async getEntityStats(): Promise<{ [key: string]: number }> {
    const stats: { [key: string]: number } = {};
    Array.from(this.entities.values()).forEach(entity => {
      stats[entity.type] = (stats[entity.type] || 0) + 1;
    });
    return stats;
  }

  async getProcessingStats(): Promise<{
    totalDocuments: number;
    processingQueue: number;
    avgProcessingTime: number;
    avgAccuracy: number;
  }> {
    const docs = Array.from(this.documents.values());
    const processingQueue = docs.filter(d => d.status === "processing" || d.status === "queued").length;
    
    const completedDocs = docs.filter(d => d.status === "completed");
    const avgProcessingTime = completedDocs.length > 0 
      ? completedDocs.reduce((sum, d) => sum + (d.processingTimeMs || 0), 0) / completedDocs.length
      : 0;
    
    const avgAccuracy = completedDocs.length > 0
      ? completedDocs.reduce((sum, d) => sum + (d.confidence || 0), 0) / completedDocs.length
      : 0;

    return {
      totalDocuments: docs.length,
      processingQueue,
      avgProcessingTime: Math.round(avgProcessingTime),
      avgAccuracy: Math.round(avgAccuracy * 100) / 100
    };
  }

  // Simplified graph operations for prototype
  async getGraphNode(id: string): Promise<GraphNode | undefined> {
    return this.graphNodes.get(id);
  }

  async getAllGraphNodes(): Promise<GraphNode[]> {
    return Array.from(this.graphNodes.values()).filter(node => node.isActive !== false);
  }

  async createGraphNode(insertNode: InsertGraphNode): Promise<GraphNode> {
    const id = randomUUID();
    const now = new Date();
    const node: GraphNode = { 
      ...insertNode, 
      id,
      createdAt: now,
      updatedAt: now,
      properties: insertNode.properties || {},
      confidence: insertNode.confidence ?? 1.0,
      isActive: insertNode.isActive !== false,
      entityId: insertNode.entityId || null,
      embedding: insertNode.embedding || null
    };
    this.graphNodes.set(id, node);
    return node;
  }

  async updateGraphNode(id: string, updates: Partial<GraphNode>): Promise<GraphNode> {
    const existing = this.graphNodes.get(id);
    if (!existing) {
      throw new Error(`Graph node ${id} not found`);
    }
    const updated: GraphNode = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.graphNodes.set(id, updated);
    return updated;
  }

  async deleteGraphNode(id: string): Promise<void> {
    const node = this.graphNodes.get(id);
    if (node) {
      node.isActive = false;
      node.updatedAt = new Date();
    }
  }

  async searchGraphNodes(query: GraphSearchQuery): Promise<GraphNode[]> {
    return Array.from(this.graphNodes.values())
      .filter(node => node.isActive !== false)
      .filter(node => node.label.toLowerCase().includes(query.query.toLowerCase()))
      .slice(0, query.limit || 20);
  }

  async getGraphRelationship(id: string): Promise<GraphRelationship | undefined> {
    return this.graphRelationships.get(id);
  }

  async getAllGraphRelationships(): Promise<GraphRelationship[]> {
    return Array.from(this.graphRelationships.values()).filter(rel => rel.isActive !== false);
  }

  async getRelationshipsByNode(nodeId: string): Promise<GraphRelationship[]> {
    return Array.from(this.graphRelationships.values())
      .filter(rel => rel.isActive !== false && (rel.fromNodeId === nodeId || rel.toNodeId === nodeId));
  }

  async createGraphRelationship(insertRel: InsertGraphRelationship): Promise<GraphRelationship> {
    const id = randomUUID();
    const now = new Date();
    const relationship: GraphRelationship = { 
      ...insertRel, 
      id,
      createdAt: now,
      updatedAt: now,
      properties: insertRel.properties || {},
      strength: insertRel.strength ?? 1.0,
      confidence: insertRel.confidence ?? 1.0,
      isActive: insertRel.isActive !== false,
      sourceDocumentId: insertRel.sourceDocumentId || null,
      inferenceReason: insertRel.inferenceReason || null
    };
    this.graphRelationships.set(id, relationship);
    return relationship;
  }

  async updateGraphRelationship(id: string, updates: Partial<GraphRelationship>): Promise<GraphRelationship> {
    const existing = this.graphRelationships.get(id);
    if (!existing) {
      throw new Error(`Graph relationship ${id} not found`);
    }
    const updated: GraphRelationship = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.graphRelationships.set(id, updated);
    return updated;
  }

  async deleteGraphRelationship(id: string): Promise<void> {
    const relationship = this.graphRelationships.get(id);
    if (relationship) {
      relationship.isActive = false;
      relationship.updatedAt = new Date();
    }
  }

  async findShortestPath(query: GraphPathQuery): Promise<GraphPath | null> {
    return null; // Simplified for prototype
  }

  async getNeighborhood(query: GraphNeighborQuery): Promise<GraphNeighborhood> {
    const centerNode = this.graphNodes.get(query.nodeId);
    if (!centerNode) {
      throw new Error(`Node ${query.nodeId} not found`);
    }
    
    const relationships = await this.getRelationshipsByNode(query.nodeId);
    const neighbors = [];
    
    for (const rel of relationships) {
      const neighborId = rel.fromNodeId === query.nodeId ? rel.toNodeId : rel.fromNodeId;
      const neighbor = this.graphNodes.get(neighborId);
      if (neighbor && neighbor.isActive !== false) {
        neighbors.push({
          node: neighbor,
          relationship: rel,
          distance: 1
        });
      }
    }

    return {
      centerNode,
      neighbors
    };
  }

  async getGraphMetrics(): Promise<GraphMetrics> {
    const activeNodes = Array.from(this.graphNodes.values()).filter(n => n.isActive !== false);
    const activeRels = Array.from(this.graphRelationships.values()).filter(r => r.isActive !== false);
    
    return {
      totalNodes: activeNodes.length,
      totalRelationships: activeRels.length,
      avgDegree: activeNodes.length > 0 ? (activeRels.length * 2) / activeNodes.length : 0,
      density: activeNodes.length > 1 ? (2 * activeRels.length) / (activeNodes.length * (activeNodes.length - 1)) : 0,
      clusters: this.graphClusters.size,
      topEntities: activeNodes.slice(0, 5).map(node => ({
        node,
        degree: 0,
        centrality: 0
      }))
    };
  }

  async getGraphCluster(id: string): Promise<GraphCluster | undefined> {
    return this.graphClusters.get(id);
  }

  async getAllGraphClusters(): Promise<GraphCluster[]> {
    return Array.from(this.graphClusters.values());
  }

  async createGraphCluster(insertCluster: InsertGraphCluster): Promise<GraphCluster> {
    const id = randomUUID();
    const now = new Date();
    const cluster: GraphCluster = { 
      ...insertCluster, 
      id,
      createdAt: now,
      updatedAt: now,
      metrics: insertCluster.metrics || {}
    };
    this.graphClusters.set(id, cluster);
    return cluster;
  }

  async buildGraphFromEntities(documentId?: string): Promise<{ nodes: GraphNode[]; relationships: GraphRelationship[] }> {
    let entities: Entity[];
    if (documentId) {
      entities = await this.getEntitiesByDocumentId(documentId);
    } else {
      entities = Array.from(this.entities.values());
    }

    const nodes: GraphNode[] = [];
    const relationships: GraphRelationship[] = [];

    console.log(`Building graph from ${entities.length} entities...`);

    // Clear existing graph data to avoid duplicates
    this.graphNodes.clear();
    this.graphRelationships.clear();

    // Create nodes from entities
    for (const entity of entities) {
      const node = await this.createGraphNode({
        label: entity.value,
        type: "ENTITY",
        entityId: entity.id,
        properties: {
          entityType: entity.type,
          originalContext: entity.context
        },
        confidence: entity.confidence || 0.5
      });
      nodes.push(node);
    }

    // Create relationships between entities in the same document(s)
    const entitiesByDoc = new Map<string, Entity[]>();
    entities.forEach(entity => {
      if (!entitiesByDoc.has(entity.documentId)) {
        entitiesByDoc.set(entity.documentId, []);
      }
      entitiesByDoc.get(entity.documentId)!.push(entity);
    });

    // For each document, create co-occurrence relationships between entities
    for (const [docId, docEntities] of entitiesByDoc) {
      for (let i = 0; i < docEntities.length; i++) {
        for (let j = i + 1; j < docEntities.length; j++) {
          const entity1 = docEntities[i];
          const entity2 = docEntities[j];
          
          const node1 = nodes.find(n => n.entityId === entity1.id);
          const node2 = nodes.find(n => n.entityId === entity2.id);
          
          if (node1 && node2) {
            // Calculate relationship strength based on entity confidence and proximity
            const strength = Math.min((entity1.confidence || 0.5) * (entity2.confidence || 0.5), 1.0);
            
            try {
              const relationship = await this.createGraphRelationship({
                fromNodeId: node1.id,
                toNodeId: node2.id,
                relationshipType: "RELATED_TO",
                strength: strength,
                confidence: strength,
                properties: {
                  coOccurrence: true,
                  sourceDocument: docId,
                  entityTypes: `${entity1.type}-${entity2.type}`
                },
                sourceDocumentId: docId,
                inferenceReason: "Entity co-occurrence in same document"
              });
              relationships.push(relationship);
            } catch (error) {
              console.error('Error creating relationship:', error);
            }
          }
        }
      }
    }

    console.log(`Built graph with ${nodes.length} nodes and ${relationships.length} relationships`);
    return { nodes, relationships };
  }

  // =====================================
  // Build™ Module Implementation
  // =====================================

  // Pipeline operations
  async getPipelines(filters?: { type?: string; status?: string; createdBy?: string }): Promise<Pipeline[]> {
    let pipelines = Array.from(this.pipelines.values());
    
    if (filters?.type) {
      pipelines = pipelines.filter(p => p.type === filters.type);
    }
    if (filters?.status) {
      pipelines = pipelines.filter(p => p.status === filters.status);
    }
    if (filters?.createdBy) {
      pipelines = pipelines.filter(p => p.createdBy === filters.createdBy);
    }
    
    return pipelines.sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getPipeline(id: string): Promise<Pipeline | undefined> {
    return this.pipelines.get(id);
  }

  async createPipeline(insertPipeline: InsertPipeline): Promise<Pipeline> {
    const id = randomUUID();
    const now = new Date();
    const pipeline: Pipeline = {
      ...insertPipeline,
      id,
      createdAt: now,
      updatedAt: now,
      executionCount: 0,
      lastExecuted: null
    };
    this.pipelines.set(id, pipeline);
    return pipeline;
  }

  async updatePipeline(id: string, updates: Partial<Pipeline>): Promise<Pipeline | undefined> {
    const existing = this.pipelines.get(id);
    if (!existing) return undefined;
    
    const updated: Pipeline = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.pipelines.set(id, updated);
    return updated;
  }

  async deletePipeline(id: string): Promise<void> {
    this.pipelines.delete(id);
    // Also delete associated executions
    Array.from(this.pipelineExecutions.entries()).forEach(([execId, exec]) => {
      if (exec.pipelineId === id) {
        this.pipelineExecutions.delete(execId);
      }
    });
  }

  async executePipeline(id: string, params: { inputData?: any; executedBy: string }): Promise<PipelineExecution> {
    const pipeline = this.pipelines.get(id);
    if (!pipeline) {
      throw new Error(`Pipeline ${id} not found`);
    }

    const execId = randomUUID();
    const now = new Date();
    const execution: PipelineExecution = {
      id: execId,
      pipelineId: id,
      status: "running",
      startTime: now,
      endTime: null,
      executionTimeMs: null,
      inputData: params.inputData || {},
      outputData: null,
      errorDetails: null,
      executedBy: params.executedBy,
      metadata: {}
    };

    this.pipelineExecutions.set(execId, execution);
    
    // Update pipeline execution count
    await this.updatePipeline(id, {
      executionCount: (pipeline.executionCount || 0) + 1,
      lastExecuted: now
    });

    return execution;
  }

  async getPipelineExecutions(pipelineId: string): Promise<PipelineExecution[]> {
    return Array.from(this.pipelineExecutions.values())
      .filter(exec => exec.pipelineId === pipelineId)
      .sort((a, b) => new Date(b.startTime!).getTime() - new Date(a.startTime!).getTime());
  }

  async getPipelineExecution(id: string): Promise<PipelineExecution | undefined> {
    return this.pipelineExecutions.get(id);
  }

  // Builder operations
  async getBuilders(filters?: { type?: string; isPublic?: boolean; createdBy?: string }): Promise<Builder[]> {
    let builders = Array.from(this.builders.values());
    
    if (filters?.type) {
      builders = builders.filter(b => b.type === filters.type);
    }
    if (filters?.isPublic !== undefined) {
      builders = builders.filter(b => b.isPublic === filters.isPublic);
    }
    if (filters?.createdBy) {
      builders = builders.filter(b => b.createdBy === filters.createdBy);
    }
    
    return builders.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  async getBuilder(id: string): Promise<Builder | undefined> {
    return this.builders.get(id);
  }

  async createBuilder(insertBuilder: InsertBuilder): Promise<Builder> {
    const id = randomUUID();
    const now = new Date();
    const builder: Builder = {
      ...insertBuilder,
      id,
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      rating: 0
    };
    this.builders.set(id, builder);
    return builder;
  }

  // Template operations
  async getTemplates(filters?: { category?: string; isOfficial?: boolean }): Promise<Template[]> {
    let templates = Array.from(this.templates.values());
    
    if (filters?.category) {
      templates = templates.filter(t => t.category === filters.category);
    }
    if (filters?.isOfficial !== undefined) {
      templates = templates.filter(t => t.isOfficial === filters.isOfficial);
    }
    
    return templates.sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = randomUUID();
    const now = new Date();
    const template: Template = {
      ...insertTemplate,
      id,
      createdAt: now,
      updatedAt: now,
      downloadCount: 0
    };
    this.templates.set(id, template);
    return template;
  }

  async incrementTemplateDownload(id: string): Promise<void> {
    const template = this.templates.get(id);
    if (template) {
      template.downloadCount = (template.downloadCount || 0) + 1;
      template.updatedAt = new Date();
      this.templates.set(id, template);
    }
  }

  async getBuildAnalytics(): Promise<any> {
    const pipelines = Array.from(this.pipelines.values());
    const executions = Array.from(this.pipelineExecutions.values());
    
    return {
      totalPipelines: pipelines.length,
      activePipelines: pipelines.filter(p => p.status === 'active').length,
      totalExecutions: executions.length,
      successfulExecutions: executions.filter(e => e.status === 'completed').length,
      totalBuilders: this.builders.size,
      totalTemplates: this.templates.size,
      popularTemplates: Array.from(this.templates.values())
        .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
        .slice(0, 5)
    };
  }

  // =====================================
  // Profile™ Module Implementation
  // =====================================

  // User profile operations
  async getUserProfiles(filters?: { role?: string; isActive?: boolean }): Promise<UserProfile[]> {
    let profiles = Array.from(this.userProfiles.values());
    
    if (filters?.role) {
      profiles = profiles.filter(p => p.role === filters.role);
    }
    if (filters?.isActive !== undefined) {
      profiles = profiles.filter(p => p.isActive === filters.isActive);
    }
    
    return profiles.sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getUserProfileByUserId(userId: string): Promise<UserProfile | undefined> {
    return Array.from(this.userProfiles.values()).find(p => p.userId === userId);
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const id = randomUUID();
    const now = new Date();
    const profile: UserProfile = {
      ...insertProfile,
      id,
      createdAt: now,
      updatedAt: now,
      lastLogin: null
    };
    this.userProfiles.set(id, profile);
    return profile;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined> {
    const existing = Array.from(this.userProfiles.values()).find(p => p.userId === userId);
    if (!existing) return undefined;
    
    const updated: UserProfile = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.userProfiles.set(existing.id, updated);
    return updated;
  }

  async recordUserActivity(userId: string, action: string, metadata?: any): Promise<void> {
    const profile = Array.from(this.userProfiles.values()).find(p => p.userId === userId);
    if (profile) {
      const stats = profile.activityStats as any || {};
      stats[action] = (stats[action] || 0) + 1;
      stats.lastActivity = new Date();
      if (metadata) {
        stats.lastMetadata = metadata;
      }
      
      await this.updateUserProfile(userId, { 
        activityStats: stats,
        lastLogin: action === 'login' ? new Date() : profile.lastLogin
      });
    }
  }

  // Document profile operations
  async getDocumentProfiles(filters?: { qualityThreshold?: number; complexityThreshold?: number }): Promise<DocumentProfile[]> {
    let profiles = Array.from(this.documentProfiles.values());
    
    if (filters?.qualityThreshold !== undefined) {
      profiles = profiles.filter(p => (p.qualityScore || 0) >= filters.qualityThreshold!);
    }
    if (filters?.complexityThreshold !== undefined) {
      profiles = profiles.filter(p => (p.complexityScore || 0) >= filters.complexityThreshold!);
    }
    
    return profiles.sort((a, b) => (b.qualityScore || 0) - (a.qualityScore || 0));
  }

  async getDocumentProfile(documentId: string): Promise<DocumentProfile | undefined> {
    return Array.from(this.documentProfiles.values()).find(p => p.documentId === documentId);
  }

  async createDocumentProfile(insertProfile: InsertDocumentProfile): Promise<DocumentProfile> {
    const id = randomUUID();
    const now = new Date();
    const profile: DocumentProfile = {
      ...insertProfile,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.documentProfiles.set(id, profile);
    return profile;
  }

  async updateDocumentProfile(documentId: string, updates: Partial<DocumentProfile>): Promise<DocumentProfile | undefined> {
    const existing = Array.from(this.documentProfiles.values()).find(p => p.documentId === documentId);
    if (!existing) return undefined;
    
    const updated: DocumentProfile = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.documentProfiles.set(existing.id, updated);
    return updated;
  }

  async addDocumentAnnotation(documentId: string, annotation: any, userId: string): Promise<void> {
    const profile = await this.getDocumentProfile(documentId);
    if (profile) {
      const annotations = (profile.annotations as any[]) || [];
      annotations.push({
        ...annotation,
        userId,
        timestamp: new Date(),
        id: randomUUID()
      });
      await this.updateDocumentProfile(documentId, { annotations });
    }
  }

  async getRelatedDocuments(documentId: string, limit: number): Promise<Document[]> {
    const profile = await this.getDocumentProfile(documentId);
    if (!profile || !(profile.relatedDocuments as any[])?.length) {
      return [];
    }
    
    const relatedIds = (profile.relatedDocuments as string[]).slice(0, limit);
    return relatedIds.map(id => this.documents.get(id)).filter(Boolean) as Document[];
  }

  // Entity profile operations
  async getEntityProfiles(filters?: { category?: string; verificationStatus?: string; importanceThreshold?: number }): Promise<EntityProfile[]> {
    let profiles = Array.from(this.entityProfiles.values());
    
    if (filters?.category) {
      profiles = profiles.filter(p => p.category === filters.category);
    }
    if (filters?.verificationStatus) {
      profiles = profiles.filter(p => p.verificationStatus === filters.verificationStatus);
    }
    if (filters?.importanceThreshold !== undefined) {
      profiles = profiles.filter(p => (p.importance || 0) >= filters.importanceThreshold!);
    }
    
    return profiles.sort((a, b) => (b.importance || 0) - (a.importance || 0));
  }

  async getEntityProfile(entityId: string): Promise<EntityProfile | undefined> {
    return Array.from(this.entityProfiles.values()).find(p => p.entityId === entityId);
  }

  async createEntityProfile(insertProfile: InsertEntityProfile): Promise<EntityProfile> {
    const id = randomUUID();
    const now = new Date();
    const profile: EntityProfile = {
      ...insertProfile,
      id,
      createdAt: now,
      updatedAt: now,
      documentFrequency: 0,
      importance: 0
    };
    this.entityProfiles.set(id, profile);
    return profile;
  }

  async updateEntityProfile(entityId: string, updates: Partial<EntityProfile>): Promise<EntityProfile | undefined> {
    const existing = Array.from(this.entityProfiles.values()).find(p => p.entityId === entityId);
    if (!existing) return undefined;
    
    const updated: EntityProfile = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.entityProfiles.set(existing.id, updated);
    return updated;
  }

  async verifyEntity(entityId: string, status: string, verifiedBy: string, notes?: string): Promise<void> {
    await this.updateEntityProfile(entityId, {
      verificationStatus: status,
      notes: notes || undefined
    });
  }

  async getEntityRelationships(entityId: string): Promise<any[]> {
    const entity = this.entities.get(entityId);
    if (!entity) return [];
    
    const node = Array.from(this.graphNodes.values()).find(n => n.entityId === entityId);
    if (!node) return [];
    
    return Array.from(this.graphRelationships.values())
      .filter(r => r.fromNodeId === node.id || r.toNodeId === node.id);
  }

  // System profile operations
  async getSystemProfiles(filters?: { type?: string; environment?: string; isActive?: boolean }): Promise<SystemProfile[]> {
    let profiles = Array.from(this.systemProfiles.values());
    
    if (filters?.type) {
      profiles = profiles.filter(p => p.type === filters.type);
    }
    if (filters?.environment) {
      profiles = profiles.filter(p => p.environment === filters.environment);
    }
    if (filters?.isActive !== undefined) {
      profiles = profiles.filter(p => p.isActive === filters.isActive);
    }
    
    return profiles.sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getSystemProfile(id: string): Promise<SystemProfile | undefined> {
    return this.systemProfiles.get(id);
  }

  async createSystemProfile(insertProfile: InsertSystemProfile): Promise<SystemProfile> {
    const id = randomUUID();
    const now = new Date();
    const profile: SystemProfile = {
      ...insertProfile,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.systemProfiles.set(id, profile);
    return profile;
  }

  async updateSystemHealth(id: string, healthData: any): Promise<void> {
    const profile = this.systemProfiles.get(id);
    if (profile) {
      const healthChecks = (profile.healthChecks as any[]) || [];
      healthChecks.push({
        ...healthData,
        timestamp: new Date(),
        id: randomUUID()
      });
      
      profile.healthChecks = healthChecks;
      profile.updatedAt = new Date();
      this.systemProfiles.set(id, profile);
    }
  }

  // Profile analytics
  async getUserAnalytics(): Promise<any> {
    const profiles = Array.from(this.userProfiles.values());
    return {
      totalUsers: profiles.length,
      activeUsers: profiles.filter(p => p.isActive).length,
      usersByRole: profiles.reduce((acc, p) => {
        acc[p.role] = (acc[p.role] || 0) + 1;
        return acc;
      }, {} as any),
      recentLogins: profiles.filter(p => p.lastLogin && 
        new Date().getTime() - new Date(p.lastLogin).getTime() < 24 * 60 * 60 * 1000).length
    };
  }

  async getDocumentAnalytics(): Promise<any> {
    const profiles = Array.from(this.documentProfiles.values());
    return {
      totalProfiles: profiles.length,
      avgQualityScore: profiles.reduce((sum, p) => sum + (p.qualityScore || 0), 0) / profiles.length,
      avgComplexityScore: profiles.reduce((sum, p) => sum + (p.complexityScore || 0), 0) / profiles.length,
      qualityDistribution: {
        high: profiles.filter(p => (p.qualityScore || 0) >= 0.8).length,
        medium: profiles.filter(p => (p.qualityScore || 0) >= 0.5 && (p.qualityScore || 0) < 0.8).length,
        low: profiles.filter(p => (p.qualityScore || 0) < 0.5).length
      }
    };
  }

  async getEntityAnalytics(): Promise<any> {
    const profiles = Array.from(this.entityProfiles.values());
    return {
      totalProfiles: profiles.length,
      verifiedEntities: profiles.filter(p => p.verificationStatus === 'verified').length,
      unverifiedEntities: profiles.filter(p => p.verificationStatus === 'unverified').length,
      avgImportance: profiles.reduce((sum, p) => sum + (p.importance || 0), 0) / profiles.length,
      categoriesDistribution: profiles.reduce((acc, p) => {
        if (p.category) {
          acc[p.category] = (acc[p.category] || 0) + 1;
        }
        return acc;
      }, {} as any)
    };
  }

  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: any): Promise<User> {
    const user: User = {
      ...insertUser,
      id: insertUser.id || randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const updatedUser: User = {
      ...existingUser,
      ...updates,
      id: existingUser.id, // Preserve ID
      createdAt: existingUser.createdAt, // Preserve creation date
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id!);
    
    const user: User = {
      ...userData,
      id: userData.id!,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    this.users.set(user.id, user);
    return user;
  }
}

export const storage = new MemStorage();
