-- 1570773754823
DROP DATABASE IF EXISTS mysql_proxy_test
-- 1570773754828
CREATE DATABASE IF NOT EXISTS mysql_proxy_test
-- 1570773754842
CREATE TABLE table_1 (
  id MEDIUMINT NOT NULL AUTO_INCREMENT,
  field_1 VARCHAR(255),
  field_2 VARCHAR(255),
  field_3 VARCHAR(255),
  PRIMARY KEY (id)
)
-- 1570773756574
INSERT INTO table_1 (field_1, field_2, field_3) VALUES ("foo", "bar", "baz")
-- 1570773758166
-- INSERT into table_1 (field_1, field_2, field_3) SELECT "foo" as ENCRYPT_001, "bar" as ENCRYPT_002, "baz" as ENCRYPT_003
INSERT into table_1 (field_1, field_2, field_3) SELECT "cpfq9mIKFNtkc2yLfc2rCQ==" as ENCRYPT_001, "EpDMzUB0c88RimqMGDlX9w==" as ENCRYPT_002, "nfgZowCSCRF+k+K+jzt67Q==" as ENCRYPT_003
-- 1570773832703
DROP DATABASE IF EXISTS mysql_proxy_test
-- 1570773832704
CREATE DATABASE IF NOT EXISTS mysql_proxy_test
-- 1570773832706
CREATE TABLE mysql_proxy_test.table_1 (
  id MEDIUMINT NOT NULL AUTO_INCREMENT,
  field_1 VARCHAR(255),
  field_2 VARCHAR(255),
  field_3 VARCHAR(255),
  PRIMARY KEY (id)
)
-- 1570773834043
INSERT INTO mysql_proxy_test.table_1 (field_1, field_2, field_3) VALUES ("foo", "bar", "baz")
-- 1570773835515
-- INSERT into mysql_proxy_test.table_1 (field_1, field_2, field_3) SELECT "foo" as ENCRYPT_001, "bar" as ENCRYPT_002, "baz" as ENCRYPT_003
INSERT into mysql_proxy_test.table_1 (field_1, field_2, field_3) SELECT "cpfq9mIKFNtkc2yLfc2rCQ==" as ENCRYPT_001, "EpDMzUB0c88RimqMGDlX9w==" as ENCRYPT_002, "nfgZowCSCRF+k+K+jzt67Q==" as ENCRYPT_003
