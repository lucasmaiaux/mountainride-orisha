package fr.mountainride.backend.controller;

import fr.mountainride.backend.domain.ProductPrice;
import fr.mountainride.backend.dto.ProductPriceDTO;
import fr.mountainride.backend.service.ProductPriceService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * GET      /api/product-price        - Liste des prix de produits
 * GET      /api/product-price/{id}   - Afficher un prix de produit
 * POST     /api/product-price        - Ajout d'un prix de produit
 * PUT      /api/product-price/{id}   - Modification d'un prix de produit
 * DELETE   /api/product-price/{id}   - Suppression d'un prix de produit
 */
@RestController
@RequestMapping("/api/product-price")
public class ProductPriceController {

    private final ProductPriceService productPriceService;

    public ProductPriceController(ProductPriceService productPriceService) {
        this.productPriceService = productPriceService;
    }

    @GetMapping
    public Iterable<ProductPrice> findAll() {
        return productPriceService.findAll();
    }

    @GetMapping("/{id}")
    public ProductPrice findById(@PathVariable Long id) {
        return productPriceService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductPrice create(@RequestBody ProductPriceDTO productPriceDTO) {
        return productPriceService.create(productPriceDTO);
    }

    @PutMapping("/{id}")
    public ProductPrice update(@PathVariable Long id, @RequestBody ProductPriceDTO productPriceDTO) {
        return productPriceService.update(id, productPriceDTO);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        productPriceService.delete(id);
    }
}
