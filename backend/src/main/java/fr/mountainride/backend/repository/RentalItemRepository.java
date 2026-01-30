package fr.mountainride.backend.repository;

import fr.mountainride.backend.domain.RentalItem;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RentalItemRepository extends CrudRepository<RentalItem, Long> {
    List<RentalItem> findByRentalId(Long rentalId);
}
