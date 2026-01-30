# Multi-stage build pour optimiser la taille

# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app

# Cache des dependances Maven
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build de l'application
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Creer un utilisateur non-root pour la securite
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copier le JAR depuis le stage builder
COPY --from=builder /app/target/*.jar app.jar

# Exposer le port
EXPOSE 8080

# Healthcheck simple (sans Actuator)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Demarrer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]
