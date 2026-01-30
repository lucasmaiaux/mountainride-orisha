package fr.mountainride.backend.service;

import fr.mountainride.backend.domain.Customer;
import fr.mountainride.backend.domain.Rental;
import fr.mountainride.backend.dto.RentalDTO;
import fr.mountainride.backend.exception.RentalNotFoundException;
import fr.mountainride.backend.repository.RentalRepository;
import org.springframework.stereotype.Service;

@Service
public class RentalService {

    private final RentalRepository rentalRepository;
    private final CustomerService customerService;

    public RentalService(RentalRepository rentalRepository, CustomerService customerService) {
        this.rentalRepository = rentalRepository;
        this.customerService = customerService;
    }

    public Iterable<Rental> findAll() {
        return rentalRepository.findAll();
    }

    public Rental findById(Long id) {
        return rentalRepository.findById(id)
                .orElseThrow(() -> new RentalNotFoundException(id));
    }

    public Rental create(RentalDTO rentalDTO) {
        Rental rental = new Rental();
        Customer customer = customerService.findById(rentalDTO.getCustomerId());
        rental.setCustomer(customer);
        rental.setCode(rentalDTO.getCode());
        rental.setStartDate(rentalDTO.getStartDate());
        rental.setEndDate(rentalDTO.getEndDate());
        rental.setStatus(rentalDTO.getStatus());
        rental.setTotalPrice(rentalDTO.getTotalPrice());
        return rentalRepository.save(rental);
    }

    public Rental update(Long id, RentalDTO rentalDTO) {
        Rental rental = findById(id);
        Customer customer = customerService.findById(rentalDTO.getCustomerId());
        rental.setCustomer(customer);
        rental.setCode(rentalDTO.getCode());
        rental.setStartDate(rentalDTO.getStartDate());
        rental.setEndDate(rentalDTO.getEndDate());
        rental.setStatus(rentalDTO.getStatus());
        rental.setTotalPrice(rentalDTO.getTotalPrice());
        return rentalRepository.save(rental);
    }

    public void delete(Long id) {
        Rental rental = findById(id);
        rentalRepository.delete(rental);
    }
}
