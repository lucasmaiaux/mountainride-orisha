package fr.mountainride.backend.controller;

import fr.mountainride.backend.domain.Customer;
import fr.mountainride.backend.dto.CustomerDTO;
import fr.mountainride.backend.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

/**
 * GET      /api/customer        - Liste des clients
 * GET      /api/customer/{id}   - Afficher les infos d'un client
 * POST     /api/customer        - Ajout d'un client
 * PUT      /api/customer/{id}   - Modification d'un client via son ID
 * DELETE   /api/customer/{id}   - Suppression d'un client via son ID
 */
@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }


    // [GET] /api/customer : Liste des clients
    @GetMapping()
    public Iterable<Customer> getCustomers() {
        return customerService.getCustomers();
    }

    // [GET] /api/customer/{id} : Afficher les infos d'un client
    @GetMapping("/{id}")
    public Customer getCustomerById(@PathVariable Long id) {
        return customerService.getCustomerById(id);
    }

    // [POST] /api/customer : Ajout d'un client (DTO)
    @PostMapping()
    public ResponseEntity<Customer> addCustomer(@RequestBody CustomerDTO customerDTO) {
        Customer customer = customerService.createCustomer(customerDTO);
        URI location = URI.create("/customer/" + customer.getId());
        return ResponseEntity.created(location)
                .body(customer);
    }

    // [PUT] /api/customer/{id} : Modification d'un client via son ID
    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody CustomerDTO customerDTO) {
        Customer customer = customerService.updateCustomer(id, customerDTO);
        return ResponseEntity.status(HttpStatus.OK).body(customer);
    }

    // [DELETE] /api/customer/{id} : Suppression d'un client via son ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return  ResponseEntity.noContent().build();
    }
}
