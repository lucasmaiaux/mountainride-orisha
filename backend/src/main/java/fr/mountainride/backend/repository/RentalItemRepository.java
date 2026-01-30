package fr.mountainride.backend.repository;

import fr.mountainride.backend.domain.RentalItem;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RentalItemRepository extends CrudRepository<RentalItem, Long> {
}
