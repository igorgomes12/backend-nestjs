CREATE ROLE prisma WITH LOGIN PASSWORD 'igor';
GRANT CONNECT ON DATABASE lideradm TO prisma;
GRANT USAGE ON SCHEMA public TO prisma;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO prisma;