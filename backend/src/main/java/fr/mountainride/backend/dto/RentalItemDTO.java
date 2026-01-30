package fr.mountainride.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class RentalItemDTO {
    private Long rentalId;
    private Long productId;
    private Integer duration;
    private BigDecimal dailyPrice;
}
