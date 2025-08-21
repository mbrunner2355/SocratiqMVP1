#!/usr/bin/env node

// Simple server to serve the React app
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Serve static files from react-app/dist (after build)
app.use(express.static(path.join(__dirname, 'react-app/dist')));

// Handle React Router routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'react-app/dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 React App Server running on http://0.0.0.0:${PORT}`);
  console.log(`📱 SocratIQ Transform™ with AWS Services Integration`);
  console.log(`🧬 EMME Engage Pharmaceutical Intelligence Platform`);
});