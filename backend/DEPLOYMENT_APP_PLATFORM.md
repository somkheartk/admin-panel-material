# Deploying Backend to DigitalOcean App Platform

This guide explains how to deploy the backend application to DigitalOcean's App Platform, a fully managed Platform-as-a-Service (PaaS) solution.

## Overview

DigitalOcean App Platform provides:
- Automatic builds and deployments from GitHub
- Built-in HTTPS/SSL certificates
- Auto-scaling capabilities
- Integrated monitoring and logging
- No need to manage servers or containers

## Prerequisites

1. **DigitalOcean Account**: Create an account at [digitalocean.com](https://digitalocean.com)
2. **GitHub Repository**: Your repository must be accessible to DigitalOcean
3. **MongoDB Database**: A MongoDB instance (can use DigitalOcean Managed Database)

## Deployment Methods

### Method 1: Automated Deployment via GitHub Actions (Recommended)

#### Step 1: Configure GitHub Secrets

Add the following secret in your GitHub repository (Settings → Secrets and variables → Actions):

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `DIGITALOCEAN_ACCESS_TOKEN` | DigitalOcean API token | Go to DigitalOcean Dashboard → API → Generate New Token |
| `MONGODB_URI` | MongoDB connection string | Your MongoDB connection string (e.g., from MongoDB Atlas or DO Managed Database) |

#### Step 2: Get DigitalOcean API Token

1. Log in to [DigitalOcean Dashboard](https://cloud.digitalocean.com)
2. Go to **API** → **Tokens/Keys**
3. Click **Generate New Token**
4. Name it (e.g., "GitHub Actions")
5. Select **Both** Read and Write scopes
6. Copy the token and save it as `DIGITALOCEAN_ACCESS_TOKEN` in GitHub Secrets

#### Step 3: Configure MongoDB

You have two options:

**Option A: DigitalOcean Managed MongoDB**
1. Go to DigitalOcean Dashboard → **Databases**
2. Click **Create Database**
3. Select **MongoDB**
4. Choose your configuration (Basic plan starts at $15/month)
5. Copy the connection string
6. Save it as `MONGODB_URI` in GitHub Secrets

**Option B: External MongoDB (e.g., MongoDB Atlas)**
1. Use your existing MongoDB instance
2. Get the connection string
3. Save it as `MONGODB_URI` in GitHub Secrets

Format: `mongodb://username:password@host:port/database`

#### Step 4: Deploy

The deployment will happen automatically when you:
- Push changes to the `main` branch that affect the `backend/` directory
- Manually trigger the workflow from GitHub Actions tab

**To manually trigger:**
1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **Deploy Backend to DigitalOcean App Platform**
4. Click **Run workflow**
5. Select the branch and click **Run workflow**

The deployment typically takes 5-10 minutes.

### Method 2: Manual Deployment via DigitalOcean Dashboard

#### Step 1: Create App

1. Log in to [DigitalOcean Dashboard](https://cloud.digitalocean.com)
2. Click **Apps** in the left sidebar
3. Click **Create App**
4. Select **GitHub** as the source
5. Authorize DigitalOcean to access your GitHub account
6. Select your repository: `somkheartk/admin-panel-material`
7. Select branch: `main`
8. Check **Autodeploy** to enable automatic deployments on push

#### Step 2: Configure Your App

1. **Source Directory**: Enter `backend`
2. **Build Command**: `npm install && npm run build`
3. **Run Command**: `npm start` (or leave empty to use Procfile)
4. **HTTP Port**: `3001`
5. **Environment Variables**: Click **Edit** and add:
   - `PORT` = `3001`
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = (your MongoDB connection string, mark as **secret**)
   - `ALLOWED_ORIGINS` = (optional, comma-separated list of allowed CORS origins)

#### Step 3: Configure Resources

1. **Plan**: Select **Basic** (starts at $5/month)
2. **Instance Size**: Select **Basic XXS** (512 MB RAM, 1 vCPU) - suitable for small apps
3. **Region**: Select closest to your users (e.g., `sgp1` for Singapore)

#### Step 4: Review and Create

1. Review the configuration
2. App name will be `admin-panel-backend`
3. Click **Create Resources**
4. Wait for the initial deployment (5-10 minutes)

### Method 3: Deploy via doctl CLI

#### Step 1: Install doctl

**macOS:**
```bash
brew install doctl
```

**Linux:**
```bash
cd ~
wget https://github.com/digitalocean/doctl/releases/download/v1.104.0/doctl-1.104.0-linux-amd64.tar.gz
tar xf doctl-1.104.0-linux-amd64.tar.gz
sudo mv doctl /usr/local/bin
```

**Windows:**
Download from [GitHub Releases](https://github.com/digitalocean/doctl/releases)

#### Step 2: Authenticate

```bash
doctl auth init
```

Enter your DigitalOcean API token when prompted.

#### Step 3: Create or Update App

**Create new app:**
```bash
doctl apps create --spec .do/app.yaml
```

**Update existing app:**
```bash
# Get app ID
doctl apps list

# Update the app
doctl apps update <APP_ID> --spec .do/app.yaml
```

## App Configuration

The app configuration is defined in `.do/app.yaml`. Key settings:

```yaml
name: admin-panel-backend          # App name
region: sgp1                        # Deployment region

services:
  - name: backend
    source_dir: backend              # Directory containing backend code
    build_command: npm install && npm run build
    run_command: npm start
    instance_count: 1                # Number of instances
    instance_size_slug: basic-xxs    # Instance size
    http_port: 3001                  # HTTP port
    
    health_check:
      http_path: /health             # Health check endpoint
      initial_delay_seconds: 60
      period_seconds: 10
      
    envs:
      - key: PORT
        value: "3001"
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI              # Will be added as secret
        scope: RUN_AND_BUILD_TIME
        type: SECRET
```

## Available Regions

Choose the region closest to your users:

- `nyc1`, `nyc3` - New York, USA
- `sfo3` - San Francisco, USA
- `ams3` - Amsterdam, Netherlands
- `sgp1` - Singapore
- `lon1` - London, UK
- `fra1` - Frankfurt, Germany
- `tor1` - Toronto, Canada
- `blr1` - Bangalore, India
- `syd1` - Sydney, Australia

## Environment Variables

Configure these environment variables in the App Platform:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `PORT` | HTTP port | `3001` | Yes |
| `NODE_ENV` | Node environment | `production` | Yes |
| `MONGODB_URI` | MongoDB connection string | `mongodb://...` | Yes |

### Adding Environment Variables

**Via Dashboard:**
1. Go to your app in DigitalOcean Dashboard
2. Click **Settings** tab
3. Scroll to **App-Level Environment Variables**
4. Click **Edit**
5. Add variables
6. Mark sensitive values as **Secret**
7. Click **Save**

**Via doctl:**
```bash
doctl apps update <APP_ID> --spec .do/app.yaml
```

**Via GitHub Actions:**
Environment variables are automatically configured from GitHub Secrets.

## Monitoring and Logs

### View Logs

**Via Dashboard:**
1. Go to your app in DigitalOcean Dashboard
2. Click **Runtime Logs** tab
3. View real-time logs

**Via doctl:**
```bash
# Get app ID
doctl apps list

# View logs
doctl apps logs <APP_ID> --type run
```

### Monitor Performance

**Via Dashboard:**
1. Go to your app
2. Click **Insights** tab
3. View:
   - CPU usage
   - Memory usage
   - Request rate
   - Response time
   - HTTP status codes

### Health Checks

The app includes a health check endpoint at `/health` that:
- Checks MongoDB connection
- Returns HTTP 200 if healthy
- Returns HTTP 503 if unhealthy

App Platform will automatically restart the service if health checks fail.

## Scaling

### Manual Scaling

**Via Dashboard:**
1. Go to your app → **Settings**
2. Under **Resources**, click **Edit**
3. Adjust:
   - **Instance Count**: Number of containers (horizontal scaling)
   - **Instance Size**: Container resources (vertical scaling)
4. Click **Save**

**Via doctl:**
Update the `instance_count` and `instance_size_slug` in `.do/app.yaml`, then:
```bash
doctl apps update <APP_ID> --spec .do/app.yaml
```

### Instance Sizes

| Size | RAM | vCPUs | Price/month |
|------|-----|-------|-------------|
| `basic-xxs` | 512 MB | 1 | $5 |
| `basic-xs` | 1 GB | 1 | $12 |
| `basic-s` | 2 GB | 1 | $24 |
| `basic-m` | 4 GB | 2 | $48 |
| `professional-xs` | 1 GB | 1 | $12 |
| `professional-s` | 2 GB | 1 | $24 |

## Custom Domains

### Add Custom Domain

1. Go to your app → **Settings**
2. Click **Domains** → **Add Domain**
3. Enter your domain (e.g., `api.yourdomain.com`)
4. Add the CNAME record to your DNS:
   - Type: `CNAME`
   - Name: `api` (or your subdomain)
   - Value: (provided by DigitalOcean)
5. Wait for DNS propagation (up to 48 hours, usually much faster)
6. SSL certificate is automatically provisioned

## Troubleshooting

### Deployment Fails

**Check build logs:**
```bash
doctl apps logs <APP_ID> --type build
```

**Common issues:**
- Missing dependencies in `package.json`
- Build errors (check TypeScript compilation)
- Incorrect build/run commands

### App Won't Start

**Check runtime logs:**
```bash
doctl apps logs <APP_ID> --type run
```

**Common issues:**
- MongoDB connection failure (check `MONGODB_URI`)
- Missing environment variables
- Port mismatch (ensure `PORT=3001`)
- Health check failures

### Database Connection Issues

**Symptoms:**
- App keeps restarting
- Health check fails
- Logs show MongoDB connection errors

**Solutions:**
1. Verify `MONGODB_URI` is correct
2. Check database is accessible from App Platform
3. If using DO Managed Database:
   - Go to Database → Settings → Trusted Sources
   - Add "All App Platform apps"
4. Test connection string locally

### Health Check Failing

**Check health endpoint:**
```bash
curl https://your-app-url.ondigitalocean.app/health
```

**Common issues:**
- Endpoint returns non-200 status
- MongoDB connection issues
- Application not starting properly

## Costs

### Typical Monthly Costs

**Minimal Setup (Development/Testing):**
- App Platform: Basic XXS - $5/month
- Total: **$5/month**

**Production Setup:**
- App Platform: Basic S (2 instances for HA) - $48/month
- Managed MongoDB: Basic - $15/month
- Total: **$63/month**

**Cost Optimization Tips:**
1. Start with smallest instance size
2. Scale up based on actual usage
3. Use external MongoDB (MongoDB Atlas free tier) initially
4. Monitor usage in Insights tab

## CI/CD Pipeline

The GitHub Actions workflow automatically:

1. **Triggers** on push to `main` branch (if backend files changed)
2. **Checks** if app exists
3. **Creates** new app if it doesn't exist
4. **Updates** existing app with latest configuration
5. **Deploys** the latest code

### Workflow Status

Check deployment status:
- GitHub: Actions tab
- DigitalOcean: Apps → Your App → Activity tab

## Security Best Practices

1. **Environment Variables**: Store all secrets as encrypted environment variables
2. **HTTPS**: Automatically enabled by App Platform
3. **Firewall**: Configure trusted sources for managed databases
4. **API Tokens**: Rotate DigitalOcean API tokens periodically
5. **Access Control**: Use team permissions in DigitalOcean

## Rollback

If a deployment fails or has issues:

**Via Dashboard:**
1. Go to your app → **Deployments** tab
2. Find the previous working deployment
3. Click **Actions** → **Rollback**

**Via doctl:**
```bash
# List deployments
doctl apps list-deployments <APP_ID>

# Rollback to specific deployment
doctl apps create-deployment <APP_ID> --deployment-id <DEPLOYMENT_ID>
```

## Migration from Droplet Deployment

If you previously used the Droplet deployment method:

1. Keep the old workflow disabled (rename or delete)
2. Use the new App Platform workflow
3. Update frontend to point to the new App Platform URL
4. Test thoroughly before removing Droplet resources
5. Once stable, you can delete:
   - Droplet
   - Container Registry (if not used elsewhere)

## Support and Resources

- [DigitalOcean App Platform Docs](https://docs.digitalocean.com/products/app-platform/)
- [App Platform Pricing](https://www.digitalocean.com/pricing/app-platform)
- [doctl Documentation](https://docs.digitalocean.com/reference/doctl/)
- [Support Tickets](https://cloud.digitalocean.com/support/tickets)

## Quick Commands Reference

```bash
# List all apps
doctl apps list

# Get app details
doctl apps get <APP_ID>

# View logs
doctl apps logs <APP_ID> --type run
doctl apps logs <APP_ID> --type build

# List deployments
doctl apps list-deployments <APP_ID>

# Update app
doctl apps update <APP_ID> --spec .do/app.yaml

# Delete app
doctl apps delete <APP_ID>
```
