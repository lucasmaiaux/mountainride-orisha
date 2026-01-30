package fr.mountainride.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomerNotFoundException.class)
    public ResponseEntity<ErrorEntity> customerNotFoundHandler(CustomerNotFoundException exception) {
        return buildErrorResponse(exception);
    }

    @ExceptionHandler(ProductTypeNotFoundException.class)
    public ResponseEntity<ErrorEntity> productTypeNotFoundHandler(ProductTypeNotFoundException exception) {
        return buildErrorResponse(exception);
    }

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ErrorEntity> productNotFoundHandler(ProductNotFoundException exception) {
        return buildErrorResponse(exception);
    }

    @ExceptionHandler(ProductPriceNotFoundException.class)
    public ResponseEntity<ErrorEntity> productPriceNotFoundHandler(ProductPriceNotFoundException exception) {
        return buildErrorResponse(exception);
    }

    @ExceptionHandler(RentalNotFoundException.class)
    public ResponseEntity<ErrorEntity> rentalNotFoundHandler(RentalNotFoundException exception) {
        return buildErrorResponse(exception);
    }

    @ExceptionHandler(RentalItemNotFoundException.class)
    public ResponseEntity<ErrorEntity> rentalItemNotFoundHandler(RentalItemNotFoundException exception) {
        return buildErrorResponse(exception);
    }

    @ExceptionHandler(RentalSearchNotFoundException.class)
    public ResponseEntity<ErrorEntity> rentalSearchNotFoundHandler(RentalSearchNotFoundException exception) {
        return buildErrorResponse(exception);
    }

    private ResponseEntity<ErrorEntity> buildErrorResponse(RuntimeException exception) {
        ErrorEntity error = ErrorEntity.builder()
                .timeStamp(LocalDateTime.now())
                .message(exception.getMessage())
                .httpStatus(HttpStatus.NOT_FOUND.value())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
}
