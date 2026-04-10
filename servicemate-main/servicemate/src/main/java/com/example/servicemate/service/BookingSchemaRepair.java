package com.example.servicemate.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class BookingSchemaRepair implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public BookingSchemaRepair(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        if (!tableExists("bookings")) {
            return;
        }

        dropForeignKeys("bookings", "provider_id", "users");
        dropForeignKeys("bookings", "service_id", null);

        if (columnExists("bookings", "service_id")) {
            jdbcTemplate.execute("ALTER TABLE bookings MODIFY COLUMN service_id INT NULL");
        }

        jdbcTemplate.execute("ALTER TABLE bookings MODIFY COLUMN status VARCHAR(20) NOT NULL DEFAULT 'PENDING'");
        jdbcTemplate.update("UPDATE bookings SET status = UPPER(status) WHERE status IS NOT NULL");

        if (!columnExists("bookings", "priority")) {
            jdbcTemplate.execute("ALTER TABLE bookings ADD COLUMN priority VARCHAR(20) NOT NULL DEFAULT 'LOW'");
        } else {
            jdbcTemplate.execute("ALTER TABLE bookings MODIFY COLUMN priority VARCHAR(20) NOT NULL DEFAULT 'LOW'");
            jdbcTemplate.update("UPDATE bookings SET priority = UPPER(priority) WHERE priority IS NOT NULL");
        }
    }

    private boolean tableExists(String tableName) {
        Integer count = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*)
                FROM information_schema.tables
                WHERE table_schema = DATABASE() AND table_name = ?
                """,
                Integer.class,
                tableName
        );
        return count != null && count > 0;
    }

    private boolean columnExists(String tableName, String columnName) {
        Integer count = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*)
                FROM information_schema.columns
                WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?
                """,
                Integer.class,
                tableName,
                columnName
        );
        return count != null && count > 0;
    }

    private void dropForeignKeys(String tableName, String columnName, String expectedReferenceTable) {
        List<Map<String, Object>> keys = jdbcTemplate.queryForList(
                """
                SELECT constraint_name, referenced_table_name
                FROM information_schema.key_column_usage
                WHERE table_schema = DATABASE()
                  AND table_name = ?
                  AND column_name = ?
                  AND referenced_table_name IS NOT NULL
                """,
                tableName,
                columnName
        );

        for (Map<String, Object> key : keys) {
            String constraintName = String.valueOf(key.get("constraint_name"));
            String referencedTable = String.valueOf(key.get("referenced_table_name"));
            if (expectedReferenceTable == null || !expectedReferenceTable.equalsIgnoreCase(referencedTable)) {
                jdbcTemplate.execute("ALTER TABLE " + tableName + " DROP FOREIGN KEY " + constraintName);
            }
        }
    }
}
