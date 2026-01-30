package fr.mountainride.backend.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Entity
@Table(name = "rental_item")
public class RentalItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "rental_id", nullable = false)
    @JsonBackReference
    private Rental rental;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private Integer duration;

    @Column(name = "daily_price", precision = 10, scale = 2)
    private BigDecimal dailyPrice;
}
