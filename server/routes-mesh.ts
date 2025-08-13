import express from "express";
import { storage } from "./storage";

const router = express.Router();

// SocratIQ Mesh - Knowledge Graph API Routes

// Graph Nodes
router.get("/graph/nodes", async (req, res) => {
  try {
    const nodes = await storage.getAllGraphNodes();
    res.json(nodes);
  } catch (error) {
    console.error("Error fetching graph nodes:", error);
    res.status(500).json({ error: "Failed to fetch graph nodes" });
  }
});

// Graph Relationships  
router.get("/graph/relationships", async (req, res) => {
  try {
    const relationships = await storage.getAllGraphRelationships();
    res.json(relationships);
  } catch (error) {
    console.error("Error fetching graph relationships:", error);
    res.status(500).json({ error: "Failed to fetch graph relationships" });
  }
});

// Graph Metrics
router.get("/graph/metrics", async (req, res) => {
  try {
    const metrics = await storage.getGraphMetrics();
    res.json(metrics);
  } catch (error) {
    console.error("Error fetching graph metrics:", error);
    res.status(500).json({ error: "Failed to fetch graph metrics" });
  }
});

// Build graph from entities
router.post("/graph/build", async (req, res) => {
  try {
    const { documentId } = req.body;
    const result = await storage.buildGraphFromEntities(documentId);
    res.json({
      message: `Built graph with ${result.nodes.length} nodes and ${result.relationships.length} relationships`,
      ...result
    });
  } catch (error) {
    console.error("Error building graph:", error);
    res.status(500).json({ error: "Failed to build graph" });
  }
});

// Graph status  
router.get("/graph/status", async (req, res) => {
  try {
    const metrics = await storage.getGraphMetrics();
    
    res.json({
      status: "ready",
      ...metrics,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching graph status:", error);
    res.status(500).json({ error: "Failed to fetch graph status" });
  }
});

export default router;