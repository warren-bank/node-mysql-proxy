INSERT into mysql_proxy_test.table_1 (field_1, field_2, field_3) SELECT "foo" as ENCRYPT_001, "bar" as ENCRYPT_002, "baz" as ENCRYPT_003;

SELECT * FROM mysql_proxy_test.table_1 ORDER BY id;
