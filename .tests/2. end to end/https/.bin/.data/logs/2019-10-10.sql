-- 1570704837397
DROP DATABASE IF EXISTS mysql_proxy_test;
-- 1570704837398
CREATE DATABASE IF NOT EXISTS mysql_proxy_test;
-- 1570704837399
CREATE TABLE table_1 ( id MEDIUMINT NOT NULL AUTO_INCREMENT, field_1 VARCHAR(255), field_2 VARCHAR(255), field_3 VARCHAR(255), PRIMARY KEY (id) );
-- 1570704839863
INSERT INTO table_1 (field_1, field_2, field_3) VALUES ("foo", "bar", "baz");
-- 1570704842555
-- INSERT into table_1 (field_1, field_2, field_3) SELECT "foo" as ENCRYPT_001, "bar" as ENCRYPT_002, "baz" as ENCRYPT_003;
INSERT into table_1 (field_1, field_2, field_3) SELECT "KyMAsJM4bC7A6TirK9czZA==" as ENCRYPT_001, "uh1tSQO1kM1O4YuWvmLgUQ==" as ENCRYPT_002, "qbLtkmePnT/yb5mgYFhjZQ==" as ENCRYPT_003;
