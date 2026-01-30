package fr.mountainride.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ProductTypeNotFoundException extends RuntimeException {
    public ProductTypeNotFoundException(Long id) {
        super("Type de produit non trouvé avec l'ID : " + id);
    }
}
