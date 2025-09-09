-- Initialize database with required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- Create indexes for better performance
-- These will be created by TypeORM, but we can prepare the database
