import { Router } from 'express';
import { 
  insertCorpusSchema,
  insertCorpusDocumentSchema,
  insertCorpusFederationSchema,
  insertContextMemorySchema,
  insertSemanticLinkSchema,
  insertTraceUnitSchema,
  insertOntologyAlignmentSchema,
  CorpusTypes,
  MemoryTypes,
  LinkTypes,
  AlignmentTypes
} from '@shared/schema';
import { z } from 'zod';
import { randomUUID } from 'crypto';

const router = Router();

// =====================================
// SocratIQ Corpus Construction & Federation API Routes
// =====================================

// Mock data stores for corpus construction (in production, use database)
const mockCorpora: any[] = [];
const mockCorpusDocuments: any[] = [];
const mockCorpusFederations: any[] = [];
const mockContextMemories: any[] = [];
const mockSemanticLinks: any[] = [];
const mockTraceUnits: any[] = [];
const mockOntologyAlignments: any[] = [];

// Corpus Management Routes
router.get('/corpora', async (req, res) => {
  try {
    const { type, module, isActive } = req.query;
    let corpora = [...mockCorpora];

    if (type) corpora = corpora.filter(c => c.type === type);
    if (module) corpora = corpora.filter(c => c.module === module);
    if (isActive !== undefined) corpora = corpora.filter(c => c.isActive === (isActive === 'true'));

    res.json(corpora);
  } catch (error) {
    console.error('Get corpora error:', error);
    res.status(500).json({ error: 'Failed to retrieve corpora' });
  }
});

router.get('/corpora/:id', async (req, res) => {
  try {
    const corpus = mockCorpora.find(c => c.id === req.params.id);
    if (!corpus) {
      return res.status(404).json({ error: 'Corpus not found' });
    }
    res.json(corpus);
  } catch (error) {
    console.error('Get corpus error:', error);
    res.status(500).json({ error: 'Failed to retrieve corpus' });
  }
});

router.post('/corpora', async (req, res) => {
  try {
    const corpusData = insertCorpusSchema.parse(req.body);
    const corpus = {
      id: randomUUID(),
      ...corpusData,
      isActive: true,
      documentCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockCorpora.push(corpus);
    res.status(201).json({
      message: 'Corpus created successfully',
      corpus
    });
  } catch (error) {
    console.error('Create corpus error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid corpus data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create corpus' });
  }
});

router.put('/corpora/:id', async (req, res) => {
  try {
    const corpusIndex = mockCorpora.findIndex(c => c.id === req.params.id);
    if (corpusIndex === -1) {
      return res.status(404).json({ error: 'Corpus not found' });
    }

    const updates = req.body;
    mockCorpora[corpusIndex] = {
      ...mockCorpora[corpusIndex],
      ...updates,
      updatedAt: new Date()
    };

    res.json({
      message: 'Corpus updated successfully',
      corpus: mockCorpora[corpusIndex]
    });
  } catch (error) {
    console.error('Update corpus error:', error);
    res.status(500).json({ error: 'Failed to update corpus' });
  }
});

router.delete('/corpora/:id', async (req, res) => {
  try {
    const corpusIndex = mockCorpora.findIndex(c => c.id === req.params.id);
    if (corpusIndex === -1) {
      return res.status(404).json({ error: 'Corpus not found' });
    }

    mockCorpora.splice(corpusIndex, 1);
    res.json({ message: 'Corpus deleted successfully' });
  } catch (error) {
    console.error('Delete corpus error:', error);
    res.status(500).json({ error: 'Failed to delete corpus' });
  }
});

// Corpus Document Management Routes
router.get('/corpora/:corpusId/documents', async (req, res) => {
  try {
    const documents = mockCorpusDocuments.filter(d => d.corpusId === req.params.corpusId);
    res.json(documents);
  } catch (error) {
    console.error('Get corpus documents error:', error);
    res.status(500).json({ error: 'Failed to retrieve corpus documents' });
  }
});

router.post('/corpora/:corpusId/documents', async (req, res) => {
  try {
    const documentData = insertCorpusDocumentSchema.parse({
      ...req.body,
      corpusId: req.params.corpusId
    });
    const document = {
      id: randomUUID(),
      ...documentData,
      addedAt: new Date(),
      lastProcessed: new Date()
    };
    
    mockCorpusDocuments.push(document);
    res.status(201).json({
      message: 'Corpus document created successfully',
      document
    });
  } catch (error) {
    console.error('Create corpus document error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid document data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create corpus document' });
  }
});

