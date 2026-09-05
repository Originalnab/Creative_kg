# Creative KG Project Structure

This repository is structured into modular project layers:

- **`website_FE/`**: The complete frontend website, client proofing portal, system media vault, and live visual studio editing platform.
  - Built with React 19, TypeScript, Vite, Tailwind CSS, Motion, Lucide icons.
  - Includes full administrative management, Google Drive cloud integration, booking package setup, and 5 curated palette themes.

## Quick Commands (from project root)

```bash
# Start local development server on http://localhost:3000/
npm run dev

# Compile production bundle
npm run build

# Preview production build
npm run preview
```

## Docker Containerization (Nginx + Media Cache)

The project includes a multi-stage Docker build that compiles the React 19 application and serves it via Alpine Nginx with custom media caching and instant invalidation headers.

### Prerequisites
Make sure **Docker Desktop** is installed and running on your machine.

### Run with Docker Compose
From the project root:

```bash
# 1. Build and start the container in the background
npm run docker:up
# Or using Docker Compose directly:
# docker compose up -d --build

# 2. View container logs
npm run docker:logs

# 3. Stop the container
npm run docker:down
```

The container will be accessible at **http://localhost:3000/** (or custom `$PORT`).

### Production Deployment (Port 80)
For direct staging/production deployment on port 80:
```bash
npm run docker:prod
# Or:
# docker compose -f docker-compose.prod.yml up -d --build
```

### Features included in the Docker build:
- **Multi-Stage Node 22 Alpine Builder**: Generates clean minified production bundles.
- **Ultra-lean Nginx Alpine Image**: Fast startup (<1s) and low memory footprint (~20MB).
- **Custom Media & Proxy Caching**: Nginx volume cache with `bypass` headers for instant updates when media is replaced.
- **Docker Health Check**: Proactively monitors HTTP status every 30 seconds via `curl`.
- **Immutable Asset Caching**: Vite bundle chunks cached for 1 year with `immutable` flag.

---

## Hostinger VPS Production Deployment (`creativekg.com`)

The VPS `1311214` runs **Nginx Proxy Manager (NPM)** on public ports 80, 81, and 443. Creative KG runs as a Docker container bound to **`127.0.0.1:8094`**, and NPM terminates SSL and forwards traffic seamlessly to the container.

### Step 1: Create Directory on VPS via SSH
```bash
ssh root@<vps-ip>
mkdir -p /opt/creativekg
cd /opt/creativekg
```

### Step 2: Clone and Build
```bash
git clone https://github.com/Originalnab/Creative_kg.git .
cp .env.example .env
npm run docker:prod
# Or:
# docker compose -f docker-compose.prod.yml up -d --build
```

### Step 3: Configure Nginx Proxy Manager (Port 81)
1. Open your Nginx Proxy Manager admin panel: `http://<vps-ip>:81`
2. Navigate to **Proxy Hosts** -> **Add Proxy Host**:
   - **Domain Names**: `creativekg.com`, `www.creativekg.com`
   - **Scheme**: `http`
   - **Forward Hostname / IP**: `127.0.0.1` (or `172.17.0.1`)
   - **Forward Port**: `8094`
   - Enable: **Cache Assets**, **Block Common Exploits**, **WebSockets Support**
3. Navigate to the **SSL** tab:
   - Select **Request a new SSL Certificate** (Let's Encrypt)
   - Enable **Force SSL** and **HTTP/2 Support**
   - Save


