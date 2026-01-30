package fr.mountainride.backend.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Entity
@Table(name = "product_price")
public class ProductPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    @JsonBackReference
    private Product product;

    @Column(name = "min_duration")
    private Integer minDuration;

    @Column(name = "max_duration")
    private Integer maxDuration;

    @Column(name = "daily_price", precision = 10, scale = 2)
    private BigDecimal dailyPrice;
}
