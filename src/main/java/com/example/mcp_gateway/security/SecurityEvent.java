
package com.example.mcp_gateway.security;

import java.time.LocalDateTime;

public class SecurityEvent {

    private Long id;
    private String toolName;
    private String userName;
    private String action;
    private String severity;
    private String status;
    private String message;
    private LocalDateTime timestamp;

    public SecurityEvent() {
    }

    public SecurityEvent(Long id, String toolName, String userName,
                         String action, String severity, String status,
                         String message, LocalDateTime timestamp) {
        this.id = id;
        this.toolName = toolName;
        this.userName = userName;
        this.action = action;
        this.severity = severity;
        this.status = status;
        this.message = message;
        this.timestamp = timestamp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getToolName() { return toolName; }
    public void setToolName(String toolName) { this.toolName = toolName; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
