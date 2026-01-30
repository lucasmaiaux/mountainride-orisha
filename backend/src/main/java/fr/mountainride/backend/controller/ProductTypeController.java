package fr.mountainride.backend.controller;

import fr.mountainride.backend.domain.ProductType;
import fr.mountainride.backend.dto.ProductTypeDTO;
import fr.mountainride.backend.service.ProductTypeService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * GET      /api/product-type        - Liste des types de produits
 * GET      /api/product-type/{id}   - Afficher un type de produit
 * POST     /api/product-type        - Ajout d'un type de produit
 * PUT      /api/product-type/{id}   - Modification d'un type de produit
 * DELETE   /api/product-type/{id}   - Suppression d'un type de produit
 */
@RestController
@RequestMapping("/api/product-type")
public class ProductTypeController {

    private final ProductTypeService productTypeService;

    public ProductTypeController(ProductTypeService productTypeService) {
        this.productTypeService = productTypeService;
    }

    @GetMapping
    public Iterable<ProductType> findAll() {
        return productTypeService.findAll();
    }

    @GetMapping("/{id}")
    public ProductType findById(@PathVariable Long id) {
        return productTypeService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductType create(@RequestBody ProductTypeDTO productTypeDTO) {
        return productTypeService.create(productTypeDTO);
    }

    @PutMapping("/{id}")
    public ProductType update(@PathVariable Long id, @RequestBody ProductTypeDTO productTypeDTO) {
        return productTypeService.update(id, productTypeDTO);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        productTypeService.delete(id);
    }
}
