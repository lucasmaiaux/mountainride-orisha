package fr.mountainride.backend.controller;

import fr.mountainride.backend.domain.Rental;
import fr.mountainride.backend.dto.RentalDTO;
import fr.mountainride.backend.service.RentalService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * GET      /api/rental        - Liste des locations
 * GET      /api/rental/{id}   - Afficher une location
 * POST     /api/rental        - Ajout d'une location
 * PUT      /api/rental/{id}   - Modification d'une location
 * DELETE   /api/rental/{id}   - Suppression d'une location
 */
@RestController
@RequestMapping("/api/rental")
public class RentalController {

    private final RentalService rentalService;

    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    @GetMapping
    public Iterable<Rental> findAll() {
        return rentalService.findAll();
    }

    @GetMapping("/{id}")
    public Rental findById(@PathVariable Long id) {
        return rentalService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Rental create(@RequestBody RentalDTO rentalDTO) {
        return rentalService.create(rentalDTO);
    }

    @PutMapping("/{id}")
    public Rental update(@PathVariable Long id, @RequestBody RentalDTO rentalDTO) {
        return rentalService.update(id, rentalDTO);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        rentalService.delete(id);
    }
}
