# Deployment Architecture Diagram

## DigitalOcean App Platform Deployment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     GitHub Repository                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Push to main branch                                      │  │
│  │  (backend/ files changed)                                │  │
│  └──────────────────┬───────────────────────────────────────┘  │
└─────────────────────┼───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              GitHub Actions Workflow                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  1. Checkout code                                         │  │
│  │  2. Install doctl (DigitalOcean CLI)                     │  │
│  │  3. Authenticate with DIGITALOCEAN_ACCESS_TOKEN          │  │
│  │  4. Check if app exists                                  │  │
│  │  5. Create/Update app using .do/app.yaml                 │  │
│  └──────────────────┬───────────────────────────────────────┘  │
└─────────────────────┼───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│           DigitalOcean App Platform                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Build Phase:                                             │  │
│  │  - npm install                                            │  │
│  │  - npm run build                                          │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                             │
│  ┌──────────────────▼───────────────────────────────────────┐  │
│  │  Deploy Phase:                                            │  │
│  │  - Create container from build                           │  │
│  │  - Inject environment variables (PORT, MONGODB_URI)      │  │
│  │  - npm start (runs built application)                    │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                             │
│  ┌──────────────────▼───────────────────────────────────────┐  │
│  │  Health Check:                                            │  │
│  │  - Wait 60 seconds                                        │  │
│  │  - Check /health every 10 seconds                        │  │
│  │  - Restart if fails 3 times                              │  │
│  └──────────────────┬───────────────────────────────────────┘  │
└─────────────────────┼───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Live Application                              │
│                                                                   │
│  URL: https://admin-panel-backend-xxxxx.ondigitalocean.app      │
│  Port: 3001                                                      │
│  HTTPS: ✅ Automatic SSL/TLS                                    │
│                                                                   │
│  Endpoints:                                                      │
│  - GET  /health              (Health check)                     │
│  - GET  /users               (List users)                       │
│  - GET  /orders              (List orders)                      │
│  - GET  /products            (List products)                    │
│  - POST /users               (Create user)                      │
│  - ...and more                                                   │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                   MongoDB Database                               │
│                                                                   │
│  Options:                                                        │
│  1. MongoDB Atlas (Free Tier available)                         │
│  2. DigitalOcean Managed MongoDB ($15/month)                    │
│  3. Self-hosted MongoDB                                         │
│                                                                   │
│  Connection: MONGODB_URI environment variable                   │
└─────────────────────────────────────────────────────────────────┘
```

## Components Overview

### 1. GitHub Repository
- Contains source code and configuration
- Triggers deployment on push to main
- Stores secrets (DIGITALOCEAN_ACCESS_TOKEN, MONGODB_URI)

### 2. GitHub Actions
- Automated CI/CD pipeline
- Uses doctl for DigitalOcean integration
- Manages app creation/updates

### 3. App Platform Specification (.do/app.yaml)
```yaml
name: admin-panel-backend
region: sgp1
services:
  - name: backend
    instance_size_slug: basic-xxs  # $5/month
    build_command: npm install && npm run build
    run_command: npm start
    http_port: 3001
```

### 4. DigitalOcean App Platform
- Fully managed platform
- Automatic builds from GitHub
- Container orchestration
- Load balancing
- Auto-scaling
- SSL/TLS certificates
- Health monitoring

### 5. Application Container
- Node.js runtime
- NestJS backend
- Port 3001
- Environment variables injected
- Health check endpoint

### 6. MongoDB Database
- NoSQL database
- Stores users, orders, products
- Connection via MONGODB_URI
- Supports MongoDB Atlas or DigitalOcean Managed DB

## Data Flow

```
User Request → HTTPS (SSL/TLS) → App Platform Load Balancer
                                          ↓
                                    Backend Container
                                     (NestJS App)
                                          ↓
                                    MongoDB Database
                                          ↓
                                    Response (JSON)
                                          ↓
                                User ← HTTPS (SSL/TLS)
```

## Deployment Workflow

```
Developer            GitHub              DigitalOcean
    ┃                  ┃                      ┃
    ┃─── git push ────>┃                      ┃
    ┃                  ┃                      ┃
    ┃                  ┃─── Trigger ────────>┃
    ┃                  ┃    Workflow          ┃
    ┃                  ┃                      ┃
    ┃                  ┃                      ┃─── Build
    ┃                  ┃                      ┃
    ┃                  ┃                      ┃─── Deploy
    ┃                  ┃                      ┃
    ┃                  ┃<─── Status ─────────┃
    ┃<─── Notification ┃    (Success)         ┃
    ┃    (Email/UI)    ┃                      ┃
    ┃                  ┃                      ┃
```

## Scaling Architecture

```
                   DigitalOcean App Platform
┌──────────────────────────────────────────────────────────┐
│                                                            │
│  Load Balancer (Automatic)                                │
│          ↓           ↓           ↓                        │
│    ┌─────────┐ ┌─────────┐ ┌─────────┐                  │
│    │Container│ │Container│ │Container│                  │
│    │Instance │ │Instance │ │Instance │                  │
│    │   #1    │ │   #2    │ │   #3    │  (Auto-scale)   │
│    └─────────┘ └─────────┘ └─────────┘                  │
│                                                            │
│  Health Checks: /health                                   │
│  Auto-restart on failure                                  │
└──────────────────────────────────────────────────────────┘
                        ↓
              MongoDB Database
```

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│  1. HTTPS/TLS Encryption (Automatic)                    │
│     - All traffic encrypted                             │
│     - Automatic SSL certificate                         │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  2. Environment Variables (Encrypted)                   │
│     - MONGODB_URI stored securely                       │
│     - No hardcoded credentials                          │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  3. GitHub Secrets (Encrypted)                          │
│     - DIGITALOCEAN_ACCESS_TOKEN                         │
│     - Only accessible in workflows                      │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  4. Workflow Permissions (Restricted)                   │
│     - Read-only access to repository                    │
│     - Minimal required permissions                      │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  5. Network Security                                     │
│     - Firewall rules                                    │
│     - Trusted sources for database                      │
└─────────────────────────────────────────────────────────┘
```

## Cost Breakdown

```
Monthly Cost Estimation:

Basic Setup (Development/Testing):
├─ App Platform (Basic XXS)        $5/month
├─ MongoDB Atlas (Free Tier)       $0/month
└─ Total:                           $5/month

Production Setup:
├─ App Platform (Basic S, 2x)      $48/month
├─ DigitalOcean Managed MongoDB    $15/month
└─ Total:                           $63/month

Enterprise Setup:
├─ App Platform (Professional)     $100+/month
├─ DigitalOcean Managed MongoDB    $40+/month
├─ Load Balancer                   $10/month
└─ Total:                           $150+/month
```

## Monitoring & Observability

```
┌─────────────────────────────────────────────────────────┐
│  App Platform Dashboard                                 │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Runtime Logs                                      │ │
│  │  - Application logs in real-time                  │ │
│  │  - Error tracking                                 │ │
│  └───────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Build Logs                                        │ │
│  │  - npm install output                             │ │
│  │  - Build errors/warnings                          │ │
│  └───────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Insights                                          │ │
│  │  - CPU usage                                       │ │
│  │  - Memory usage                                    │ │
│  │  - Request rate                                    │ │
│  │  - Response time                                   │ │
│  └───────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Health Status                                     │ │
│  │  - Health check results                           │ │
│  │  - Uptime percentage                              │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```


