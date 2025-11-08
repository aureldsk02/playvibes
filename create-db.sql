-- Create the database and user
CREATE DATABASE playvibes;
CREATE USER playvibes_user WITH PASSWORD 'dev_password';
GRANT ALL PRIVILEGES ON DATABASE playvibes TO playvibes_user;

-- Connect to the playvibes database and grant schema permissions
\c playvibes;
GRANT ALL ON SCHEMA public TO playvibes_user;