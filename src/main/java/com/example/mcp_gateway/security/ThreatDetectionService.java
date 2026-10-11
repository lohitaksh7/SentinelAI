package com.example.mcp_gateway.security;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
public class ThreatDetectionService {

    private final SecurityEventRepository repository;

    public ThreatDetectionService(SecurityEventRepository repository) {
        this.repository = repository;
    }

    public SecurityEvent analyze(SecurityEvent event) {
        String tool = event.getToolName() == null
                ? "" : event.getToolName().toLowerCase(Locale.ROOT);

        String action = event.getAction() == null
                ? "" : event.getAction().toLowerCase(Locale.ROOT);

        String message = event.getMessage() == null
                ? "" : event.getMessage().toLowerCase(Locale.ROOT);

        if (tool.contains("admin") || tool.contains("shell")
                || action.contains("delete_all")
                || message.contains("ignore previous instructions")) {

            event.setSeverity("HIGH");
            event.setStatus("BLOCKED");
            event.setMessage("Suspicious activity detected by security rules.");
        } else {
            event.setSeverity("LOW");
            event.setStatus("ALLOWED");

            if (event.getMessage() == null || event.getMessage().isBlank()) {
                event.setMessage("No suspicious pattern matched.");
            }
        }

        if (event.getUserName() == null || event.getUserName().isBlank()) {
            event.setUserName("demo-user");
        }

        if (event.getToolName() == null || event.getToolName().isBlank()) {
            event.setToolName("unknown-tool");
        }

        if (event.getAction() == null || event.getAction().isBlank()) {
            event.setAction("UNKNOWN");
        }

        event.setTimestamp(LocalDateTime.now());

        return repository.save(event);
    }

    public List<SecurityEvent> getAllEvents() {
        return repository.findAll();
    }
}