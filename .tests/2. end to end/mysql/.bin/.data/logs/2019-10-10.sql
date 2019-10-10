-- 1570704654359
DROP DATABASE IF EXISTS mysql_proxy_test
-- 1570704654362
CREATE DATABASE IF NOT EXISTS mysql_proxy_test
-- 1570704654368
CREATE TABLE table_1 (
  id MEDIUMINT NOT NULL AUTO_INCREMENT,
  field_1 VARCHAR(255),
  field_2 VARCHAR(255),
  field_3 VARCHAR(255),
  PRIMARY KEY (id)
)
-- 1570704656085
INSERT INTO table_1 (field_1, field_2, field_3) VALUES ("foo", "bar", "baz")
-- 1570704658349
-- INSERT into table_1 (field_1, field_2, field_3) SELECT "foo" as ENCRYPT_001, "bar" as ENCRYPT_002, "baz" as ENCRYPT_003
INSERT into table_1 (field_1, field_2, field_3) SELECT "3ZFwV+fysnnuhN1k/+wMuQ==" as ENCRYPT_001, "j1zK8yJOd8jFX46fnIRStQ==" as ENCRYPT_002, "9Mvn7gMIZTCtbmkERRmufg==" as ENCRYPT_003
-- 1570704677419
DROP DATABASE IF EXISTS mysql_proxy_test
-- 1570704677423
CREATE DATABASE IF NOT EXISTS mysql_proxy_test
-- 1570704677427
CREATE TABLE mysql_proxy_test.table_1 (
  id MEDIUMINT NOT NULL AUTO_INCREMENT,
  field_1 VARCHAR(255),
  field_2 VARCHAR(255),
  field_3 VARCHAR(255),
  PRIMARY KEY (id)
)
-- 1570704679120
INSERT INTO mysql_proxy_test.table_1 (field_1, field_2, field_3) VALUES ("foo", "bar", "baz")
-- 1570704680662
-- INSERT into mysql_proxy_test.table_1 (field_1, field_2, field_3) SELECT "foo" as ENCRYPT_001, "bar" as ENCRYPT_002, "baz" as ENCRYPT_003
INSERT into mysql_proxy_test.table_1 (field_1, field_2, field_3) SELECT "3ZFwV+fysnnuhN1k/+wMuQ==" as ENCRYPT_001, "j1zK8yJOd8jFX46fnIRStQ==" as ENCRYPT_002, "9Mvn7gMIZTCtbmkERRmufg==" as ENCRYPT_003
