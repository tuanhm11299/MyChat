-- Runs once, when the Postgres container is created for the first time.
-- The main database (mychat) is created from POSTGRES_DB in docker-compose.yml;
-- this adds the separate database used by the API end-to-end tests.
CREATE DATABASE mychat_test OWNER mychat;