router.put('/documents/:documentId/enrich', async (req, res) => {
  try {
    const { semanticTags, qualityScore, enrichmentData } = req.body;
    const documentIndex = mockCorpusDocuments.findIndex(d => d.id === req.params.documentId);
    
    if (documentIndex === -1) {
      return res.status(404).json({ error: 'Corpus document not found' });
    }

    mockCorpusDocuments[documentIndex] = {
      ...mockCorpusDocuments[documentIndex],
      semanticTags,
      qualityScore,
      enrichmentData,
      lastProcessed: new Date()
    };

    res.json({ message: 'Document enriched successfully' });
  } catch (error) {
    console.error('Enrich document error:', error);
    res.status(500).json({ error: 'Failed to enrich document' });
  }
});

// Corpus Federation Routes
router.get('/federations', async (req, res) => {
  try {
    const { sourceModule, targetModule, isActive } = req.query;
    let federations = [...mockCorpusFederations];
    
    if (sourceModule) federations = federations.filter(f => f.sourceModule === sourceModule);
    if (targetModule) federations = federations.filter(f => f.targetModule === targetModule);
    if (isActive !== undefined) federations = federations.filter(f => f.isActive === (isActive === 'true'));

    res.json(federations);
  } catch (error) {
    console.error('Get federations error:', error);
    res.status(500).json({ error: 'Failed to retrieve federations' });
  }
});

router.post('/federations', async (req, res) => {
  try {
    const federationData = insertCorpusFederationSchema.parse(req.body);
    const federation = {
      id: randomUUID(),
      ...federationData,
      lastValidated: new Date(),
      validationScore: 0.8,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockCorpusFederations.push(federation);
    res.status(201).json({
      message: 'Corpus federation created successfully',
      federation
    });
  } catch (error) {
    console.error('Create federation error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid federation data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create federation' });
  }
});

router.post('/federations/:id/sync', async (req, res) => {
  try {
    const federationIndex = mockCorpusFederations.findIndex(f => f.id === req.params.id);
    if (federationIndex === -1) {
      return res.status(404).json({ error: 'Federation not found' });
    }

    const result = {
      syncedDocuments: 45,
      newSemanticLinks: 12,
      updatedAlignments: 8,
      processingTime: '2.3s'
    };

    mockCorpusFederations[federationIndex].lastValidated = new Date();
    
    res.json({
      message: 'Federation synchronized successfully',
      result
    });
  } catch (error) {
    console.error('Sync federation error:', error);
    res.status(500).json({ error: 'Failed to sync federation' });
  }
});

// Context Memory Management Routes
router.get('/context-memory', async (req, res) => {
  try {
    const { memoryType, sessionId, isActive } = req.query;
    let memories = [...mockContextMemories];
    
    if (memoryType) memories = memories.filter(m => m.memoryType === memoryType);
    if (sessionId) memories = memories.filter(m => m.sessionId === sessionId);

    res.json(memories);
  } catch (error) {
    console.error('Get context memories error:', error);
    res.status(500).json({ error: 'Failed to retrieve context memories' });
  }
});

router.post('/context-memory', async (req, res) => {
  try {
    const memoryData = insertContextMemorySchema.parse(req.body);
    const memory = {
      id: randomUUID(),
      ...memoryData,
      accessCount: 0,
      lastAccessed: new Date(),
      createdAt: new Date()
    };
    
    mockContextMemories.push(memory);
    res.status(201).json({
      message: 'Context memory created successfully',
      memory
    });
  } catch (error) {
    console.error('Create context memory error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid memory data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create context memory' });
  }
});

router.put('/context-memory/:id/decay', async (req, res) => {
  try {
    const { decayFactor } = req.body;
    const memoryIndex = mockContextMemories.findIndex(m => m.id === req.params.id);
    
    if (memoryIndex === -1) {
      return res.status(404).json({ error: 'Context memory not found' });
    }

    mockContextMemories[memoryIndex].relevanceScore *= (1 - decayFactor);
    mockContextMemories[memoryIndex].lastAccessed = new Date();

    res.json({ message: 'Memory decay applied successfully' });
  } catch (error) {
    console.error('Decay memory error:', error);
    res.status(500).json({ error: 'Failed to decay memory' });
  }
});

