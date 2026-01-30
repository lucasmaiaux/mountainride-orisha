-- ============================================
-- Données initiales - Mountain Ride Orisha
-- INSERT IGNORE : ignore si la donnée existe déjà
-- ============================================

-- ============================================
-- PRODUCT_TYPE
-- ============================================
INSERT IGNORE INTO product_type (id, name) VALUES
(1, 'Ski'),
(2, 'Snowboard'),
(3, 'Raquettes'),
(4, 'Luge'),
(5, 'Vêtements'),
(6, 'Casques'),
(7, 'Chaussures'),
(8, 'Bâtons');

-- ============================================
-- PRODUCT
-- ============================================
-- Skis
INSERT IGNORE INTO product (id, product_type_id, name, size, description, base_price) VALUES
(1, 1, 'Ski Alpin Rossignol Experience', '160cm', 'Ski polyvalent pour pistes', 35.00),
(2, 1, 'Ski Alpin Rossignol Experience', '170cm', 'Ski polyvalent pour pistes', 35.00),
(3, 1, 'Ski Alpin Rossignol Experience', '180cm', 'Ski polyvalent pour pistes', 35.00),
(4, 1, 'Ski Alpin Salomon QST', '165cm', 'Ski freeride performant', 45.00),
(5, 1, 'Ski Alpin Salomon QST', '175cm', 'Ski freeride performant', 45.00),
(6, 1, 'Ski Enfant Atomic', '120cm', 'Ski junior débutant', 25.00),
(7, 1, 'Ski Enfant Atomic', '140cm', 'Ski junior intermédiaire', 25.00);

-- Snowboards
INSERT IGNORE INTO product (id, product_type_id, name, size, description, base_price) VALUES
(8, 2, 'Snowboard Burton Custom', '154cm', 'Board polyvalente freestyle', 40.00),
(9, 2, 'Snowboard Burton Custom', '158cm', 'Board polyvalente freestyle', 40.00),
(10, 2, 'Snowboard Burton Custom', '162cm', 'Board polyvalente freestyle', 40.00),
(11, 2, 'Snowboard Enfant Burton Chopper', '120cm', 'Board junior débutant', 28.00);

-- Raquettes
INSERT IGNORE INTO product (id, product_type_id, name, size, description, base_price) VALUES
(12, 3, 'Raquettes TSL 325', 'M', 'Raquettes randonnée classique', 15.00),
(13, 3, 'Raquettes TSL 325', 'L', 'Raquettes randonnée classique', 15.00),
(14, 3, 'Raquettes TSL Enfant', 'S', 'Raquettes junior', 10.00);

-- Luges
INSERT IGNORE INTO product (id, product_type_id, name, size, description, base_price) VALUES
(15, 4, 'Luge plastique classique', 'Adulte', 'Luge simple et robuste', 8.00),
(16, 4, 'Luge plastique classique', 'Enfant', 'Luge enfant légère', 6.00),
(17, 4, 'Luge en bois traditionnelle', 'Adulte', 'Luge bois style vintage', 12.00);

-- Vêtements
INSERT IGNORE INTO product (id, product_type_id, name, size, description, base_price) VALUES
(18, 5, 'Combinaison ski adulte', 'S', 'Combinaison imperméable chaude', 20.00),
(19, 5, 'Combinaison ski adulte', 'M', 'Combinaison imperméable chaude', 20.00),
(20, 5, 'Combinaison ski adulte', 'L', 'Combinaison imperméable chaude', 20.00),
(21, 5, 'Combinaison ski adulte', 'XL', 'Combinaison imperméable chaude', 20.00),
(22, 5, 'Combinaison ski enfant', 'S', 'Combinaison enfant colorée', 15.00),
(23, 5, 'Combinaison ski enfant', 'M', 'Combinaison enfant colorée', 15.00);

-- Casques
INSERT IGNORE INTO product (id, product_type_id, name, size, description, base_price) VALUES
(24, 6, 'Casque ski Bollé', 'S', 'Casque léger et ventilé', 8.00),
(25, 6, 'Casque ski Bollé', 'M', 'Casque léger et ventilé', 8.00),
(26, 6, 'Casque ski Bollé', 'L', 'Casque léger et ventilé', 8.00),
(27, 6, 'Casque enfant', 'S', 'Casque junior coloré', 6.00);

