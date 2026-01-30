package fr.mountainride.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class RentalDTO {
    private Long customerId;
    private String code;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private BigDecimal totalPrice;
}
