-- SocratIQ Platform Database Setup Script
-- Run this after creating your RDS instance

-- Create database if not exists (for PostgreSQL)
-- Note: Connect to the default 'postgres' database first, then run this

-- Create application database
CREATE DATABASE socratiq_prod;

-- Connect to the new database and create initial admin user
\c socratiq_prod;

-- The Drizzle schema will be automatically created when the app starts
-- But we can create an initial admin user manually

-- Create initial super admin user (run after app deployment)
INSERT INTO users (
    id, 
    email, 
    name, 
    role, 
    permissions,
    created_at,
    updated_at
) VALUES (
    'admin-' || substr(md5(random()::text), 1, 8),
    'admin@yourcompany.com',  -- Replace with your admin email
    'System Administrator',
    'super_admin',
    '{"system_admin": true, "user_management": true, "partner_management": true, "all_modules": true}'::jsonb,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Create demo users for pharmaceutical team
INSERT INTO users (
    id, 
    email, 
    name, 
    role, 
    permissions,
    created_at,
    updated_at
) VALUES 
(
    'demo-analyst-' || substr(md5(random()::text), 1, 8),
    'analyst@yourcompany.com',
    'Pharmaceutical Analyst',
    'analyst',
    '{"emme_access": true, "strategic_intelligence": true, "market_analysis": true}'::jsonb,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'demo-manager-' || substr(md5(random()::text), 1, 8),
    'manager@yourcompany.com',
    'Project Manager',
    'manager',
    '{"emme_access": true, "project_management": true, "team_management": true, "strategic_intelligence": true}'::jsonb,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'demo-executive-' || substr(md5(random()::text), 1, 8),
    'executive@yourcompany.com',
    'Executive Director',
    'executive',
    '{"emme_access": true, "all_modules": true, "executive_dashboard": true, "strategic_intelligence": true}'::jsonb,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Create initial project data for demonstration
-- Note: This will only work after the Drizzle schema is created by the application

-- Verify setup
SELECT 'Database setup completed successfully!' as status;
SELECT 'Users created: ' || count(*) as user_count FROM users;