-- Chaussures
INSERT IGNORE INTO product (id, product_type_id, name, size, description, base_price) VALUES
(28, 7, 'Chaussures ski Salomon', '38', 'Chaussures confort flex 80', 18.00),
(29, 7, 'Chaussures ski Salomon', '40', 'Chaussures confort flex 80', 18.00),
(30, 7, 'Chaussures ski Salomon', '42', 'Chaussures confort flex 80', 18.00),
(31, 7, 'Chaussures ski Salomon', '44', 'Chaussures confort flex 80', 18.00),
(32, 7, 'Chaussures ski Salomon', '46', 'Chaussures confort flex 80', 18.00),
(33, 7, 'Chaussures snowboard Burton', '40', 'Boots snowboard souples', 16.00),
(34, 7, 'Chaussures snowboard Burton', '42', 'Boots snowboard souples', 16.00),
(35, 7, 'Chaussures snowboard Burton', '44', 'Boots snowboard souples', 16.00),
(36, 7, 'Chaussures ski enfant', '32', 'Chaussures junior', 12.00),
(37, 7, 'Chaussures ski enfant', '35', 'Chaussures junior', 12.00);

-- Bâtons
INSERT IGNORE INTO product (id, product_type_id, name, size, description, base_price) VALUES
(38, 8, 'Bâtons ski aluminium', '110cm', 'Bâtons légers polyvalents', 5.00),
(39, 8, 'Bâtons ski aluminium', '120cm', 'Bâtons légers polyvalents', 5.00),
(40, 8, 'Bâtons ski aluminium', '130cm', 'Bâtons légers polyvalents', 5.00),
(41, 8, 'Bâtons ski enfant', '90cm', 'Bâtons junior', 4.00),
(42, 8, 'Bâtons ski enfant', '100cm', 'Bâtons junior', 4.00);

-- ============================================
-- PRODUCT_PRICE (tarifs dégressifs)
-- ============================================
-- Format : 1 jour = tarif plein, 2-3 jours = -15%, 4-7 jours = -25%

-- Skis adulte premium (base 45€)
INSERT IGNORE INTO product_price (id, product_id, min_duration, max_duration, daily_price) VALUES
(1, 4, 1, 1, 45.00), (2, 4, 2, 3, 38.00), (3, 4, 4, 7, 34.00),
(4, 5, 1, 1, 45.00), (5, 5, 2, 3, 38.00), (6, 5, 4, 7, 34.00);

-- Skis adulte standard (base 35€)
INSERT IGNORE INTO product_price (id, product_id, min_duration, max_duration, daily_price) VALUES
(7, 1, 1, 1, 35.00), (8, 1, 2, 3, 30.00), (9, 1, 4, 7, 26.00),
(10, 2, 1, 1, 35.00), (11, 2, 2, 3, 30.00), (12, 2, 4, 7, 26.00),
(13, 3, 1, 1, 35.00), (14, 3, 2, 3, 30.00), (15, 3, 4, 7, 26.00);

-- Skis enfant (base 25€)
INSERT IGNORE INTO product_price (id, product_id, min_duration, max_duration, daily_price) VALUES
(16, 6, 1, 1, 25.00), (17, 6, 2, 3, 21.00), (18, 6, 4, 7, 19.00),
(19, 7, 1, 1, 25.00), (20, 7, 2, 3, 21.00), (21, 7, 4, 7, 19.00);

-- Snowboards adulte (base 40€)
INSERT IGNORE INTO product_price (id, product_id, min_duration, max_duration, daily_price) VALUES
(22, 8, 1, 1, 40.00), (23, 8, 2, 3, 34.00), (24, 8, 4, 7, 30.00),
(25, 9, 1, 1, 40.00), (26, 9, 2, 3, 34.00), (27, 9, 4, 7, 30.00),
(28, 10, 1, 1, 40.00), (29, 10, 2, 3, 34.00), (30, 10, 4, 7, 30.00);

-- Snowboard enfant (base 28€)
INSERT IGNORE INTO product_price (id, product_id, min_duration, max_duration, daily_price) VALUES
(31, 11, 1, 1, 28.00), (32, 11, 2, 3, 24.00), (33, 11, 4, 7, 21.00);

-- Raquettes adulte (base 15€)
INSERT IGNORE INTO product_price (id, product_id, min_duration, max_duration, daily_price) VALUES
(34, 12, 1, 1, 15.00), (35, 12, 2, 3, 13.00), (36, 12, 4, 7, 11.00),
(37, 13, 1, 1, 15.00), (38, 13, 2, 3, 13.00), (39, 13, 4, 7, 11.00);

-- Raquettes enfant (base 10€)
INSERT IGNORE INTO product_price (id, product_id, min_duration, max_duration, daily_price) VALUES
(40, 14, 1, 1, 10.00), (41, 14, 2, 3, 8.00), (42, 14, 4, 7, 7.00);

