package fr.mountainride.backend.service;

import fr.mountainride.backend.domain.Customer;
import fr.mountainride.backend.domain.Product;
import fr.mountainride.backend.domain.ProductPrice;
import fr.mountainride.backend.domain.Rental;
import fr.mountainride.backend.domain.RentalItem;
import fr.mountainride.backend.dto.NewRentalDTO;
import fr.mountainride.backend.dto.NewRentalItemDTO;
import fr.mountainride.backend.dto.RentalDTO;
import fr.mountainride.backend.exception.ProductNotAvailableException;
import fr.mountainride.backend.exception.RentalNotFoundException;
import fr.mountainride.backend.repository.ProductPriceRepository;
import fr.mountainride.backend.repository.ProductRepository;
import fr.mountainride.backend.repository.RentalItemRepository;
import fr.mountainride.backend.repository.RentalRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.Year;
import java.util.List;

@Service
public class RentalService {

    private final RentalRepository rentalRepository;
    private final RentalItemRepository rentalItemRepository;
    private final ProductRepository productRepository;
    private final ProductPriceRepository productPriceRepository;
    private final CustomerService customerService;
    private final ProductService productService;

    public RentalService(RentalRepository rentalRepository,
                         RentalItemRepository rentalItemRepository,
                         ProductRepository productRepository,
                         ProductPriceRepository productPriceRepository,
                         CustomerService customerService,
                         ProductService productService) {
        this.rentalRepository = rentalRepository;
        this.rentalItemRepository = rentalItemRepository;
        this.productRepository = productRepository;
        this.productPriceRepository = productPriceRepository;
        this.customerService = customerService;
        this.productService = productService;
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
        rental.setTotalPrice(rentalDTO.getTotalPrice() != null ? rentalDTO.getTotalPrice() : BigDecimal.ZERO);
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
        rental.setTotalPrice(rentalDTO.getTotalPrice() != null ? rentalDTO.getTotalPrice() : BigDecimal.ZERO);
        return rentalRepository.save(rental);
    }

    public void delete(Long id) {
        Rental rental = findById(id);
        rentalRepository.delete(rental);
    }

    public List<Rental> findByCustomerId(Long customerId) {
        customerService.findById(customerId);
        return rentalRepository.findByCustomerId(customerId);
    }

    // Création d'une location
    /* FORMAT DU JSON
        {
            "customer":
            {
                "firstName": "Jean",
                "lastName": "Dupont",
                "email": "jean@mail.fr",
                "phoneNumber": "0612345678",
                "address": "15 rue des Alpes"
            },
            "items":
            [
                { "productId": 2, "duration": 3 },
                { "productId": 30, "duration": 3 }
            ]
        }
    */
    public Rental startRental(NewRentalDTO newRentalDTO) {

        // Si le mail existe déjà en BDD, récupère le customer existant, sinon le créé
        Customer customer = customerService.findOrCreate(newRentalDTO.getCustomer());

        // Création de l'objet Rental (pas de RentalItem associés encore)
        Rental rental = new Rental();
        rental.setCustomer(customer);
        rental.setCode(generateRentalCode());
        rental.setStartDate(LocalDate.now());
        rental.setStatus("ACTIVE");
        rental = rentalRepository.save(rental);

        BigDecimal totalPrice = BigDecimal.ZERO;

        for (NewRentalItemDTO item : newRentalDTO.getItems()) {
            Product product = productService.findById(item.getProductId());

            // Vérification que le produit n'est pas déjà loué, sinon renvoie une erreur
            if (!product.getAvailable()) {
                throw new ProductNotAvailableException(product.getId());
            }

            // Récupère le prix associé à la durée choisie dans la table product_price
            BigDecimal dailyPrice = findDailyPrice(product, item.getDuration());

            // Calcule le prix final (duration * dailyPrice) directement
            // En partant du principe qu'il n'y a aucun retard/modification
            BigDecimal itemFinalPrice = dailyPrice.multiply(BigDecimal.valueOf(item.getDuration()));

            RentalItem rentalItem = new RentalItem();
            rentalItem.setRental(rental);
            rentalItem.setProduct(product);
            rentalItem.setDuration(item.getDuration());
            rentalItem.setDailyPrice(dailyPrice);
            rentalItem.setFinalPrice(itemFinalPrice);
            rentalItemRepository.save(rentalItem);

            // Change le status d'un product : AVAILABLE -> NON AVAILABLE
            product.setAvailable(false);
            productRepository.save(product);

            totalPrice = totalPrice.add(itemFinalPrice);
        }

        rental.setTotalPrice(totalPrice);
        return rentalRepository.save(rental);
    }

    // Trouve le prix journalier selon la durée (tarif dégressif)
    private BigDecimal findDailyPrice(Product product, Integer duration) {
        List<ProductPrice> prices = productPriceRepository.findByProductId(product.getId());

        return prices.stream()
                .filter(p -> duration >= p.getMinDuration() && duration <= p.getMaxDuration())
                .findFirst()
                .map(ProductPrice::getDailyPrice)
                .orElse(product.getBasePrice());
    }

    public List<Rental> findByCode(String code) {
        return rentalRepository.findByCode(code);
    }

    public List<Rental> findByCustomerLastName(String lastName) {
        return rentalRepository.findByCustomerLastName(lastName);
    }

    public List<Rental> findByCustomerPhoneNumber(String phoneNumber) {
        return rentalRepository.findByCustomerPhoneNumber(phoneNumber);
    }

    // Finalisation d'une location
    public Rental finishRental(Long rentalId) {
        Rental rental = findById(rentalId);

        // Met la date de fin à aujourd'hui
        rental.setEndDate(LocalDate.now());
        rental.setStatus("COMPLETED");

        // Remet tous les produits en disponible
        List<RentalItem> items = rentalItemRepository.findByRentalId(rentalId);
        for (RentalItem item : items) {
            Product product = item.getProduct();
            product.setAvailable(true);
            productRepository.save(product);
        }

        return rentalRepository.save(rental);
    }

    // Génération d'un code de location (format LOCMR-année-10 chiffres aléatoires)
    private String generateRentalCode() {
        String year = String.valueOf(Year.now().getValue());
        String random = String.format("%010d", new SecureRandom().nextInt(1_000_000_000));
        return "LOCMR-" + year + "-" + random;
    }
}
