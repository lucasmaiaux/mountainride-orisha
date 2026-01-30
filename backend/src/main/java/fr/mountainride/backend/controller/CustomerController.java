package fr.mountainride.backend.controller;

import fr.mountainride.backend.domain.Customer;
import fr.mountainride.backend.domain.Rental;
import fr.mountainride.backend.dto.CustomerDTO;
import fr.mountainride.backend.service.CustomerService;
import fr.mountainride.backend.service.RentalService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * GET      /api/customer              - Liste des clients
 * GET      /api/customer/{id}         - Afficher les infos d'un client
 * GET      /api/customer/{id}/rentals - Afficher les locations d'un client
 * POST     /api/customer              - Ajout d'un client
 * PUT      /api/customer/{id}         - Modification d'un client via son ID
 * DELETE   /api/customer/{id}         - Suppression d'un client via son ID
 */
@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    private final CustomerService customerService;
    private final RentalService rentalService;

    public CustomerController(CustomerService customerService, RentalService rentalService) {
        this.customerService = customerService;
        this.rentalService = rentalService;
    }

    @GetMapping
    public Iterable<Customer> findAll() {
        return customerService.findAll();
    }

    @GetMapping("/{id}")
    public Customer findById(@PathVariable Long id) {
        return customerService.findById(id);
    }

    @GetMapping("/{id}/rentals")
    public List<Rental> findRentalsByCustomerId(@PathVariable Long id) {
        return rentalService.findByCustomerId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Customer create(@RequestBody CustomerDTO customerDTO) {
        return customerService.create(customerDTO);
    }

    @PutMapping("/{id}")
    public Customer update(@PathVariable Long id, @RequestBody CustomerDTO customerDTO) {
        return customerService.update(id, customerDTO);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        customerService.delete(id);
    }
}
