package fr.mountainride.backend.controller;

import fr.mountainride.backend.domain.RentalItem;
import fr.mountainride.backend.dto.RentalItemDTO;
import fr.mountainride.backend.service.RentalItemService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * GET      /api/rental-item        - Liste des articles de location
 * GET      /api/rental-item/{id}   - Afficher un article de location
 * POST     /api/rental-item        - Ajout d'un article de location
 * PUT      /api/rental-item/{id}   - Modification d'un article de location
 * DELETE   /api/rental-item/{id}   - Suppression d'un article de location
 */
@RestController
@RequestMapping("/api/rental-item")
public class RentalItemController {

    private final RentalItemService rentalItemService;

    public RentalItemController(RentalItemService rentalItemService) {
        this.rentalItemService = rentalItemService;
    }

    @GetMapping
    public Iterable<RentalItem> findAll() {
        return rentalItemService.findAll();
    }

    @GetMapping("/{id}")
    public RentalItem findById(@PathVariable Long id) {
        return rentalItemService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RentalItem create(@RequestBody RentalItemDTO rentalItemDTO) {
        return rentalItemService.create(rentalItemDTO);
    }

    @PutMapping("/{id}")
    public RentalItem update(@PathVariable Long id, @RequestBody RentalItemDTO rentalItemDTO) {
        return rentalItemService.update(id, rentalItemDTO);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        rentalItemService.delete(id);
    }
}
