import { randomUUID } from "crypto";
import { 
  type GraphNode, type InsertGraphNode,
  type GraphRelationship, type InsertGraphRelationship,
  type GraphCluster, type InsertGraphCluster,
  type GraphPath, type GraphNeighborhood, type GraphMetrics,
  type GraphPathQuery, type GraphNeighborQuery, type GraphSearchQuery,
  type Entity, NodeTypes, RelationshipTypes
} from "@shared/schema";

// Graph operations for MemStorage
export class GraphStorageMixin {
  protected graphNodes: Map<string, GraphNode>;
  protected graphRelationships: Map<string, GraphRelationship>;
  protected graphClusters: Map<string, GraphCluster>;

  constructor() {
    this.graphNodes = new Map();
    this.graphRelationships = new Map();
    this.graphClusters = new Map();
  }

  // Node operations
  async getGraphNode(id: string): Promise<GraphNode | undefined> {
    return this.graphNodes.get(id);
  }

  async getAllGraphNodes(): Promise<GraphNode[]> {
    return Array.from(this.graphNodes.values()).filter(node => node.isActive);
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
      confidence: insertNode.confidence || 1.0,
      isActive: insertNode.isActive !== false
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
    // Soft delete by setting isActive to false
    const node = this.graphNodes.get(id);
    if (node) {
      node.isActive = false;
      node.updatedAt = new Date();
      // Also deactivate related relationships
      Array.from(this.graphRelationships.values()).forEach(rel => {
        if (rel.fromNodeId === id || rel.toNodeId === id) {
          rel.isActive = false;
          rel.updatedAt = new Date();
        }
      });
    }
  }

  async searchGraphNodes(query: GraphSearchQuery): Promise<GraphNode[]> {
    const nodes = Array.from(this.graphNodes.values())
      .filter(node => node.isActive)
      .filter(node => {
        if (query.nodeTypes && !query.nodeTypes.includes(node.type as any)) {
          return false;
        }
        if (query.minConfidence && node.confidence < query.minConfidence) {
          return false;
        }
        const searchText = `${node.label} ${JSON.stringify(node.properties)}`.toLowerCase();
        return searchText.includes(query.query.toLowerCase());
      })
      .slice(0, query.limit || 50);
    
    return nodes;
  }

  // Relationship operations
  async getGraphRelationship(id: string): Promise<GraphRelationship | undefined> {
    return this.graphRelationships.get(id);
  }

  async getRelationshipsByNode(nodeId: string): Promise<GraphRelationship[]> {
    return Array.from(this.graphRelationships.values())
      .filter(rel => rel.isActive && (rel.fromNodeId === nodeId || rel.toNodeId === nodeId));
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
      strength: insertRel.strength || 1.0,
      confidence: insertRel.confidence || 1.0,
      isActive: insertRel.isActive !== false
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

  // Graph traversal and analysis
  async findShortestPath(query: GraphPathQuery): Promise<GraphPath | null> {
    if (!query.endNodeId) return null;
    
    // Simple BFS for shortest path
    const visited = new Set<string>();
    const queue: Array<{
      nodeId: string;
      path: GraphNode[];
      relationships: GraphRelationship[];
      totalStrength: number;
    }> = [];
    
    const startNode = this.graphNodes.get(query.startNodeId);
    if (!startNode) return null;
    
    queue.push({
      nodeId: query.startNodeId,
      path: [startNode],
      relationships: [],
      totalStrength: 0
    });

    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (current.nodeId === query.endNodeId) {
        return {
          nodes: current.path,
          relationships: current.relationships,
          totalStrength: current.totalStrength,
          avgConfidence: current.path.reduce((sum, n) => sum + n.confidence, 0) / current.path.length
        };
      }

      if (visited.has(current.nodeId) || current.path.length >= (query.maxDepth || 5)) {
        continue;
      }

      visited.add(current.nodeId);

      // Find connected nodes
      const connections = Array.from(this.graphRelationships.values())
        .filter(rel => rel.isActive && rel.fromNodeId === current.nodeId)
        .filter(rel => !query.relationshipTypes || query.relationshipTypes.includes(rel.relationshipType as any))
        .filter(rel => !query.minConfidence || rel.confidence >= query.minConfidence);

      for (const rel of connections) {
        const nextNode = this.graphNodes.get(rel.toNodeId);
        if (nextNode && nextNode.isActive && !visited.has(rel.toNodeId)) {
          queue.push({
            nodeId: rel.toNodeId,
            path: [...current.path, nextNode],
            relationships: [...current.relationships, rel],
            totalStrength: current.totalStrength + rel.strength
          });
        }
      }
    }

    return null;
  }

