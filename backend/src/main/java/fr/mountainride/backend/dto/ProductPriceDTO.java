package fr.mountainride.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductPriceDTO {
    private Long productId;
    private Integer minDuration;
    private Integer maxDuration;
    private BigDecimal dailyPrice;
}
