package smartbus_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.validation.Valid;
import smartbus_backend.dto.BusLocationRequest;
import smartbus_backend.dto.BusLocationResponse;
import smartbus_backend.entity.Bus;
import smartbus_backend.service.BusService;

@RestController
@RequestMapping("/api")
@Validated
public class BusController {

    private static final Logger logger = LoggerFactory.getLogger(BusController.class);

    private final BusService busService;

    public BusController(BusService busService) {
        this.busService = busService;
    }

    @GetMapping("/buses")
    public ResponseEntity<List<Bus>> getAllBuses() {
        return ResponseEntity.ok(busService.getAllBuses());
    }

    @GetMapping("/buses/{id}")
    public ResponseEntity<Bus> getBusById(@PathVariable Long id) {
        Bus bus = busService.getBusById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bus not found with id: " + id));
        return ResponseEntity.ok(bus);
    }

    @GetMapping("/buses/{id}/location")
    public ResponseEntity<BusLocationResponse> getBusLocation(@PathVariable Long id) {
        logger.info("Location request received for bus ID: {}", id);
        return ResponseEntity.ok(busService.getBusLocation(id));
    }

    @PostMapping("/buses/{id}/location")
    public ResponseEntity<BusLocationResponse> updateBusLocation(
            @PathVariable Long id,
            @Valid @RequestBody BusLocationRequest request) {
        return ResponseEntity.ok(busService.updateBusLocation(id, request));
    }

    @GetMapping("/buses/search")
    public ResponseEntity<List<Bus>> searchBuses(
            @RequestParam(required = false) String startingPoint,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) String routeNumber) {

        List<Bus> buses = busService.searchBuses(startingPoint, destination, routeNumber);
        return ResponseEntity.ok(buses);
    }

    @PostMapping("/buses")
    public ResponseEntity<Bus> createBus(@Valid @RequestBody Bus bus) {
        Bus createdBus = busService.createBus(bus);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBus);
    }

    @PutMapping("/buses/{id}")
    public ResponseEntity<Bus> updateBus(@PathVariable Long id, @Valid @RequestBody Bus bus) {
        Bus updatedBus = busService.updateBus(id, bus);
        return ResponseEntity.ok(updatedBus);
    }

    @DeleteMapping("/buses/{id}")
    public ResponseEntity<Void> deleteBus(@PathVariable Long id) {
        busService.deleteBus(id);
        return ResponseEntity.noContent().build();
    }
}
