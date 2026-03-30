-- Run this script with a PostgreSQL superuser in psql.
-- Example:
--   sudo -u postgres psql -f src/main/resources/local-postgres-init.sql
-- If you prefer password authentication over TCP:
--   psql -h localhost -U postgres -f src/main/resources/local-postgres-init.sql

DO
$$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_roles
        WHERE rolname = 'aakorea_admin'
    ) THEN
        CREATE ROLE aakorea_admin LOGIN PASSWORD 'aa1935';
    END IF;
END
$$;

SELECT 'CREATE DATABASE aakorea_main OWNER aakorea_admin'
WHERE NOT EXISTS (
    SELECT 1
    FROM pg_database
    WHERE datname = 'aakorea_main'
)
\gexec

SELECT 'CREATE DATABASE aakorea_main_test OWNER aakorea_admin'
WHERE NOT EXISTS (
    SELECT 1
    FROM pg_database
    WHERE datname = 'aakorea_main_test'
)
\gexec

GRANT ALL PRIVILEGES ON DATABASE aakorea_main TO aakorea_admin;
GRANT ALL PRIVILEGES ON DATABASE aakorea_main_test TO aakorea_admin;