-- Luges (base 6-12€)
INSERT IGNORE INTO product_price (id, product_id, min_duration, max_duration, daily_price) VALUES
(43, 15, 1, 1, 8.00), (44, 15, 2, 3, 7.00), (45, 15, 4, 7, 6.00),
(46, 16, 1, 1, 6.00), (47, 16, 2, 3, 5.00), (48, 16, 4, 7, 4.00),
(49, 17, 1, 1, 12.00), (50, 17, 2, 3, 10.00), (51, 17, 4, 7, 9.00);

-- Vêtements adulte (base 20€)
INSERT IGNORE INTO product_price (id, product_id, min_duration, max_duration, daily_price) VALUES
(52, 18, 1, 1, 20.00), (53, 18, 2, 3, 17.00), (54, 18, 4, 7, 15.00),
(55, 19, 1, 1, 20.00), (56, 19, 2, 3, 17.00), (57, 19, 4, 7, 15.00),
(58, 20, 1, 1, 20.00), (59, 20, 2, 3, 17.00), (60, 20, 4, 7, 15.00),
(61, 21, 1, 1, 20.00), (62, 21, 2, 3, 17.00), (63, 21, 4, 7, 15.00);

-- Vêtements enfant (base 15€)
INSERT IGNORE INTO product_price (id, product_id, min_duration, max_duration, daily_price) VALUES
(64, 22, 1, 1, 15.00), (65, 22, 2, 3, 13.00), (66, 22, 4, 7, 11.00),
(67, 23, 1, 1, 15.00), (68, 23, 2, 3, 13.00), (69, 23, 4, 7, 11.00);

-- Casques adulte (base 8€)
INSERT IGNORE INTO product_price (id, product_id, min_duration, max_duration, daily_price) VALUES
(70, 24, 1, 1, 8.00), (71, 24, 2, 3, 7.00), (72, 24, 4, 7, 6.00),
(73, 25, 1, 1, 8.00), (74, 25, 2, 3, 7.00), (75, 25, 4, 7, 6.00),
(76, 26, 1, 1, 8.00), (77, 26, 2, 3, 7.00), (78, 26, 4, 7, 6.00);

-- Casque enfant (base 6€)
INSERT IGNORE INTO product_price (id, product_id, min_duration, max_duration, daily_price) VALUES
(79, 27, 1, 1, 6.00), (80, 27, 2, 3, 5.00), (81, 27, 4, 7, 4.00);

-- Chaussures ski adulte (base 18€)
INSERT IGNORE INTO product_price (id, product_id, min_duration, max_duration, daily_price) VALUES
(82, 28, 1, 1, 18.00), (83, 28, 2, 3, 15.00), (84, 28, 4, 7, 14.00),
(85, 29, 1, 1, 18.00), (86, 29, 2, 3, 15.00), (87, 29, 4, 7, 14.00),
(88, 30, 1, 1, 18.00), (89, 30, 2, 3, 15.00), (90, 30, 4, 7, 14.00),
(91, 31, 1, 1, 18.00), (92, 31, 2, 3, 15.00), (93, 31, 4, 7, 14.00),
(94, 32, 1, 1, 18.00), (95, 32, 2, 3, 15.00), (96, 32, 4, 7, 14.00);

-- Chaussures snowboard (base 16€)
INSERT IGNORE INTO product_price (id, product_id, min_duration, max_duration, daily_price) VALUES
(97, 33, 1, 1, 16.00), (98, 33, 2, 3, 14.00), (99, 33, 4, 7, 12.00),
(100, 34, 1, 1, 16.00), (101, 34, 2, 3, 14.00), (102, 34, 4, 7, 12.00),
(103, 35, 1, 1, 16.00), (104, 35, 2, 3, 14.00), (105, 35, 4, 7, 12.00);

-- Chaussures enfant (base 12€)
INSERT IGNORE INTO product_price (id, product_id, min_duration, max_duration, daily_price) VALUES
(106, 36, 1, 1, 12.00), (107, 36, 2, 3, 10.00), (108, 36, 4, 7, 9.00),
(109, 37, 1, 1, 12.00), (110, 37, 2, 3, 10.00), (111, 37, 4, 7, 9.00);

-- Bâtons adulte (base 5€)
INSERT IGNORE INTO product_price (id, product_id, min_duration, max_duration, daily_price) VALUES
(112, 38, 1, 1, 5.00), (113, 38, 2, 3, 4.00), (114, 38, 4, 7, 3.00),
(115, 39, 1, 1, 5.00), (116, 39, 2, 3, 4.00), (117, 39, 4, 7, 3.00),
(118, 40, 1, 1, 5.00), (119, 40, 2, 3, 4.00), (120, 40, 4, 7, 3.00);

