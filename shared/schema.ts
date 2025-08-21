import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, real, boolean, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  filePath: text("file_path"), // Local path or S3 URL
  s3Key: text("s3_key"), // S3 object key
  content: text("content"),
  status: text("status").notNull().default("processing"), // processing, completed, failed
  processingProgress: integer("processing_progress").default(0),
  confidence: real("confidence"),
  wordCount: integer("word_count"),
  entities: jsonb("entities").default([]),
  semanticTags: jsonb("semantic_tags").default([]),
  metadata: jsonb("metadata").default({}),
  processingTimeMs: integer("processing_time_ms"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const entities = pgTable("entities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentId: varchar("document_id").notNull().references(() => documents.id),
  type: text("type").notNull(), // PERSON, ORGANIZATION, LOCATION, DATE, MEDICAL_TERM, etc.
  value: text("value").notNull(),
  confidence: real("confidence").notNull(),
  startPosition: integer("start_position"),
  endPosition: integer("end_position"),
  context: text("context"),
  metadata: jsonb("metadata").default({}),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEntitySchema = createInsertSchema(entities).omit({
  id: true,
});

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table with role-based access control
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("viewer"), // super_admin, platform_admin, partner_admin, analyst, viewer
  tenantId: varchar("tenant_id"), // null for admin/direct customers, tenant ID for partner users
  partnerId: varchar("partner_id"), // for partner users, references the partner organization
  isActive: boolean("is_active").default(true),
  permissions: jsonb("permissions").default("{}"), // Additional role-specific permissions
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Partner/Tenant management table
export const partners = pgTable("partners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  slug: varchar("slug").unique().notNull(), // URL-friendly identifier (e.g., 'mock5')
  contactEmail: varchar("contact_email").notNull(),
  whiteLabel: jsonb("white_label_config").default("{}"), // Branding configuration
  features: jsonb("features").default("[]"), // Enabled features for this partner
  limits: jsonb("limits").default("{}"), // Usage limits
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User roles enum for type safety - Production Role Hierarchy
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',        // Platform owner - complete system control
  PLATFORM_ADMIN: 'platform_admin', // SocratIQ team - full operational access
  PARTNER_ADMIN: 'partner_admin',    // Partners like EMME - manage their organization
  ANALYST: 'analyst',                // Advanced users - create projects, analyze data
  VIEWER: 'viewer',                  // Basic users - view reports, limited access
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Role permissions mapping
export const ROLE_PERMISSIONS = {
  [USER_ROLES.SUPER_ADMIN]: [
    'system_admin', 'user_management', 'partner_management', 'billing', 
    'database_admin', 'security_admin', 'audit_logs', 'system_settings'
  ],
  [USER_ROLES.PLATFORM_ADMIN]: [
    'user_management', 'partner_support', 'content_moderation', 
    'analytics_admin', 'technical_support', 'audit_view'
  ],
  [USER_ROLES.PARTNER_ADMIN]: [
    'partner_users', 'partner_content', 'partner_analytics', 
    'partner_settings', 'partner_billing', 'team_management'
  ],
  [USER_ROLES.ANALYST]: [
    'create_projects', 'advanced_analytics', 'data_export', 
    'collaboration', 'custom_reports', 'api_access'
  ],
  [USER_ROLES.VIEWER]: [
    'view_reports', 'basic_search', 'view_analytics', 'profile_edit'
  ],
} as const;

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// EMME Projects table for pharmaceutical project management
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  organizationType: text("organization_type"),
  therapeuticArea: text("therapeutic_area"),
  developmentStage: text("development_stage"),
  patientPopulation: text("patient_population"),
  hcpInsights: text("hcp_insights"),
  clinicalEndpoints: text("clinical_endpoints"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  userId: varchar("user_id").references(() => users.id),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type InsertProject = typeof projects.$inferInsert;
export type Project = typeof projects.$inferSelect;

// Sophie Impact Lens™ Schema - Pattern-based decision impact assessment
export const sophiePatterns = pgTable("sophie_patterns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patternType: varchar("pattern_type", { length: 255 }).notNull(),
  description: text("description").notNull(),
  confidence: real("confidence").notNull(), // 0.0 - 1.0
  detectedAt: timestamp("detected_at").defaultNow(),
  sourceDocuments: jsonb("source_documents").default('[]'), // Document IDs that contributed
  patternData: jsonb("pattern_data").notNull(), // Raw pattern analysis data
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const patternHypotheses = pgTable("pattern_hypotheses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patternId: varchar("pattern_id").references(() => sophiePatterns.id, { onDelete: "cascade" }).notNull(),
  hypothesis: text("hypothesis").notNull(),
  reasoning: text("reasoning").notNull(),
  supportingEvidence: jsonb("supporting_evidence").default('[]'),
  confidenceLevel: real("confidence_level").notNull(), // 0.0 - 1.0
  validationStatus: varchar("validation_status", { enum: ['pending', 'validated', 'rejected', 'under_review'] }).default('pending'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const recommendedActions = pgTable("recommended_actions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hypothesisId: varchar("hypothesis_id").references(() => patternHypotheses.id, { onDelete: "cascade" }).notNull(),
  action: text("action").notNull(),
  priority: varchar("priority", { enum: ['low', 'medium', 'high', 'critical'] }).notNull(),
  expectedOutcome: text("expected_outcome").notNull(),
  riskLevel: varchar("risk_level", { enum: ['low', 'medium', 'high'] }).notNull(),
  effort: varchar("effort", { length: 255 }).notNull(), // e.g., "2-3 weeks", "Low effort"
  timeline: varchar("timeline", { length: 255 }).notNull(), // e.g., "Immediate", "Q2 2025"
  prerequisites: jsonb("prerequisites").default('[]'),
  resources: jsonb("resources").default('[]'),
  stakeholders: jsonb("stakeholders").default('[]'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blastZoneAnalyses = pgTable("blast_zone_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  actionId: varchar("action_id").references(() => recommendedActions.id, { onDelete: "cascade" }).notNull(),
  impactRadius: varchar("impact_radius", { enum: ['localized', 'departmental', 'organizational', 'ecosystem'] }).notNull(),
  affectedEntities: jsonb("affected_entities").notNull(), // Teams, departments, systems affected
  impactSeverity: varchar("impact_severity", { enum: ['minimal', 'moderate', 'significant', 'critical'] }).notNull(),
  cascadeEffects: jsonb("cascade_effects").default('[]'), // Secondary and tertiary effects
  timeToFullImpact: varchar("time_to_full_impact", { length: 255 }).notNull(), // e.g., "3-6 months"
  reversibilityScore: real("reversibility_score").notNull(), // 0.0 - 1.0 (how easily undoable)
  mitigationStrategies: jsonb("mitigation_strategies").default('[]'),
  monitoringMetrics: jsonb("monitoring_metrics").default('[]'),
  simulationData: jsonb("simulation_data").default('{}'), // Monte Carlo, graph analysis results
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sophieImpactLenses = pgTable("sophie_impact_lenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  patternId: varchar("pattern_id").references(() => sophiePatterns.id, { onDelete: "cascade" }).notNull(),
  hypothesisId: varchar("hypothesis_id").references(() => patternHypotheses.id, { onDelete: "cascade" }).notNull(),
  overallRiskScore: real("overall_risk_score").notNull(), // 0.0 - 10.0
  confidenceLevel: real("confidence_level").notNull(), // 0.0 - 1.0
  status: varchar("status", { enum: ['analyzing', 'ready', 'implemented', 'monitoring', 'archived'] }).default('analyzing'),
  decisionMade: boolean("decision_made").default(false),
  implementationNotes: text("implementation_notes"),
  outcomeAssessment: jsonb("outcome_assessment").default('{}'), // Post-implementation analysis
  userId: varchar("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Impact monitoring and agent feedback loops
export const impactMonitoringEvents = pgTable("impact_monitoring_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  impactLensId: varchar("impact_lens_id").references(() => sophieImpactLenses.id, { onDelete: "cascade" }).notNull(),
  eventType: varchar("event_type", { length: 255 }).notNull(), // e.g., "metric_threshold_reached", "cascade_detected"
  eventData: jsonb("event_data").notNull(),
  severity: varchar("severity", { enum: ['info', 'warning', 'critical'] }).notNull(),
  agentId: varchar("agent_id", { length: 255 }), // Which AI agent detected this
  isResolved: boolean("is_resolved").default(false),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// Define relationships for Sophie Impact Lens™
export const sophiePatternsRelations = relations(sophiePatterns, ({ many }) => ({
  hypotheses: many(patternHypotheses),
  impactLenses: many(sophieImpactLenses),
}));

export const patternHypothesesRelations = relations(patternHypotheses, ({ one, many }) => ({
  pattern: one(sophiePatterns, {
    fields: [patternHypotheses.patternId],
    references: [sophiePatterns.id],
  }),
  actions: many(recommendedActions),
  impactLenses: many(sophieImpactLenses),
}));

export const recommendedActionsRelations = relations(recommendedActions, ({ one, many }) => ({
  hypothesis: one(patternHypotheses, {
    fields: [recommendedActions.hypothesisId],
    references: [patternHypotheses.id],
  }),
  blastZoneAnalyses: many(blastZoneAnalyses),
}));

export const blastZoneAnalysesRelations = relations(blastZoneAnalyses, ({ one }) => ({
  action: one(recommendedActions, {
    fields: [blastZoneAnalyses.actionId],
    references: [recommendedActions.id],
  }),
}));

export const sophieImpactLensesRelations = relations(sophieImpactLenses, ({ one, many }) => ({
  pattern: one(sophiePatterns, {
    fields: [sophieImpactLenses.patternId],
    references: [sophiePatterns.id],
  }),
  hypothesis: one(patternHypotheses, {
    fields: [sophieImpactLenses.hypothesisId],
    references: [patternHypotheses.id],
  }),
  user: one(users, {
    fields: [sophieImpactLenses.userId],
    references: [users.id],
  }),
  monitoringEvents: many(impactMonitoringEvents),
}));

export const impactMonitoringEventsRelations = relations(impactMonitoringEvents, ({ one }) => ({
  impactLens: one(sophieImpactLenses, {
    fields: [impactMonitoringEvents.impactLensId],
    references: [sophieImpactLenses.id],
  }),
}));

// Type exports for Sophie Impact Lens™
export type SophiePattern = typeof sophiePatterns.$inferSelect;
export type InsertSophiePattern = typeof sophiePatterns.$inferInsert;
export type PatternHypothesis = typeof patternHypotheses.$inferSelect;
export type InsertPatternHypothesis = typeof patternHypotheses.$inferInsert;
export type RecommendedAction = typeof recommendedActions.$inferSelect;
export type InsertRecommendedAction = typeof recommendedActions.$inferInsert;
export type BlastZoneAnalysis = typeof blastZoneAnalyses.$inferSelect;
export type InsertBlastZoneAnalysis = typeof blastZoneAnalyses.$inferInsert;
export type SophieImpactLens = typeof sophieImpactLenses.$inferSelect;
export type InsertSophieImpactLens = typeof sophieImpactLenses.$inferInsert;
export type ImpactMonitoringEvent = typeof impactMonitoringEvents.$inferSelect;
export type InsertImpactMonitoringEvent = typeof impactMonitoringEvents.$inferInsert;

// Core Platform Schema will be referenced from existing modules below
// Transform™ - Document Processing Pipeline (uses existing documents/entities)
export const transformJobs = pgTable("transform_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentId: varchar("document_id").references(() => documents.id, { onDelete: "cascade" }).notNull(),
  jobType: varchar("job_type", { enum: ['nlp_extraction', 'semantic_analysis', 'entity_linking', 'knowledge_graph'] }).notNull(),
  status: varchar("status", { enum: ['queued', 'processing', 'completed', 'failed', 'retrying'] }).default('queued'),
  progress: integer("progress").default(0), // 0-100
  inputData: jsonb("input_data").notNull(),
  outputData: jsonb("output_data").default('{}'),
  errorMessage: text("error_message"),
  processingTimeMs: integer("processing_time_ms"),
  agentId: varchar("agent_id", { length: 255 }), // AI agent that processed this
  retryCount: integer("retry_count").default(0),
  maxRetries: integer("max_retries").default(3),
  priority: integer("priority").default(5), // 1-10, higher = more urgent
  createdAt: timestamp("created_at").defaultNow(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Agent System - Platform Core
export const aiAgents = pgTable("ai_agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentName: varchar("agent_name", { length: 255 }).notNull(),
  agentType: varchar("agent_type", { enum: ['sophie', 'transform', 'mesh', 'trace', 'build', 'profile', 'monitor'] }).notNull(),
  description: text("description").notNull(),
  capabilities: jsonb("capabilities").default('[]'),
  configuration: jsonb("configuration").default('{}'),
  status: varchar("status", { enum: ['active', 'inactive', 'maintenance', 'error'] }).default('active'),
  version: varchar("version", { length: 50 }).notNull(),
  performance: jsonb("performance").default('{}'), // Performance metrics
  learningData: jsonb("learning_data").default('{}'), // Adaptive learning state
  lastActivity: timestamp("last_activity").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const agentTasks = pgTable("agent_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").references(() => aiAgents.id, { onDelete: "cascade" }).notNull(),
  taskType: varchar("task_type", { length: 255 }).notNull(),
  taskData: jsonb("task_data").notNull(),
  status: varchar("status", { enum: ['queued', 'processing', 'completed', 'failed', 'cancelled'] }).default('queued'),
  priority: integer("priority").default(5), // 1-10
  progress: integer("progress").default(0), // 0-100
  result: jsonb("result").default('{}'),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// System Monitoring and Analytics
export const systemMetrics = pgTable("system_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metricType: varchar("metric_type", { length: 255 }).notNull(), // performance, usage, error, business
  metricName: varchar("metric_name", { length: 255 }).notNull(),
  value: real("value").notNull(),
  unit: varchar("unit", { length: 50 }),
  dimensions: jsonb("dimensions").default('{}'), // Additional context/tags
  threshold: real("threshold"), // Alert threshold
  isAlert: boolean("is_alert").default(false),
  alertLevel: varchar("alert_level", { enum: ['info', 'warning', 'critical'] }),
  timestamp: timestamp("timestamp").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Additional Platform Relations
export const transformJobsRelations = relations(transformJobs, ({ one }) => ({
  document: one(documents, {
    fields: [transformJobs.documentId],
    references: [documents.id],
  }),
}));

export const aiAgentsRelations = relations(aiAgents, ({ many }) => ({
  tasks: many(agentTasks),
}));

export const agentTasksRelations = relations(agentTasks, ({ one }) => ({
  agent: one(aiAgents, {
    fields: [agentTasks.agentId],
    references: [aiAgents.id],
  }),
}));

// Core Platform Type Exports
export type TransformJob = typeof transformJobs.$inferSelect;
export type InsertTransformJob = typeof transformJobs.$inferInsert;
export type AIAgent = typeof aiAgents.$inferSelect;
export type InsertAIAgent = typeof aiAgents.$inferInsert;
export type AgentTask = typeof agentTasks.$inferSelect;
export type InsertAgentTask = typeof agentTasks.$inferInsert;
export type SystemMetric = typeof systemMetrics.$inferSelect;
export type InsertSystemMetric = typeof systemMetrics.$inferInsert;

export type Partner = typeof partners.$inferSelect;
export type UpsertPartner = typeof partners.$inferInsert;

// SocratIQ Mesh™ - Knowledge Graph Tables
export const graphNodes = pgTable("graph_nodes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  label: text("label").notNull(), // Human readable name
  type: text("type").notNull(), // NODE_TYPES
  entityId: varchar("entity_id").references(() => entities.id), // Optional reference to entity
  properties: jsonb("properties").default({}), // Flexible node properties
  embedding: jsonb("embedding"), // Vector embedding for similarity
  confidence: real("confidence").default(1.0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const graphRelationships = pgTable("graph_relationships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromNodeId: varchar("from_node_id").notNull().references(() => graphNodes.id),
  toNodeId: varchar("to_node_id").notNull().references(() => graphNodes.id),
  relationshipType: text("relationship_type").notNull(), // RELATIONSHIP_TYPES
  strength: real("strength").default(1.0), // Relationship strength (0-1)
  confidence: real("confidence").default(1.0), // AI confidence in relationship
  properties: jsonb("properties").default({}), // Additional relationship metadata
  sourceDocumentId: varchar("source_document_id").references(() => documents.id), // Where this relationship was discovered
  inferenceReason: text("inference_reason"), // How this relationship was inferred
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Graph clustering and community detection
export const graphClusters = pgTable("graph_clusters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  nodeIds: jsonb("node_ids").notNull(), // Array of node IDs in this cluster
  clusterType: text("cluster_type").notNull(), // CLUSTER_TYPES
  metrics: jsonb("metrics").default({}), // Clustering metrics (modularity, etc.)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});


export const insertGraphNodeSchema = createInsertSchema(graphNodes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGraphRelationshipSchema = createInsertSchema(graphRelationships).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGraphClusterSchema = createInsertSchema(graphClusters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Entity = typeof entities.$inferSelect;
export type InsertEntity = z.infer<typeof insertEntitySchema>;
export type GraphNode = typeof graphNodes.$inferSelect;
export type InsertGraphNode = z.infer<typeof insertGraphNodeSchema>;
export type GraphRelationship = typeof graphRelationships.$inferSelect;
export type InsertGraphRelationship = z.infer<typeof insertGraphRelationshipSchema>;
export type GraphCluster = typeof graphClusters.$inferSelect;
export type InsertGraphCluster = z.infer<typeof insertGraphClusterSchema>;

// Processing status types
export const ProcessingStatus = {
  QUEUED: "queued",
  PROCESSING: "processing", 
  COMPLETED: "completed",
  FAILED: "failed"
} as const;

export type ProcessingStatusType = typeof ProcessingStatus[keyof typeof ProcessingStatus];

// Mesh™ Processing Status
export const MeshStatus = {
  BUILDING: "building", // Building graph from entities
  ANALYZING: "analyzing", // Computing relationships
  CLUSTERING: "clustering", // Finding communities
  READY: "ready", // Graph ready for queries
  ERROR: "error" // Processing error
} as const;

export type MeshStatusType = typeof MeshStatus[keyof typeof MeshStatus];

// Entity types
export const EntityTypes = {
  PERSON: "PERSON",
  ORGANIZATION: "ORGANIZATION", 
  LOCATION: "LOCATION",
  DATE: "DATE",
  MEDICAL_TERM: "MEDICAL_TERM",
  DRUG: "DRUG",
  DISEASE: "DISEASE",
  PROTOCOL: "PROTOCOL",
  REGULATION: "REGULATION"
} as const;

export type EntityType = typeof EntityTypes[keyof typeof EntityTypes];

// Graph Node Types
export const NodeTypes = {
  ENTITY: "ENTITY", // Based on extracted entities
  CONCEPT: "CONCEPT", // Abstract concepts
  DOCUMENT: "DOCUMENT", // Document nodes
  TOPIC: "TOPIC", // Topic clusters
  KEYWORD: "KEYWORD", // Important keywords
  TEMPORAL: "TEMPORAL", // Time-based nodes
  SPATIAL: "SPATIAL", // Location-based nodes
} as const;

export type NodeType = typeof NodeTypes[keyof typeof NodeTypes];

// Graph Relationship Types  
export const RelationshipTypes = {
  // Document relationships
  CONTAINS: "CONTAINS", // Document contains entity
  MENTIONS: "MENTIONS", // Entity mentioned in context
  
  // Entity relationships
  RELATED_TO: "RELATED_TO", // General semantic relationship
  PART_OF: "PART_OF", // Hierarchical relationship
  SIMILAR_TO: "SIMILAR_TO", // Semantic similarity
  OPPOSITE_TO: "OPPOSITE_TO", // Antonym/opposite
  
  // Temporal relationships
  OCCURS_BEFORE: "OCCURS_BEFORE",
  OCCURS_AFTER: "OCCURS_AFTER", 
  OCCURS_WITH: "OCCURS_WITH",
  
  // Spatial relationships
  LOCATED_IN: "LOCATED_IN",
  NEAR: "NEAR",
  CONTAINS_LOCATION: "CONTAINS_LOCATION",
  
  // Domain-specific relationships
  TREATS: "TREATS", // Drug treats condition
  CAUSES: "CAUSES", // A causes B
  INHIBITS: "INHIBITS", // A inhibits B
  INTERACTS_WITH: "INTERACTS_WITH", // Drug interactions
  
  // Organizational relationships
  WORKS_FOR: "WORKS_FOR",
  COLLABORATES_WITH: "COLLABORATES_WITH",
  COMPETES_WITH: "COMPETES_WITH",
} as const;

export type RelationshipType = typeof RelationshipTypes[keyof typeof RelationshipTypes];

// Graph Cluster Types
export const ClusterTypes = {
  TOPIC_CLUSTER: "TOPIC_CLUSTER", // Topically related nodes
  ENTITY_CLUSTER: "ENTITY_CLUSTER", // Similar entities
  DOCUMENT_CLUSTER: "DOCUMENT_CLUSTER", // Related documents
  TEMPORAL_CLUSTER: "TEMPORAL_CLUSTER", // Time-based groupings
  SEMANTIC_CLUSTER: "SEMANTIC_CLUSTER", // Semantically similar
} as const;

export type ClusterType = typeof ClusterTypes[keyof typeof ClusterTypes];

// Graph Query and Analysis Types
export interface GraphPathQuery {
  startNodeId: string;
  endNodeId?: string;
  relationshipTypes?: RelationshipType[];
  maxDepth?: number;
  minConfidence?: number;
}

export interface GraphNeighborQuery {
  nodeId: string;
  depth?: number;
  relationshipTypes?: RelationshipType[];
  nodeTypes?: NodeType[];
  minStrength?: number;
}

export interface GraphSearchQuery {
  query: string;
  nodeTypes?: NodeType[];
  limit?: number;
  minConfidence?: number;
}

// Graph Analysis Results
export interface GraphPath {
  nodes: GraphNode[];
  relationships: GraphRelationship[];
  totalStrength: number;
  avgConfidence: number;
}

export interface GraphNeighborhood {
  centerNode: GraphNode;
  neighbors: Array<{
    node: GraphNode;
    relationship: GraphRelationship;
    distance: number;
  }>;
}

export interface GraphMetrics {
  totalNodes: number;
  totalRelationships: number;
  avgDegree: number;
  density: number;
  clusters: number;
  topEntities: Array<{
    node: GraphNode;
    degree: number;
    centrality: number;
  }>;
}

// =====================================
// SocratIQ Build™ Module - Construction Project Intelligence
// =====================================

// Construction Projects - Main project entities
export const constructionProjects = pgTable("construction_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // COMMERCIAL, RESIDENTIAL, INFRASTRUCTURE, INDUSTRIAL
  status: text("status").notNull().default("planning"), // planning, active, on_hold, completed, cancelled
  phase: text("phase").notNull().default("design"), // design, pre_construction, construction, closeout
  client: text("client").notNull(),
  location: text("location").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  plannedBudget: real("planned_budget").notNull(),
  currentCost: real("current_cost").default(0),
  percentComplete: real("percent_complete").default(0),
  projectManager: varchar("project_manager").notNull(),
  riskLevel: text("risk_level").default("medium"), // low, medium, high, critical
  compliance: jsonb("compliance").default({}), // Regulatory compliance tracking
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Project Tasks - Tasks with dependencies and critical path analysis
export const projectTasks = pgTable("project_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => constructionProjects.id),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // DESIGN, PROCUREMENT, CONSTRUCTION, INSPECTION, TESTING
  status: text("status").notNull().default("not_started"), // not_started, in_progress, completed, delayed, blocked
  priority: text("priority").default("medium"), // low, medium, high, critical
  isCriticalPath: boolean("is_critical_path").default(false),
  plannedStartDate: timestamp("planned_start_date"),
  plannedEndDate: timestamp("planned_end_date"),
  actualStartDate: timestamp("actual_start_date"),
  actualEndDate: timestamp("actual_end_date"),
  estimatedHours: real("estimated_hours"),
  actualHours: real("actual_hours"),
  budgetAllocated: real("budget_allocated"),
  actualCost: real("actual_cost").default(0),
  assignedTeam: jsonb("assigned_team").default([]), // Array of team member IDs
  dependencies: jsonb("dependencies").default([]), // Array of task IDs this depends on
  blockers: jsonb("blockers").default([]), // Current blocking issues
  percentComplete: real("percent_complete").default(0),
  qualityScore: real("quality_score"), // Quality assessment 0-1
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Project Resources - Workforce, equipment, materials
export const projectResources = pgTable("project_resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => constructionProjects.id),
  name: text("name").notNull(),
  type: text("type").notNull(), // WORKFORCE, EQUIPMENT, MATERIAL, SUBCONTRACTOR
  category: text("category"), // Specific category within type
  quantity: real("quantity"),
  unit: text("unit"), // hours, days, pieces, tons, etc.
  costPerUnit: real("cost_per_unit"),
  totalCost: real("total_cost"),
  supplier: text("supplier"),
  availability: text("availability").default("available"), // available, allocated, unavailable
  scheduledDate: timestamp("scheduled_date"),
  deliveryDate: timestamp("delivery_date"),
  utilization: real("utilization").default(0), // 0-1 utilization rate
  location: text("location"),
  specifications: jsonb("specifications").default({}),
  status: text("status").default("planned"), // planned, ordered, delivered, in_use, completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Budget tracking and cost management
export const projectBudgets = pgTable("project_budgets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => constructionProjects.id),
  category: text("category").notNull(), // LABOR, MATERIALS, EQUIPMENT, OVERHEAD, CONTINGENCY
  subcategory: text("subcategory"),
  budgetedAmount: real("budgeted_amount").notNull(),
  actualAmount: real("actual_amount").default(0),
  variance: real("variance").default(0), // Actual - Budgeted
  variancePercent: real("variance_percent").default(0),
  forecastAmount: real("forecast_amount"), // Projected final cost
  isApproved: boolean("is_approved").default(false),
  approvedBy: varchar("approved_by"),
  approvalDate: timestamp("approval_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Change Orders - Scope changes and impact analysis
export const changeOrders = pgTable("change_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => constructionProjects.id),
  orderNumber: text("order_number").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  reason: text("reason").notNull(), // CLIENT_REQUEST, DESIGN_CHANGE, SITE_CONDITIONS, REGULATORY
  status: text("status").default("pending"), // pending, approved, rejected, in_progress, completed
  requestedBy: varchar("requested_by").notNull(),
  requestDate: timestamp("request_date").defaultNow(),
  reviewedBy: varchar("reviewed_by"),
  reviewDate: timestamp("review_date"),
  approvedBy: varchar("approved_by"),
  approvalDate: timestamp("approval_date"),
  costImpact: real("cost_impact"), // Additional cost (positive) or savings (negative)
  scheduleImpact: integer("schedule_impact_days"), // Days added or reduced
  affectedTasks: jsonb("affected_tasks").default([]), // Array of task IDs impacted
  affectedResources: jsonb("affected_resources").default([]), // Array of resource IDs impacted
  riskAssessment: jsonb("risk_assessment").default({}),
  mitigationPlan: text("mitigation_plan"),
  attachments: jsonb("attachments").default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Risk Assessments - Risk monitoring and mitigation
export const riskAssessments = pgTable("risk_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => constructionProjects.id),
  riskType: text("risk_type").notNull(), // SCHEDULE, BUDGET, QUALITY, SAFETY, WEATHER, SUPPLY_CHAIN
  category: text("category"), // Subcategory within risk type
  title: text("title").notNull(),
  description: text("description").notNull(),
  probability: real("probability").notNull(), // 0-1 probability of occurrence
  impact: real("impact").notNull(), // 0-1 impact severity
  riskScore: real("risk_score").notNull(), // probability * impact
  status: text("status").default("active"), // active, mitigated, resolved, closed
  identifiedBy: varchar("identified_by").notNull(),
  identifiedDate: timestamp("identified_date").defaultNow(),
  assignedTo: varchar("assigned_to"),
  dueDate: timestamp("due_date"),
  mitigationStrategy: text("mitigation_strategy"),
  contingencyPlan: text("contingency_plan"),
  statusNotes: text("status_notes"),
  lastReviewDate: timestamp("last_review_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =====================================
// SocratIQ Profile™ Module - Comprehensive Profiling System
// =====================================

export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(), // External user ID
  displayName: text("display_name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("analyst"), // admin, analyst, viewer, guest
  preferences: jsonb("preferences").default({}), // UI preferences, notifications, etc.
  permissions: jsonb("permissions").default([]), // Fine-grained permissions
  activityStats: jsonb("activity_stats").default({}), // Usage statistics
  lastLogin: timestamp("last_login"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const documentProfiles = pgTable("document_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentId: varchar("document_id").notNull().references(() => documents.id),
  qualityScore: real("quality_score"), // 0-1 quality assessment
  complexityScore: real("complexity_score"), // Document complexity metric
  confidenceScore: real("confidence_score"), // Processing confidence
  processingHistory: jsonb("processing_history").default([]), // Processing events
  annotations: jsonb("annotations").default([]), // User annotations
  classifications: jsonb("classifications").default([]), // Document classifications
  relatedDocuments: jsonb("related_documents").default([]), // Similar/related docs
  usageStats: jsonb("usage_stats").default({}), // View count, downloads, etc.
  complianceFlags: jsonb("compliance_flags").default([]), // Regulatory compliance
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const entityProfiles = pgTable("entity_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: varchar("entity_id").notNull().references(() => entities.id),
  canonicalName: text("canonical_name"), // Standardized entity name
  aliases: jsonb("aliases").default([]), // Alternative names/spellings
  description: text("description"),
  category: text("category"), // Refined categorization
  attributes: jsonb("attributes").default({}), // Entity-specific attributes
  relationshipSummary: jsonb("relationship_summary").default({}), // Relationship counts by type
  documentFrequency: integer("document_frequency").default(0), // Appears in N documents
  importance: real("importance").default(0), // Importance score (0-1)
  verificationStatus: text("verification_status").default("unverified"), // verified, unverified, disputed
  sources: jsonb("sources").default([]), // Source references
  notes: text("notes"), // User notes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const systemProfiles = pgTable("system_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // ENVIRONMENT, PROCESSING, ANALYSIS, INTEGRATION
  configuration: jsonb("configuration").notNull(), // System configuration
  environment: text("environment").notNull(), // development, staging, production
  version: text("version").notNull(),
  isActive: boolean("is_active").default(true),
  performanceMetrics: jsonb("performance_metrics").default({}), // Performance data
  healthChecks: jsonb("health_checks").default([]), // System health status
  dependencies: jsonb("dependencies").default([]), // External dependencies
  maintenanceWindow: jsonb("maintenance_window"), // Scheduled maintenance
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas for Build module - Construction Project Intelligence
export const insertConstructionProjectSchema = createInsertSchema(constructionProjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectTaskSchema = createInsertSchema(projectTasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectResourceSchema = createInsertSchema(projectResources).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectBudgetSchema = createInsertSchema(projectBudgets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChangeOrderSchema = createInsertSchema(changeOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRiskAssessmentSchema = createInsertSchema(riskAssessments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Insert schemas for Profile module
export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDocumentProfileSchema = createInsertSchema(documentProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEntityProfileSchema = createInsertSchema(entityProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSystemProfileSchema = createInsertSchema(systemProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports for Build module - Construction Project Intelligence
export type ConstructionProject = typeof constructionProjects.$inferSelect;
export type InsertConstructionProject = z.infer<typeof insertConstructionProjectSchema>;
export type ProjectTask = typeof projectTasks.$inferSelect;
export type InsertProjectTask = z.infer<typeof insertProjectTaskSchema>;
export type ProjectResource = typeof projectResources.$inferSelect;
export type InsertProjectResource = z.infer<typeof insertProjectResourceSchema>;
export type ProjectBudget = typeof projectBudgets.$inferSelect;
export type InsertProjectBudget = z.infer<typeof insertProjectBudgetSchema>;
export type ChangeOrder = typeof changeOrders.$inferSelect;
export type InsertChangeOrder = z.infer<typeof insertChangeOrderSchema>;
export type RiskAssessment = typeof riskAssessments.$inferSelect;
export type InsertRiskAssessment = z.infer<typeof insertRiskAssessmentSchema>;

// Type exports for Profile module
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type DocumentProfile = typeof documentProfiles.$inferSelect;
export type InsertDocumentProfile = z.infer<typeof insertDocumentProfileSchema>;
export type EntityProfile = typeof entityProfiles.$inferSelect;
export type InsertEntityProfile = z.infer<typeof insertEntityProfileSchema>;
export type SystemProfile = typeof systemProfiles.$inferSelect;
export type InsertSystemProfile = z.infer<typeof insertSystemProfileSchema>;

// Build module constants
export const PipelineTypes = {
  DOCUMENT_PROCESSING: "DOCUMENT_PROCESSING",
  GRAPH_CONSTRUCTION: "GRAPH_CONSTRUCTION", 
  ANALYSIS: "ANALYSIS",
  CUSTOM: "CUSTOM"
} as const;

export const BuilderTypes = {
  GRAPH_BUILDER: "GRAPH_BUILDER",
  QUERY_BUILDER: "QUERY_BUILDER",
  REPORT_BUILDER: "REPORT_BUILDER",
  WORKFLOW_BUILDER: "WORKFLOW_BUILDER"
} as const;

export const TemplateCategories = {
  PIPELINE: "PIPELINE",
  GRAPH: "GRAPH",
  ANALYSIS: "ANALYSIS",
  REPORT: "REPORT"
} as const;

// Profile module constants
export const ProfileUserRoles = {
  ADMIN: "admin",
  ANALYST: "analyst",
  VIEWER: "viewer", 
  GUEST: "guest"
} as const;

export const ProfileTypes = {
  ENVIRONMENT: "ENVIRONMENT",
  PROCESSING: "PROCESSING",
  ANALYSIS: "ANALYSIS",
  INTEGRATION: "INTEGRATION"
} as const;

export const VerificationStatus = {
  VERIFIED: "verified",
  UNVERIFIED: "unverified",
  DISPUTED: "disputed"
} as const;

export type ProfileUserRole = typeof ProfileUserRoles[keyof typeof ProfileUserRoles];
export type VerificationStatusType = typeof VerificationStatus[keyof typeof VerificationStatus];

// =====================================
// SocratIQ Corpus Construction & Federation
// =====================================

// Domain-specific corpora for each module
export const corpora = pgTable("corpora", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  module: text("module").notNull(), // TRANSFORM, MESH, TRACE, SOPHIE, BUILD, PROFILE
  domain: text("domain").notNull(), // CONSTRUCTION, MEDICAL, LEGAL, FINANCIAL, etc.
  type: text("type").notNull(), // DOCUMENTS, PROTOCOLS, REPORTS, TRANSCRIPTS, PROJECTS
  version: text("version").notNull().default("1.0.0"),
  ontologyVersion: text("ontology_version"), // Aligned ontology version
  semanticTags: jsonb("semantic_tags").default([]), // Domain-specific tags
  indexConfiguration: jsonb("index_configuration").default({}), // Search indexing config
  federationRules: jsonb("federation_rules").default({}), // Cross-corpus linking rules
  enrichmentMetadata: jsonb("enrichment_metadata").default({}), // Enrichment statistics
  status: text("status").default("building"), // building, active, archived, deprecated
  documentCount: integer("document_count").default(0),
  totalSize: integer("total_size").default(0), // Size in bytes
  lastEnrichment: timestamp("last_enrichment"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Linking documents to specific corpora with enrichment metadata
export const corpusDocuments = pgTable("corpus_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  corpusId: varchar("corpus_id").notNull().references(() => corpora.id),
  documentId: varchar("document_id").notNull().references(() => documents.id),
  role: text("role").notNull(), // PRIMARY, REFERENCE, SUPPORTING, CONTEXTUAL
  enrichmentLevel: text("enrichment_level").default("basic"), // basic, enhanced, expert
  semanticVector: jsonb("semantic_vector"), // Vector embedding for semantic search
  extractedConcepts: jsonb("extracted_concepts").default([]), // Domain-specific concepts
  qualityScore: real("quality_score"), // Document quality within corpus context
  relevanceScore: real("relevance_score"), // Relevance to corpus domain
  processingMetadata: jsonb("processing_metadata").default({}),
  addedAt: timestamp("added_at").defaultNow(),
  lastProcessed: timestamp("last_processed"),
});

// Cross-module corpus federation for semantic linking
export const corpusFederation = pgTable("corpus_federation", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sourceCorpusId: varchar("source_corpus_id").notNull().references(() => corpora.id),
  targetCorpusId: varchar("target_corpus_id").notNull().references(() => corpora.id),
  relationshipType: text("relationship_type").notNull(), // SEMANTIC_LINK, DOMAIN_OVERLAP, TEMPORAL_SEQUENCE, CAUSAL_RELATION
  strength: real("strength").notNull(), // 0-1 relationship strength
  bidirectional: boolean("bidirectional").default(true),
  semanticMapping: jsonb("semantic_mapping").default({}), // Concept mappings between corpora
  contextRules: jsonb("context_rules").default({}), // Rules for context propagation
  lastValidated: timestamp("last_validated"),
  validationScore: real("validation_score"), // Automated validation score
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Context Memory Architecture - Short-term reasoning memory
export const contextMemory = pgTable("context_memory", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(), // Reasoning session identifier
  memoryType: text("memory_type").notNull(), // SHORT_TERM, WORKING, EPISODIC
  contextData: jsonb("context_data").notNull(), // Contextual information
  semanticLinks: jsonb("semantic_links").default([]), // Links to relevant corpus elements
  reasoning_chain: jsonb("reasoning_chain").default([]), // SophieLogic™ reasoning steps
  relevanceScore: real("relevance_score").default(1.0),
  accessCount: integer("access_count").default(0),
  lastAccessed: timestamp("last_accessed").defaultNow(),
  expiresAt: timestamp("expires_at"), // For short-term memory cleanup
  createdAt: timestamp("created_at").defaultNow(),
});

// Long-term persistent semantic links across corpora
export const semanticLinks = pgTable("semantic_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sourceType: text("source_type").notNull(), // DOCUMENT, ENTITY, CONCEPT, PROJECT, USER
  sourceId: varchar("source_id").notNull(),
  targetType: text("target_type").notNull(),
  targetId: varchar("target_id").notNull(),
  linkType: text("link_type").notNull(), // SEMANTIC_SIMILARITY, CAUSAL, TEMPORAL, SPATIAL, ONTOLOGICAL
  corpusId: varchar("corpus_id").references(() => corpora.id), // Source corpus
  strength: real("strength").notNull(), // 0-1 link strength
  confidence: real("confidence").notNull(), // 0-1 confidence in link
  evidence: jsonb("evidence").default([]), // Supporting evidence for link
  metadata: jsonb("metadata").default({}), // Additional link metadata
  validatedBy: varchar("validated_by"), // Human validation
  validatedAt: timestamp("validated_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Immutable TraceUnits for context preservation
export const traceUnits = pgTable("trace_units", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  traceId: varchar("trace_id").notNull(), // Grouping identifier
  unitType: text("unit_type").notNull(), // REASONING_STEP, DECISION_POINT, CONTEXT_SNAPSHOT, FEDERATION_EVENT
  contextSnapshot: jsonb("context_snapshot").notNull(), // Immutable context state
  inputData: jsonb("input_data").default({}),
  outputData: jsonb("output_data").default({}),
  reasoning: jsonb("reasoning").default({}), // SophieLogic™ reasoning process
  corporaInvolved: jsonb("corpora_involved").default([]), // Corpora used in this trace
  federationLinks: jsonb("federation_links").default([]), // Cross-corpus links activated
  qualityMetrics: jsonb("quality_metrics").default({}),
  hash: varchar("hash").notNull(), // Cryptographic hash for immutability
  previousTraceUnit: varchar("previous_trace_unit"), // Chain to previous unit
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Ontology alignment and versioning for corpus federation
export const ontologyAlignments = pgTable("ontology_alignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sourceOntology: text("source_ontology").notNull(),
  targetOntology: text("target_ontology").notNull(),
  version: text("version").notNull(),
  mappings: jsonb("mappings").notNull(), // Concept mappings between ontologies
  confidence: real("confidence").notNull(), // 0-1 alignment confidence
  validationStatus: text("validation_status").default("pending"), // pending, validated, rejected
  usageCount: integer("usage_count").default(0),
  lastUsed: timestamp("last_used"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// FedScout™ - Federal Technology Licensing Intelligence
export const federalLaboratories = pgTable("federal_laboratories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  acronym: text("acronym").notNull(),
  agency: text("agency").notNull(), // NIH, FDA, DOE, DOD, NASA, etc.
  technologyOffice: text("technology_office").notNull(),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  website: text("website"),
  focusAreas: jsonb("focus_areas").default([]), // Research areas
  totalPatents: integer("total_patents").default(0),
  availablePatents: integer("available_patents").default(0),
  activePartnerships: integer("active_partnerships").default(0),
  connectionStatus: text("connection_status").default("disconnected"), // connected, limited, disconnected
  lastSyncAt: timestamp("last_sync_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const federalPatents = pgTable("federal_patents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  labId: varchar("lab_id").references(() => federalLaboratories.id).notNull(),
  title: text("title").notNull(),
  patentNumber: text("patent_number").unique(),
  applicationNumber: text("application_number"),
  inventors: jsonb("inventors").default([]),
  filedDate: timestamp("filed_date"),
  issuedDate: timestamp("issued_date"),
  expirationDate: timestamp("expiration_date"),
  abstract: text("abstract"),
  description: text("description"),
  claims: jsonb("claims").default([]),
  therapeuticAreas: jsonb("therapeutic_areas").default([]), // Oncology, Neurology, etc.
  applicationDomains: jsonb("application_domains").default([]), // Drug delivery, diagnostics, etc.
  keywords: jsonb("keywords").default([]),
  status: text("status").default("available"), // available, licensed, restricted, expired
  licensingStatus: text("licensing_status"), // exclusive_available, non_exclusive_available, government_use_only
  estimatedValue: text("estimated_value"), // Commercial value estimate
  relevanceScore: real("relevance_score").default(0), // AI-calculated relevance to user's interests
  crossDomainApplications: jsonb("cross_domain_applications").default([]), // Non-obvious applications
  patentFamily: jsonb("patent_family").default([]), // Related patents
  citationCount: integer("citation_count").default(0),
  licenseInquiries: integer("license_inquiries").default(0),
  commercialInterest: real("commercial_interest").default(0), // Market interest level
  contactInfo: jsonb("contact_info").default({}), // Lab contact details
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const technologyOpportunities = pgTable("technology_opportunities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patentId: varchar("patent_id").references(() => federalPatents.id).notNull(),
  opportunityType: text("opportunity_type").notNull(), // licensing, partnership, collaboration
  title: text("title").notNull(),
  description: text("description").notNull(),
  lifeSciecesApplication: text("life_sciences_application").notNull(), // Specific therapeutic application
  marketOpportunity: text("market_opportunity"), // Size and potential
  competitiveAdvantage: text("competitive_advantage"),
  developmentTimeline: text("development_timeline"), // Estimated time to market
  capitalRequirements: text("capital_requirements"), // Investment needed
  riskFactors: jsonb("risk_factors").default([]),
  mitigationStrategies: jsonb("mitigation_strategies").default([]),
  strategicPartners: jsonb("strategic_partners").default([]), // Potential partners
  priorityScore: real("priority_score").default(0), // Overall opportunity priority
  stage: text("stage").default("discovery"), // discovery, evaluation, negotiation, closed
  assignedTo: varchar("assigned_to"), // User responsible
  nextActions: jsonb("next_actions").default([]),
  progressNotes: jsonb("progress_notes").default([]),
  estimatedCloseDate: timestamp("estimated_close_date"),
  actualCloseDate: timestamp("actual_close_date"),
  outcomeStatus: text("outcome_status"), // successful, unsuccessful, ongoing
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const fedscoutSearches = pgTable("fedscout_searches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  searchQuery: text("search_query").notNull(),
  filters: jsonb("filters").default({}), // Search filters applied
  resultCount: integer("result_count").default(0),
  relevantResults: integer("relevant_results").default(0), // High relevance matches
  executionTime: integer("execution_time_ms"), // Search performance
  savedSearch: boolean("saved_search").default(false),
  searchName: text("search_name"), // User-defined name for saved searches
  alertsEnabled: boolean("alerts_enabled").default(false), // Email alerts for new matches
  lastExecuted: timestamp("last_executed").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const patentAnalytics = pgTable("patent_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patentId: varchar("patent_id").references(() => federalPatents.id).notNull(),
  viewCount: integer("view_count").default(0),
  saveCount: integer("save_count").default(0),
  inquiryCount: integer("inquiry_count").default(0),
  downloadCount: integer("download_count").default(0),
  marketInterestScore: real("market_interest_score").default(0), // Calculated interest
  trendingScore: real("trending_score").default(0), // Recent activity
  lastViewed: timestamp("last_viewed"),
  lastInquiry: timestamp("last_inquiry"),
  peakInterestDate: timestamp("peak_interest_date"),
  competitorViews: integer("competitor_views").default(0), // Anonymized competitor interest
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas for Corpus Construction & Federation
export const insertCorpusSchema = createInsertSchema(corpora).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCorpusDocumentSchema = createInsertSchema(corpusDocuments).omit({
  id: true,
  addedAt: true,
});

export const insertCorpusFederationSchema = createInsertSchema(corpusFederation).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContextMemorySchema = createInsertSchema(contextMemory).omit({
  id: true,
  createdAt: true,
});

export const insertSemanticLinkSchema = createInsertSchema(semanticLinks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTraceUnitSchema = createInsertSchema(traceUnits).omit({
  id: true,
  createdAt: true,
});

export const insertOntologyAlignmentSchema = createInsertSchema(ontologyAlignments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// FedScout insert schemas
export const insertFederalLaboratorySchema = createInsertSchema(federalLaboratories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFederalPatentSchema = createInsertSchema(federalPatents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTechnologyOpportunitySchema = createInsertSchema(technologyOpportunities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFedscoutSearchSchema = createInsertSchema(fedscoutSearches).omit({
  id: true,
  createdAt: true,
});

export const insertPatentAnalyticsSchema = createInsertSchema(patentAnalytics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});


// Type exports for Corpus Construction & Federation
export type Corpus = typeof corpora.$inferSelect;
export type InsertCorpus = z.infer<typeof insertCorpusSchema>;
export type CorpusDocument = typeof corpusDocuments.$inferSelect;
export type InsertCorpusDocument = z.infer<typeof insertCorpusDocumentSchema>;
export type CorpusFederation = typeof corpusFederation.$inferSelect;
export type InsertCorpusFederation = z.infer<typeof insertCorpusFederationSchema>;
export type ContextMemory = typeof contextMemory.$inferSelect;
export type InsertContextMemory = z.infer<typeof insertContextMemorySchema>;
export type SemanticLink = typeof semanticLinks.$inferSelect;
export type InsertSemanticLink = z.infer<typeof insertSemanticLinkSchema>;
export type TraceUnit = typeof traceUnits.$inferSelect;
export type InsertTraceUnit = z.infer<typeof insertTraceUnitSchema>;
export type OntologyAlignment = typeof ontologyAlignments.$inferSelect;
export type InsertOntologyAlignment = z.infer<typeof insertOntologyAlignmentSchema>;



// Corpus Construction & Federation constants
export const CorpusModules = {
  TRANSFORM: "TRANSFORM",
  MESH: "MESH",
  TRACE: "TRACE", 
  SOPHIE: "SOPHIE",
  BUILD: "BUILD",
  PROFILE: "PROFILE"
} as const;

export const CorpusDomains = {
  CONSTRUCTION: "CONSTRUCTION",
  MEDICAL: "MEDICAL",
  LEGAL: "LEGAL",
  FINANCIAL: "FINANCIAL",
  ACADEMIC: "ACADEMIC",
  TECHNICAL: "TECHNICAL"
} as const;

export const CorpusTypes = {
  DOCUMENTS: "DOCUMENTS",
  PROTOCOLS: "PROTOCOLS",
  REPORTS: "REPORTS",
  TRANSCRIPTS: "TRANSCRIPTS",
  PROJECTS: "PROJECTS",
  PROFILES: "PROFILES"
} as const;

export const FederationRelationshipTypes = {
  SEMANTIC_LINK: "SEMANTIC_LINK",
  DOMAIN_OVERLAP: "DOMAIN_OVERLAP",
  TEMPORAL_SEQUENCE: "TEMPORAL_SEQUENCE",
  CAUSAL_RELATION: "CAUSAL_RELATION"
} as const;

export const MemoryTypes = {
  SHORT_TERM: "SHORT_TERM",
  WORKING: "WORKING",
  EPISODIC: "EPISODIC"
} as const;

export const TraceUnitTypes = {
  REASONING_STEP: "REASONING_STEP",
  DECISION_POINT: "DECISION_POINT",
  CONTEXT_SNAPSHOT: "CONTEXT_SNAPSHOT",
  FEDERATION_EVENT: "FEDERATION_EVENT"
} as const;

export const LinkTypes = {
  SEMANTIC_SIMILARITY: "SEMANTIC_SIMILARITY",
  CAUSAL: "CAUSAL",
  TEMPORAL: "TEMPORAL",
  SPATIAL: "SPATIAL",
  ONTOLOGICAL: "ONTOLOGICAL"
} as const;

export const AlignmentTypes = {
  EXACT_MATCH: "EXACT_MATCH",
  SEMANTIC_EQUIVALENT: "SEMANTIC_EQUIVALENT",
  PARTIAL_OVERLAP: "PARTIAL_OVERLAP",
  RELATED_CONCEPT: "RELATED_CONCEPT",
  INVERSE_RELATION: "INVERSE_RELATION"
} as const;

// AI/ML Pipeline Constants
export const TransformerModels = {
  BIOBERT: "BioBERT",
  PUBMEDBERT: "PubMedBERT",
  CLINICALBERT: "Clinical-BERT",
  LEGALBERT: "Legal-BERT",
  CONSTRUCTIONBERT: "Construction-BERT",
  GENERALBERT: "BERT-Base"
} as const;

export const PipelineModelTypes = {
  DOMAIN_SPECIFIC: "DOMAIN_SPECIFIC",
  GENERAL_PURPOSE: "GENERAL_PURPOSE",
  FINE_TUNED: "FINE_TUNED"
} as const;

export const DomainTypes = {
  BIOMEDICAL: "BIOMEDICAL",
  CLINICAL: "CLINICAL",
  LEGAL: "LEGAL",
  CONSTRUCTION: "CONSTRUCTION",
  GENERAL: "GENERAL"
} as const;

export const PipelineStages = {
  INGESTION: "INGESTION",
  PREPROCESSING: "PREPROCESSING",
  SEMANTIC_ENHANCEMENT: "SEMANTIC_ENHANCEMENT"
} as const;

export const ProcessorTypes = {
  TRANSFORMER: "TRANSFORMER",
  RULE_BASED: "RULE_BASED",
  HYBRID: "HYBRID"
} as const;

export const TaskTypes = {
  NER: "NER", // Named Entity Recognition
  RELATION_EXTRACTION: "RELATION_EXTRACTION",
  CLASSIFICATION: "CLASSIFICATION",
  QA: "QA", // Question Answering
  SENTIMENT: "SENTIMENT"
} as const;

export const FeedbackTypes = {
  CORRECTION: "CORRECTION",
  VALIDATION: "VALIDATION",
  ENHANCEMENT: "ENHANCEMENT"
} as const;

export const AggregationStrategies = {
  FEDAVG: "FedAvg",
  FEDPROX: "FedProx",
  SCAFFOLD: "SCAFFOLD"
} as const;

export const QualityAssessors = {
  MODEL: "MODEL",
  HUMAN: "HUMAN",
  HYBRID: "HYBRID"
} as const;

export type CorpusModule = typeof CorpusModules[keyof typeof CorpusModules];
export type CorpusDomain = typeof CorpusDomains[keyof typeof CorpusDomains];
export type CorpusType = typeof CorpusTypes[keyof typeof CorpusTypes];
export type FederationRelationshipType = typeof FederationRelationshipTypes[keyof typeof FederationRelationshipTypes];
export type MemoryType = typeof MemoryTypes[keyof typeof MemoryTypes];
export type TraceUnitType = typeof TraceUnitTypes[keyof typeof TraceUnitTypes];
export type LinkType = typeof LinkTypes[keyof typeof LinkTypes];
export type AlignmentType = typeof AlignmentTypes[keyof typeof AlignmentTypes];
export type TransformerModel = typeof TransformerModels[keyof typeof TransformerModels];
export type PipelineModelType = typeof PipelineModelTypes[keyof typeof PipelineModelTypes];
export type DomainType = typeof DomainTypes[keyof typeof DomainTypes];
export type PipelineStage = typeof PipelineStages[keyof typeof PipelineStages];
export type ProcessorType = typeof ProcessorTypes[keyof typeof ProcessorTypes];
export type TaskType = typeof TaskTypes[keyof typeof TaskTypes];
export type FeedbackType = typeof FeedbackTypes[keyof typeof FeedbackTypes];
export type AggregationStrategy = typeof AggregationStrategies[keyof typeof AggregationStrategies];
export type QualityAssessor = typeof QualityAssessors[keyof typeof QualityAssessors];

// =====================================
// Advanced AI/ML Processing Pipeline
// =====================================

// Transformer Ensemble Management
export const transformerEnsemble = pgTable("transformer_ensemble", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  modelName: text("model_name").notNull(), // BioBERT, PubMedBERT, Clinical-BERT, Legal-BERT, Construction-BERT
  modelType: text("model_type").notNull(), // DOMAIN_SPECIFIC, GENERAL_PURPOSE, FINE_TUNED
  domain: text("domain").notNull(), // BIOMEDICAL, CLINICAL, LEGAL, CONSTRUCTION, GENERAL
  version: text("version").notNull(),
  modelPath: text("model_path").notNull(), // Storage path for model files
  configuration: jsonb("configuration").notNull(), // Model-specific config
  performance: jsonb("performance").default({}), // Accuracy, F1-score, etc.
  isActive: boolean("is_active").default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// LoRA Adapters for Fine-tuning
export const loraAdapters = pgTable("lora_adapters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  baseModelId: varchar("base_model_id").notNull().references(() => transformerEnsemble.id),
  adapterName: text("adapter_name").notNull(),
  taskType: text("task_type").notNull(), // NER, RELATION_EXTRACTION, CLASSIFICATION, QA
  domain: text("domain").notNull(),
  rankSize: integer("rank_size").default(16), // LoRA rank parameter
  alphaValue: real("alpha_value").default(32), // LoRA alpha parameter
  adapterPath: text("adapter_path").notNull(),
  trainingData: jsonb("training_data").default({}), // Dataset metadata
  performance: jsonb("performance").default({}),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Processing Pipeline Stages
export const processingPipeline = pgTable("processing_pipeline", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentId: varchar("document_id").notNull().references(() => documents.id),
  stage: text("stage").notNull(), // INGESTION, PREPROCESSING, SEMANTIC_ENHANCEMENT
  stageOrder: integer("stage_order").notNull(),
  processorType: text("processor_type").notNull(), // TRANSFORMER, RULE_BASED, HYBRID
  modelId: varchar("model_id").references(() => transformerEnsemble.id),
  adapterIds: jsonb("adapter_ids").default([]), // Array of LoRA adapter IDs
  inputData: jsonb("input_data").notNull(),
  outputData: jsonb("output_data").default({}),
  processingTime: integer("processing_time_ms"),
  confidenceScore: real("confidence_score"),
  errorLog: text("error_log"),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Model Version Control and A/B Testing
export const modelVersions = pgTable("model_versions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  modelId: varchar("model_id").notNull().references(() => transformerEnsemble.id),
  versionNumber: text("version_number").notNull(),
  parentVersionId: varchar("parent_version_id"),
  changeLog: text("change_log"),
  trainingMetrics: jsonb("training_metrics").default({}),
  validationMetrics: jsonb("validation_metrics").default({}),
  abTestResults: jsonb("ab_test_results").default({}),
  isProduction: boolean("is_production").default(false),
  deploymentDate: timestamp("deployment_date"),
  rollbackDate: timestamp("rollback_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Human-in-the-Loop Feedback
export const humanFeedback = pgTable("human_feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pipelineId: varchar("pipeline_id").notNull().references(() => processingPipeline.id),
  expertId: varchar("expert_id").notNull(), // User who provided feedback
  feedbackType: text("feedback_type").notNull(), // CORRECTION, VALIDATION, ENHANCEMENT
  originalPrediction: jsonb("original_prediction").notNull(),
  correctedPrediction: jsonb("corrected_prediction"),
  confidence: real("confidence"), // Expert confidence in their feedback
  explanation: text("explanation"),
  isIncorporated: boolean("is_incorporated").default(false),
  incorporationDate: timestamp("incorporation_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Federated Learning Coordination
export const federatedLearning = pgTable("federated_learning", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  modelId: varchar("model_id").notNull().references(() => transformerEnsemble.id),
  roundNumber: integer("round_number").notNull(),
  participantNodes: jsonb("participant_nodes").notNull(), // Array of participating nodes
  globalModelWeights: jsonb("global_model_weights"), // Encrypted model weights
  aggregationStrategy: text("aggregation_strategy").default("FedAvg"), // FedAvg, FedProx, etc.
  privacyBudget: real("privacy_budget"), // Differential privacy budget
  convergenceMetrics: jsonb("convergence_metrics").default({}),
  status: text("status").notNull().default("initiated"), // initiated, aggregating, completed, failed
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Data Quality Assessment
export const dataQuality = pgTable("data_quality", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentId: varchar("document_id").notNull().references(() => documents.id),
  completenessScore: real("completeness_score"), // 0-1 completeness rating
  accuracyScore: real("accuracy_score"), // Estimated accuracy
  consistencyScore: real("consistency_score"), // Internal consistency
  duplicateScore: real("duplicate_score"), // Similarity to existing docs
  corruptionFlags: jsonb("corruption_flags").default([]), // Detected corruption issues
  qualityIssues: jsonb("quality_issues").default([]), // Specific quality problems
  enhancementSuggestions: jsonb("enhancement_suggestions").default([]),
  assessedBy: text("assessed_by").notNull(), // MODEL, HUMAN, HYBRID
  assessedAt: timestamp("assessed_at").defaultNow(),
});

// Insert schemas for AI/ML Pipeline
export const insertTransformerEnsembleSchema = createInsertSchema(transformerEnsemble).omit({
  id: true,
  lastUpdated: true,
  createdAt: true,
});

export const insertLoraAdapterSchema = createInsertSchema(loraAdapters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProcessingPipelineSchema = createInsertSchema(processingPipeline).omit({
  id: true,
  createdAt: true,
});

export const insertModelVersionSchema = createInsertSchema(modelVersions).omit({
  id: true,
  createdAt: true,
});

export const insertHumanFeedbackSchema = createInsertSchema(humanFeedback).omit({
  id: true,
  createdAt: true,
});

export const insertFederatedLearningSchema = createInsertSchema(federatedLearning).omit({
  id: true,
  startedAt: true,
});

export const insertDataQualitySchema = createInsertSchema(dataQuality).omit({
  id: true,
  assessedAt: true,
});

// =====================================
// Graph Neural Network Pipeline
// =====================================

// GNN Node Embeddings
export const gnnNodeEmbeddings = pgTable("gnn_node_embeddings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nodeId: varchar("node_id").notNull().references(() => graphNodes.id),
  embeddingVector: jsonb("embedding_vector").notNull(), // Dense vector representation
  embeddingDimension: integer("embedding_dimension").notNull(),
  generationMethod: text("generation_method").notNull(), // GCN, GAT, GraphSAGE, etc.
  temporalVersion: integer("temporal_version").default(1), // For time-aware embeddings
  domainContext: text("domain_context").notNull(), // BIOMEDICAL, LEGAL, CONSTRUCTION, etc.
  localFeatures: jsonb("local_features").default({}), // Local neighborhood features
  globalFeatures: jsonb("global_features").default({}), // Global graph structure features
  attentionWeights: jsonb("attention_weights").default({}), // Attention mechanism weights
  confidenceScore: real("confidence_score").default(1.0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// GNN Model Configurations
export const gnnModels = pgTable("gnn_models", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  modelName: text("model_name").notNull(),
  architecture: text("architecture").notNull(), // GCN, GAT, GraphSAGE, GIN, etc.
  layerCount: integer("layer_count").notNull(),
  hiddenDimensions: jsonb("hidden_dimensions").notNull(), // Array of layer dimensions
  attentionHeads: integer("attention_heads"), // For GAT models
  dropoutRate: real("dropout_rate").default(0.1),
  learningRate: real("learning_rate").default(0.001),
  domainSpecialization: text("domain_specialization"), // Specialized for specific domains
  trainingConfig: jsonb("training_config").default({}),
  performance: jsonb("performance").default({}), // Model performance metrics
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Link Prediction Results
export const linkPredictions = pgTable("link_predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sourceNodeId: varchar("source_node_id").notNull().references(() => graphNodes.id),
  targetNodeId: varchar("target_node_id").notNull().references(() => graphNodes.id),
  predictedRelationType: text("predicted_relation_type").notNull(),
  predictionScore: real("prediction_score").notNull(), // 0-1 probability
  confidenceInterval: jsonb("confidence_interval"), // Statistical confidence bounds
  gnnModelId: varchar("gnn_model_id").notNull().references(() => gnnModels.id),
  evidenceNodes: jsonb("evidence_nodes").default([]), // Supporting evidence path
  validationStatus: text("validation_status").default("pending"), // pending, validated, rejected
  humanVerified: boolean("human_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Node Classification Results
export const nodeClassifications = pgTable("node_classifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nodeId: varchar("node_id").notNull().references(() => graphNodes.id),
  predictedType: text("predicted_type").notNull(),
  predictedAttributes: jsonb("predicted_attributes").default({}),
  classificationScore: real("classification_score").notNull(),
  alternativePredictions: jsonb("alternative_predictions").default([]), // Top-k predictions
  gnnModelId: varchar("gnn_model_id").notNull().references(() => gnnModels.id),
  featureImportance: jsonb("feature_importance").default({}), // Feature attribution
  validationStatus: text("validation_status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Graph Clustering Results
export const graphClustering = pgTable("graph_clustering", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clusterName: text("cluster_name").notNull(),
  algorithm: text("algorithm").notNull(), // LOUVAIN, LEIDEN, SPECTRAL, etc.
  nodeIds: jsonb("node_ids").notNull(), // Array of nodes in cluster
  clusterSize: integer("cluster_size").notNull(),
  modularityScore: real("modularity_score"), // Community structure quality
  intraClusterDensity: real("intra_cluster_density"), // Internal connectivity
  interClusterConnections: jsonb("inter_cluster_connections").default([]), // External connections
  clusterFeatures: jsonb("cluster_features").default({}), // Derived cluster characteristics
  domainContext: text("domain_context"),
  stabilityScore: real("stability_score"), // Temporal stability across runs
  createdAt: timestamp("created_at").defaultNow(),
});

// Anomaly Detection Results
export const anomalyDetection = pgTable("anomaly_detection", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nodeId: varchar("node_id").references(() => graphNodes.id),
  relationshipId: varchar("relationship_id").references(() => graphRelationships.id),
  anomalyType: text("anomaly_type").notNull(), // NODE_OUTLIER, EDGE_ANOMALY, PATTERN_DEVIATION
  anomalyScore: real("anomaly_score").notNull(), // Higher = more anomalous
  detectionMethod: text("detection_method").notNull(), // ISOLATION_FOREST, AUTOENCODER, GAE, etc.
  anomalyDescription: text("anomaly_description"),
  contextualFeatures: jsonb("contextual_features").default({}), // Features that contributed to detection
  neighborhoodAnalysis: jsonb("neighborhood_analysis").default({}), // Local structure analysis
  severity: text("severity").default("medium"), // low, medium, high, critical
  investigationStatus: text("investigation_status").default("pending"), // pending, investigating, resolved, false_positive
  investigationNotes: text("investigation_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cross-Domain Reasoning Sessions
export const crossDomainReasoning = pgTable("cross_domain_reasoning", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  queryType: text("query_type").notNull(), // META_GRAPH_TRAVERSAL, SEMANTIC_BRIDGING, CAUSAL_INFERENCE, COUNTERFACTUAL
  sourceDomains: jsonb("source_domains").notNull(), // Array of involved domains
  targetDomains: jsonb("target_domains").notNull(),
  queryDescription: text("query_description").notNull(),
  reasoningPath: jsonb("reasoning_path").notNull(), // Step-by-step reasoning trace
  semanticBridges: jsonb("semantic_bridges").default([]), // Cross-domain concept alignments
  causalRelations: jsonb("causal_relations").default([]), // Identified causal links
  counterfactualScenarios: jsonb("counterfactual_scenarios").default([]), // What-if scenarios
  confidenceScore: real("confidence_score").notNull(),
  executionTime: integer("execution_time_ms"),
  resultSummary: text("result_summary"),
  validationStatus: text("validation_status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Graph Distributed Storage Shards
export const graphShards = pgTable("graph_shards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shardName: text("shard_name").notNull(),
  region: text("region").notNull(), // Geographic region
  nodeRange: jsonb("node_range").notNull(), // Range of node IDs in this shard
  relationshipCount: integer("relationship_count").default(0),
  storageSize: integer("storage_size_bytes").default(0),
  indexStatus: text("index_status").default("indexed"), // indexed, indexing, needs_reindex
  lastRebalanced: timestamp("last_rebalanced"),
  queryLatency: real("avg_query_latency_ms"), // Average query response time
  isActive: boolean("is_active").default(true),
  backupStatus: text("backup_status").default("current"), // current, backing_up, needs_backup
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});





// Insert schemas for Graph Neural Network Pipeline
export const insertGnnNodeEmbeddingSchema = createInsertSchema(gnnNodeEmbeddings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGnnModelSchema = createInsertSchema(gnnModels).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLinkPredictionSchema = createInsertSchema(linkPredictions).omit({
  id: true,
  createdAt: true,
});

export const insertNodeClassificationSchema = createInsertSchema(nodeClassifications).omit({
  id: true,
  createdAt: true,
});

export const insertGraphClusteringSchema = createInsertSchema(graphClustering).omit({
  id: true,
  createdAt: true,
});

export const insertAnomalyDetectionSchema = createInsertSchema(anomalyDetection).omit({
  id: true,
  createdAt: true,
});

export const insertCrossDomainReasoningSchema = createInsertSchema(crossDomainReasoning).omit({
  id: true,
  createdAt: true,
});

export const insertGraphShardSchema = createInsertSchema(graphShards).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports for Graph Neural Network Pipeline
export type GnnNodeEmbedding = typeof gnnNodeEmbeddings.$inferSelect;
export type InsertGnnNodeEmbedding = z.infer<typeof insertGnnNodeEmbeddingSchema>;
export type GnnModel = typeof gnnModels.$inferSelect;
export type InsertGnnModel = z.infer<typeof insertGnnModelSchema>;
export type LinkPrediction = typeof linkPredictions.$inferSelect;
export type InsertLinkPrediction = z.infer<typeof insertLinkPredictionSchema>;
export type NodeClassification = typeof nodeClassifications.$inferSelect;
export type InsertNodeClassification = z.infer<typeof insertNodeClassificationSchema>;
export type GraphClustering = typeof graphClustering.$inferSelect;
export type InsertGraphClustering = z.infer<typeof insertGraphClusteringSchema>;
export type AnomalyDetection = typeof anomalyDetection.$inferSelect;
export type InsertAnomalyDetection = z.infer<typeof insertAnomalyDetectionSchema>;
export type CrossDomainReasoning = typeof crossDomainReasoning.$inferSelect;
export type InsertCrossDomainReasoning = z.infer<typeof insertCrossDomainReasoningSchema>;
export type GraphShard = typeof graphShards.$inferSelect;
export type InsertGraphShard = z.infer<typeof insertGraphShardSchema>;

// Graph Neural Network Constants
export const GnnArchitectures = {
  GCN: "GCN", // Graph Convolutional Network
  GAT: "GAT", // Graph Attention Network
  GRAPHSAGE: "GraphSAGE", // Graph Sample and Aggregate
  GIN: "GIN", // Graph Isomorphism Network
  TRANSFORMER: "TRANSFORMER", // Graph Transformer
  MPNN: "MPNN", // Message Passing Neural Network
} as const;

export const AnomalyTypes = {
  NODE_OUTLIER: "NODE_OUTLIER",
  EDGE_ANOMALY: "EDGE_ANOMALY",
  PATTERN_DEVIATION: "PATTERN_DEVIATION",
  TEMPORAL_ANOMALY: "TEMPORAL_ANOMALY",
  COMMUNITY_ANOMALY: "COMMUNITY_ANOMALY",
} as const;

export const ReasoningTypes = {
  META_GRAPH_TRAVERSAL: "META_GRAPH_TRAVERSAL",
  SEMANTIC_BRIDGING: "SEMANTIC_BRIDGING", 
  CAUSAL_INFERENCE: "CAUSAL_INFERENCE",
  COUNTERFACTUAL: "COUNTERFACTUAL",
} as const;

export const ClusteringAlgorithms = {
  LOUVAIN: "LOUVAIN",
  LEIDEN: "LEIDEN",
  SPECTRAL: "SPECTRAL",
  KMEANS: "KMEANS",
  HIERARCHICAL: "HIERARCHICAL",
} as const;

// =====================================
// SocratIQ Trace™ Module - Immutable Audit System
// =====================================

// Audit Events - Core audit trail with cryptographic signatures
export const auditEvents = pgTable("audit_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventType: text("event_type").notNull(), // DATA_OPERATION, DECISION_EVENT, SYSTEM_EVENT
  eventSubtype: text("event_subtype").notNull(), // Specific operation type
  actor: varchar("actor").notNull(), // User ID or system component
  actorType: text("actor_type").notNull().default("USER"), // USER, SYSTEM, AGENT, API
  targetEntity: varchar("target_entity"), // Entity being acted upon
  targetEntityType: text("target_entity_type"), // DOCUMENT, MODEL, USER, etc.
  operation: text("operation").notNull(), // CREATE, UPDATE, DELETE, QUERY, etc.
  payload: jsonb("payload").notNull(), // Full operation details
  payloadHash: text("payload_hash").notNull(), // SHA-256 hash of payload
  previousEventHash: text("previous_event_hash"), // Hash chain for immutability
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  sessionId: varchar("session_id"), // Optional session grouping
  transactionId: varchar("transaction_id"), // Optional transaction grouping
  sourceSystem: text("source_system").notNull().default("SOCRATIQ"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  cryptographicSignature: text("cryptographic_signature").notNull(), // Digital signature
  validationStatus: text("validation_status").default("VALID"), // VALID, INVALID, PENDING
  retentionPolicy: text("retention_policy").default("PERMANENT"), // Retention classification
  complianceFlags: jsonb("compliance_flags").default([]), // Regulatory compliance tags
});

// Decision Events - Capture agent and human decisions
export const decisionEvents = pgTable("decision_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  auditEventId: varchar("audit_event_id").notNull().references(() => auditEvents.id),
  decisionType: text("decision_type").notNull(), // AGENT_RECOMMENDATION, HUMAN_OVERRIDE, POLICY_APPLICATION, WORKFLOW_EXECUTION
  decisionMaker: varchar("decision_maker").notNull(), // User ID or agent ID
  decisionMakerType: text("decision_maker_type").notNull(), // HUMAN, AGENT, SYSTEM
  confidence: real("confidence"), // Decision confidence (0-1)
  reasoning: text("reasoning"), // Decision justification
  alternatives: jsonb("alternatives").default([]), // Alternative options considered
  evidence: jsonb("evidence").default([]), // Supporting evidence
  riskAssessment: jsonb("risk_assessment").default({}), // Risk analysis
  impactAnalysis: jsonb("impact_analysis").default({}), // Impact assessment
  approvalChain: jsonb("approval_chain").default([]), // Approval workflow
  policyReferences: jsonb("policy_references").default([]), // Policy citations
  modelVersions: jsonb("model_versions").default([]), // AI model versions used
  humanReviewRequired: boolean("human_review_required").default(false),
  reviewStatus: text("review_status").default("PENDING"), // PENDING, APPROVED, REJECTED
  reviewedBy: varchar("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Evidence Bundles - Regulatory submission packages
export const evidenceBundles = pgTable("evidence_bundles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bundleName: text("bundle_name").notNull(),
  bundleType: text("bundle_type").notNull(), // REGULATORY_SUBMISSION, AUDIT_COMPLIANCE, INVESTIGATION
  regulatoryContext: text("regulatory_context"), // FDA, EMA, SOX, GDPR, etc.
  submissionId: varchar("submission_id"), // External submission reference
  status: text("status").default("DRAFT"), // DRAFT, SUBMITTED, APPROVED, REJECTED
  dataLineage: jsonb("data_lineage").notNull(), // Complete source-to-conclusion chain
  modelReferences: jsonb("model_references").default([]), // Model versions and training data
  humanReviewCycles: jsonb("human_review_cycles").default([]), // Review approval chain
  externalValidations: jsonb("external_validations").default([]), // Third-party validations
  auditEventIds: jsonb("audit_event_ids").notNull(), // Referenced audit events
  timePeriod: jsonb("time_period").notNull(), // Start and end timestamps
  entityScope: jsonb("entity_scope").default([]), // Entities included in bundle
  documentReferences: jsonb("document_references").default([]), // Source documents
  qualityMetrics: jsonb("quality_metrics").default({}), // Bundle completeness metrics
  exportFormats: jsonb("export_formats").default([]), // Available export formats
  submittedBy: varchar("submitted_by"),
  submittedAt: timestamp("submitted_at"),
  approvedBy: varchar("approved_by"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =====================================
// SocratIQ SophieTrust™ Module - Governance and Safety Framework  
// =====================================

// Risk Assessments - SophieTrust™ risk assessment engine
export const riskAssessmentsSophieTrust = pgTable("risk_assessments_sophietrust", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  auditEventId: varchar("audit_event_id").notNull().references(() => auditEvents.id),
  reasoningCycleId: varchar("reasoning_cycle_id").notNull(),
  agentName: text("agent_name").notNull(), // Sophie, specialized agents
  queryInput: text("query_input").notNull(), // Original user query
  contextData: jsonb("context_data").notNull(), // Contextual information used
  reasoningSteps: jsonb("reasoning_steps").notNull(), // Step-by-step reasoning
  knowledgeReferences: jsonb("knowledge_references").default([]), // KB entities accessed
  modelInferences: jsonb("model_inferences").default([]), // AI model outputs
  confidenceScores: jsonb("confidence_scores").default({}), // Step-wise confidence
  uncertaintyFlags: jsonb("uncertainty_flags").default([]), // Areas of uncertainty
  alternativeReasoning: jsonb("alternative_reasoning").default([]), // Alternative paths
  finalConclusion: text("final_conclusion").notNull(), // Reasoning outcome
  evidenceStrength: real("evidence_strength"), // Overall evidence quality (0-1)
  biasDetection: jsonb("bias_detection").default({}), // Bias analysis results
  explainabilityScore: real("explainability_score"), // How explainable the reasoning is
  verificationStatus: text("verification_status").default("UNVERIFIED"), // VERIFIED, UNVERIFIED, DISPUTED
  humanReview: jsonb("human_review").default({}), // Human expert review
  processingTime: integer("processing_time"), // Milliseconds to complete
  memoryAccesses: jsonb("memory_accesses").default([]), // Context memory accessed
  createdAt: timestamp("created_at").defaultNow(),
});

// System State Snapshots - Point-in-time system configurations
export const systemSnapshots = pgTable("system_snapshots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  snapshotType: text("snapshot_type").notNull(), // DECISION_POINT, ERROR_CONDITION, SCHEDULED
  triggerEventId: varchar("trigger_event_id").references(() => auditEvents.id),
  systemConfiguration: jsonb("system_configuration").notNull(), // Full system config
  activeModels: jsonb("active_models").default([]), // Models in use
  userSessions: jsonb("user_sessions").default([]), // Active user sessions
  processingQueues: jsonb("processing_queues").default([]), // Queue states
  resourceUtilization: jsonb("resource_utilization").default({}), // CPU, memory, etc.
  securityState: jsonb("security_state").default({}), // Security configurations
  integrationStatus: jsonb("integration_status").default([]), // External system status
  dataIntegrity: jsonb("data_integrity").default({}), // Data validation status
  performanceMetrics: jsonb("performance_metrics").default({}), // System performance
  complianceStatus: jsonb("compliance_status").default({}), // Regulatory compliance
  backupStatus: jsonb("backup_status").default({}), // Backup system status
  monitoringAlerts: jsonb("monitoring_alerts").default([]), // Active alerts
  snapshotHash: text("snapshot_hash").notNull(), // SHA-256 of snapshot content
  compressionRatio: real("compression_ratio"), // Storage efficiency
  retentionExpiry: timestamp("retention_expiry"), // When to expire snapshot
  createdAt: timestamp("created_at").defaultNow(),
});

// External System Integrations - Track external system interactions
export const externalIntegrations = pgTable("external_integrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  auditEventId: varchar("audit_event_id").notNull().references(() => auditEvents.id),
  systemName: text("system_name").notNull(), // External system identifier
  systemType: text("system_type").notNull(), // API, DATABASE, SERVICE, etc.
  operation: text("operation").notNull(), // GET, POST, PUT, DELETE, QUERY
  endpoint: text("endpoint"), // API endpoint or connection string
  requestPayload: jsonb("request_payload"), // Outgoing request data
  responsePayload: jsonb("response_payload"), // Incoming response data
  statusCode: integer("status_code"), // HTTP status or equivalent
  responseTime: integer("response_time"), // Milliseconds
  success: boolean("success").notNull(), // Operation success flag
  errorMessage: text("error_message"), // Error details if failed
  retryCount: integer("retry_count").default(0), // Number of retries
  authenticationMethod: text("authentication_method"), // Auth type used
  dataClassification: text("data_classification"), // Sensitivity level
  complianceImpact: text("compliance_impact"), // Regulatory implications
  createdAt: timestamp("created_at").defaultNow(),
});

// Audit Event Constants
export const AuditEventTypes = {
  DATA_OPERATION: "DATA_OPERATION",
  DECISION_EVENT: "DECISION_EVENT",
  SYSTEM_EVENT: "SYSTEM_EVENT",
} as const;

export const DataOperationTypes = {
  DOCUMENT_INGESTION: "DOCUMENT_INGESTION",
  TRANSFORMATION_STEP: "TRANSFORMATION_STEP",
  GRAPH_UPDATE: "GRAPH_UPDATE",
  QUERY_EXECUTION: "QUERY_EXECUTION",
  ENTITY_EXTRACTION: "ENTITY_EXTRACTION",
  CORPUS_CREATION: "CORPUS_CREATION",
} as const;

export const DecisionEventTypes = {
  AGENT_RECOMMENDATION: "AGENT_RECOMMENDATION",
  HUMAN_OVERRIDE: "HUMAN_OVERRIDE", 
  POLICY_APPLICATION: "POLICY_APPLICATION",
  WORKFLOW_EXECUTION: "WORKFLOW_EXECUTION",
  RISK_ASSESSMENT: "RISK_ASSESSMENT",
  COMPLIANCE_CHECK: "COMPLIANCE_CHECK",
} as const;

export const SystemEventTypes = {
  USER_AUTHENTICATION: "USER_AUTHENTICATION",
  CONFIGURATION_CHANGE: "CONFIGURATION_CHANGE",
  MODEL_DEPLOYMENT: "MODEL_DEPLOYMENT",
  ERROR_CONDITION: "ERROR_CONDITION",
  BACKUP_OPERATION: "BACKUP_OPERATION",
  SECURITY_ALERT: "SECURITY_ALERT",
} as const;

export const ActorTypes = {
  USER: "USER",
  SYSTEM: "SYSTEM",
  AGENT: "AGENT",
  API: "API",
  SCHEDULER: "SCHEDULER",
} as const;

export const BundleTypes = {
  REGULATORY_SUBMISSION: "REGULATORY_SUBMISSION",
  AUDIT_COMPLIANCE: "AUDIT_COMPLIANCE",
  INVESTIGATION: "INVESTIGATION",
  FORENSIC: "FORENSIC",
} as const;

export const ValidationStatuses = {
  VALID: "VALID",
  INVALID: "INVALID",
  PENDING: "PENDING",
  EXPIRED: "EXPIRED",
} as const;

// Insert schemas for Trace™ module
export const insertAuditEventSchema = createInsertSchema(auditEvents).omit({
  id: true,
});

export const insertDecisionEventSchema = createInsertSchema(decisionEvents).omit({
  id: true,
  createdAt: true,
});

export const insertEvidenceBundleSchema = createInsertSchema(evidenceBundles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSystemSnapshotSchema = createInsertSchema(systemSnapshots).omit({
  id: true,
  createdAt: true,
});

export const insertExternalIntegrationSchema = createInsertSchema(externalIntegrations).omit({
  id: true,
  createdAt: true,
});

// Type exports for Trace™ module
export type AuditEvent = typeof auditEvents.$inferSelect;
export type InsertAuditEvent = z.infer<typeof insertAuditEventSchema>;
export type DecisionEvent = typeof decisionEvents.$inferSelect;
export type InsertDecisionEvent = z.infer<typeof insertDecisionEventSchema>;
export type EvidenceBundle = typeof evidenceBundles.$inferSelect;
export type InsertEvidenceBundle = z.infer<typeof insertEvidenceBundleSchema>;
export type SystemSnapshot = typeof systemSnapshots.$inferSelect;
export type InsertSystemSnapshot = z.infer<typeof insertSystemSnapshotSchema>;
export type ExternalIntegration = typeof externalIntegrations.$inferSelect;
export type InsertExternalIntegration = z.infer<typeof insertExternalIntegrationSchema>;

export type AuditEventType = typeof AuditEventTypes[keyof typeof AuditEventTypes];
export type DataOperationType = typeof DataOperationTypes[keyof typeof DataOperationTypes];
export type DecisionEventType = typeof DecisionEventTypes[keyof typeof DecisionEventTypes];
export type SystemEventType = typeof SystemEventTypes[keyof typeof SystemEventTypes];
export type ActorType = typeof ActorTypes[keyof typeof ActorTypes];
export type BundleType = typeof BundleTypes[keyof typeof BundleTypes];
export type ValidationStatus = typeof ValidationStatuses[keyof typeof ValidationStatuses];

// =====================================
// SocratIQ Sophie™ Module - Multi-Agent Orchestration System
// =====================================

// Agent Definitions - Core agent types and their capabilities
export const agentDefinitions = pgTable("agent_definitions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentName: text("agent_name").notNull(), // Unique agent identifier
  agentType: text("agent_type").notNull(), // PATTERN_DETECTION, HYPOTHESIS, DECISION_ENGINE, ACTION_DISPATCH
  category: text("category"), // Subcategory within agent type
  capabilities: jsonb("capabilities").notNull(), // Specific capabilities and functions
  modelReferences: jsonb("model_references").default([]), // AI models used by this agent
  resourceRequirements: jsonb("resource_requirements").default({}), // CPU, memory, GPU requirements
  communicationProtocols: jsonb("communication_protocols").default([]), // Supported communication patterns
  domainSpecialization: text("domain_specialization"), // Domain expertise (BIOMEDICAL, LEGAL, etc.)
  confidenceThresholds: jsonb("confidence_thresholds").default({}), // Decision confidence requirements
  timeoutSettings: jsonb("timeout_settings").default({}), // Execution timeout configurations
  priority: integer("priority").default(5), // Agent priority (1-10)
  isActive: boolean("is_active").default(true),
  version: text("version").notNull().default("1.0.0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reasoning Sessions - SophieLogic™ reasoning cycles
export const reasoningSessions = pgTable("reasoning_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionType: text("session_type").notNull(), // DATA_SIGNAL, AGENT_REQUEST, USER_PROMPT, SCHEDULED
  triggerSource: text("trigger_source").notNull(), // What initiated the session
  triggerPayload: jsonb("trigger_payload").notNull(), // Input data that triggered reasoning
  status: text("status").default("ACTIVE"), // ACTIVE, COMPLETED, FAILED, CANCELLED
  sessionContext: jsonb("session_context").notNull(), // Working memory and context
  agentOrchestration: jsonb("agent_orchestration").default([]), // Agents involved in session
  reasoningWorkflow: jsonb("reasoning_workflow").default([]), // Workflow steps and sequence
  currentStep: integer("current_step").default(0), // Current step in reasoning workflow
  totalSteps: integer("total_steps").default(1), // Total steps in workflow
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  processingTime: integer("processing_time"), // Total processing time in ms
  confidenceScore: real("confidence_score"), // Overall session confidence
  riskAssessment: jsonb("risk_assessment").default({}), // Risk analysis results
  qualityMetrics: jsonb("quality_metrics").default({}), // Session quality indicators
  parentSessionId: varchar("parent_session_id").references(() => reasoningSessions.id), // For nested sessions
  correlationId: varchar("correlation_id"), // For tracking related sessions
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Agent Executions - Individual agent invocations within sessions
export const agentExecutions = pgTable("agent_executions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => reasoningSessions.id),
  agentId: varchar("agent_id").notNull().references(() => agentDefinitions.id),
  executionOrder: integer("execution_order").notNull(), // Order within session
  status: text("status").default("PENDING"), // PENDING, RUNNING, COMPLETED, FAILED, TIMEOUT
  inputData: jsonb("input_data").notNull(), // Input provided to agent
  outputData: jsonb("output_data"), // Agent output results
  processingTime: integer("processing_time"), // Agent execution time in ms
  memoryUsage: integer("memory_usage"), // Peak memory usage in bytes
  cpuUsage: real("cpu_usage"), // CPU utilization percentage
  confidenceScore: real("confidence_score"), // Agent-specific confidence
  errorDetails: jsonb("error_details"), // Error information if failed
  retryCount: integer("retry_count").default(0), // Number of retries attempted
  modelInvocations: jsonb("model_invocations").default([]), // Models called by agent
  communicationLog: jsonb("communication_log").default([]), // Agent communication events
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Pattern Detection Results - Output from PatternDetectionAgents
export const patternDetectionResults = pgTable("pattern_detection_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  executionId: varchar("execution_id").notNull().references(() => agentExecutions.id),
  patternType: text("pattern_type").notNull(), // STATISTICAL_ANOMALY, TEMPORAL_PATTERN, CROSS_DOMAIN_CORRELATION, EMERGING_SIGNAL
  detectionMethod: text("detection_method").notNull(), // Algorithm or technique used
  dataSource: text("data_source").notNull(), // Source of analyzed data
  patternDescription: text("pattern_description").notNull(), // Human-readable pattern description
  statisticalSignificance: real("statistical_significance"), // p-value or equivalent
  confidenceInterval: jsonb("confidence_interval"), // Statistical confidence bounds
  anomalyScore: real("anomaly_score"), // Anomaly detection score (0-1)
  temporalFeatures: jsonb("temporal_features").default({}), // Time-series characteristics
  spatialFeatures: jsonb("spatial_features").default({}), // Geographic or dimensional features
  correlationMatrix: jsonb("correlation_matrix"), // Cross-domain correlations
  emergingSignals: jsonb("emerging_signals").default([]), // New signals identified
  baselineMetrics: jsonb("baseline_metrics").default({}), // Baseline comparison data
  validationResults: jsonb("validation_results"), // Pattern validation outcomes
  actionableInsights: jsonb("actionable_insights").default([]), // Recommended actions
  createdAt: timestamp("created_at").defaultNow(),
});

// Hypothesis Generation - Output from HypothesisAgents
export const hypothesisGeneration = pgTable("hypothesis_generation", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  executionId: varchar("execution_id").notNull().references(() => agentExecutions.id),
  hypothesisType: text("hypothesis_type").notNull(), // CAUSAL_RELATIONSHIP, COUNTERFACTUAL_SCENARIO, PREDICTIVE_OUTCOME, ALTERNATIVE_PATHWAY
  hypothesisStatement: text("hypothesis_statement").notNull(), // Formal hypothesis statement
  evidenceBase: jsonb("evidence_base").notNull(), // Supporting evidence and data
  causalModel: jsonb("causal_model"), // Causal relationship structure
  counterfactualScenarios: jsonb("counterfactual_scenarios").default([]), // What-if scenarios
  predictiveModeling: jsonb("predictive_modeling"), // Predictive model results
  alternativePathways: jsonb("alternative_pathways").default([]), // Alternative solution paths
  probabilityEstimation: real("probability_estimation"), // Hypothesis probability (0-1)
  uncertaintyQuantification: jsonb("uncertainty_quantification"), // Uncertainty measures
  sensitivityAnalysis: jsonb("sensitivity_analysis"), // Parameter sensitivity results
  validationCriteria: jsonb("validation_criteria").default([]), // How to validate hypothesis
  testableImplications: jsonb("testable_implications").default([]), // Testable predictions
  riskFactors: jsonb("risk_factors").default([]), // Associated risks
  createdAt: timestamp("created_at").defaultNow(),
});

// Decision Recommendations - Output from DecisionEngineAgents
export const decisionRecommendations = pgTable("decision_recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  executionId: varchar("execution_id").notNull().references(() => agentExecutions.id),
  recommendationType: text("recommendation_type").notNull(), // MULTI_CRITERIA_OPTIMIZATION, RISK_BENEFIT_ANALYSIS, RESOURCE_ALLOCATION, TIMELINE_OPTIMIZATION
  decisionContext: jsonb("decision_context").notNull(), // Context and constraints
  alternatives: jsonb("alternatives").notNull(), // Available options
  evaluationCriteria: jsonb("evaluation_criteria").notNull(), // Decision criteria and weights
  optimizationResults: jsonb("optimization_results"), // Optimization outcomes
  riskBenefitAnalysis: jsonb("risk_benefit_analysis"), // Risk-benefit assessment
  resourceRequirements: jsonb("resource_requirements"), // Required resources per option
  timelineProjections: jsonb("timeline_projections"), // Time estimates per option
  sensitivityAnalysis: jsonb("sensitivity_analysis"), // Parameter sensitivity
  stakeholderImpact: jsonb("stakeholder_impact").default([]), // Impact on stakeholders
  recommendedAction: text("recommended_action").notNull(), // Primary recommendation
  alternativeActions: jsonb("alternative_actions").default([]), // Secondary options
  confidenceLevel: real("confidence_level").notNull(), // Recommendation confidence (0-1)
  implementationPlan: jsonb("implementation_plan"), // How to implement recommendation
  monitoringPlan: jsonb("monitoring_plan"), // How to monitor outcomes
  createdAt: timestamp("created_at").defaultNow(),
});

// Action Dispatches - Output from ActionDispatchAgents
export const actionDispatches = pgTable("action_dispatches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  executionId: varchar("execution_id").notNull().references(() => agentExecutions.id),
  actionType: text("action_type").notNull(), // WORKFLOW_AUTOMATION, ALERT_GENERATION, TASK_ASSIGNMENT, FEEDBACK_LOOP
  targetSystem: text("target_system"), // System or service to receive action
  actionPayload: jsonb("action_payload").notNull(), // Action data and parameters
  workflowDefinition: jsonb("workflow_definition"), // Automated workflow steps
  alertConfiguration: jsonb("alert_configuration"), // Alert settings and routing
  taskAssignments: jsonb("task_assignments").default([]), // Task assignments to users/systems
  feedbackLoops: jsonb("feedback_loops").default([]), // Feedback mechanisms
  executionStatus: text("execution_status").default("PENDING"), // PENDING, EXECUTING, COMPLETED, FAILED
  scheduledTime: timestamp("scheduled_time"), // When to execute action
  executedTime: timestamp("executed_time"), // When action was executed
  executionResults: jsonb("execution_results"), // Results of action execution
  errorHandling: jsonb("error_handling"), // Error handling configuration
  retryPolicy: jsonb("retry_policy"), // Retry configuration
  dependencies: jsonb("dependencies").default([]), // Dependencies on other actions
  priority: integer("priority").default(5), // Action priority (1-10)
  timeout: integer("timeout").default(300000), // Timeout in milliseconds
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Agent Communication - Inter-agent communication events
export const agentCommunication = pgTable("agent_communication", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => reasoningSessions.id),
  fromAgentId: varchar("from_agent_id").notNull().references(() => agentDefinitions.id),
  toAgentId: varchar("to_agent_id").references(() => agentDefinitions.id), // Null for broadcast
  communicationType: text("communication_type").notNull(), // EVENT_DRIVEN, REQUEST_RESPONSE, BROADCAST, NEGOTIATION
  messageType: text("message_type").notNull(), // DATA_SHARE, RESULT_NOTIFICATION, RESOURCE_REQUEST, STATUS_UPDATE
  messagePayload: jsonb("message_payload").notNull(), // Message content
  responsePayload: jsonb("response_payload"), // Response if request-response
  messageId: varchar("message_id").notNull(), // Unique message identifier
  correlationId: varchar("correlation_id"), // For tracking related messages
  priority: integer("priority").default(5), // Message priority (1-10)
  timeout: integer("timeout"), // Response timeout in milliseconds
  retryCount: integer("retry_count").default(0), // Number of retries
  deliveryStatus: text("delivery_status").default("PENDING"), // PENDING, DELIVERED, FAILED, TIMEOUT
  acknowledgmentReceived: boolean("acknowledgment_received").default(false),
  processingTime: integer("processing_time"), // Message processing time
  createdAt: timestamp("created_at").defaultNow(),
  deliveredAt: timestamp("delivered_at"),
});

// Resource Allocations - Dynamic resource management
export const resourceAllocations = pgTable("resource_allocations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => reasoningSessions.id),
  agentId: varchar("agent_id").notNull().references(() => agentDefinitions.id),
  resourceType: text("resource_type").notNull(), // CPU, MEMORY, GPU, NETWORK, STORAGE
  allocatedAmount: real("allocated_amount").notNull(), // Amount allocated
  utilizationPeak: real("utilization_peak"), // Peak utilization observed
  utilizationAverage: real("utilization_average"), // Average utilization
  allocationTime: timestamp("allocation_time").defaultNow(),
  releaseTime: timestamp("release_time"),
  allocationDuration: integer("allocation_duration"), // Duration in milliseconds
  costIncurred: real("cost_incurred"), // Resource cost
  efficiency: real("efficiency"), // Utilization efficiency (0-1)
  bottlenecks: jsonb("bottlenecks").default([]), // Identified bottlenecks
  optimizationSuggestions: jsonb("optimization_suggestions").default([]), // Performance improvements
  createdAt: timestamp("created_at").defaultNow(),
});

// Agent Constants
export const AgentTypes = {
  PATTERN_DETECTION: "PATTERN_DETECTION",
  HYPOTHESIS: "HYPOTHESIS", 
  DECISION_ENGINE: "DECISION_ENGINE",
  ACTION_DISPATCH: "ACTION_DISPATCH",
} as const;

export const PatternDetectionCategories = {
  STATISTICAL_ANOMALY: "STATISTICAL_ANOMALY",
  TEMPORAL_PATTERN: "TEMPORAL_PATTERN",
  CROSS_DOMAIN_CORRELATION: "CROSS_DOMAIN_CORRELATION", 
  EMERGING_SIGNAL: "EMERGING_SIGNAL",
} as const;

export const HypothesisCategories = {
  CAUSAL_RELATIONSHIP: "CAUSAL_RELATIONSHIP",
  COUNTERFACTUAL_SCENARIO: "COUNTERFACTUAL_SCENARIO",
  PREDICTIVE_OUTCOME: "PREDICTIVE_OUTCOME",
  ALTERNATIVE_PATHWAY: "ALTERNATIVE_PATHWAY",
} as const;

export const DecisionEngineCategories = {
  MULTI_CRITERIA_OPTIMIZATION: "MULTI_CRITERIA_OPTIMIZATION",
  RISK_BENEFIT_ANALYSIS: "RISK_BENEFIT_ANALYSIS",
  RESOURCE_ALLOCATION: "RESOURCE_ALLOCATION",
  TIMELINE_OPTIMIZATION: "TIMELINE_OPTIMIZATION",
} as const;

export const ActionDispatchCategories = {
  WORKFLOW_AUTOMATION: "WORKFLOW_AUTOMATION",
  ALERT_GENERATION: "ALERT_GENERATION",
  TASK_ASSIGNMENT: "TASK_ASSIGNMENT",
  FEEDBACK_LOOP: "FEEDBACK_LOOP",
} as const;

export const SessionTypes = {
  DATA_SIGNAL: "DATA_SIGNAL",
  AGENT_REQUEST: "AGENT_REQUEST",
  USER_PROMPT: "USER_PROMPT",
  SCHEDULED: "SCHEDULED",
} as const;

export const SessionStatuses = {
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
} as const;

export const ExecutionStatuses = {
  PENDING: "PENDING",
  RUNNING: "RUNNING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  TIMEOUT: "TIMEOUT",
} as const;

export const CommunicationTypes = {
  EVENT_DRIVEN: "EVENT_DRIVEN",
  REQUEST_RESPONSE: "REQUEST_RESPONSE",
  BROADCAST: "BROADCAST",
  NEGOTIATION: "NEGOTIATION",
} as const;

export const ResourceTypes = {
  CPU: "CPU",
  MEMORY: "MEMORY",
  GPU: "GPU",
  NETWORK: "NETWORK",
  STORAGE: "STORAGE",
} as const;

// Insert schemas for Sophie™ module
export const insertAgentDefinitionSchema = createInsertSchema(agentDefinitions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReasoningSessionSchema = createInsertSchema(reasoningSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAgentExecutionSchema = createInsertSchema(agentExecutions).omit({
  id: true,
  createdAt: true,
});

export const insertPatternDetectionResultSchema = createInsertSchema(patternDetectionResults).omit({
  id: true,
  createdAt: true,
});

export const insertHypothesisGenerationSchema = createInsertSchema(hypothesisGeneration).omit({
  id: true,
  createdAt: true,
});

export const insertDecisionRecommendationSchema = createInsertSchema(decisionRecommendations).omit({
  id: true,
  createdAt: true,
});

export const insertActionDispatchSchema = createInsertSchema(actionDispatches).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAgentCommunicationSchema = createInsertSchema(agentCommunication).omit({
  id: true,
  createdAt: true,
});

export const insertResourceAllocationSchema = createInsertSchema(resourceAllocations).omit({
  id: true,
  createdAt: true,
});

// Type exports for Sophie™ module
export type AgentDefinition = typeof agentDefinitions.$inferSelect;
export type InsertAgentDefinition = z.infer<typeof insertAgentDefinitionSchema>;
export type ReasoningSession = typeof reasoningSessions.$inferSelect;
export type InsertReasoningSession = z.infer<typeof insertReasoningSessionSchema>;
export type AgentExecution = typeof agentExecutions.$inferSelect;
export type InsertAgentExecution = z.infer<typeof insertAgentExecutionSchema>;
export type PatternDetectionResult = typeof patternDetectionResults.$inferSelect;
export type InsertPatternDetectionResult = z.infer<typeof insertPatternDetectionResultSchema>;
export type HypothesisGeneration = typeof hypothesisGeneration.$inferSelect;
export type InsertHypothesisGeneration = z.infer<typeof insertHypothesisGenerationSchema>;
export type DecisionRecommendation = typeof decisionRecommendations.$inferSelect;
export type InsertDecisionRecommendation = z.infer<typeof insertDecisionRecommendationSchema>;
export type ActionDispatch = typeof actionDispatches.$inferSelect;
export type InsertActionDispatch = z.infer<typeof insertActionDispatchSchema>;
export type AgentCommunication = typeof agentCommunication.$inferSelect;
export type InsertAgentCommunication = z.infer<typeof insertAgentCommunicationSchema>;
export type ResourceAllocation = typeof resourceAllocations.$inferSelect;
export type InsertResourceAllocation = z.infer<typeof insertResourceAllocationSchema>;

export type AgentType = typeof AgentTypes[keyof typeof AgentTypes];
export type PatternDetectionCategory = typeof PatternDetectionCategories[keyof typeof PatternDetectionCategories];
export type HypothesisCategory = typeof HypothesisCategories[keyof typeof HypothesisCategories];
export type DecisionEngineCategory = typeof DecisionEngineCategories[keyof typeof DecisionEngineCategories];
export type ActionDispatchCategory = typeof ActionDispatchCategories[keyof typeof ActionDispatchCategories];
export type SessionType = typeof SessionTypes[keyof typeof SessionTypes];
export type SessionStatus = typeof SessionStatuses[keyof typeof SessionStatuses];
export type ExecutionStatus = typeof ExecutionStatuses[keyof typeof ExecutionStatuses];
export type CommunicationType = typeof CommunicationTypes[keyof typeof CommunicationTypes];
export type ResourceType = typeof ResourceTypes[keyof typeof ResourceTypes];

// =====================================
// SocratIQ SophieTrust™ Module - Governance and Safety Framework
// =====================================

// Compliance Policies - Governance rules and policies
export const compliancePolicies = pgTable("compliance_policies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  policyName: text("policy_name").notNull(),
  policyType: text("policy_type").notNull(), // DATA_PRIVACY, BUDGET_CONTROL, ACCESS_CONTROL, AUDIT_REQUIREMENT, REGULATORY_COMPLIANCE
  policyCategory: text("policy_category"), // GxP, GDPR, SOX, BUDGET, TIMELINE
  description: text("description").notNull(),
  ruleSpecification: jsonb("rule_specification").notNull(), // Natural language and formal rule specification
  enforcementLevel: text("enforcement_level").default("warn"), // block, warn, log, audit
  applicableEntities: jsonb("applicable_entities").default([]), // Entities this policy applies to
  conditions: jsonb("conditions").default([]), // Conditions for policy activation
  actions: jsonb("actions").default([]), // Actions to take when policy is triggered
  exceptions: jsonb("exceptions").default([]), // Policy exceptions
  priority: integer("priority").default(5), // Policy priority (1-10)
  isActive: boolean("is_active").default(true),
  effectiveDate: timestamp("effective_date").defaultNow(),
  expirationDate: timestamp("expiration_date"),
  approvedBy: varchar("approved_by"), // Policy approver
  approvalDate: timestamp("approval_date"),
  version: text("version").default("1.0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sophie Guardrails™ - Real-time constraint enforcement
export const sophieGuardrails = pgTable("sophie_guardrails", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  guardrailName: text("guardrail_name").notNull(),
  guardrailType: text("guardrail_type").notNull(), // POLICY_ENFORCEMENT, CONSTRAINT_VALIDATION, ACCESS_CONTROL, BUDGET_LIMIT, DATA_PROTECTION
  enforcementEngine: text("enforcement_engine").notNull(), // RULE_BASED, CONSTRAINT_LOGIC, FUZZY_LOGIC, ML_BASED
  triggerConditions: jsonb("trigger_conditions").notNull(), // Conditions that activate guardrail
  constraintLogic: jsonb("constraint_logic").notNull(), // Logic for constraint evaluation
  actionOnViolation: text("action_on_violation").default("block"), // block, reroute, escalate, log
  rerouttingRules: jsonb("rerouting_rules").default([]), // Rules for action rerouting
  escalationPath: jsonb("escalation_path").default([]), // Escalation workflow
  dependencyTracking: jsonb("dependency_tracking").default([]), // Dependency relationships
  rollbackControls: jsonb("rollback_controls").default({}), // Rollback mechanisms
  confidenceThreshold: real("confidence_threshold").default(0.8), // Confidence threshold for action
  priority: integer("priority").default(5), // Guardrail priority
  isActive: boolean("is_active").default(true),
  performanceMetrics: jsonb("performance_metrics").default({}), // Performance tracking
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sophie Ascend™ - Autonomy calibration and promotion
export const sophieAscend = pgTable("sophie_ascend", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").notNull(),
  actionType: text("action_type").notNull(), // Action being calibrated
  autonomyLevel: text("autonomy_level").notNull().default("supervised"), // supervised, semi_autonomous, autonomous
  confidenceScore: real("confidence_score").notNull(), // Current confidence score
  successRate: real("success_rate").default(0), // Historical success rate
  supervisionHistory: jsonb("supervision_history").default([]), // Previous supervision events
  promotionCriteria: jsonb("promotion_criteria").default({}), // Criteria for autonomy promotion
  demotionTriggers: jsonb("demotion_triggers").default([]), // Triggers for autonomy reduction
  learningMetrics: jsonb("learning_metrics").default({}), // Reinforcement learning metrics
  statisticalBaseline: jsonb("statistical_baseline").default({}), // Statistical performance baseline
  riskTolerance: real("risk_tolerance").default(0.1), // Risk tolerance for autonomous actions
  rollbackCapability: boolean("rollback_capability").default(true), // Can actions be rolled back
  humanOverrideCount: integer("human_override_count").default(0), // Count of human overrides
  lastPromotionDate: timestamp("last_promotion_date"),
  lastDemotionDate: timestamp("last_demotion_date"),
  nextReviewDate: timestamp("next_review_date"),
  calibrationNotes: text("calibration_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sophie Ripple™ - Impact simulation and modeling
export const sophieRipple = pgTable("sophie_ripple", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  simulationName: text("simulation_name").notNull(),
  simulationType: text("simulation_type").notNull(), // AGENT_BASED_CASCADE, GRAPH_NEURAL_PROPAGATION, MONTE_CARLO, MULTI_STAKEHOLDER
  triggerAction: jsonb("trigger_action").notNull(), // Action that triggers the simulation
  stakeholders: jsonb("stakeholders").default([]), // Affected stakeholders
  impactDomains: jsonb("impact_domains").default([]), // Domains affected (teams, processes, timeline)
  cascadeEffects: jsonb("cascade_effects").default([]), // Multi-hop cascade effects
  timeHorizon: integer("time_horizon").default(30), // Simulation time horizon in days
  propagationRules: jsonb("propagation_rules").default([]), // Rules for impact propagation
  simulationResults: jsonb("simulation_results").default({}), // Simulation outcomes
  probabilisticOutcomes: jsonb("probabilistic_outcomes").default([]), // Probabilistic results
  riskMetrics: jsonb("risk_metrics").default({}), // Risk quantification
  mitigationOptions: jsonb("mitigation_options").default([]), // Mitigation strategies
  confidenceInterval: real("confidence_interval").default(0.95), // Statistical confidence
  simulationParameters: jsonb("simulation_parameters").default({}), // Model parameters
  computationTime: integer("computation_time"), // Time taken for simulation
  status: text("status").default("pending"), // pending, running, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sophie Risk Lens™ - Probabilistic risk quantification
export const sophieRiskLens = pgTable("sophie_risk_lens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  riskAnalysisName: text("risk_analysis_name").notNull(),
  analysisType: text("analysis_type").notNull(), // BAYESIAN_SIMULATION, MONTE_CARLO, AGENT_BASED_MODELING, SENSITIVITY_ANALYSIS
  targetAction: jsonb("target_action").notNull(), // Action being analyzed
  riskCategories: jsonb("risk_categories").default([]), // Categories of risk analyzed
  probabilisticModels: jsonb("probabilistic_models").default([]), // Models used in analysis
  bayesianNetworks: jsonb("bayesian_networks").default([]), // Bayesian network structure
  simulationRuns: integer("simulation_runs").default(10000), // Number of simulation runs
  riskQuantification: jsonb("risk_quantification").default({}), // Quantified risk results
  costProjections: jsonb("cost_projections").default({}), // Cost impact projections
  timelineImpacts: jsonb("timeline_impacts").default({}), // Timeline risk analysis
  complianceRisks: jsonb("compliance_risks").default({}), // Compliance risk assessment
  downstreamEffects: jsonb("downstream_effects").default([]), // Downstream consequences
  riskDistribution: jsonb("risk_distribution").default({}), // Risk probability distribution
  confidenceBounds: jsonb("confidence_bounds").default({}), // Statistical confidence bounds
  sensitivityAnalysis: jsonb("sensitivity_analysis").default({}), // Parameter sensitivity
  recommendations: jsonb("recommendations").default([]), // Risk-based recommendations
  validationMetrics: jsonb("validation_metrics").default({}), // Model validation results
  status: text("status").default("pending"), // pending, running, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Policy Violations - Tracking violations and responses
export const policyViolations = pgTable("policy_violations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  policyId: varchar("policy_id").notNull().references(() => compliancePolicies.id),
  violationType: text("violation_type").notNull(), // COMPLIANCE_BREACH, ACCESS_VIOLATION, BUDGET_OVERRUN, DATA_MISUSE
  severity: text("severity").notNull(), // low, medium, high, critical
  violatingEntity: varchar("violating_entity"), // Entity that caused violation
  violatingEntityType: text("violating_entity_type"),
  violationContext: jsonb("violation_context").default({}), // Context of violation
  detectionMethod: text("detection_method"), // How violation was detected
  automaticResponse: jsonb("automatic_response").default({}), // Automatic response taken
  humanResponse: jsonb("human_response").default({}), // Human response/override
  blockingAction: boolean("blocking_action").default(false), // Was action blocked
  rerouting: jsonb("rerouting").default({}), // Action rerouting details
  escalationLevel: integer("escalation_level").default(0), // Current escalation level
  resolutionStatus: text("resolution_status").default("open"), // open, investigating, resolved, false_positive
  resolutionActions: jsonb("resolution_actions").default([]), // Actions taken to resolve
  impactAssessment: jsonb("impact_assessment").default({}), // Assessment of violation impact
  lessonsLearned: text("lessons_learned"), // Lessons learned from violation
  assignedTo: varchar("assigned_to"), // Person assigned to handle violation
  reportedAt: timestamp("reported_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Governance Actions - Actions taken by governance system
export const governanceActions = pgTable("governance_actions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  actionType: text("action_type").notNull(), // BLOCK_ACTION, ESCALATE_ISSUE, AUDIT_LOG, REVOKE_ACCESS, APPROVE_WORKFLOW, REROUTE_ACTION
  triggerEvent: varchar("trigger_event"), // Event that triggered the action
  triggerEventType: text("trigger_event_type"), // Type of triggering event
  governanceComponent: text("governance_component").notNull(), // GUARDRAILS, RISK_LENS, ASCEND, RIPPLE
  targetEntity: varchar("target_entity"), // Entity affected by action
  targetEntityType: text("target_entity_type"),
  actionDetails: jsonb("action_details").notNull(), // Details of action taken
  automationLevel: text("automation_level").default("automated"), // automated, semi_automated, manual
  humanOverride: boolean("human_override").default(false), // Was there human override
  overrideReason: text("override_reason"), // Reason for override
  actionResult: text("action_result"), // Result of action
  impactMeasurement: jsonb("impact_measurement").default({}), // Measured impact of action
  followUpRequired: boolean("follow_up_required").default(false), // Is follow-up needed
  followUpActions: jsonb("follow_up_actions").default([]), // Required follow-up actions
  complianceFlags: jsonb("compliance_flags").default([]), // Compliance-related flags
  auditTrail: jsonb("audit_trail").default([]), // Audit trail for action
  executedBy: varchar("executed_by"), // Who/what executed the action
  approvedBy: varchar("approved_by"), // Who approved the action
  executedAt: timestamp("executed_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// SophieTrust™ Constants
export const RiskCategories = {
  COMPLIANCE_VIOLATION: "COMPLIANCE_VIOLATION",
  DATA_PRIVACY_BREACH: "DATA_PRIVACY_BREACH",
  FINANCIAL_THRESHOLD: "FINANCIAL_THRESHOLD",
  TIMELINE_RISK: "TIMELINE_RISK",
  QUALITY_DEGRADATION: "QUALITY_DEGRADATION",
  SECURITY_RISK: "SECURITY_RISK",
  OPERATIONAL_RISK: "OPERATIONAL_RISK"
} as const;

export const DetectionMethods = {
  RULE_BASED_VALIDATION: "RULE_BASED_VALIDATION",
  ACCESS_PATTERN_ANALYSIS: "ACCESS_PATTERN_ANALYSIS",
  BUDGET_TRACKING: "BUDGET_TRACKING",
  CRITICAL_PATH_ANALYSIS: "CRITICAL_PATH_ANALYSIS",
  PERFORMANCE_MONITORING: "PERFORMANCE_MONITORING",
  ML_ANOMALY_DETECTION: "ML_ANOMALY_DETECTION",
  STATISTICAL_ANALYSIS: "STATISTICAL_ANALYSIS"
} as const;

export const PolicyTypes = {
  DATA_PRIVACY: "DATA_PRIVACY",
  BUDGET_CONTROL: "BUDGET_CONTROL",
  ACCESS_CONTROL: "ACCESS_CONTROL",
  AUDIT_REQUIREMENT: "AUDIT_REQUIREMENT",
  REGULATORY_COMPLIANCE: "REGULATORY_COMPLIANCE",
  QUALITY_ASSURANCE: "QUALITY_ASSURANCE",
  SECURITY_POLICY: "SECURITY_POLICY"
} as const;

export const EnforcementLevels = {
  BLOCK: "block",
  WARN: "warn",
  LOG: "log",
  AUDIT: "audit"
} as const;

export const GuardrailTypes = {
  POLICY_ENFORCEMENT: "POLICY_ENFORCEMENT",
  CONSTRAINT_VALIDATION: "CONSTRAINT_VALIDATION",
  ACCESS_CONTROL: "ACCESS_CONTROL",
  BUDGET_LIMIT: "BUDGET_LIMIT",
  DATA_PROTECTION: "DATA_PROTECTION",
  TIMELINE_CONSTRAINT: "TIMELINE_CONSTRAINT"
} as const;

export const EnforcementEngines = {
  RULE_BASED: "RULE_BASED",
  CONSTRAINT_LOGIC: "CONSTRAINT_LOGIC",
  FUZZY_LOGIC: "FUZZY_LOGIC",
  ML_BASED: "ML_BASED"
} as const;

export const AutonomyLevels = {
  SUPERVISED: "supervised",
  SEMI_AUTONOMOUS: "semi_autonomous",
  AUTONOMOUS: "autonomous"
} as const;

export const SimulationTypes = {
  AGENT_BASED_CASCADE: "AGENT_BASED_CASCADE",
  GRAPH_NEURAL_PROPAGATION: "GRAPH_NEURAL_PROPAGATION",
  MONTE_CARLO: "MONTE_CARLO",
  MULTI_STAKEHOLDER: "MULTI_STAKEHOLDER"
} as const;

export const AnalysisTypes = {
  BAYESIAN_SIMULATION: "BAYESIAN_SIMULATION",
  MONTE_CARLO_ANALYSIS: "MONTE_CARLO_ANALYSIS",
  AGENT_BASED_MODELING: "AGENT_BASED_MODELING",
  SENSITIVITY_ANALYSIS: "SENSITIVITY_ANALYSIS"
} as const;

export const ViolationTypes = {
  COMPLIANCE_BREACH: "COMPLIANCE_BREACH",
  ACCESS_VIOLATION: "ACCESS_VIOLATION",
  BUDGET_OVERRUN: "BUDGET_OVERRUN",
  DATA_MISUSE: "DATA_MISUSE",
  TIMELINE_VIOLATION: "TIMELINE_VIOLATION"
} as const;

export const GovernanceActionTypes = {
  BLOCK_ACTION: "BLOCK_ACTION",
  ESCALATE_ISSUE: "ESCALATE_ISSUE",
  AUDIT_LOG: "AUDIT_LOG",
  REVOKE_ACCESS: "REVOKE_ACCESS",
  APPROVE_WORKFLOW: "APPROVE_WORKFLOW",
  REROUTE_ACTION: "REROUTE_ACTION"
} as const;

// Insert schemas for SophieTrust™ module
export const insertRiskAssessmentSophieTrustSchema = createInsertSchema(riskAssessmentsSophieTrust).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCompliancePolicySchema = createInsertSchema(compliancePolicies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSophieGuardrailSchema = createInsertSchema(sophieGuardrails).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSophieAscendSchema = createInsertSchema(sophieAscend).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSophieRippleSchema = createInsertSchema(sophieRipple).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSophieRiskLensSchema = createInsertSchema(sophieRiskLens).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPolicyViolationSchema = createInsertSchema(policyViolations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGovernanceActionSchema = createInsertSchema(governanceActions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports for SophieTrust™ module
export type RiskAssessmentSophieTrust = typeof riskAssessmentsSophieTrust.$inferSelect;
export type InsertRiskAssessmentSophieTrust = z.infer<typeof insertRiskAssessmentSophieTrustSchema>;
export type CompliancePolicy = typeof compliancePolicies.$inferSelect;
export type InsertCompliancePolicy = z.infer<typeof insertCompliancePolicySchema>;
export type SophieGuardrail = typeof sophieGuardrails.$inferSelect;
export type InsertSophieGuardrail = z.infer<typeof insertSophieGuardrailSchema>;
export type SophieAscend = typeof sophieAscend.$inferSelect;
export type InsertSophieAscend = z.infer<typeof insertSophieAscendSchema>;
export type SophieRipple = typeof sophieRipple.$inferSelect;
export type InsertSophieRipple = z.infer<typeof insertSophieRippleSchema>;
export type SophieRiskLens = typeof sophieRiskLens.$inferSelect;
export type InsertSophieRiskLens = z.infer<typeof insertSophieRiskLensSchema>;
export type PolicyViolation = typeof policyViolations.$inferSelect;
export type InsertPolicyViolation = z.infer<typeof insertPolicyViolationSchema>;
export type GovernanceAction = typeof governanceActions.$inferSelect;
export type InsertGovernanceAction = z.infer<typeof insertGovernanceActionSchema>;

export type RiskCategory = typeof RiskCategories[keyof typeof RiskCategories];
export type DetectionMethod = typeof DetectionMethods[keyof typeof DetectionMethods];
export type PolicyType = typeof PolicyTypes[keyof typeof PolicyTypes];
export type EnforcementLevel = typeof EnforcementLevels[keyof typeof EnforcementLevels];
export type GuardrailType = typeof GuardrailTypes[keyof typeof GuardrailTypes];
export type EnforcementEngine = typeof EnforcementEngines[keyof typeof EnforcementEngines];
export type AutonomyLevel = typeof AutonomyLevels[keyof typeof AutonomyLevels];
export type SimulationType = typeof SimulationTypes[keyof typeof SimulationTypes];
export type AnalysisType = typeof AnalysisTypes[keyof typeof AnalysisTypes];
export type ViolationType = typeof ViolationTypes[keyof typeof ViolationTypes];
export type GovernanceActionType = typeof GovernanceActionTypes[keyof typeof GovernanceActionTypes];

// =====================================
// SocratIQ SophieModels™ - AI Cognitive Toolkit
// =====================================

// AI Models - Core model definitions and capabilities
export const aiModels = pgTable("ai_models", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  modelName: text("model_name").notNull(),
  modelType: text("model_type").notNull(), // SYMBOLIC, NEURAL, EVOLUTIONARY, QUANTUM, HYBRID
  architecture: text("architecture").notNull(), // TRANSFORMER, CNN, RNN, GNN, SYMBOLIC_LOGIC, etc.
  paradigm: text("paradigm").notNull(), // SUPERVISED, UNSUPERVISED, REINFORCEMENT, SYMBOLIC_REASONING
  category: text("category").notNull(), // FOUNDATION, FINE_TUNED, SPECIALIZED, AGENT_SPECIFIC
  domain: text("domain"), // GENERAL, BIOMEDICAL, LEGAL, FINANCIAL, TECHNICAL
  capabilities: jsonb("capabilities").notNull(), // Specific model capabilities
  parameters: jsonb("parameters").default({}), // Model parameters and hyperparameters
  modelSize: text("model_size"), // 7B, 13B, 70B, etc.
  contextLength: integer("context_length"), // Context window size
  inputModalities: jsonb("input_modalities").default([]), // text, image, audio, multimodal
  outputModalities: jsonb("output_modalities").default([]), // text, code, reasoning, action
  trainingData: jsonb("training_data").default({}), // Training dataset information
  benchmarkScores: jsonb("benchmark_scores").default({}), // Performance benchmarks
  computeRequirements: jsonb("compute_requirements").default({}), // GPU, memory, storage requirements
  latencyProfile: jsonb("latency_profile").default({}), // Performance latency characteristics
  apiEndpoint: text("api_endpoint"), // Model serving endpoint
  modelPath: text("model_path"), // Storage path for model files
  checkpointHash: text("checkpoint_hash"), // Model checkpoint verification hash
  version: text("version").notNull().default("1.0.0"),
  isActive: boolean("is_active").default(true),
  isPublic: boolean("is_public").default(false), // Public vs private model
  license: text("license"), // Model license information
  authorOrganization: text("author_organization"),
  publishedDate: timestamp("published_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Training Jobs - Model training and fine-tuning operations
export const trainingJobs = pgTable("training_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobName: text("job_name").notNull(),
  baseModelId: varchar("base_model_id").references(() => aiModels.id),
  trainingType: text("training_type").notNull(), // FULL_TRAINING, FINE_TUNING, LORA_ADAPTATION, RLHF
  trainingMethod: text("training_method").notNull(), // SUPERVISED, REINFORCEMENT, CONTRASTIVE, SELF_SUPERVISED
  status: text("status").default("queued"), // queued, running, completed, failed, paused
  priority: integer("priority").default(5), // Job priority (1-10)
  trainingConfig: jsonb("training_config").notNull(), // Training hyperparameters and configuration
  dataset: jsonb("dataset").notNull(), // Training dataset specifications
  validationDataset: jsonb("validation_dataset").default({}), // Validation dataset
  trainingMetrics: jsonb("training_metrics").default({}), // Training loss, accuracy, etc.
  validationMetrics: jsonb("validation_metrics").default({}), // Validation performance
  resourceAllocation: jsonb("resource_allocation").default({}), // Compute resources allocated
  estimatedDuration: integer("estimated_duration"), // Estimated training time in minutes
  actualDuration: integer("actual_duration"), // Actual training time
  progressPercentage: real("progress_percentage").default(0), // Training progress (0-100)
  currentEpoch: integer("current_epoch").default(0),
  totalEpochs: integer("total_epochs"),
  checkpointPath: text("checkpoint_path"), // Path to model checkpoints
  logPath: text("log_path"), // Path to training logs
  errorDetails: jsonb("error_details").default({}), // Error information if failed
  hyperparameterSearch: jsonb("hyperparameter_search").default({}), // HPO configuration
  distributedConfig: jsonb("distributed_config").default({}), // Distributed training setup
  resultingModelId: varchar("resulting_model_id").references(() => aiModels.id), // Resulting trained model
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Model Deployments - Production deployment tracking
export const modelDeployments = pgTable("model_deployments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  deploymentName: text("deployment_name").notNull(),
  modelId: varchar("model_id").notNull().references(() => aiModels.id),
  environment: text("environment").notNull(), // development, staging, production
  deploymentType: text("deployment_type").notNull(), // API_ENDPOINT, BATCH_PROCESSING, EMBEDDED, AGENT_INTEGRATION
  status: text("status").default("deploying"), // deploying, active, inactive, failed, updating
  endpoint: text("endpoint"), // Service endpoint URL
  version: text("version").notNull(),
  configuration: jsonb("configuration").notNull(), // Deployment configuration
  scalingPolicy: jsonb("scaling_policy").default({}), // Auto-scaling configuration
  resourceLimits: jsonb("resource_limits").default({}), // Resource constraints
  performanceTargets: jsonb("performance_targets").default({}), // SLA targets
  monitoringConfig: jsonb("monitoring_config").default({}), // Monitoring setup
  healthChecks: jsonb("health_checks").default([]), // Health check configuration
  accessControls: jsonb("access_controls").default({}), // Access control policies
  apiKeys: jsonb("api_keys").default([]), // Associated API keys
  usageMetrics: jsonb("usage_metrics").default({}), // Usage statistics
  performanceMetrics: jsonb("performance_metrics").default({}), // Performance data
  costTracking: jsonb("cost_tracking").default({}), // Cost and billing information
  rollbackConfig: jsonb("rollback_config").default({}), // Rollback configuration
  deployedBy: varchar("deployed_by").notNull(),
  approvedBy: varchar("approved_by"),
  deployedAt: timestamp("deployed_at"),
  lastHealthCheck: timestamp("last_health_check"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Agent Families - Specialized agent collections
export const agentFamilies = pgTable("agent_families", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyName: text("family_name").notNull(),
  familyType: text("family_type").notNull(), // COGNITIVE_ARCHITECTS, DOMAIN_SPECIALISTS, REASONING_ENGINES, ACTION_COORDINATORS
  description: text("description").notNull(),
  domain: text("domain"), // Specialized domain
  capabilities: jsonb("capabilities").notNull(), // Family-wide capabilities
  modelArchitectures: jsonb("model_architectures").default([]), // Supported architectures
  agentTypes: jsonb("agent_types").default([]), // Types of agents in this family
  coordinationPatterns: jsonb("coordination_patterns").default([]), // Inter-agent coordination
  specialization: jsonb("specialization").default({}), // Domain specialization details
  performanceMetrics: jsonb("performance_metrics").default({}), // Family performance data
  resourceRequirements: jsonb("resource_requirements").default({}), // Shared resource needs
  configuration: jsonb("configuration").default({}), // Family configuration
  version: text("version").notNull().default("1.0.0"),
  isActive: boolean("is_active").default(true),
  maintainer: varchar("maintainer"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Model Repositories - Centralized model storage and versioning
export const modelRepositories = pgTable("model_repositories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  repositoryName: text("repository_name").notNull(),
  repositoryType: text("repository_type").notNull(), // HUGGINGFACE, PRIVATE, ENTERPRISE, RESEARCH
  organization: text("organization"),
  visibility: text("visibility").default("private"), // public, private, organization
  description: text("description"),
  repositoryUrl: text("repository_url"),
  storageBackend: text("storage_backend"), // S3, GCS, AZURE, LOCAL
  storagePath: text("storage_path"),
  accessCredentials: jsonb("access_credentials").default({}), // Encrypted credentials
  modelCount: integer("model_count").default(0),
  totalSize: integer("total_size").default(0), // Total size in bytes
  tags: jsonb("tags").default([]), // Repository tags
  metadata: jsonb("metadata").default({}), // Additional metadata
  syncStatus: text("sync_status").default("synchronized"), // synchronized, syncing, error
  lastSyncAt: timestamp("last_sync_at"),
  syncConfig: jsonb("sync_config").default({}), // Synchronization configuration
  versioningStrategy: text("versioning_strategy").default("semantic"), // semantic, timestamp, hash
  retentionPolicy: jsonb("retention_policy").default({}), // Model retention rules
  backupConfig: jsonb("backup_config").default({}), // Backup configuration
  accessLog: jsonb("access_log").default([]), // Access tracking
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Performance Metrics - Model and system performance tracking
export const performanceMetrics = pgTable("performance_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metricName: text("metric_name").notNull(),
  metricType: text("metric_type").notNull(), // ACCURACY, LATENCY, THROUGHPUT, COST, RESOURCE_UTILIZATION
  category: text("category").notNull(), // TRAINING, INFERENCE, DEPLOYMENT, SYSTEM
  targetEntityId: varchar("target_entity_id").notNull(), // ID of model, deployment, or job
  targetEntityType: text("target_entity_type").notNull(), // MODEL, DEPLOYMENT, TRAINING_JOB, AGENT_FAMILY
  metricValue: real("metric_value").notNull(),
  metricUnit: text("metric_unit"), // seconds, tokens/sec, accuracy%, cost/request
  benchmarkName: text("benchmark_name"), // MMLU, HellaSwag, HumanEval, etc.
  testDataset: text("test_dataset"), // Dataset used for evaluation
  evaluationContext: jsonb("evaluation_context").default({}), // Evaluation parameters
  comparisonBaseline: real("comparison_baseline"), // Baseline for comparison
  percentileRank: real("percentile_rank"), // Performance percentile
  confidenceInterval: jsonb("confidence_interval").default({}), // Statistical confidence
  aggregationPeriod: text("aggregation_period"), // hour, day, week, month
  tags: jsonb("tags").default([]), // Metric tags
  metadata: jsonb("metadata").default({}), // Additional metric data
  isLatest: boolean("is_latest").default(true), // Latest metric for this entity
  collectedAt: timestamp("collected_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cognitive Architectures - High-level cognitive system designs
export const cognitiveArchitectures = pgTable("cognitive_architectures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  architectureName: text("architecture_name").notNull(),
  architectureType: text("architecture_type").notNull(), // TRANSFORMER_BASED, SYMBOLIC_HYBRID, MULTI_AGENT, NEURO_SYMBOLIC
  paradigm: text("paradigm").notNull(), // REACTIVE, DELIBERATIVE, HYBRID, LAYERED
  description: text("description").notNull(),
  components: jsonb("components").notNull(), // Architecture components
  dataFlow: jsonb("data_flow").notNull(), // Information flow patterns
  controlFlow: jsonb("control_flow").notNull(), // Control and coordination
  memoryArchitecture: jsonb("memory_architecture").default({}), // Memory management
  reasoningComponents: jsonb("reasoning_components").default([]), // Reasoning modules
  learningMechanisms: jsonb("learning_mechanisms").default([]), // Learning algorithms
  adaptationStrategies: jsonb("adaptation_strategies").default([]), // Self-adaptation
  emergentCapabilities: jsonb("emergent_capabilities").default([]), // Emergent behaviors
  scalabilityProfile: jsonb("scalability_profile").default({}), // Scaling characteristics
  performanceCharacteristics: jsonb("performance_characteristics").default({}), // Performance profile
  limitationsAndConstraints: jsonb("limitations_and_constraints").default([]), // Known limitations
  designPrinciples: jsonb("design_principles").default([]), // Guiding principles
  implementationPatterns: jsonb("implementation_patterns").default([]), // Implementation guidelines
  validationMethods: jsonb("validation_methods").default([]), // Validation approaches
  version: text("version").notNull().default("1.0.0"),
  isActive: boolean("is_active").default(true),
  designedBy: varchar("designed_by").notNull(),
  approvedBy: varchar("approved_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// SophieModels™ Constants
export const ModelTypes = {
  SYMBOLIC: "SYMBOLIC",
  NEURAL: "NEURAL", 
  EVOLUTIONARY: "EVOLUTIONARY",
  QUANTUM: "QUANTUM",
  HYBRID: "HYBRID"
} as const;

export const ModelArchitectures = {
  TRANSFORMER: "TRANSFORMER",
  CNN: "CNN",
  RNN: "RNN",
  GNN: "GNN",
  SYMBOLIC_LOGIC: "SYMBOLIC_LOGIC",
  REINFORCEMENT_LEARNING: "REINFORCEMENT_LEARNING",
  EVOLUTIONARY_ALGORITHM: "EVOLUTIONARY_ALGORITHM",
  QUANTUM_CIRCUIT: "QUANTUM_CIRCUIT"
} as const;

export const TrainingTypes = {
  FULL_TRAINING: "FULL_TRAINING",
  FINE_TUNING: "FINE_TUNING",
  LORA_ADAPTATION: "LORA_ADAPTATION",
  RLHF: "RLHF",
  CONSTITUTIONAL_AI: "CONSTITUTIONAL_AI"
} as const;

export const DeploymentTypes = {
  API_ENDPOINT: "API_ENDPOINT",
  BATCH_PROCESSING: "BATCH_PROCESSING",
  EMBEDDED: "EMBEDDED",
  AGENT_INTEGRATION: "AGENT_INTEGRATION",
  REAL_TIME_INFERENCE: "REAL_TIME_INFERENCE"
} as const;

export const AgentFamilyTypes = {
  COGNITIVE_ARCHITECTS: "COGNITIVE_ARCHITECTS",
  DOMAIN_SPECIALISTS: "DOMAIN_SPECIALISTS",
  REASONING_ENGINES: "REASONING_ENGINES",
  ACTION_COORDINATORS: "ACTION_COORDINATORS",
  LEARNING_AGENTS: "LEARNING_AGENTS"
} as const;

export const MetricTypes = {
  ACCURACY: "ACCURACY",
  LATENCY: "LATENCY",
  THROUGHPUT: "THROUGHPUT",
  COST: "COST",
  RESOURCE_UTILIZATION: "RESOURCE_UTILIZATION",
  QUALITY: "QUALITY"
} as const;

// Insert schemas for SophieModels™ module
export const insertAiModelSchema = createInsertSchema(aiModels).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTrainingJobSchema = createInsertSchema(trainingJobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertModelDeploymentSchema = createInsertSchema(modelDeployments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAgentFamilySchema = createInsertSchema(agentFamilies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertModelRepositorySchema = createInsertSchema(modelRepositories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPerformanceMetricSchema = createInsertSchema(performanceMetrics).omit({
  id: true,
  createdAt: true,
});

export const insertCognitiveArchitectureSchema = createInsertSchema(cognitiveArchitectures).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports for SophieModels™ module
export type AiModel = typeof aiModels.$inferSelect;
export type InsertAiModel = z.infer<typeof insertAiModelSchema>;
export type TrainingJob = typeof trainingJobs.$inferSelect;
export type InsertTrainingJob = z.infer<typeof insertTrainingJobSchema>;
export type ModelDeployment = typeof modelDeployments.$inferSelect;
export type InsertModelDeployment = z.infer<typeof insertModelDeploymentSchema>;
export type AgentFamily = typeof agentFamilies.$inferSelect;
export type InsertAgentFamily = z.infer<typeof insertAgentFamilySchema>;
export type ModelRepository = typeof modelRepositories.$inferSelect;
export type InsertModelRepository = z.infer<typeof insertModelRepositorySchema>;
export type PerformanceMetric = typeof performanceMetrics.$inferSelect;
export type InsertPerformanceMetric = z.infer<typeof insertPerformanceMetricSchema>;
export type CognitiveArchitecture = typeof cognitiveArchitectures.$inferSelect;
export type InsertCognitiveArchitecture = z.infer<typeof insertCognitiveArchitectureSchema>;

export type AIModelType = typeof ModelTypes[keyof typeof ModelTypes];
export type ModelArchitecture = typeof ModelArchitectures[keyof typeof ModelArchitectures];
export type TrainingType = typeof TrainingTypes[keyof typeof TrainingTypes];
export type DeploymentType = typeof DeploymentTypes[keyof typeof DeploymentTypes];
export type AgentFamilyType = typeof AgentFamilyTypes[keyof typeof AgentFamilyTypes];
export type MetricType = typeof MetricTypes[keyof typeof MetricTypes];

// =====================================
// SocratIQ EMME™ Module - Partnership Ecosystem
// =====================================

// Strategic Partnerships - Core partnership entities
export const partnerships = pgTable("partnerships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerName: text("partner_name").notNull(),
  partnerType: text("partner_type").notNull(), // STRATEGIC_LICENSING, CO_DEVELOPMENT, CHANNEL_PARTNER, DOMAIN_EXPERT
  partnershipModel: text("partnership_model").notNull(), // BI_DIRECTIONAL_LICENSING, WHITE_LABEL, REVENUE_SHARE, JOINT_VENTURE
  status: text("status").notNull().default("active"), // active, pending, suspended, completed, terminated
  industry: text("industry"), // Target industry vertical
  region: text("region"), // Geographic focus
  contractStartDate: timestamp("contract_start_date"),
  contractEndDate: timestamp("contract_end_date"),
  renewalOptions: jsonb("renewal_options").default({}),
  partnershipTerms: jsonb("partnership_terms").notNull(), // Contract terms and conditions
  revenueModel: jsonb("revenue_model").notNull(), // Revenue sharing structure
  intellectualProperty: jsonb("intellectual_property").default({}), // IP rights and licensing terms
  brandingRights: jsonb("branding_rights").default({}), // White label and co-branding permissions
  supportLevel: text("support_level").default("standard"), // basic, standard, premium, enterprise
  partnerContact: jsonb("partner_contact").notNull(), // Contact information
  socratiqContact: varchar("socratiq_contact").notNull(), // Internal relationship manager
  performanceMetrics: jsonb("performance_metrics").default({}), // KPIs and success metrics
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// EMME Modules - Specific partnership modules (Connect, Engage, Health)
export const emmeModules = pgTable("emme_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnershipId: varchar("partnership_id").notNull().references(() => partnerships.id),
  moduleName: text("module_name").notNull(), // EMME_CONNECT, EMME_ENGAGE, EMME_HEALTH
  moduleType: text("module_type").notNull(), // COMMERCIALIZATION_PLANNING, GO_TO_MARKET_EXECUTION, HEALTH_EQUITY_SPECIALIZATION
  version: text("version").notNull().default("1.0.0"),
  status: text("status").notNull().default("development"), // development, testing, production, maintenance, deprecated
  capabilities: jsonb("capabilities").notNull(), // Core module capabilities and features
  targetMarkets: jsonb("target_markets").default([]), // Target market segments
  pricingModel: jsonb("pricing_model").notNull(), // Pricing structure and tiers
  moduleOwner: text("module_owner").notNull().default("SOCRATIQ"), // SOCRATIQ, PARTNER, JOINT, LICENSED_IN, LICENSED_OUT
  deploymentModel: text("deployment_model").notNull().default("CORE_PLATFORM"), // CORE_PLATFORM, WHITE_LABEL, CO_BRANDED, POWERED_BY
  integrationLevel: text("integration_level").notNull(), // CORE_PLATFORM, BRANDED_DEPLOYMENT, WHITE_LABEL
  customizations: jsonb("customizations").default({}), // Partner-specific customizations
  deploymentConfig: jsonb("deployment_config").notNull(), // Technical deployment configuration
  brandingConfig: jsonb("branding_config").default({}), // Partner branding and UI customization
  accessControls: jsonb("access_controls").notNull(), // Permissions and access management
  dataRequirements: jsonb("data_requirements").default({}), // Data integration requirements
  complianceFrameworks: jsonb("compliance_frameworks").default([]), // Regulatory compliance requirements
  performanceTargets: jsonb("performance_targets").default({}), // Success metrics and KPIs
  documentation: jsonb("documentation").default({}), // Module documentation and resources
  isActive: boolean("is_active").default(true),
  launchDate: timestamp("launch_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Licensing Agreements - Bi-directional licensing framework
export const licensingAgreements = pgTable("licensing_agreements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnershipId: varchar("partnership_id").notNull().references(() => partnerships.id),
  emmeModuleId: varchar("emme_module_id").references(() => emmeModules.id),
  licenseType: text("license_type").notNull(), // INBOUND_LICENSE, OUTBOUND_LICENSE, CROSS_LICENSE
  licensedAsset: text("licensed_asset").notNull(), // What is being licensed
  assetType: text("asset_type").notNull(), // FRAMEWORK, PLATFORM, TECHNOLOGY, METHODOLOGY, BRAND
  licensor: text("licensor").notNull(), // Who is licensing the asset
  licensee: text("licensee").notNull(), // Who is receiving the license
  exclusivity: text("exclusivity").notNull(), // EXCLUSIVE, NON_EXCLUSIVE, LIMITED_EXCLUSIVE
  territory: jsonb("territory").default([]), // Geographic scope
  fieldOfUse: jsonb("field_of_use").default([]), // Industry or application restrictions
  licenseTerms: jsonb("license_terms").notNull(), // Detailed terms and conditions
  royaltyStructure: jsonb("royalty_structure").notNull(), // Payment structure
  minimumCommitments: jsonb("minimum_commitments").default({}), // Minimum revenue or volume commitments
  reportingRequirements: jsonb("reporting_requirements").default({}), // Reporting obligations
  qualityStandards: jsonb("quality_standards").default({}), // Quality and performance standards
  improvementRights: jsonb("improvement_rights").default({}), // Rights to improvements and derivatives
  terminationConditions: jsonb("termination_conditions").default({}), // Termination clauses
  disputeResolution: text("dispute_resolution"), // Dispute resolution mechanism
  governingLaw: text("governing_law"), // Governing jurisdiction
  effectiveDate: timestamp("effective_date").notNull(),
  expirationDate: timestamp("expiration_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Co-Development Projects - Joint development initiatives
export const coDevelopmentProjects = pgTable("co_development_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnershipId: varchar("partnership_id").notNull().references(() => partnerships.id),
  projectName: text("project_name").notNull(),
  projectType: text("project_type").notNull(), // JOINT_PRODUCT, TECHNOLOGY_ENHANCEMENT, MARKET_EXPANSION, INTEGRATION
  description: text("description").notNull(),
  objectives: jsonb("objectives").notNull(), // Project goals and success criteria
  scope: jsonb("scope").notNull(), // Project scope and deliverables
  timeline: jsonb("timeline").notNull(), // Project phases and milestones
  resourceAllocation: jsonb("resource_allocation").notNull(), // Resource commitments from each party
  ipOwnership: jsonb("ip_ownership").notNull(), // Intellectual property ownership structure
  riskAssessment: jsonb("risk_assessment").default({}), // Project risks and mitigation strategies
  governanceStructure: jsonb("governance_structure").notNull(), // Project management and decision-making
  communicationPlan: jsonb("communication_plan").default({}), // Regular communication and reporting
  budgetAllocation: jsonb("budget_allocation").notNull(), // Financial commitments and cost sharing
  qualityAssurance: jsonb("quality_assurance").default({}), // QA processes and standards
  deliverables: jsonb("deliverables").notNull(), // Expected project outputs
  dependencies: jsonb("dependencies").default([]), // External dependencies
  constraints: jsonb("constraints").default([]), // Project constraints and limitations
  status: text("status").notNull().default("planning"), // planning, active, on_hold, completed, cancelled
  progressPercentage: real("progress_percentage").default(0),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  actualCompletionDate: timestamp("actual_completion_date"),
  projectManager: varchar("project_manager").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// NewCo Spin-outs - Partner company spin-out tracking
export const newcoSpinouts = pgTable("newco_spinouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnershipId: varchar("partnership_id").notNull().references(() => partnerships.id),
  newcoName: text("newco_name").notNull(),
  businessModel: text("business_model").notNull(), // B2B_SAAS, B2C_PLATFORM, MARKETPLACE, CONSULTING
  targetMarket: jsonb("target_market").notNull(), // Target customer segments and markets
  valueProposition: text("value_proposition").notNull(),
  competitiveAdvantage: text("competitive_advantage"),
  fundingStage: text("funding_stage").notNull(), // PRE_SEED, SEED, SERIES_A, SERIES_B, GROWTH
  fundingAmount: real("funding_amount"), // Funding raised or target
  valuation: real("valuation"), // Company valuation
  equityStructure: jsonb("equity_structure").notNull(), // Ownership and equity distribution
  boardStructure: jsonb("board_structure").default({}), // Board composition
  managementTeam: jsonb("management_team").notNull(), // Key personnel
  operatingMetrics: jsonb("operating_metrics").default({}), // Key business metrics
  financialProjections: jsonb("financial_projections").default({}), // Revenue and growth projections
  milestonesAchieved: jsonb("milestones_achieved").default([]), // Key milestones reached
  exitStrategy: text("exit_strategy"), // Planned exit approach
  socratiqInvolvement: jsonb("socratiq_involvement").notNull(), // SocratIQ's role and involvement
  platformLicensing: jsonb("platform_licensing").default({}), // Use of SocratIQ platform
  brandingArrangement: text("branding_arrangement"), // POWERED_BY_SOCRATIQ, WHITE_LABEL, CO_BRANDED
  supportServices: jsonb("support_services").default([]), // Services provided by SocratIQ
  performanceMetrics: jsonb("performance_metrics").default({}), // Success metrics and KPIs
  status: text("status").notNull().default("planning"), // planning, incorporation, operating, scaling, exit
  incorporationDate: timestamp("incorporation_date"),
  operatingLaunchDate: timestamp("operating_launch_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Partnership Analytics - Performance tracking and metrics
export const partnershipAnalytics = pgTable("partnership_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnershipId: varchar("partnership_id").notNull().references(() => partnerships.id),
  metricType: text("metric_type").notNull(), // REVENUE, USAGE, GROWTH, SATISFACTION, PERFORMANCE
  metricName: text("metric_name").notNull(),
  metricValue: real("metric_value").notNull(),
  metricUnit: text("metric_unit"), // dollars, users, percentage, etc.
  measurementPeriod: text("measurement_period").notNull(), // DAILY, WEEKLY, MONTHLY, QUARTERLY, ANNUAL
  targetValue: real("target_value"), // Target or benchmark value
  previousValue: real("previous_value"), // Previous period value for comparison
  trendDirection: text("trend_direction"), // UP, DOWN, STABLE
  dataSource: text("data_source").notNull(), // Source of the metric data
  calculationMethod: text("calculation_method"), // How the metric is calculated
  context: jsonb("context").default({}), // Additional context about the measurement
  notes: text("notes"),
  measuredAt: timestamp("measured_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// EMME Questions - Questions for agent processing
export const emmeQuestions = pgTable("emme_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  emmeModuleId: varchar("emme_module_id").references(() => emmeModules.id),
  questionText: text("question_text").notNull(),
  questionType: text("question_type").notNull(), // CLINICAL, REGULATORY, STRATEGIC, OPERATIONAL, RESEARCH
  domain: text("domain").notNull(), // BIOMEDICAL, PHARMACEUTICAL, CLINICAL_TRIAL, MARKET_ACCESS, etc.
  priority: text("priority").default("medium"), // low, medium, high, urgent
  context: text("context"), // Additional context for the question
  expectedResponseType: text("expected_response_type"), // FACTUAL, ANALYTICAL, STRATEGIC, PREDICTIVE
  tags: jsonb("tags").default([]), // Array of tags for categorization
  metadata: jsonb("metadata").default({}), // Additional question metadata
  agentGuidance: jsonb("agent_guidance").default({}), // Specific guidance for agents
  validationChecks: jsonb("validation_checks").default([]), // Required validation checks
  knowledgeRequirements: jsonb("knowledge_requirements").default([]), // Required knowledge areas
  riskLevel: text("risk_level").default("low"), // low, medium, high, critical
  complianceFlags: jsonb("compliance_flags").default([]), // Regulatory compliance considerations
  processingHistory: jsonb("processing_history").default([]), // History of agent processing
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// EMME Question Processing Results
export const emmeQuestionResults = pgTable("emme_question_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  questionId: varchar("question_id").notNull().references(() => emmeQuestions.id),
  agentId: varchar("agent_id"), // ID of the agent that processed the question
  processingTime: integer("processing_time_ms"),
  confidence: real("confidence"),
  responseStrategy: text("response_strategy"),
  extractedEntities: jsonb("extracted_entities").default([]),
  domainClassification: jsonb("domain_classification").default({}),
  qualityMetrics: jsonb("quality_metrics").default({}),
  riskAssessment: jsonb("risk_assessment").default({}),
  recommendedActions: jsonb("recommended_actions").default([]),
  processingMetadata: jsonb("processing_metadata").default({}),
  nlpAnalysis: jsonb("nlp_analysis").default({}),
  meshEnrichment: jsonb("mesh_enrichment").default({}),
  processedAt: timestamp("processed_at").defaultNow(),
});

// EMME Projects - Project information completion and management
export const emmeProjects = pgTable("emme_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectTitle: text("project_title").notNull(),
  client: text("client").notNull(),
  team: text("team").notNull(),
  summary: text("summary").notNull(),
  overview: text("overview"), // Detailed project overview for mock5 team
  scope: text("scope"), // Project scope definition for mock5 team
  status: text("status").default("draft"), // draft, active, completed, on_hold, cancelled
  priority: text("priority").default("medium"), // low, medium, high, critical
  type: text("type").notNull(), // campaign, clinical_trial, regulatory_submission, market_access
  phase: text("phase"), // Phase I, II, III, IV for clinical trials
  therapeuticArea: text("therapeutic_area"), // oncology, cardiology, etc.
  indication: text("indication"), // specific disease/condition
  targetMarkets: jsonb("target_markets").default([]), // Array of markets/regions
  timelineText: text("timeline_text"), // Timeline details for mock5 team input
  timeline: jsonb("timeline").default({}), // Project timeline milestones
  budget: jsonb("budget").default({}), // Budget breakdown
  stakeholders: jsonb("stakeholders").default([]), // Key stakeholders
  documents: jsonb("documents").default([]), // Associated documents
  risks: jsonb("risks").default([]), // Risk assessments
  milestones: jsonb("milestones").default([]), // Project milestones
  tags: jsonb("tags").default([]), // Project tags for categorization
  metadata: jsonb("metadata").default({}), // Additional project metadata
  
  // Strategic Intelligence Integration
  strategicIntelligence: jsonb("strategic_intelligence").default({
    marketAnalysis: {},
    competitorMapping: {},
    payerInsights: {},
    scenarioModeling: {},
    riskAssessment: {},
    launchReadiness: 0
  }),
  
  // Stakeholder Engagement Integration  
  stakeholderEngagement: jsonb("stakeholder_engagement").default({
    hcpTargets: [],
    patientPrograms: [],
    payerRelations: [],
    kolNetwork: [],
    engagementMetrics: {},
    touchpoints: []
  }),
  
  // Content Orchestration Integration
  contentOrchestration: jsonb("content_orchestration").default({
    workflows: [],
    assets: [],
    mlrStatus: {},
    complianceTracking: {},
    multilingualContent: {},
    approvalQueue: []
  }),
  
  createdBy: varchar("created_by").notNull(),
  assignedTo: varchar("assigned_to"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// EMME Constants
export const PartnershipTypes = {
  STRATEGIC_LICENSING: "STRATEGIC_LICENSING",
  CO_DEVELOPMENT: "CO_DEVELOPMENT", 
  CHANNEL_PARTNER: "CHANNEL_PARTNER",
  DOMAIN_EXPERT: "DOMAIN_EXPERT"
} as const;

export const PartnershipModels = {
  BI_DIRECTIONAL_LICENSING: "BI_DIRECTIONAL_LICENSING",
  WHITE_LABEL: "WHITE_LABEL",
  REVENUE_SHARE: "REVENUE_SHARE", 
  JOINT_VENTURE: "JOINT_VENTURE"
} as const;

export const EMMEModuleTypes = {
  COMMERCIALIZATION_PLANNING: "COMMERCIALIZATION_PLANNING",
  GO_TO_MARKET_EXECUTION: "GO_TO_MARKET_EXECUTION",
  HEALTH_EQUITY_SPECIALIZATION: "HEALTH_EQUITY_SPECIALIZATION",
  DOMAIN_SPECIALIZATION: "DOMAIN_SPECIALIZATION",
  COMPETITIVE_INTELLIGENCE: "COMPETITIVE_INTELLIGENCE",
  MARKET_ACCESS_POLICY: "MARKET_ACCESS_POLICY",
  EVIDENCE_GENERATION: "EVIDENCE_GENERATION",
  PRICING_OPTIMIZATION: "PRICING_OPTIMIZATION",
  MA_SUITOR_MAPPING: "MA_SUITOR_MAPPING",
  REGULATORY_PATHWAY: "REGULATORY_PATHWAY",
  REAL_WORLD_EVIDENCE: "REAL_WORLD_EVIDENCE"
} as const;

export const LicenseTypes = {
  INBOUND_LICENSE: "INBOUND_LICENSE",
  OUTBOUND_LICENSE: "OUTBOUND_LICENSE", 
  CROSS_LICENSE: "CROSS_LICENSE"
} as const;

export const NewCoFundingStages = {
  PRE_SEED: "PRE_SEED",
  SEED: "SEED",
  SERIES_A: "SERIES_A",
  SERIES_B: "SERIES_B",
  GROWTH: "GROWTH"
} as const;

// Insert schemas for EMME™ module
export const insertPartnershipSchema = createInsertSchema(partnerships).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmmeModuleSchema = createInsertSchema(emmeModules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLicensingAgreementSchema = createInsertSchema(licensingAgreements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCoDevelopmentProjectSchema = createInsertSchema(coDevelopmentProjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNewcoSpinoutSchema = createInsertSchema(newcoSpinouts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPartnershipAnalyticsSchema = createInsertSchema(partnershipAnalytics).omit({
  id: true,
  createdAt: true,
});

export const insertEmmeQuestionSchema = createInsertSchema(emmeQuestions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmmeQuestionResultSchema = createInsertSchema(emmeQuestionResults).omit({
  id: true,
  processedAt: true,
});

export const insertEmmeProjectSchema = createInsertSchema(emmeProjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastUpdated: true,
});

// Type exports for EMME™ module
export type Partnership = typeof partnerships.$inferSelect;
export type InsertPartnership = z.infer<typeof insertPartnershipSchema>;
export type EmmeModule = typeof emmeModules.$inferSelect;
export type InsertEmmeModule = z.infer<typeof insertEmmeModuleSchema>;
export type LicensingAgreement = typeof licensingAgreements.$inferSelect;
export type InsertLicensingAgreement = z.infer<typeof insertLicensingAgreementSchema>;
export type CoDevelopmentProject = typeof coDevelopmentProjects.$inferSelect;
export type InsertCoDevelopmentProject = z.infer<typeof insertCoDevelopmentProjectSchema>;
export type NewcoSpinout = typeof newcoSpinouts.$inferSelect;
export type InsertNewcoSpinout = z.infer<typeof insertNewcoSpinoutSchema>;
export type EmmeQuestion = typeof emmeQuestions.$inferSelect;
export type InsertEmmeQuestion = z.infer<typeof insertEmmeQuestionSchema>;
export type EmmeQuestionResult = typeof emmeQuestionResults.$inferSelect;
export type InsertEmmeQuestionResult = z.infer<typeof insertEmmeQuestionResultSchema>;
export type EmmeProject = typeof emmeProjects.$inferSelect;
export type InsertEmmeProject = z.infer<typeof insertEmmeProjectSchema>;

// Partner Customers - Track customers of partner organizations
export const partnerCustomers = pgTable("partner_customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnershipId: varchar("partnership_id").notNull().references(() => partnerships.id),
  customerName: text("customer_name").notNull(),
  customerType: text("customer_type").notNull(), // DIRECT, REFERRAL, CO_ACQUIRED, EVOLVED
  industry: text("industry"),
  region: text("region"),
  relationshipType: text("relationship_type").notNull(), // PILOT, CUSTOMER, ENTERPRISE, STRATEGIC
  contractValue: real("contract_value"),
  annualRecurringRevenue: real("annual_recurring_revenue"),
  moduleUsage: jsonb("module_usage").default([]), // Array of modules they use
  evolutionStage: text("evolution_stage").default("CUSTOMER"), // PROSPECT, PILOT, CUSTOMER, PARTNER_CANDIDATE, EVOLVED_PARTNER
  evolutionHistory: jsonb("evolution_history").default([]), // Track progression over time
  partnerContactId: varchar("partner_contact_id"),
  socratiqContactId: varchar("socratiq_contact_id"),
  status: text("status").default("active"), // active, inactive, churned, evolved
  onboardingDate: timestamp("onboarding_date"),
  lastActivityDate: timestamp("last_activity_date"),
  notes: text("notes"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer Evolution Tracking - Track customer to partner evolution
export const customerEvolutionTracking = pgTable("customer_evolution_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalCustomerId: varchar("original_customer_id"), // Reference to initial customer record
  partnerCustomerId: varchar("partner_customer_id").references(() => partnerCustomers.id),
  evolutionPath: text("evolution_path").notNull(), // CUSTOMER_TO_PARTNER, PILOT_TO_NEWCO, STRATEGIC_TO_JOINT_VENTURE
  triggerEvent: text("trigger_event"), // What caused the evolution
  timelineEvents: jsonb("timeline_events").default([]), // Chronological progression
  businessCaseMetrics: jsonb("business_case_metrics").default({}), // ROI, success metrics
  stakeholders: jsonb("stakeholders").default([]), // People involved in evolution
  newPartnershipId: varchar("new_partnership_id").references(() => partnerships.id),
  newCoSpinoutId: varchar("newco_spinout_id").references(() => newcoSpinouts.id),
  evolutionStartDate: timestamp("evolution_start_date"),
  evolutionCompletedDate: timestamp("evolution_completed_date"),
  status: text("status").default("in_progress"), // in_progress, completed, stalled, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export type PartnershipAnalytics = typeof partnershipAnalytics.$inferSelect;
export type InsertPartnershipAnalytics = z.infer<typeof insertPartnershipAnalyticsSchema>;

// Insert schemas for enhanced partnership ecosystem
export const insertPartnerCustomerSchema = createInsertSchema(partnerCustomers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCustomerEvolutionTrackingSchema = createInsertSchema(customerEvolutionTracking).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type PartnerCustomer = typeof partnerCustomers.$inferSelect;
export type InsertPartnerCustomer = z.infer<typeof insertPartnerCustomerSchema>;
export type CustomerEvolutionTracking = typeof customerEvolutionTracking.$inferSelect;
export type InsertCustomerEvolutionTracking = z.infer<typeof insertCustomerEvolutionTrackingSchema>;

// Module ownership and deployment constants
export const ModuleOwnership = {
  SOCRATIQ: "SOCRATIQ",
  PARTNER: "PARTNER", 
  JOINT: "JOINT",
  LICENSED_IN: "LICENSED_IN", // SocratIQ licenses from partner
  LICENSED_OUT: "LICENSED_OUT", // SocratIQ licenses to partner
} as const;

export const DeploymentModels = {
  CORE_PLATFORM: "CORE_PLATFORM", // Integrated into SocratIQ platform
  WHITE_LABEL: "WHITE_LABEL", // Partner branded, no SocratIQ branding
  CO_BRANDED: "CO_BRANDED", // Both SocratIQ and partner branding
  POWERED_BY: "POWERED_BY", // Partner branded with "Powered by SocratIQ"
} as const;

export const CustomerEvolutionStages = {
  PROSPECT: "PROSPECT",
  PILOT: "PILOT",
  CUSTOMER: "CUSTOMER",
  STRATEGIC_CUSTOMER: "STRATEGIC_CUSTOMER", 
  PARTNER_CANDIDATE: "PARTNER_CANDIDATE",
  EVOLVED_PARTNER: "EVOLVED_PARTNER",
  NEWCO_FOUNDER: "NEWCO_FOUNDER"
} as const;

export const PartnerCustomerTypes = {
  DIRECT: "DIRECT", // Partner's own customer
  REFERRAL: "REFERRAL", // Referred by SocratIQ
  CO_ACQUIRED: "CO_ACQUIRED", // Jointly acquired
  EVOLVED: "EVOLVED", // Evolved from SocratIQ customer
} as const;

export type ModuleOwnershipType = typeof ModuleOwnership[keyof typeof ModuleOwnership];
export type DeploymentModelType = typeof DeploymentModels[keyof typeof DeploymentModels];
export type CustomerEvolutionStageType = typeof CustomerEvolutionStages[keyof typeof CustomerEvolutionStages];
export type PartnerCustomerType = typeof PartnerCustomerTypes[keyof typeof PartnerCustomerTypes];

export type PartnershipType = typeof PartnershipTypes[keyof typeof PartnershipTypes];
export type PartnershipModel = typeof PartnershipModels[keyof typeof PartnershipModels];
export type EMMEModuleType = typeof EMMEModuleTypes[keyof typeof EMMEModuleTypes];
export type LicenseType = typeof LicenseTypes[keyof typeof LicenseTypes];
export type NewCoFundingStage = typeof NewCoFundingStages[keyof typeof NewCoFundingStages];