  async getNeighborhood(query: GraphNeighborQuery): Promise<GraphNeighborhood> {
    const centerNode = this.graphNodes.get(query.nodeId);
    if (!centerNode) {
      throw new Error(`Node ${query.nodeId} not found`);
    }

    const neighbors: Array<{
      node: GraphNode;
      relationship: GraphRelationship;
      distance: number;
    }> = [];

    // Get direct neighbors
    const relationships = await this.getRelationshipsByNode(query.nodeId);
    
    for (const rel of relationships) {
      if (query.relationshipTypes && !query.relationshipTypes.includes(rel.relationshipType as any)) {
        continue;
      }
      if (query.minStrength && rel.strength < query.minStrength) {
        continue;
      }

      const neighborId = rel.fromNodeId === query.nodeId ? rel.toNodeId : rel.fromNodeId;
      const neighbor = this.graphNodes.get(neighborId);
      
      if (neighbor && neighbor.isActive) {
        if (!query.nodeTypes || query.nodeTypes.includes(neighbor.type as any)) {
          neighbors.push({
            node: neighbor,
            relationship: rel,
            distance: 1
          });
        }
      }
    }

    return {
      centerNode,
      neighbors: neighbors.slice(0, 100) // Limit results
    };
  }

  async getGraphMetrics(): Promise<GraphMetrics> {
    const activeNodes = Array.from(this.graphNodes.values()).filter(n => n.isActive);
    const activeRels = Array.from(this.graphRelationships.values()).filter(r => r.isActive);
    
    // Calculate node degrees
    const degrees = new Map<string, number>();
    activeRels.forEach(rel => {
      degrees.set(rel.fromNodeId, (degrees.get(rel.fromNodeId) || 0) + 1);
      degrees.set(rel.toNodeId, (degrees.get(rel.toNodeId) || 0) + 1);
    });

    const avgDegree = activeNodes.length > 0 
      ? Array.from(degrees.values()).reduce((sum, deg) => sum + deg, 0) / activeNodes.length 
      : 0;

    const density = activeNodes.length > 1 
      ? (2 * activeRels.length) / (activeNodes.length * (activeNodes.length - 1))
      : 0;

    const topEntities = activeNodes
      .map(node => ({
        node,
        degree: degrees.get(node.id) || 0,
        centrality: ((degrees.get(node.id) || 0) / Math.max(activeNodes.length - 1, 1)) // Simple degree centrality
      }))
      .sort((a, b) => b.degree - a.degree)
      .slice(0, 10);

    return {
      totalNodes: activeNodes.length,
      totalRelationships: activeRels.length,
      avgDegree: Math.round(avgDegree * 100) / 100,
      density: Math.round(density * 1000) / 1000,
      clusters: this.graphClusters.size,
      topEntities
    };
  }

  // Clustering operations
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

  // Graph building from entities
  async buildGraphFromEntities(entities: Entity[]): Promise<{ nodes: GraphNode[]; relationships: GraphRelationship[] }> {
    const nodes: GraphNode[] = [];
    const relationships: GraphRelationship[] = [];

    // Create nodes from entities
    for (const entity of entities) {
      const node = await this.createGraphNode({
        label: entity.value,
        type: NodeTypes.ENTITY,
        entityId: entity.id,
        properties: {
          entityType: entity.type,
          originalContext: entity.context,
          ...entity.metadata as any
        },
        confidence: entity.confidence
      });
      nodes.push(node);
    }

    // Create relationships between entities in the same document
    const entitiesByDoc = new Map<string, Entity[]>();
    entities.forEach(entity => {
      if (!entitiesByDoc.has(entity.documentId)) {
        entitiesByDoc.set(entity.documentId, []);
      }
      entitiesByDoc.get(entity.documentId)!.push(entity);
    });

    // For each document, create co-occurrence relationships
    for (const [docId, docEntities] of entitiesByDoc) {
      for (let i = 0; i < docEntities.length; i++) {
        for (let j = i + 1; j < docEntities.length; j++) {
          const entity1 = docEntities[i];
          const entity2 = docEntities[j];
          
          const node1 = nodes.find(n => n.entityId === entity1.id);
          const node2 = nodes.find(n => n.entityId === entity2.id);
          
          if (node1 && node2) {
            const relationship = await this.createGraphRelationship({
              fromNodeId: node1.id,
              toNodeId: node2.id,
              relationshipType: RelationshipTypes.RELATED_TO,
              strength: 0.5, // Co-occurrence strength
              confidence: Math.min(entity1.confidence, entity2.confidence),
              properties: {
                coOccurrence: true,
                sourceDocument: docId
              },
              sourceDocumentId: docId,
              inferenceReason: "Entity co-occurrence in same document"
            });
            relationships.push(relationship);
          }
        }
      }
    }

    return { nodes, relationships };
  }
}