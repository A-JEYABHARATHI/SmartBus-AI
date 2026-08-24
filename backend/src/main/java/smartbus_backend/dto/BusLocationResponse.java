package smartbus_backend.dto;

import java.time.LocalDateTime;

public record BusLocationResponse(
        Long busId,
        String busNumber,
        Double latitude,
        Double longitude,
        LocalDateTime lastUpdated) {
}