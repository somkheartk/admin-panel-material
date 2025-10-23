# Environment Variables Separation Guide

## Overview

This guide explains the new approach to managing environment variables in the deployment pipeline. Environment variables are now separated from the main application configuration for improved security and maintainability.

## Problem Solved

**Before:** Environment variables were hardcoded directly in `.do/app.yaml`, which:
- Mixed configuration with sensitive data
- Made it harder to manage different environments
- Increased risk of exposing secrets in version control

**After:** Environment variables are now:
- Stored separately in `.do/env.yaml` (not committed)
- Injected from GitHub Secrets during CI/CD
- Merged with app configuration at deployment time

## For Developers

### GitHub Actions Deployment (Automated)

The CI/CD pipeline handles everything automatically:

1. **Workflow creates environment file** from GitHub Secrets
   ```yaml
   - name: Create env.yaml from secrets
     run: |
       cat > .do/env.yaml << EOF
       envs:
         - key: PORT
           value: "3001"
         - key: NODE_ENV
           value: production
         - key: MONGODB_URI
           scope: RUN_AND_BUILD_TIME
           type: SECRET
           value: "${{ secrets.MONGODB_URI }}"
       EOF
   ```

2. **Merges environment variables** into app configuration
   ```bash
   yq eval-all 'select(fileIndex == 0).services[0].envs = select(fileIndex == 1).envs | select(fileIndex == 0)' \
     .do/app.yaml .do/env.yaml > /tmp/app-final.yaml
   ```

3. **Deploys merged configuration** to DigitalOcean
   ```bash
   doctl apps update $APP_ID --spec /tmp/app-final.yaml
   ```

### Manual Deployment (Local)

If you need to deploy manually:

1. **Copy the example file:**
   ```bash
   cp .do/env.yaml.example .do/env.yaml
   ```

2. **Edit with your values:**
   ```bash
   nano .do/env.yaml
   ```
   
   Example content:
   ```yaml
   envs:
     - key: PORT
       value: "3001"
     - key: NODE_ENV
       value: production
     - key: MONGODB_URI
       scope: RUN_AND_BUILD_TIME
       type: SECRET
       value: "mongodb://your-actual-connection-string"
   ```

3. **Deploy using the merge script:**
   ```bash
   cd .do
   ./merge-env.sh
   doctl apps update <APP_ID> --spec /tmp/app-final.yaml
   ```

## For DevOps/Admins

### Required GitHub Secrets

Ensure these secrets are configured in your repository:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `DIGITALOCEAN_ACCESS_TOKEN` | DigitalOcean API token | `dop_v1_...` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |

To add secrets:
1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each secret with its name and value

### Adding New Environment Variables

When you need to add a new environment variable:

1. **Update `.do/env.yaml.example`:**
   ```yaml
   envs:
     # ... existing vars ...
     - key: NEW_VAR_NAME
       value: "example_value"
   ```

2. **Update the workflow** (`.github/workflows/deploy-backend-app-platform.yml`):
   ```yaml
   - name: Create env.yaml from secrets
     run: |
       cat > .do/env.yaml << EOF
       envs:
         # ... existing vars ...
         - key: NEW_VAR_NAME
           value: "${{ secrets.NEW_VAR_NAME }}"
       EOF
   ```

3. **Add the secret** to GitHub repository settings

4. **Update documentation** if needed

## Security Best Practices

✅ **DO:**
- Store sensitive values in GitHub Secrets
- Keep `.do/env.yaml` in `.gitignore`
- Use `.do/env.yaml.example` as a template (safe to commit)
- Review environment variables before deployment
- Rotate secrets regularly

❌ **DON'T:**
- Commit `.do/env.yaml` to version control
- Share sensitive values in code comments
- Use production secrets in development
- Hardcode secrets in workflow files
- Leave test secrets in configuration

## Troubleshooting

### Issue: "env.yaml not found" error

**Solution:** The error occurs during manual deployment. Create the file:
```bash
cp .do/env.yaml.example .do/env.yaml
# Then edit with your values
```

### Issue: GitHub Actions deployment fails

**Solution:** Check that all required secrets are configured:
```bash
# Verify in GitHub: Settings → Secrets and variables → Actions
```

### Issue: Merged config has empty envs

**Solution:** Check the env.yaml format matches the example:
```yaml
envs:  # Must be "envs" not "env"
  - key: PORT
    value: "3001"
```

### Issue: "yq not found" error

**Solution:** The workflow installs yq automatically. For local use:
```bash
# macOS
brew install yq

# Linux
sudo wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64
sudo chmod +x /usr/local/bin/yq
```

## Migration Notes

### Existing Deployments

Your existing deployments will continue to work. The next deployment will:
1. Use the new approach automatically
2. Read secrets from GitHub Secrets (already configured)
3. Merge them into the app configuration
4. Deploy with the same environment variables

### No Action Required

If your GitHub Secrets are already configured, no action is needed. The next push to main will use the new approach automatically.

## Benefits Summary

1. **Security**: Sensitive data separated from configuration
2. **Maintainability**: Easier to manage different environments
3. **Flexibility**: Supports both automated and manual deployments
4. **Safety**: Protected by `.gitignore` to prevent accidental commits
5. **Clarity**: Clear separation of concerns
6. **Auditability**: Changes to app config don't expose secrets

## Reference Files

- `.do/app.yaml` - Main application specification
- `.do/env.yaml.example` - Environment variables template
- `.do/env.yaml` - Actual environment variables (not in git)
- `.do/merge-env.sh` - Local deployment helper script
- `.github/workflows/deploy-backend-app-platform.yml` - CI/CD workflow
- `.do/README.md` - DigitalOcean App Platform documentation

## Support

For questions or issues:
1. Check this guide first
2. Review the `.do/README.md` file
3. Check the deployment guides in `backend/DEPLOYMENT_APP_PLATFORM.md`
4. Create an issue in the repository

---

**Last Updated:** October 2025
**Version:** 1.0.0
