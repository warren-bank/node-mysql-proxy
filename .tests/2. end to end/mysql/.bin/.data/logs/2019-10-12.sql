-- 1570868355924
DROP DATABASE IF EXISTS mysql_proxy_test
-- 1570868355928
CREATE DATABASE IF NOT EXISTS mysql_proxy_test
-- 1570868355935
CREATE TABLE table_1 (
  id MEDIUMINT NOT NULL AUTO_INCREMENT,
  field_1 VARCHAR(255),
  field_2 VARCHAR(255),
  field_3 VARCHAR(255),
  PRIMARY KEY (id)
)
-- 1570868358247
INSERT INTO table_1 (field_1, field_2, field_3) VALUES ("foo", "bar", "baz")
-- 1570868360170
-- INSERT into table_1 (field_1, field_2, field_3) SELECT "foo" as ENCRYPT_001, "bar" as ENCRYPT_002, "baz" as ENCRYPT_003
INSERT into table_1 (field_1, field_2, field_3) SELECT "rEaqocFLxO2K0V13lweg4Q==" as ENCRYPT_001, "QgLALzZQeE+nSjMfoZkoJQ==" as ENCRYPT_002, "58WZ9otn/F98C4UfZPubrQ==" as ENCRYPT_003
-- 1570868379128
DROP DATABASE IF EXISTS mysql_proxy_test
-- 1570868379131
CREATE DATABASE IF NOT EXISTS mysql_proxy_test
-- 1570868379133
CREATE TABLE mysql_proxy_test.table_1 (
  id MEDIUMINT NOT NULL AUTO_INCREMENT,
  field_1 VARCHAR(255),
  field_2 VARCHAR(255),
  field_3 VARCHAR(255),
  PRIMARY KEY (id)
)
-- 1570868381366
INSERT INTO mysql_proxy_test.table_1 (field_1, field_2, field_3) VALUES ("foo", "bar", "baz")
-- 1570868383522
-- INSERT into mysql_proxy_test.table_1 (field_1, field_2, field_3) SELECT "foo" as ENCRYPT_001, "bar" as ENCRYPT_002, "baz" as ENCRYPT_003
INSERT into mysql_proxy_test.table_1 (field_1, field_2, field_3) SELECT "rEaqocFLxO2K0V13lweg4Q==" as ENCRYPT_001, "QgLALzZQeE+nSjMfoZkoJQ==" as ENCRYPT_002, "58WZ9otn/F98C4UfZPubrQ==" as ENCRYPT_003
