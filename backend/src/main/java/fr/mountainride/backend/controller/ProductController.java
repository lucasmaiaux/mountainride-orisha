package fr.mountainride.backend.controller;

import fr.mountainride.backend.domain.Product;
import fr.mountainride.backend.domain.ProductPrice;
import fr.mountainride.backend.dto.ProductDTO;
import fr.mountainride.backend.service.ProductPriceService;
import fr.mountainride.backend.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * GET      /api/product             - Liste des produits
 * GET      /api/product/{id}        - Afficher un produit
 * GET      /api/product/{id}/prices - Afficher les prix d'un produit
 * POST     /api/product             - Ajout d'un produit
 * PUT      /api/product/{id}        - Modification d'un produit
 * DELETE   /api/product/{id}        - Suppression d'un produit
 */
@RestController
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;
    private final ProductPriceService productPriceService;

    public ProductController(ProductService productService, ProductPriceService productPriceService) {
        this.productService = productService;
        this.productPriceService = productPriceService;
    }

    @GetMapping
    public Iterable<Product> findAll() {
        return productService.findAll();
    }

    @GetMapping("/{id}")
    public Product findById(@PathVariable Long id) {
        return productService.findById(id);
    }

    @GetMapping("/{id}/prices")
    public List<ProductPrice> findPricesByProductId(@PathVariable Long id) {
        return productPriceService.findByProductId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product create(@RequestBody ProductDTO productDTO) {
        return productService.create(productDTO);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody ProductDTO productDTO) {
        return productService.update(id, productDTO);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        productService.delete(id);
    }
}
