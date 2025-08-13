import { Router } from 'express';
import { storage } from './storage';
import { 
  insertUserProfileSchema,
  insertDocumentProfileSchema,
  insertEntityProfileSchema,
  insertSystemProfileSchema,
  ProfileUserRoles,
  ProfileTypes,
  VerificationStatus
} from '@shared/schema';
import { z } from 'zod';

const router = Router();

// =====================================
// SocratIQ Profile™ Module API Routes
// =====================================

// User Profile Management Routes
router.get('/users', async (req, res) => {
  try {
    const { role, isActive } = req.query;
    const profiles = await storage.getUserProfiles({
      role: role as string,
      isActive: isActive === 'true'
    });
    res.json(profiles);
  } catch (error) {
    console.error('Get user profiles error:', error);
    res.status(500).json({ error: 'Failed to retrieve user profiles' });
  }
});

router.get('/users/:userId', async (req, res) => {
  try {
    const profile = await storage.getUserProfileByUserId(req.params.userId);
    if (!profile) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
});

router.post('/users', async (req, res) => {
  try {
    const profileData = insertUserProfileSchema.parse(req.body);
    const profile = await storage.createUserProfile(profileData);
    res.status(201).json({
      message: 'User profile created successfully',
      profile
    });
  } catch (error) {
    console.error('Create user profile error:', error);
    res.status(500).json({ error: 'Failed to create user profile' });
  }
});

router.put('/users/:userId', async (req, res) => {
  try {
    const updateData = insertUserProfileSchema.partial().parse(req.body);
    const profile = await storage.updateUserProfile(req.params.userId, updateData);
    if (!profile) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    res.json({
      message: 'User profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

router.post('/users/:userId/activity', async (req, res) => {
  try {
    const { action, metadata } = req.body;
    await storage.recordUserActivity(req.params.userId, action, metadata);
    res.json({ message: 'Activity recorded successfully' });
  } catch (error) {
    console.error('Record user activity error:', error);
    res.status(500).json({ error: 'Failed to record activity' });
  }
});

// Document Profile Management Routes
router.get('/documents', async (req, res) => {
  try {
    const { qualityThreshold, complexityThreshold } = req.query;
    const profiles = await storage.getDocumentProfiles({
      qualityThreshold: qualityThreshold ? parseFloat(qualityThreshold as string) : undefined,
      complexityThreshold: complexityThreshold ? parseFloat(complexityThreshold as string) : undefined
    });
    res.json(profiles);
  } catch (error) {
    console.error('Get document profiles error:', error);
    res.status(500).json({ error: 'Failed to retrieve document profiles' });
  }
});

router.get('/documents/:documentId', async (req, res) => {
  try {
    const profile = await storage.getDocumentProfile(req.params.documentId);
    if (!profile) {
      return res.status(404).json({ error: 'Document profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Get document profile error:', error);
    res.status(500).json({ error: 'Failed to retrieve document profile' });
  }
});

router.post('/documents', async (req, res) => {
  try {
    const profileData = insertDocumentProfileSchema.parse(req.body);
    const profile = await storage.createDocumentProfile(profileData);
    res.status(201).json({
      message: 'Document profile created successfully',
      profile
    });
  } catch (error) {
    console.error('Create document profile error:', error);
    res.status(500).json({ error: 'Failed to create document profile' });
  }
});

router.put('/documents/:documentId', async (req, res) => {
  try {
    const updateData = insertDocumentProfileSchema.partial().parse(req.body);
    const profile = await storage.updateDocumentProfile(req.params.documentId, updateData);
    if (!profile) {
      return res.status(404).json({ error: 'Document profile not found' });
    }
    res.json({
      message: 'Document profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Update document profile error:', error);
    res.status(500).json({ error: 'Failed to update document profile' });
  }
});

router.post('/documents/:documentId/annotations', async (req, res) => {
  try {
    const { annotation, userId } = req.body;
    await storage.addDocumentAnnotation(req.params.documentId, annotation, userId);
    res.json({ message: 'Annotation added successfully' });
  } catch (error) {
    console.error('Add annotation error:', error);
    res.status(500).json({ error: 'Failed to add annotation' });
  }
});

router.get('/documents/:documentId/related', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const relatedDocs = await storage.getRelatedDocuments(req.params.documentId, parseInt(limit as string));
    res.json(relatedDocs);
  } catch (error) {
    console.error('Get related documents error:', error);
    res.status(500).json({ error: 'Failed to retrieve related documents' });
  }
});

// Entity Profile Management Routes
router.get('/entities', async (req, res) => {
  try {
    const { category, verificationStatus, importanceThreshold } = req.query;
    const profiles = await storage.getEntityProfiles({
      category: category as string,
      verificationStatus: verificationStatus as string,
      importanceThreshold: importanceThreshold ? parseFloat(importanceThreshold as string) : undefined
    });
    res.json(profiles);
  } catch (error) {
    console.error('Get entity profiles error:', error);
    res.status(500).json({ error: 'Failed to retrieve entity profiles' });
  }
});

router.get('/entities/:entityId', async (req, res) => {
  try {
    const profile = await storage.getEntityProfile(req.params.entityId);
    if (!profile) {
      return res.status(404).json({ error: 'Entity profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Get entity profile error:', error);
    res.status(500).json({ error: 'Failed to retrieve entity profile' });
  }
});

router.post('/entities', async (req, res) => {
  try {
    const profileData = insertEntityProfileSchema.parse(req.body);
    const profile = await storage.createEntityProfile(profileData);
    res.status(201).json({
      message: 'Entity profile created successfully',
      profile
    });
  } catch (error) {
    console.error('Create entity profile error:', error);
    res.status(500).json({ error: 'Failed to create entity profile' });
  }
});

router.put('/entities/:entityId', async (req, res) => {
  try {
    const updateData = insertEntityProfileSchema.partial().parse(req.body);
    const profile = await storage.updateEntityProfile(req.params.entityId, updateData);
    if (!profile) {
      return res.status(404).json({ error: 'Entity profile not found' });
    }
    res.json({
      message: 'Entity profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Update entity profile error:', error);
    res.status(500).json({ error: 'Failed to update entity profile' });
  }
});

router.post('/entities/:entityId/verify', async (req, res) => {
  try {
    const { status, verifiedBy, notes } = req.body;
    await storage.verifyEntity(req.params.entityId, status, verifiedBy, notes);
    res.json({ message: 'Entity verification updated successfully' });
  } catch (error) {
    console.error('Verify entity error:', error);
    res.status(500).json({ error: 'Failed to verify entity' });
  }
});

router.get('/entities/:entityId/relationships', async (req, res) => {
  try {
    const relationships = await storage.getEntityRelationships(req.params.entityId);
    res.json(relationships);
  } catch (error) {
    console.error('Get entity relationships error:', error);
    res.status(500).json({ error: 'Failed to retrieve entity relationships' });
  }
});

// System Profile Management Routes
router.get('/system', async (req, res) => {
  try {
    const { type, environment, isActive } = req.query;
    const profiles = await storage.getSystemProfiles({
      type: type as string,
      environment: environment as string,
      isActive: isActive === 'true'
    });
    res.json(profiles);
  } catch (error) {
    console.error('Get system profiles error:', error);
    res.status(500).json({ error: 'Failed to retrieve system profiles' });
  }
});

router.get('/system/:id', async (req, res) => {
  try {
    const profile = await storage.getSystemProfile(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: 'System profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Get system profile error:', error);
    res.status(500).json({ error: 'Failed to retrieve system profile' });
  }
});

router.post('/system', async (req, res) => {
  try {
    const profileData = insertSystemProfileSchema.parse(req.body);
    const profile = await storage.createSystemProfile(profileData);
    res.status(201).json({
      message: 'System profile created successfully',
      profile
    });
  } catch (error) {
    console.error('Create system profile error:', error);
    res.status(500).json({ error: 'Failed to create system profile' });
  }
});

router.put('/system/:id/health', async (req, res) => {
  try {
    const { healthData } = req.body;
    await storage.updateSystemHealth(req.params.id, healthData);
    res.json({ message: 'System health updated successfully' });
  } catch (error) {
    console.error('Update system health error:', error);
    res.status(500).json({ error: 'Failed to update system health' });
  }
});

// Profile Analytics Routes
router.get('/analytics/users', async (req, res) => {
  try {
    const analytics = await storage.getUserAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({ error: 'Failed to retrieve user analytics' });
  }
});

router.get('/analytics/documents', async (req, res) => {
  try {
    const analytics = await storage.getDocumentAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('Get document analytics error:', error);
    res.status(500).json({ error: 'Failed to retrieve document analytics' });
  }
});

router.get('/analytics/entities', async (req, res) => {
  try {
    const analytics = await storage.getEntityAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('Get entity analytics error:', error);
    res.status(500).json({ error: 'Failed to retrieve entity analytics' });
  }
});

// Profile Constants Routes
router.get('/constants/user-roles', (req, res) => {
  res.json(Object.values(UserRoles));
});

router.get('/constants/profile-types', (req, res) => {
  res.json(Object.values(ProfileTypes));
});

router.get('/constants/verification-status', (req, res) => {
  res.json(Object.values(VerificationStatus));
});

export default router;