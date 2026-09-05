# ==========================================================
# Creative KG - Multi-Stage Production Dockerfile
# Stage 1: Build React 19 + Vite Application
# Stage 2: Serve with High-Performance Nginx & Media Cache
# ==========================================================

# ----------------- Stage 1: Builder -----------------
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies with clean cache
COPY package*.json ./
RUN npm ci

# Copy full frontend application source
COPY . .

# Build production bundle to /app/dist
RUN npm run build

# ----------------- Stage 2: Production Server -----------------
FROM nginx:alpine

# Install curl for Docker health check and create cache directories
RUN apk add --no-cache curl && \
    mkdir -p /var/cache/nginx/creativekg_media /var/www/creativekg/dist && \
    chown -R nginx:nginx /var/cache/nginx/creativekg_media /var/www/creativekg/dist

# Copy custom Nginx media caching configuration
COPY nginx/media-cache.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /var/www/creativekg/dist

# Expose standard HTTP port
EXPOSE 80

# Health check to ensure Nginx is responding
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Launch Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
