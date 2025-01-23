CREATE SCHEMA IF NOT EXISTS tigchallenge;

CREATE USER tiguser WITH PASSWORD 'simplepassword';

GRANT ALL PRIVILEGES ON SCHEMA tigchallenge TO tiguser;

CREATE TABLE tigchallenge.URLMapping(
    id SERIAL PRIMARY KEY,
    "shortCode" VARCHAR(7) UNIQUE NOT NULL,
    "originalURL" TEXT UNIQUE NOT NULL   
);

-- Grant privileges on the specific sequence (use only valid privileges: USAGE, SELECT, UPDATE)
GRANT USAGE, SELECT, UPDATE ON SEQUENCE tigchallenge.URLMapping_id_seq TO tiguser;

-- Grant privileges on all sequences in the schema (optional, covers future sequences)
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA tigchallenge TO tiguser;

-- Grant privileges on all tables in the schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA tigchallenge TO tiguser;
