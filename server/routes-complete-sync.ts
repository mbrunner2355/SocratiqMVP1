import { Router } from 'express';
import { db } from './db';

const router = Router();

// Simple complete data backup - everything you need for AWS deployment
router.post('/backup-all-data', async (req, res) => {
  try {
    const { userId = 'anonymous', browserData } = req.body;
    
    // Store complete browser state in database for AWS deployment
    const backupRecord = {
      id: `backup_${Date.now()}`,
      user_id: userId,
      backup_data: JSON.stringify(browserData),
      created_at: new Date().toISOString(),
      backup_type: 'complete_browser_state'
    };

    // Simple storage approach - store as JSON in database
    await db.query(
      `INSERT INTO user_backups (id, user_id, backup_data, created_at, backup_type) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (user_id) DO UPDATE SET 
       backup_data = $3, created_at = $4`,
      [backupRecord.id, userId, backupRecord.backup_data, backupRecord.created_at, backupRecord.backup_type]
    );

    res.json({ 
      success: true, 
      message: 'Complete data backed up for AWS deployment',
      backupId: backupRecord.id
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
    
    const result = await db.query(
      'SELECT backup_data FROM user_backups WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    if (result.rows.length > 0) {
      const restoredData = JSON.parse(result.rows[0].backup_data);
      res.json({ 
        success: true, 
        data: restoredData,
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