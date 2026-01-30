package fr.mountainride.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ProductPriceNotFoundException extends RuntimeException {
    public ProductPriceNotFoundException(Long id) {
        super("Prix de produit non trouvé avec l'ID : " + id);
    }
}
