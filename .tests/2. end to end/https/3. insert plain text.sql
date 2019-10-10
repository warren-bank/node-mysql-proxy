USE mysql_proxy_test;

INSERT INTO table_1 (field_1, field_2, field_3) VALUES ("foo", "bar", "baz");

SELECT * FROM table_1 ORDER BY id;
