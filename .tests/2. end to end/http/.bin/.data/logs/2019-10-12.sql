-- 1570868128965
DROP DATABASE IF EXISTS mysql_proxy_test;
-- 1570868128967
CREATE DATABASE IF NOT EXISTS mysql_proxy_test;
-- 1570868128967
CREATE TABLE table_1 ( id MEDIUMINT NOT NULL AUTO_INCREMENT, field_1 VARCHAR(255), field_2 VARCHAR(255), field_3 VARCHAR(255), PRIMARY KEY (id) );
-- 1570868131538
INSERT INTO table_1 (field_1, field_2, field_3) VALUES ("foo", "bar", "baz");
-- 1570868133289
-- INSERT into table_1 (field_1, field_2, field_3) SELECT "foo" as ENCRYPT_001, "bar" as ENCRYPT_002, "baz" as ENCRYPT_003;
INSERT into table_1 (field_1, field_2, field_3) SELECT "rEaqocFLxO2K0V13lweg4Q==" as ENCRYPT_001, "QgLALzZQeE+nSjMfoZkoJQ==" as ENCRYPT_002, "58WZ9otn/F98C4UfZPubrQ==" as ENCRYPT_003;
