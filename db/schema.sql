\c restaurant_list

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  password_digest VARCHAR NOT NULL
);

DROP TABLE IF EXISTS restaurants CASCADE;

CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  categories VARCHAR(255)
);

DROP TABLE IF EXISTS restaurants_users CASCADE;

CREATE TABLE restaurants_users (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users,
  restaurant_id INTEGER REFERENCES resaturants
)