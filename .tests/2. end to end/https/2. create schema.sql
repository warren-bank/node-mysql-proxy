DROP DATABASE IF EXISTS mysql_proxy_test;
CREATE DATABASE IF NOT EXISTS mysql_proxy_test;
USE mysql_proxy_test;

CREATE TABLE table_1 (
  id MEDIUMINT NOT NULL AUTO_INCREMENT,
  field_1 VARCHAR(255),
  field_2 VARCHAR(255),
  field_3 VARCHAR(255),
  PRIMARY KEY (id)
);

SHOW CREATE TABLE table_1;
