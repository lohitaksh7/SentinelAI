
package com.example.mcp_gateway.security;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/security")
@CrossOrigin(origins = "*")
public class SecurityEventController {

    private final ThreatDetectionService threatService;

    public SecurityEventController(ThreatDetectionService threatService) {
        this.threatService = threatService;
    }

    @PostMapping("/events")
    public SecurityEvent createEvent(@RequestBody SecurityEvent event) {
        return threatService.analyze(event);
    }

    @GetMapping("/events")
    public List<SecurityEvent> getEvents() {
        return threatService.getAllEvents();
    }
}
