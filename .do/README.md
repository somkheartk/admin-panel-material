# DigitalOcean App Platform Configuration

This directory contains the App Platform specification for deploying the backend.

## Files

- `app.yaml` - App Platform specification file (main configuration)
- `env.yaml.example` - Template for environment variables
- `env.yaml` - Actual environment variables (NOT committed to version control)
- `merge-env.sh` - Helper script to merge environment variables locally

## App Platform Specification

The `app.yaml` file defines:

- **App Name**: `admin-panel-backend`
- **Region**: `sgp1` (Singapore)
- **Service Type**: Node.js web service
- **Build Command**: `npm install && npm run build`
- **Run Command**: `npm start`
- **HTTP Port**: `3001`
- **Instance Size**: Basic XXS (512MB RAM, 1 vCPU)
- **Auto-deploy**: Enabled on push to main branch

## Environment Variables Management

Environment variables are now separated from the main app configuration for better security.

### For CI/CD Deployment (GitHub Actions)

The GitHub Actions workflow automatically:
1. Creates `env.yaml` from GitHub Secrets
2. Merges it with `app.yaml` during deployment
3. Deploys the merged configuration to DigitalOcean

Required GitHub Secrets:
- `DIGITALOCEAN_ACCESS_TOKEN` - DigitalOcean API token
- `MONGODB_URI` - MongoDB connection string

Optional GitHub Secrets (with defaults):
- `PORT` - HTTP port (defaults to "3001" if not set)
- `NODE_ENV` - Node environment (defaults to "production" if not set)

### For Local/Manual Deployment

If you need to deploy manually using `doctl`:

1. Copy the example file:
   ```bash
   cp .do/env.yaml.example .do/env.yaml
   ```

2. Edit `.do/env.yaml` with your actual values

3. Run the merge script and deploy:
   ```bash
   cd .do
   ./merge-env.sh
   doctl apps create --spec /tmp/app-final.yaml
   # or for updates:
   doctl apps update <APP_ID> --spec /tmp/app-final.yaml
   ```

### Environment Variables List

- `PORT` - HTTP port (default: "3001", can be set via GitHub Secret)
- `NODE_ENV` - Node environment (default: "production", can be set via GitHub Secret)
- `MONGODB_URI` - MongoDB connection string (SECRET, required)

### Security Notes

- **NEVER** commit `.do/env.yaml` to version control (it's in .gitignore)
- Store sensitive values only in GitHub Secrets or secure locations
- The `env.yaml.example` file is safe to commit as it contains no real secrets

## Health Check

The app includes a health check at `/health` that:
- Returns HTTP 200 when the database is connected
- Returns HTTP 503 when the database is disconnected
- Checks every 10 seconds after 60 seconds initial delay

## Deployment

See the deployment guides for detailed instructions:
- [English Guide](../backend/DEPLOYMENT_APP_PLATFORM.md)
- [Thai Guide](../backend/DEPLOYMENT_APP_PLATFORM_TH.md)

## Quick Deploy

```bash
# Install doctl
brew install doctl  # macOS
# or download from https://github.com/digitalocean/doctl/releases

# Authenticate
doctl auth init

# Create app
doctl apps create --spec .do/app.yaml

# Or update existing app
doctl apps update <APP_ID> --spec .do/app.yaml
```

## Modifying Configuration

To change the configuration:

1. Edit `app.yaml`
2. Commit and push changes
3. The GitHub Actions workflow will automatically update the app
4. Or manually update: `doctl apps update <APP_ID> --spec .do/app.yaml`

## Cost

With the current configuration:
- Instance: Basic XXS at $5/month
- Total: $5/month (plus any database costs)
