package fr.mountainride.backend.service;

import fr.mountainride.backend.domain.Customer;
import fr.mountainride.backend.dto.CustomerDTO;
import fr.mountainride.backend.exception.CustomerNotFoundException;
import fr.mountainride.backend.repository.CustomerRepository;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public Iterable<Customer> findAll() {
        return customerRepository.findAll();
    }

    public Customer findById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(id));
    }

    public Customer create(CustomerDTO customerDTO) {
        Customer customer = new Customer();
        customer.setFirstName(customerDTO.getFirstName());
        customer.setLastName(customerDTO.getLastName());
        customer.setEmail(customerDTO.getEmail());
        customer.setPhoneNumber(customerDTO.getPhoneNumber());
        customer.setAddress(customerDTO.getAddress());
        return customerRepository.save(customer);
    }

    public Customer update(Long id, CustomerDTO customerDTO) {
        Customer customer = findById(id);
        customer.setFirstName(customerDTO.getFirstName());
        customer.setLastName(customerDTO.getLastName());
        customer.setEmail(customerDTO.getEmail());
        customer.setPhoneNumber(customerDTO.getPhoneNumber());
        customer.setAddress(customerDTO.getAddress());
        return customerRepository.save(customer);
    }

    public void delete(Long id) {
        Customer customer = findById(id);
        customerRepository.delete(customer);
    }

    // Cherche un client par son émail et le créé si pas trouvé
    public Customer findOrCreate(CustomerDTO customerDTO) {
        return customerRepository.findByEmail(customerDTO.getEmail())
                .orElseGet(() -> create(customerDTO));
    }
}
