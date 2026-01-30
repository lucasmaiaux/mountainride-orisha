package fr.mountainride.backend.service;

import fr.mountainride.backend.domain.ProductType;
import fr.mountainride.backend.dto.ProductTypeDTO;
import fr.mountainride.backend.exception.ProductTypeNotFoundException;
import fr.mountainride.backend.repository.ProductTypeRepository;
import org.springframework.stereotype.Service;

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
                .orElseThrow(() -> new ProductTypeNotFoundException(id));
    }

    public ProductType create(ProductTypeDTO productTypeDTO) {
        ProductType productType = new ProductType();
        productType.setName(productTypeDTO.getName());
        return productTypeRepository.save(productType);
    }

    public ProductType update(Long id, ProductTypeDTO productTypeDTO) {
        ProductType productType = findById(id);
        productType.setName(productTypeDTO.getName());
        return productTypeRepository.save(productType);
    }

    public void delete(Long id) {
        ProductType productType = findById(id);
        productTypeRepository.delete(productType);
    }
}
