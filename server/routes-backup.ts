import type { Express } from "express";
import { promises as fs } from "fs";
import path from "path";
import archiver from "archiver";

export function registerBackupRoutes(app: Express) {
  // Create complete project zip backup
  app.post("/api/backup/create-zip", async (req, res) => {
    try {
      const { includeAssets = false } = req.body;
      
      // Set response headers for zip download
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="emme-engage-backup-${new Date().toISOString().slice(0, 10)}.zip"`);
      
      // Create archive
      const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level
      });

      // Handle archiver warnings and errors
      archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
          console.warn('Archive warning:', err);
        } else {
          throw err;
        }
      });

      archive.on('error', (err) => {
        throw err;
      });

      // Pipe archive data to response
      archive.pipe(res);

      // Add core project files
      const projectRoot = process.cwd();
      
      // Essential project structure
      const essentialFiles = [
        'package.json',
        'README.md',
        'tsconfig.json',
        'vite.config.ts',
        'tailwind.config.ts',
        'drizzle.config.ts',
        '.env.example'
      ];

      // Add essential files if they exist
      for (const file of essentialFiles) {
        const filePath = path.join(projectRoot, file);
        try {
          await fs.access(filePath);
          archive.file(filePath, { name: file });
        } catch (err) {
          // File doesn't exist, skip it
          console.log(`Skipping ${file} - not found`);
        }
      }

      // Add source directories
      const sourceDirectories = [
        'src',
        'client/src',
        'server',
        'shared',
        'public'
      ];

      for (const dir of sourceDirectories) {
        const dirPath = path.join(projectRoot, dir);
        try {
          await fs.access(dirPath);
          archive.directory(dirPath, dir);
        } catch (err) {
          console.log(`Skipping ${dir} - not found`);
        }
      }

      // Add assets if requested
      if (includeAssets) {
        const assetsPath = path.join(projectRoot, 'attached_assets');
        try {
          await fs.access(assetsPath);
          archive.directory(assetsPath, 'attached_assets');
        } catch (err) {
          console.log('Skipping attached_assets - not found');
        }
      }

      // Add backup instructions
      const instructions = `# EMME Engage Project Backup

## Restoration Instructions

1. Extract this ZIP file to a new directory
2. Install dependencies: \`npm install\`
3. Set up environment variables (copy .env.example to .env and configure)
4. Set up database: \`npm run db:push\`
5. Start the application: \`npm run dev\`

## Project Structure
- \`src/\` - Frontend source code
- \`server/\` - Backend API server
- \`shared/\` - Shared types and schemas
- \`public/\` - Static assets

## Database Schema
The database schema is defined in \`shared/schema.ts\`. Run \`npm run db:push\` to sync the schema to your database.

## Important Notes
- Configure your DATABASE_URL in the .env file
- Set up any required API keys and secrets
- The project uses PostgreSQL database

## Backup Created
Date: ${new Date().toISOString()}
Version: EMME Engage v1.0
`;

      archive.append(instructions, { name: 'RESTORE_INSTRUCTIONS.md' });

      // Create a project info file
      const projectInfo = {
        name: "EMME Engage - Pharmaceutical Partnership Platform",
        version: "1.0.0",
        description: "White-label pharmaceutical intelligence and partnership platform",
        backupDate: new Date().toISOString(),
        components: [
          "Strategic Intelligence Module",
          "Stakeholder Engagement Module", 
          "Content Orchestration Module",
          "Equity Access Module",
          "Data Platform Module",
          "Project Management System"
        ],
        technologies: [
          "React + TypeScript",
          "Node.js + Express",
          "PostgreSQL + Drizzle ORM",
          "TailwindCSS + shadcn/ui",
          "Vite + TanStack Query"
        ]
      };

      archive.append(JSON.stringify(projectInfo, null, 2), { name: 'project-info.json' });

      // Finalize the archive
      await archive.finalize();
      
    } catch (error) {
      console.error("Error creating backup zip:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to create backup zip" });
      }
    }
  });

  // Get backup information
  app.get("/api/backup/info", async (req, res) => {
    try {
      const projectRoot = process.cwd();
      
      // Get project size and file count
      const getDirectorySize = async (dirPath: string): Promise<{ size: number; files: number }> => {
        let totalSize = 0;
        let totalFiles = 0;
        
        try {
          const items = await fs.readdir(dirPath, { withFileTypes: true });
          
          for (const item of items) {
            const fullPath = path.join(dirPath, item.name);
            
            if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
              const { size, files } = await getDirectorySize(fullPath);
              totalSize += size;
              totalFiles += files;
            } else if (item.isFile()) {
              const stats = await fs.stat(fullPath);
              totalSize += stats.size;
              totalFiles += 1;
            }
          }
        } catch (err) {
          // Directory doesn't exist or can't be read
        }
        
        return { size: totalSize, files: totalFiles };
      };

      const sourceDirectories = ['src', 'client/src', 'server', 'shared', 'public'];
      let totalSize = 0;
      let totalFiles = 0;

      for (const dir of sourceDirectories) {
        const { size, files } = await getDirectorySize(path.join(projectRoot, dir));
        totalSize += size;
        totalFiles += files;
      }

      res.json({
        totalFiles,
        totalSizeMB: Math.round(totalSize / 1024 / 1024 * 100) / 100,
        directories: sourceDirectories,
        estimatedBackupSizeMB: Math.round(totalSize * 0.3 / 1024 / 1024 * 100) / 100, // Compressed estimate
        lastUpdate: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error getting backup info:", error);
      res.status(500).json({ error: "Failed to get backup information" });
    }
  });
}