-- Bâtons enfant (base 4€)
INSERT IGNORE INTO product_price (id, product_id, min_duration, max_duration, daily_price) VALUES
(121, 41, 1, 1, 4.00), (122, 41, 2, 3, 3.00), (123, 41, 4, 7, 2.00),
(124, 42, 1, 1, 4.00), (125, 42, 2, 3, 3.00), (126, 42, 4, 7, 2.00);

-- ============================================
-- CUSTOMER
-- ============================================
INSERT IGNORE INTO customer (id, first_name, last_name, email, phone_number, address) VALUES
(1, 'Jean', 'Dupont', 'jean.dupont@email.fr', '0612345678', '15 rue des Alpes, 73000 Chambéry'),
(2, 'Marie', 'Martin', 'marie.martin@email.fr', '0623456789', '8 avenue du Mont-Blanc, 74400 Chamonix'),
(3, 'Pierre', 'Bernard', 'pierre.bernard@email.fr', '0634567890', '22 place de la Gare, 38000 Grenoble'),
(4, 'Sophie', 'Petit', 'sophie.petit@email.fr', '0645678901', '5 chemin des Sapins, 73120 Courchevel'),
(5, 'Lucas', 'Robert', 'lucas.robert@email.fr', '0656789012', '12 boulevard des Neiges, 74000 Annecy');

-- ============================================
-- RENTAL
-- ============================================
INSERT IGNORE INTO rental (id, customer_id, code, start_date, end_date, status, total_price) VALUES
(1, 1, 'LOCMR-2025-4827361950', '2025-01-15', '2025-01-17', 'COMPLETED', 168.00),
(2, 2, 'LOCMR-2025-7193846205', '2025-01-20', '2025-01-25', 'COMPLETED', 378.00),
(3, 3, 'LOCMR-2025-5028471936', '2025-01-28', '2025-01-30', 'ACTIVE', 114.00),
(4, 4, 'LOCMR-2025-8362719405', '2025-01-29', '2025-02-02', 'ACTIVE', 215.00),
(5, 1, 'LOCMR-2025-2947183650', '2025-02-01', '2025-02-01', 'ACTIVE', 68.00);

-- ============================================
-- RENTAL_ITEM
-- ============================================
-- Location 1 : Jean - 3 jours (ski + chaussures + bâtons + casque)
INSERT IGNORE INTO rental_item (id, rental_id, product_id, duration, daily_price) VALUES
(1, 1, 2, 3, 30.00),   -- Ski 170cm (tarif 2-3j)
(2, 1, 30, 3, 15.00),  -- Chaussures 42 (tarif 2-3j)
(3, 1, 39, 3, 4.00),   -- Bâtons 120cm (tarif 2-3j)
(4, 1, 25, 3, 7.00);   -- Casque M (tarif 2-3j)

-- Location 2 : Marie - 6 jours (snowboard + boots + casque + vêtements)
INSERT IGNORE INTO rental_item (id, rental_id, product_id, duration, daily_price) VALUES
(5, 2, 9, 6, 30.00),   -- Snowboard 158cm (tarif 4-7j)
(6, 2, 34, 6, 12.00),  -- Boots snowboard 42 (tarif 4-7j)
(7, 2, 25, 6, 6.00),   -- Casque M (tarif 4-7j)
(8, 2, 19, 6, 15.00);  -- Combinaison M (tarif 4-7j)

-- Location 3 : Pierre - 3 jours (raquettes + luge)
INSERT IGNORE INTO rental_item (id, rental_id, product_id, duration, daily_price) VALUES
(9, 3, 12, 3, 13.00),   -- Raquettes M (tarif 2-3j)
(10, 3, 13, 3, 13.00),  -- Raquettes L (tarif 2-3j)
(11, 3, 15, 3, 7.00),   -- Luge adulte (tarif 2-3j)
(12, 3, 16, 3, 5.00);   -- Luge enfant (tarif 2-3j)

-- Location 4 : Sophie - 5 jours (ski famille)
INSERT IGNORE INTO rental_item (id, rental_id, product_id, duration, daily_price) VALUES
(13, 4, 1, 5, 26.00),   -- Ski 160cm (tarif 4-7j)
(14, 4, 28, 5, 14.00),  -- Chaussures 38 (tarif 4-7j)
(15, 4, 38, 5, 3.00);   -- Bâtons 110cm (tarif 4-7j)

-- Location 5 : Jean - 1 jour (ski rapide)
INSERT IGNORE INTO rental_item (id, rental_id, product_id, duration, daily_price) VALUES
(16, 5, 4, 1, 45.00),   -- Ski premium 165cm (tarif 1j)
(17, 5, 30, 1, 18.00),  -- Chaussures 42 (tarif 1j)
(18, 5, 40, 1, 5.00);   -- Bâtons 130cm (tarif 1j)
