package fr.mountainride.backend.repository;

import fr.mountainride.backend.domain.ProductType;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductTypeRepository extends CrudRepository<ProductType, Long> {
}
