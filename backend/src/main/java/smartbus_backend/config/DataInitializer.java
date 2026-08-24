package smartbus_backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import smartbus_backend.entity.User;
import smartbus_backend.entity.Bus;
import smartbus_backend.repository.BusRepository;
import smartbus_backend.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BusRepository busRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, BusRepository busRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.busRepository = busRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole("ADMIN");
            admin.setEnabled(true);
            userRepository.save(admin);
        }

        if (busRepository.findByBusNumber("Bus 14").isEmpty()) {
            Bus testBus = new Bus();
            testBus.setBusNumber("Bus 14");
            testBus.setRouteNumber("A1");
            testBus.setRouteName("Mattuthavani to Periyar");
            testBus.setStartingPoint("Mattuthavani");
            testBus.setDestination("Periyar");
            testBus.setCurrentLocation("Near Kamarajar Road");
            testBus.setNextStop("Periyar Bus Stand");
            testBus.setExpectedArrivalMinutes(8);
            testBus.setOccupancyPercentage(72);
            testBus.setStatus("On Time");
            testBus.setDelayMinutes(0);
            testBus.setOperatingHours("05:30 - 22:00");
            testBus.setLatitude(9.9252);
            testBus.setLongitude(78.1198);
            testBus.setLastUpdated(java.time.LocalDateTime.now());
            busRepository.save(testBus);
        }
    }
}
