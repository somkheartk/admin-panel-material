# Quick Setup Guide - Digital Ocean Deployment

## Required GitHub Secrets

Before the deployment pipeline can work, you must configure these secrets in your GitHub repository:

### Navigate to Repository Settings
1. Go to your GitHub repository
2. Click on **Settings**
3. Click on **Secrets and variables** → **Actions**
4. Click **New repository secret** for each of the following:

### Secrets to Add

```
DIGITALOCEAN_ACCESS_TOKEN      = Your Digital Ocean API token
DIGITALOCEAN_REGISTRY_NAME     = Name of your DO Container Registry (e.g., "admin-panel")
DIGITALOCEAN_DROPLET_IP        = IP address of your droplet (e.g., "123.45.67.89")
DIGITALOCEAN_DROPLET_USER      = SSH username (usually "root" or "ubuntu")
DIGITALOCEAN_SSH_PRIVATE_KEY   = Your SSH private key (entire content)
MONGODB_URI                    = MongoDB connection string
```

## Quick Start

### 1. Create Digital Ocean Container Registry
```bash
doctl registry create admin-panel --subscription-tier basic
```

### 2. Create and Setup Droplet
```bash
# Create droplet (or use existing one)
# Make sure Docker is installed on the droplet

# SSH into droplet
ssh root@YOUR_DROPLET_IP

# Install Docker (if not already installed)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

### 3. Generate SSH Key
```bash
# On your local machine
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/do_deploy

# Copy public key to droplet
ssh-copy-id -i ~/.ssh/do_deploy.pub root@YOUR_DROPLET_IP

# Get private key for GitHub secret
cat ~/.ssh/do_deploy
```

### 4. Get Digital Ocean API Token
1. Go to https://cloud.digitalocean.com/account/api/tokens
2. Click "Generate New Token"
3. Name: "GitHub Actions"
4. Enable both Read and Write scopes
5. Copy the token immediately (it won't be shown again)

### 5. Add Secrets to GitHub
Copy the values above into GitHub repository secrets.

## Testing the Deployment

### Automatic Deployment
The workflow triggers automatically when you:
- Push changes to the `main` branch that affect `backend/` directory
- Manually trigger from GitHub Actions tab

### Manual Trigger
1. Go to GitHub repository → Actions tab
2. Select "Deploy Backend to Digital Ocean" workflow
3. Click "Run workflow" → "Run workflow"

## Verify Deployment

After deployment, check:
```bash
# SSH into droplet
ssh root@YOUR_DROPLET_IP

# Check if container is running
docker ps

# View logs
docker logs backend

# Check application health
curl http://localhost:3001/health
```

## Common Issues

### Issue: npm install fails in Docker build
**Solution**: The Dockerfile uses `npm install` without package-lock.json to avoid version conflicts.

### Issue: Container won't start
**Solution**: Check logs with `docker logs backend` and ensure MONGODB_URI is correct.

### Issue: Can't connect to application
**Solution**: 
- Check if port 3001 is open in firewall
- Verify container is running: `docker ps`
- Check Digital Ocean firewall settings

## Next Steps

For detailed documentation, see:
- [backend/DEPLOYMENT.md](./DEPLOYMENT.md) - Full deployment guide
- [.github/workflows/deploy-backend.yml](../.github/workflows/deploy-backend.yml) - Workflow configuration

## Monitoring

```bash
# View real-time logs
docker logs -f backend

# Check container resource usage
docker stats backend

# Restart container
docker restart backend
```
