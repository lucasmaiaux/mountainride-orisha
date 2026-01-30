package fr.mountainride.backend.controller;

import fr.mountainride.backend.domain.Rental;
import fr.mountainride.backend.domain.RentalItem;
import fr.mountainride.backend.dto.NewRentalDTO;
import fr.mountainride.backend.dto.RentalDTO;
import fr.mountainride.backend.service.RentalItemService;
import fr.mountainride.backend.service.RentalService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * GET      /api/rental            - Liste des locations
 * GET      /api/rental/{id}       - Afficher une location
 * GET      /api/rental/{id}/items - Afficher les articles d'une location
 * POST     /api/rental            - Ajout d'une location
 * POST     /api/rental/start      - Démarrer une nouvelle location
 * PUT      /api/rental/{id}       - Modification d'une location
 * DELETE   /api/rental/{id}       - Suppression d'une location
 */
@RestController
@RequestMapping("/api/rental")
public class RentalController {

    private final RentalService rentalService;
    private final RentalItemService rentalItemService;

    public RentalController(RentalService rentalService, RentalItemService rentalItemService) {
        this.rentalService = rentalService;
        this.rentalItemService = rentalItemService;
    }

    @GetMapping
    public Iterable<Rental> findAll() {
        return rentalService.findAll();
    }

    @GetMapping("/{id}")
    public Rental findById(@PathVariable Long id) {
        return rentalService.findById(id);
    }

    @GetMapping("/{id}/items")
    public List<RentalItem> findItemsByRentalId(@PathVariable Long id) {
        return rentalItemService.findByRentalId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Rental create(@RequestBody RentalDTO rentalDTO) {
        return rentalService.create(rentalDTO);
    }

    @PostMapping("/start")
    @ResponseStatus(HttpStatus.CREATED)
    public Rental startRental(@RequestBody NewRentalDTO newRentalDTO) {
        return rentalService.startRental(newRentalDTO);
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
