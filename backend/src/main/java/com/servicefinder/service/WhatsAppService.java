package com.servicefinder.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;

@Service
public class WhatsAppService {
    @Value("${whatsapp.enabled:false}")
    private boolean enabled;

    @Value("${whatsapp.api-url:}")
    private String apiUrl;

    @Value("${whatsapp.api-key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void sendMessage(String phoneNumber, String message) {
        if (!enabled || apiUrl.isEmpty() || apiKey.isEmpty()) {
            System.out.println("WhatsApp notification (disabled): " + phoneNumber + " - " + message);
            return;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            Map<String, String> payload = new HashMap<>();
            payload.put("phone", phoneNumber);
            payload.put("message", message);

            String jsonPayload = objectMapper.writeValueAsString(payload);
            HttpEntity<String> entity = new HttpEntity<>(jsonPayload, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);
            System.out.println("WhatsApp notification sent: " + response.getStatusCode());
        } catch (Exception e) {
            System.err.println("Failed to send WhatsApp notification: " + e.getMessage());
        }
    }
}

