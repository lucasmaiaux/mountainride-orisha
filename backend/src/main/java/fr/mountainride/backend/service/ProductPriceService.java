package fr.mountainride.backend.service;

import fr.mountainride.backend.domain.Product;
import fr.mountainride.backend.domain.ProductPrice;
import fr.mountainride.backend.dto.ProductPriceDTO;
import fr.mountainride.backend.exception.ProductPriceNotFoundException;
import fr.mountainride.backend.repository.ProductPriceRepository;
import org.springframework.stereotype.Service;

@Service
public class ProductPriceService {

    private final ProductPriceRepository productPriceRepository;
    private final ProductService productService;

    public ProductPriceService(ProductPriceRepository productPriceRepository, ProductService productService) {
        this.productPriceRepository = productPriceRepository;
        this.productService = productService;
    }

    public Iterable<ProductPrice> findAll() {
        return productPriceRepository.findAll();
    }

    public ProductPrice findById(Long id) {
        return productPriceRepository.findById(id)
                .orElseThrow(() -> new ProductPriceNotFoundException(id));
    }

    public ProductPrice create(ProductPriceDTO productPriceDTO) {
        ProductPrice productPrice = new ProductPrice();
        Product product = productService.findById(productPriceDTO.getProductId());
        productPrice.setProduct(product);
        productPrice.setMinDuration(productPriceDTO.getMinDuration());
        productPrice.setMaxDuration(productPriceDTO.getMaxDuration());
        productPrice.setDailyPrice(productPriceDTO.getDailyPrice());
        return productPriceRepository.save(productPrice);
    }

    public ProductPrice update(Long id, ProductPriceDTO productPriceDTO) {
        ProductPrice productPrice = findById(id);
        Product product = productService.findById(productPriceDTO.getProductId());
        productPrice.setProduct(product);
        productPrice.setMinDuration(productPriceDTO.getMinDuration());
        productPrice.setMaxDuration(productPriceDTO.getMaxDuration());
        productPrice.setDailyPrice(productPriceDTO.getDailyPrice());
        return productPriceRepository.save(productPrice);
    }

    public void delete(Long id) {
        ProductPrice productPrice = findById(id);
        productPriceRepository.delete(productPrice);
    }
}
