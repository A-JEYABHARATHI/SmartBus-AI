package smartbus_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import smartbus_backend.entity.Bus;
import smartbus_backend.dto.BusLocationRequest;
import smartbus_backend.dto.BusLocationResponse;
import smartbus_backend.repository.BusRepository;

@Service
public class BusService {

    private static final Logger logger = LoggerFactory.getLogger(BusService.class);

    private final BusRepository busRepository;

    public BusService(BusRepository busRepository) {
        this.busRepository = busRepository;
    }

    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    public Optional<Bus> getBusById(Long id) {
        return busRepository.findById(id);
    }

    public BusLocationResponse getBusLocation(Long id) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bus not found with id: " + id));

        if (bus.getLatitude() == null || bus.getLongitude() == null || bus.getLastUpdated() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Bus location is currently unavailable");
        }

        logger.info("Bus location found: latitude={}, longitude={}", bus.getLatitude(), bus.getLongitude());

        return toLocationResponse(bus);
    }

    @Transactional
    public BusLocationResponse updateBusLocation(Long id, BusLocationRequest request) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bus not found with id: " + id));

        bus.setLatitude(request.getLatitude());
        bus.setLongitude(request.getLongitude());
        bus.setLastUpdated(java.time.LocalDateTime.now());

        return toLocationResponse(busRepository.save(bus));
    }

    public List<Bus> searchBuses(String startingPoint, String destination, String routeNumber) {
        String normalizedStart = normalizeText(startingPoint);
        String normalizedDestination = normalizeText(destination);
        String normalizedRoute = normalizeText(routeNumber);

        return busRepository.searchBuses(normalizedStart, normalizedDestination, normalizedRoute);
    }

    @Transactional
    public Bus createBus(Bus bus) {
        validateBus(bus);
        return busRepository.save(bus);
    }

    @Transactional
    public Bus updateBus(Long id, Bus updatedBus) {
        Bus existingBus = busRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bus not found with id: " + id));

        validateBus(updatedBus);

        existingBus.setBusNumber(updatedBus.getBusNumber());
        existingBus.setRouteNumber(updatedBus.getRouteNumber());
        existingBus.setRouteName(updatedBus.getRouteName());
        existingBus.setStartingPoint(updatedBus.getStartingPoint());
        existingBus.setDestination(updatedBus.getDestination());
        existingBus.setCurrentLocation(updatedBus.getCurrentLocation());
        existingBus.setNextStop(updatedBus.getNextStop());
        existingBus.setExpectedArrivalMinutes(updatedBus.getExpectedArrivalMinutes());
        existingBus.setOccupancyPercentage(updatedBus.getOccupancyPercentage());
        existingBus.setStatus(updatedBus.getStatus());
        existingBus.setDelayMinutes(updatedBus.getDelayMinutes());
        existingBus.setOperatingHours(updatedBus.getOperatingHours());

        return busRepository.save(existingBus);
    }

    @Transactional
    public void deleteBus(Long id) {
        if (!busRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Bus not found with id: " + id);
        }
        busRepository.deleteById(id);
    }

    private void validateBus(Bus bus) {
        if (bus == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bus payload is required");
        }

        if (bus.getBusNumber() == null || bus.getBusNumber().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bus number is required");
        }
        if (bus.getRouteNumber() == null || bus.getRouteNumber().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Route number is required");
        }
        if (bus.getRouteName() == null || bus.getRouteName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Route name is required");
        }
        if (bus.getStartingPoint() == null || bus.getStartingPoint().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Starting point is required");
        }
        if (bus.getDestination() == null || bus.getDestination().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Destination is required");
        }
        if (bus.getCurrentLocation() == null || bus.getCurrentLocation().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current location is required");
        }
        if (bus.getNextStop() == null || bus.getNextStop().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Next stop is required");
        }
        if (bus.getExpectedArrivalMinutes() == null || bus.getExpectedArrivalMinutes() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expected arrival minutes must be zero or greater");
        }
        if (bus.getOccupancyPercentage() == null || bus.getOccupancyPercentage() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Occupancy percentage must be zero or greater");
        }
        if (bus.getStatus() == null || bus.getStatus().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status is required");
        }
        if (bus.getDelayMinutes() == null || bus.getDelayMinutes() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Delay minutes must be zero or greater");
        }
        if (bus.getOperatingHours() == null || bus.getOperatingHours().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Operating hours are required");
        }
    }

    private String normalizeText(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private BusLocationResponse toLocationResponse(Bus bus) {
        return new BusLocationResponse(
                bus.getId(),
                bus.getBusNumber(),
                bus.getLatitude(),
                bus.getLongitude(),
                bus.getLastUpdated());
    }
}
