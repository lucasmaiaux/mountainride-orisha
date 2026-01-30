package fr.mountainride.backend.service;

import fr.mountainride.backend.domain.Product;
import fr.mountainride.backend.domain.Rental;
import fr.mountainride.backend.domain.RentalItem;
import fr.mountainride.backend.dto.RentalItemDTO;
import fr.mountainride.backend.exception.RentalItemNotFoundException;
import fr.mountainride.backend.repository.RentalItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RentalItemService {

    private final RentalItemRepository rentalItemRepository;
    private final RentalService rentalService;
    private final ProductService productService;

    public RentalItemService(RentalItemRepository rentalItemRepository, RentalService rentalService, ProductService productService) {
        this.rentalItemRepository = rentalItemRepository;
        this.rentalService = rentalService;
        this.productService = productService;
    }

    public Iterable<RentalItem> findAll() {
        return rentalItemRepository.findAll();
    }

    public RentalItem findById(Long id) {
        return rentalItemRepository.findById(id)
                .orElseThrow(() -> new RentalItemNotFoundException(id));
    }

    public RentalItem create(RentalItemDTO rentalItemDTO) {
        RentalItem rentalItem = new RentalItem();
        Rental rental = rentalService.findById(rentalItemDTO.getRentalId());
        Product product = productService.findById(rentalItemDTO.getProductId());
        rentalItem.setRental(rental);
        rentalItem.setProduct(product);
        rentalItem.setDuration(rentalItemDTO.getDuration());
        rentalItem.setDailyPrice(rentalItemDTO.getDailyPrice());
        return rentalItemRepository.save(rentalItem);
    }

    public RentalItem update(Long id, RentalItemDTO rentalItemDTO) {
        RentalItem rentalItem = findById(id);
        Rental rental = rentalService.findById(rentalItemDTO.getRentalId());
        Product product = productService.findById(rentalItemDTO.getProductId());
        rentalItem.setRental(rental);
        rentalItem.setProduct(product);
        rentalItem.setDuration(rentalItemDTO.getDuration());
        rentalItem.setDailyPrice(rentalItemDTO.getDailyPrice());
        return rentalItemRepository.save(rentalItem);
    }

    public void delete(Long id) {
        RentalItem rentalItem = findById(id);
        rentalItemRepository.delete(rentalItem);
    }

    public List<RentalItem> findByRentalId(Long rentalId) {
        rentalService.findById(rentalId);
        return rentalItemRepository.findByRentalId(rentalId);
    }
}
