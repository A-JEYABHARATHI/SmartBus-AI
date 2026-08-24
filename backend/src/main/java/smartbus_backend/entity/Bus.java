package smartbus_backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "buses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Bus number is required")
    @Column(name = "bus_number", nullable = false, unique = true)
    private String busNumber;

    @NotBlank(message = "Route number is required")
    @Column(name = "route_number", nullable = false)
    private String routeNumber;

    @NotBlank(message = "Route name is required")
    @Column(name = "route_name", nullable = false)
    private String routeName;

    @NotBlank(message = "Starting point is required")
    @Column(name = "starting_point", nullable = false)
    private String startingPoint;

    @NotBlank(message = "Destination is required")
    @Column(name = "destination", nullable = false)
    private String destination;

    @NotBlank(message = "Current location is required")
    @Column(name = "current_location", nullable = false)
    private String currentLocation;

    @NotBlank(message = "Next stop is required")
    @Column(name = "next_stop", nullable = false)
    private String nextStop;

    @NotNull(message = "Expected arrival time is required")
    @PositiveOrZero(message = "Expected arrival must be zero or greater")
    @Column(name = "expected_arrival_minutes", nullable = false)
    private Integer expectedArrivalMinutes;

    @NotNull(message = "Occupancy percentage is required")
    @Min(value = 0, message = "Occupancy percentage must be zero or greater")
    @Column(name = "occupancy_percentage", nullable = false)
    private Integer occupancyPercentage;

    @NotBlank(message = "Status is required")
    @Column(nullable = false)
    private String status;

    @NotNull(message = "Delay is required")
    @PositiveOrZero(message = "Delay must be zero or greater")
    @Column(name = "delay_minutes", nullable = false)
    private Integer delayMinutes;

    @NotBlank(message = "Operating hours are required")
    @Column(name = "operating_hours", nullable = false)
    private String operatingHours;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
}
