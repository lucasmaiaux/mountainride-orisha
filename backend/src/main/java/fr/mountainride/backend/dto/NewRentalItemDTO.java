package fr.mountainride.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NewRentalItemDTO {
    private Long productId;
    private Integer duration;
}
