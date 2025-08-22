import { Router } from 'express';
import { db } from './db';
import { userDataSync } from '../shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Simple complete data backup - everything you need for AWS deployment
router.post('/backup-all-data', async (req, res) => {
  try {
    const { userId = 'anonymous', browserData } = req.body;
    
    // Store complete browser state using existing schema
    await db.insert(userDataSync).values({
      userId,
      dataType: 'complete_backup',
      dataKey: `backup_${Date.now()}`,
      dataValue: browserData,
      deviceId: req.headers['user-agent']?.slice(0, 100),
      browserInfo: req.headers['user-agent']?.slice(0, 255)
    }).onConflictDoUpdate({
      target: [userDataSync.userId, userDataSync.dataType],
      set: {
        dataValue: browserData,
        lastSynced: new Date(),
      }
    });

    res.json({ 
      success: true, 
      message: 'Complete data backed up for AWS deployment'
    });
  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).json({ error: 'Backup failed' });
  }
});

// Restore data when logging in from new device/AWS
router.get('/restore-all-data/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await db.select()
      .from(userDataSync)
      .where(eq(userDataSync.userId, userId))
      .orderBy(userDataSync.lastSynced)
      .limit(1);

    if (result.length > 0) {
      res.json({ 
        success: true, 
        data: result[0].dataValue,
        message: 'Data restored successfully'
      });
    } else {
      res.json({ 
        success: false, 
        message: 'No backup found for this user'
      });
    }
  } catch (error) {
    console.error('Restore error:', error);
    res.status(500).json({ error: 'Restore failed' });
  }
});

export default router;