package fr.mountainride.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductDTO {
    private Long productTypeId;
    private String name;
    private String size;
    private String description;
    private BigDecimal basePrice;
}
