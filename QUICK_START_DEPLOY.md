# Quick Start: Deploy to DigitalOcean App Platform

This is a quick guide to deploy your backend to DigitalOcean App Platform in under 10 minutes.

## Step 1: Get DigitalOcean API Token (2 minutes)

1. Go to https://cloud.digitalocean.com/account/api/tokens
2. Click **Generate New Token**
3. Name: `GitHub Actions`
4. Scopes: ✅ Read ✅ Write
5. Click **Generate Token**
6. **Copy the token** (you won't see it again!)

## Step 2: Add GitHub Secrets (1 minute)

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click **New repository secret**
4. Add these secrets:

| Name | Value |
|------|-------|
| `DIGITALOCEAN_ACCESS_TOKEN` | (paste the token from Step 1) |
| `MONGODB_URI` | Your MongoDB connection string |

**MongoDB URI examples:**
```
# MongoDB Atlas
mongodb+srv://username:password@cluster.mongodb.net/dbname

# DigitalOcean Managed MongoDB
mongodb://username:password@host:27017/dbname?authSource=admin

# Local/Development
mongodb://localhost:27017/admin-panel
```

## Step 3: Deploy! (5-10 minutes)

### Option A: Automatic (Recommended)

1. Push any change to `main` branch that affects the `backend/` directory
2. GitHub Actions will automatically deploy
3. Check progress: Repository → Actions tab

### Option B: Manual Trigger

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **Deploy Backend to DigitalOcean App Platform**
4. Click **Run workflow** → **Run workflow**
5. Wait 5-10 minutes for deployment to complete

## Step 4: Access Your App

After deployment completes:

1. Go to https://cloud.digitalocean.com/apps
2. Click on **admin-panel-backend**
3. You'll see your app URL (e.g., `https://admin-panel-backend-xxxxx.ondigitalocean.app`)

**Test it:**
```bash
# Check health endpoint
curl https://your-app-url.ondigitalocean.app/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2025-10-20T...",
  "database": {
    "status": "connected",
    "state": 1
  },
  "features": {
    "roleSwitch": true,
    "multiRoleSupport": true
  }
}
```

## Troubleshooting

### App keeps restarting?

**Check logs:**
```bash
# Install doctl
brew install doctl  # macOS
# or: https://github.com/digitalocean/doctl/releases

# Authenticate
doctl auth init

# View logs
doctl apps list
doctl apps logs <APP_ID> --type run
```

**Common issue:** MongoDB connection failed
- Make sure `MONGODB_URI` is correct
- If using DigitalOcean Managed Database:
  - Go to Database → Settings → Trusted Sources
  - Add "All App Platform apps"

### Health check failing?

- Wait 60 seconds (initial delay)
- Check if `/health` endpoint is accessible
- Verify MongoDB is connected

### Build failed?

```bash
doctl apps logs <APP_ID> --type build
```

Common issues:
- Missing `package.json` dependencies
- TypeScript compilation errors

## What's Next?

- **Custom Domain**: Add your own domain in App Platform settings
- **Scale Up**: Increase instance size if needed (Settings → Resources)
- **Monitor**: Check Insights tab for performance metrics
- **Auto-scaling**: Configure horizontal scaling

## Cost

Current configuration:
- **$5/month** for Basic XXS instance
- Plus MongoDB costs (if using DigitalOcean Managed DB)

Start small and scale up based on actual usage!

## Need Help?

- [Full Deployment Guide (English)](backend/DEPLOYMENT_APP_PLATFORM.md)
- [คู่มือภาษาไทย](backend/DEPLOYMENT_APP_PLATFORM_TH.md)
- [DigitalOcean Support](https://cloud.digitalocean.com/support/tickets)
