# Multi-stage build

# Stage 1: Build React app
FROM node:18-alpine AS builder
WORKDIR /app

# Variables d'environnement pour le build
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Installation des dépendances
COPY package*.json ./
RUN npm ci --only=production=false

# Build de l'application
COPY . .
RUN npm run build

# Stage 2: Serve avec nginx
FROM nginx:alpine

# Copier les fichiers buildés
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration nginx
# En dev : config simple
# En prod : sera remplacée par volume mount
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 80 443

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
