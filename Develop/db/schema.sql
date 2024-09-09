CREATE TABLE category (
  id SERIAL PRIMARY KEY,
  category_name VARCHAR(255) NOT NULL
);

CREATE TABLE product (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 10,
  category_id INTEGER REFERENCES category(id)
);

CREATE TABLE tag (
  id SERIAL PRIMARY KEY,
  tag_name VARCHAR(255)
);

CREATE TABLE product_tag (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES product(id),
  tag_id INTEGER REFERENCES tag(id)
);


