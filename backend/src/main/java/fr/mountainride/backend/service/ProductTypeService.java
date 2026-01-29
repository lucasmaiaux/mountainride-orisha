package fr.mountainride.backend.service;

import fr.mountainride.backend.domain.ProductType;
import fr.mountainride.backend.repository.ProductTypeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProductTypeService {

    private final ProductTypeRepository productTypeRepository;

    public ProductTypeService(ProductTypeRepository productTypeRepository) {
        this.productTypeRepository = productTypeRepository;
    }

    public Iterable<ProductType> findAll() {
        return productTypeRepository.findAll();
    }

    public ProductType findById(Long id) {
        return productTypeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Type de produit non trouvé"));
    }

    public ProductType create(ProductType productType) {
        return productTypeRepository.save(productType);
    }

    public ProductType update(Long id, ProductType newProductType) {
        ProductType productType = findById(id);
        productType.setName(newProductType.getName());
        return productTypeRepository.save(productType);
    }

    public void delete(Long id) {
        ProductType productType = findById(id);
        productTypeRepository.delete(productType);
    }
}
