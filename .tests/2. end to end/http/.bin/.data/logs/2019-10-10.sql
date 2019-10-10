-- 1570704965048
DROP DATABASE IF EXISTS mysql_proxy_test;
-- 1570704965050
CREATE DATABASE IF NOT EXISTS mysql_proxy_test;
-- 1570704965050
CREATE TABLE table_1 ( id MEDIUMINT NOT NULL AUTO_INCREMENT, field_1 VARCHAR(255), field_2 VARCHAR(255), field_3 VARCHAR(255), PRIMARY KEY (id) );
-- 1570704967132
INSERT INTO table_1 (field_1, field_2, field_3) VALUES ("foo", "bar", "baz");
-- 1570704969719
-- INSERT into table_1 (field_1, field_2, field_3) SELECT "foo" as ENCRYPT_001, "bar" as ENCRYPT_002, "baz" as ENCRYPT_003;
INSERT into table_1 (field_1, field_2, field_3) SELECT "r3+Lm4ozS+qUGd6hubWUmg==" as ENCRYPT_001, "zlMm/fU6HRQ38JHNK9whbA==" as ENCRYPT_002, "nf0GECuyGYJ8UXH7UxeTow==" as ENCRYPT_003;
