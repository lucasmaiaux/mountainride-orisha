package fr.mountainride.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class NewRentalDTO {
    private CustomerDTO customer;
    private List<NewRentalItemDTO> items;
}
