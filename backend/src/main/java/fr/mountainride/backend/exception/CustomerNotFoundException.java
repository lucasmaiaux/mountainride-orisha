package fr.mountainride.backend.exception;

public class CustomerNotFoundException extends RuntimeException {
    public CustomerNotFoundException(Long customerId) {
        super("Client non trouvé avec l'ID : " + customerId);
    }
}
