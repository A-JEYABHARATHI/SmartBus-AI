package smartbus_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import smartbus_backend.entity.Bus;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {

    List<Bus> findByStartingPointAndDestination(String startingPoint, String destination);

    List<Bus> findByRouteNumber(String routeNumber);

    List<Bus> findByStartingPoint(String startingPoint);

    List<Bus> findByDestination(String destination);

       java.util.Optional<Bus> findByBusNumber(String busNumber);

    @Query("SELECT b FROM Bus b WHERE (:startingPoint IS NULL OR b.startingPoint = :startingPoint) " +
           "AND (:destination IS NULL OR b.destination = :destination) " +
           "AND (:routeNumber IS NULL OR b.routeNumber = :routeNumber)")
    List<Bus> searchBuses(@Param("startingPoint") String startingPoint,
                          @Param("destination") String destination,
                          @Param("routeNumber") String routeNumber);
}
