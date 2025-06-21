-- Initialize all databases for Hope Harvest microservices
-- This script runs automatically when PostgreSQL container starts

-- Create the three databases first
CREATE DATABASE "User_Authentication";
CREATE DATABASE "Donation_Payment";
CREATE DATABASE "Event_Volunteer";

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE "User_Authentication" TO postgres;
GRANT ALL PRIVILEGES ON DATABASE "Donation_Payment" TO postgres;
GRANT ALL PRIVILEGES ON DATABASE "Event_Volunteer" TO postgres;

-- Switch to User_Authentication and run schema/data
\c "User_Authentication"
\i /docker-entrypoint-initdb.d/02-user-dump.sql

-- Switch to Donation_Payment and run schema/data  
\c "Donation_Payment"
\i /docker-entrypoint-initdb.d/03-donation-dump.sql

-- Switch to Event_Volunteer and run schema/data
\c "Event_Volunteer"
\i /docker-entrypoint-initdb.d/04-event-dump.sql

\echo 'All databases created and populated successfully!';
