package fr.mountainride.backend.repository;

import fr.mountainride.backend.domain.Product;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends CrudRepository<Product, Long> {
    List<Product> findByProductTypeId(Long productTypeId);
}