// Semantic Linking Routes
router.get('/semantic-links', async (req, res) => {
  try {
    const { linkType, sourceType, targetType, strengthThreshold } = req.query;
    let links = [...mockSemanticLinks];
    
    if (linkType) links = links.filter(l => l.linkType === linkType);
    if (sourceType) links = links.filter(l => l.sourceType === sourceType);
    if (targetType) links = links.filter(l => l.targetType === targetType);
    if (strengthThreshold) links = links.filter(l => l.strength >= parseFloat(strengthThreshold as string));

    res.json(links);
  } catch (error) {
    console.error('Get semantic links error:', error);
    res.status(500).json({ error: 'Failed to retrieve semantic links' });
  }
});

router.post('/semantic-links', async (req, res) => {
  try {
    const linkData = insertSemanticLinkSchema.parse(req.body);
    const link = {
      id: randomUUID(),
      ...linkData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockSemanticLinks.push(link);
    res.status(201).json({
      message: 'Semantic link created successfully',
      link
    });
  } catch (error) {
    console.error('Create semantic link error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid link data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create semantic link' });
  }
});

router.post('/semantic-links/discover', async (req, res) => {
  try {
    const { sourceCorpusId, targetCorpusId, similarityThreshold = 0.7 } = req.body;
    
    // Mock semantic link discovery
    const discoveredLinks = [
      {
        sourceType: 'DOCUMENT',
        sourceId: randomUUID(),
        targetType: 'DOCUMENT', 
        targetId: randomUUID(),
        linkType: 'SEMANTIC_SIMILARITY',
        strength: 0.85,
        confidence: 0.9
      },
      {
        sourceType: 'ENTITY',
        sourceId: randomUUID(),
        targetType: 'ENTITY',
        targetId: randomUUID(),
        linkType: 'ONTOLOGICAL',
        strength: 0.72,
        confidence: 0.8
      }
    ];

    res.json({
      message: 'Semantic link discovery completed',
      discoveredLinks
    });
  } catch (error) {
    console.error('Discover semantic links error:', error);
    res.status(500).json({ error: 'Failed to discover semantic links' });
  }
});

// Corpus Analytics Routes
router.get('/analytics/overview', async (req, res) => {
  try {
    const analytics = {
      totalCorpora: mockCorpora.length,
      activeCorpora: mockCorpora.filter(c => c.isActive).length,
      totalDocuments: mockCorpusDocuments.length,
      totalFederations: mockCorpusFederations.length,
      totalSemanticLinks: mockSemanticLinks.length,
      memoryUtilization: {
        shortTerm: mockContextMemories.filter(m => m.memoryType === 'SHORT_TERM').length,
        working: mockContextMemories.filter(m => m.memoryType === 'WORKING').length,
        episodic: mockContextMemories.filter(m => m.memoryType === 'EPISODIC').length
      },
      corporaByModule: mockCorpora.reduce((acc, c) => {
        acc[c.module] = (acc[c.module] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    res.json(analytics);
  } catch (error) {
    console.error('Get corpus analytics error:', error);
    res.status(500).json({ error: 'Failed to retrieve corpus analytics' });
  }
});

// Cross-Corpus Query Routes
router.post('/query/federated', async (req, res) => {
  try {
    const { query, targetModules, contextId, limitPerModule = 10 } = req.body;
    
    const results = {
      query,
      totalResults: 42,
      resultsByModule: {
        'TRANSFORM': [
          { id: randomUUID(), type: 'DOCUMENT', relevance: 0.95, snippet: 'Related document content...' },
          { id: randomUUID(), type: 'ENTITY', relevance: 0.87, snippet: 'Entity match...' }
        ],
        'BUILD': [
          { id: randomUUID(), type: 'PROJECT', relevance: 0.82, snippet: 'Construction project data...' }
        ]
      },
      processingTime: '145ms',
      contextUsed: contextId
    };

    res.json(results);
  } catch (error) {
    console.error('Federated query error:', error);
    res.status(500).json({ error: 'Failed to execute federated query' });
  }
});

// Corpus Constants Routes
router.get('/constants/corpus-types', (req, res) => {
  res.json(Object.values(CorpusTypes));
});

router.get('/constants/memory-types', (req, res) => {
  res.json(Object.values(MemoryTypes));
});

router.get('/constants/link-types', (req, res) => {
  res.json(Object.values(LinkTypes));
});

router.get('/constants/alignment-types', (req, res) => {
  res.json(Object.values(AlignmentTypes));
});

export default router;