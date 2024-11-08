CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TABLE IF EXISTS users;
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE users (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL, 
    forname VARCHAR(50) NOT NULL, 
    password VARCHAR(100) NOT NULL,  
    location GEOMETRY(Point, 4326) NOT NULL,  
    work_location GEOMETRY(Point, 4326) NOT NULL, 
    phone_number VARCHAR(25) NOT NULL, 
    age INTEGER NOT NULL
);