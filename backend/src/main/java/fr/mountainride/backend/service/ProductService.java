package fr.mountainride.backend.service;

import fr.mountainride.backend.domain.Product;
import fr.mountainride.backend.domain.ProductType;
import fr.mountainride.backend.dto.ProductDTO;
import fr.mountainride.backend.exception.ProductNotFoundException;
import fr.mountainride.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductTypeService productTypeService;

    public ProductService(ProductRepository productRepository, ProductTypeService productTypeService) {
        this.productRepository = productRepository;
        this.productTypeService = productTypeService;
    }

    public Iterable<Product> findAll() {
        return productRepository.findAll();
    }

    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    public Product create(ProductDTO productDTO) {
        Product product = new Product();
        ProductType productType = productTypeService.findById(productDTO.getProductTypeId());
        product.setProductType(productType);
        product.setName(productDTO.getName());
        product.setSize(productDTO.getSize());
        product.setDescription(productDTO.getDescription());
        product.setBasePrice(productDTO.getBasePrice());
        return productRepository.save(product);
    }

    public Product update(Long id, ProductDTO productDTO) {
        Product product = findById(id);
        ProductType productType = productTypeService.findById(productDTO.getProductTypeId());
        product.setProductType(productType);
        product.setName(productDTO.getName());
        product.setSize(productDTO.getSize());
        product.setDescription(productDTO.getDescription());
        product.setBasePrice(productDTO.getBasePrice());
        return productRepository.save(product);
    }

    public void delete(Long id) {
        Product product = findById(id);
        productRepository.delete(product);
    }

    public List<Product> findByProductTypeId(Long productTypeId) {
        productTypeService.findById(productTypeId);
        return productRepository.findByProductTypeId(productTypeId);
    }
}
