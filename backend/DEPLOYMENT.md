# Backend Deployment to Digital Ocean

This document describes how to deploy the backend application to Digital Ocean using the automated CI/CD pipeline.

## Prerequisites

1. **Digital Ocean Account**: You need an active Digital Ocean account
2. **Digital Ocean Container Registry**: Create a container registry in Digital Ocean
3. **Digital Ocean Droplet**: A droplet (virtual machine) where the application will run
4. **GitHub Secrets**: Configure the following secrets in your GitHub repository

## Required GitHub Secrets

Configure these secrets in your GitHub repository settings (Settings → Secrets and variables → Actions):

### Digital Ocean Secrets

| Secret Name | Description | Example |
|------------|-------------|---------|
| `DIGITALOCEAN_ACCESS_TOKEN` | Digital Ocean API token with read/write access | `dop_v1_xxxxx...` |
| `DIGITALOCEAN_REGISTRY_NAME` | Name of your Digital Ocean Container Registry | `my-registry` |
| `DIGITALOCEAN_DROPLET_IP` | IP address of your Digital Ocean droplet | `123.45.67.89` |
| `DIGITALOCEAN_DROPLET_USER` | SSH username for the droplet | `root` or `ubuntu` |
| `DIGITALOCEAN_SSH_PRIVATE_KEY` | SSH private key for accessing the droplet | `-----BEGIN RSA PRIVATE KEY-----...` |

### Application Secrets

| Secret Name | Description | Example |
|------------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://user:pass@host:27017/dbname` |

## Setup Instructions

### 1. Create Digital Ocean Container Registry

```bash
# Login to Digital Ocean
doctl auth init

# Create a container registry
doctl registry create <registry-name> --subscription-tier basic
```

### 2. Prepare Digital Ocean Droplet

Create a droplet with the following specifications:
- **OS**: Ubuntu 22.04 LTS or newer
- **Size**: At least 1GB RAM (Basic droplet)
- **Docker**: Pre-installed or install manually

#### Install Docker on Droplet (if not pre-installed)

```bash
# SSH into your droplet
ssh root@<your-droplet-ip>

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Verify Docker installation
docker --version
```

### 3. Generate SSH Key for GitHub Actions

```bash
# On your local machine, generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/digitalocean_deploy

# Copy the public key to your droplet
ssh-copy-id -i ~/.ssh/digitalocean_deploy.pub root@<your-droplet-ip>

# Copy the private key content for GitHub secret
cat ~/.ssh/digitalocean_deploy
# Copy this entire content (including BEGIN and END lines) to DIGITALOCEAN_SSH_PRIVATE_KEY secret
```

### 4. Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add all the required secrets listed above

### 5. Configure Digital Ocean API Token

1. Go to Digital Ocean Dashboard
2. Navigate to API → Tokens/Keys
3. Click "Generate New Token"
4. Give it a name (e.g., "GitHub Actions")
5. Select both Read and Write scopes
6. Copy the token and save it as `DIGITALOCEAN_ACCESS_TOKEN` secret

## Deployment Workflow

The deployment happens automatically when:

1. **Push to main branch**: Any push to the `main` branch that includes changes in the `backend/` directory
2. **Manual trigger**: You can manually trigger the deployment from the Actions tab

### Workflow Steps

1. **Build**: Builds the Docker image from the Dockerfile
2. **Push**: Pushes the image to Digital Ocean Container Registry
3. **Deploy**: SSH into the droplet and:
   - Pulls the latest image
   - Stops the old container
   - Starts a new container with the updated image
   - Cleans up old images

## Manual Deployment

If you need to deploy manually:

```bash
# Build the Docker image
cd backend
docker build -t backend:latest .

# Tag for Digital Ocean registry
docker tag backend:latest registry.digitalocean.com/<registry-name>/backend:latest

# Login to Digital Ocean registry
doctl registry login

# Push the image
docker push registry.digitalocean.com/<registry-name>/backend:latest

# SSH to droplet and deploy
ssh root@<droplet-ip>
docker pull registry.digitalocean.com/<registry-name>/backend:latest
docker stop backend || true
docker rm backend || true
docker run -d \
  --name backend \
  --restart unless-stopped \
  -p 3001:3001 \
  -e PORT=3001 \
  -e MONGODB_URI="<your-mongodb-uri>" \
  -e NODE_ENV=production \
  registry.digitalocean.com/<registry-name>/backend:latest
```

## Monitoring and Troubleshooting

### View Logs

```bash
# SSH into the droplet
ssh root@<droplet-ip>

# View container logs
docker logs backend

# Follow logs in real-time
docker logs -f backend
```

### Check Container Status

```bash
# List running containers
docker ps

# Check container health
docker inspect backend
```

### Restart Container

```bash
docker restart backend
```

### Access the Application

After deployment, your backend will be accessible at:
```
http://<droplet-ip>:3001
```

Health check endpoint:
```
http://<droplet-ip>:3001/health
```

## Security Considerations

1. **Firewall**: Configure UFW or Digital Ocean firewall to only allow necessary ports
2. **HTTPS**: Consider using a reverse proxy (nginx) with SSL/TLS certificates
3. **Environment Variables**: Never commit secrets to the repository
4. **SSH Keys**: Use dedicated SSH keys for deployments
5. **Container Registry**: Keep your registry private

## Cost Optimization

1. **Registry**: Use the basic tier ($5/month)
2. **Droplet**: Start with the smallest size that meets your needs
3. **Image Cleanup**: The workflow automatically cleans up old images
4. **Monitoring**: Use Digital Ocean monitoring to track resource usage

## Scaling Considerations

For production workloads, consider:

1. **Load Balancer**: Digital Ocean Load Balancer for traffic distribution
2. **Managed MongoDB**: Digital Ocean Managed Database for MongoDB
3. **Multiple Droplets**: Deploy to multiple droplets for high availability
4. **Kubernetes**: Consider migrating to Digital Ocean Kubernetes for advanced orchestration

## Rollback Procedure

If you need to rollback to a previous version:

```bash
# SSH into droplet
ssh root@<droplet-ip>

# List available images
docker images | grep backend

# Stop current container
docker stop backend
docker rm backend

# Run previous version (replace SHA with actual commit SHA)
docker run -d \
  --name backend \
  --restart unless-stopped \
  -p 3001:3001 \
  -e PORT=3001 \
  -e MONGODB_URI="<your-mongodb-uri>" \
  -e NODE_ENV=production \
  registry.digitalocean.com/<registry-name>/backend:<previous-sha>
```

## Support

For issues related to:
- **Digital Ocean**: Check [Digital Ocean Documentation](https://docs.digitalocean.com/)
- **GitHub Actions**: Check [GitHub Actions Documentation](https://docs.github.com/en/actions)
- **Docker**: Check [Docker Documentation](https://docs.docker.com/)
