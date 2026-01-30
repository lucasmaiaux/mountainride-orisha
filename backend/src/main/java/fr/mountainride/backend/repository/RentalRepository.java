package fr.mountainride.backend.repository;

import fr.mountainride.backend.domain.Rental;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RentalRepository extends CrudRepository<Rental, Long> {
    List<Rental> findByCustomerId(Long customerId);
}
