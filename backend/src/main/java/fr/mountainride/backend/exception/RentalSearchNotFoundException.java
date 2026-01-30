package fr.mountainride.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class RentalSearchNotFoundException extends RuntimeException {
    public RentalSearchNotFoundException(String searchType, String value) {
        super("Aucune location trouvée pour " + searchType + " : " + value);
    }
}
