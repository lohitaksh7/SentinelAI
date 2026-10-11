package com.example.mcp_gateway.security;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public class SecurityEventRepository {

    private final JdbcTemplate jdbcTemplate;

    public SecurityEventRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<SecurityEvent> rowMapper = (rs, rowNum) -> {
        SecurityEvent event = new SecurityEvent();

        event.setId(rs.getLong("id"));
        event.setToolName(rs.getString("tool_name"));
        event.setUserName(rs.getString("user_name"));
        event.setAction(rs.getString("action"));
        event.setSeverity(rs.getString("severity"));
        event.setStatus(rs.getString("status"));
        event.setMessage(rs.getString("message"));

        Timestamp timestamp = rs.getTimestamp("event_time");
        if (timestamp != null) {
            event.setTimestamp(timestamp.toLocalDateTime());
        }

        return event;
    };

    public List<SecurityEvent> findAll() {
        return jdbcTemplate.query(
            "SELECT * FROM security_events ORDER BY id DESC",
            rowMapper
        );
    }

public SecurityEvent save(SecurityEvent event) {
    String sql = """
        INSERT INTO security_events
        (tool_name, user_name, action, severity, status, message, event_time)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """;

    org.springframework.jdbc.support.GeneratedKeyHolder keyHolder =
            new org.springframework.jdbc.support.GeneratedKeyHolder();

    jdbcTemplate.update(connection -> {
        java.sql.PreparedStatement ps = connection.prepareStatement(
                sql, java.sql.Statement.RETURN_GENERATED_KEYS);

        ps.setString(1, event.getToolName());
        ps.setString(2, event.getUserName());
        ps.setString(3, event.getAction());
        ps.setString(4, event.getSeverity());
        ps.setString(5, event.getStatus());
        ps.setString(6, event.getMessage());
        ps.setTimestamp(7,
                java.sql.Timestamp.valueOf(event.getTimestamp()));

        return ps;
    }, keyHolder);

    Number id = keyHolder.getKey();
    if (id != null) {
        event.setId(id.longValue());
    }

    return event;
}
}