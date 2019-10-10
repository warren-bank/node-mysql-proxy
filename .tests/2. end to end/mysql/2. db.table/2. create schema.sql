DROP DATABASE IF EXISTS mysql_proxy_test;
CREATE DATABASE IF NOT EXISTS mysql_proxy_test;

CREATE TABLE mysql_proxy_test.table_1 (
  id MEDIUMINT NOT NULL AUTO_INCREMENT,
  field_1 VARCHAR(255),
  field_2 VARCHAR(255),
  field_3 VARCHAR(255),
  PRIMARY KEY (id)
);

SHOW CREATE TABLE mysql_proxy_test.table_1;
