package fr.mountainride.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class RentalItemNotFoundException extends RuntimeException {
    public RentalItemNotFoundException(Long id) {
        super("Article de location non trouvé avec l'ID : " + id);
    }
}
