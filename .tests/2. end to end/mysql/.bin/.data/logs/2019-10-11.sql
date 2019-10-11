-- 1570783820458
DROP DATABASE IF EXISTS mysql_proxy_test
-- 1570783820462
CREATE DATABASE IF NOT EXISTS mysql_proxy_test
-- 1570783820470
CREATE TABLE table_1 (
  id MEDIUMINT NOT NULL AUTO_INCREMENT,
  field_1 VARCHAR(255),
  field_2 VARCHAR(255),
  field_3 VARCHAR(255),
  PRIMARY KEY (id)
)
-- 1570783822183
INSERT INTO table_1 (field_1, field_2, field_3) VALUES ("foo", "bar", "baz")
-- 1570783823817
-- INSERT into table_1 (field_1, field_2, field_3) SELECT "foo" as ENCRYPT_001, "bar" as ENCRYPT_002, "baz" as ENCRYPT_003
INSERT into table_1 (field_1, field_2, field_3) SELECT "rEaqocFLxO2K0V13lweg4Q==" as ENCRYPT_001, "QgLALzZQeE+nSjMfoZkoJQ==" as ENCRYPT_002, "58WZ9otn/F98C4UfZPubrQ==" as ENCRYPT_003
-- 1570783846379
DROP DATABASE IF EXISTS mysql_proxy_test
-- 1570783846381
CREATE DATABASE IF NOT EXISTS mysql_proxy_test
-- 1570783846383
CREATE TABLE mysql_proxy_test.table_1 (
  id MEDIUMINT NOT NULL AUTO_INCREMENT,
  field_1 VARCHAR(255),
  field_2 VARCHAR(255),
  field_3 VARCHAR(255),
  PRIMARY KEY (id)
)
-- 1570783847810
INSERT INTO mysql_proxy_test.table_1 (field_1, field_2, field_3) VALUES ("foo", "bar", "baz")
-- 1570783849392
-- INSERT into mysql_proxy_test.table_1 (field_1, field_2, field_3) SELECT "foo" as ENCRYPT_001, "bar" as ENCRYPT_002, "baz" as ENCRYPT_003
INSERT into mysql_proxy_test.table_1 (field_1, field_2, field_3) SELECT "rEaqocFLxO2K0V13lweg4Q==" as ENCRYPT_001, "QgLALzZQeE+nSjMfoZkoJQ==" as ENCRYPT_002, "58WZ9otn/F98C4UfZPubrQ==" as ENCRYPT_003
