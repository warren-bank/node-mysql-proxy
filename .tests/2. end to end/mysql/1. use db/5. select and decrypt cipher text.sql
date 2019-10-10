USE mysql_proxy_test;

SELECT * FROM (
  SELECT field_1 as ENCRYPT_001, field_2 as ENCRYPT_002, field_3 as ENCRYPT_003 FROM table_1
) AS crypto
WHERE CHAR_LENGTH(ENCRYPT_001) = 24 AND ENCRYPT_001 = "foo";
