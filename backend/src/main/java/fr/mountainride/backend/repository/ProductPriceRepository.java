package fr.mountainride.backend.repository;

import fr.mountainride.backend.domain.ProductPrice;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductPriceRepository extends CrudRepository<ProductPrice, Long> {
    List<ProductPrice> findByProductId(Long productId);
}
