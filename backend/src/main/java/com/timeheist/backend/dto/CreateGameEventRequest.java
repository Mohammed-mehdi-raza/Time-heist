package com.timeheist.backend.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Map;

public class CreateGameEventRequest {

    @NotBlank(message = "Event type is required")
    private String eventType;

    private Long objectId;

    private Map<String, Object> metadata;

    public CreateGameEventRequest() {
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public Long getObjectId() {
        return objectId;
    }

    public void setObjectId(Long objectId) {
        this.objectId = objectId;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }
}