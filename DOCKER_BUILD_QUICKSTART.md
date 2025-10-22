# Docker Build Pipeline - Quick Start

## 🎯 Purpose

This workflow automatically builds and pushes Docker images for the backend application to GitHub Container Registry (ghcr.io).

## 🚀 Quick Start

### Prerequisites
- Repository has "Packages: write" permission enabled
- Backend Dockerfile exists at `backend/Dockerfile`

### How It Works

The workflow automatically triggers on:
1. **Push to main** - Builds and pushes images
2. **Pull requests** - Builds images (no push) for validation
3. **Manual trigger** - Use "Run workflow" button in Actions tab

### Generated Tags

For each build, the following tags are created:

| Event | Tags Generated | Example |
|-------|---------------|---------|
| Push to main | `main`, `latest`, `sha-XXXXXX` | `main`, `latest`, `sha-abc1234` |
| Pull Request #N | `pr-N`, `sha-XXXXXX` | `pr-42`, `sha-def5678` |
| Feature Branch | `branch-name`, `sha-XXXXXX` | `feature-api-v2`, `sha-ghi9012` |

### Pull Images

```bash
# Pull latest from main branch
docker pull ghcr.io/somkheartk/admin-panel-material-backend:latest

# Pull specific version by SHA
docker pull ghcr.io/somkheartk/admin-panel-material-backend:sha-abc1234

# Pull from branch
docker pull ghcr.io/somkheartk/admin-panel-material-backend:main
```

### Run Container

```bash
# Run the backend
docker run -p 3001:3001 ghcr.io/somkheartk/admin-panel-material-backend:latest

# With environment variables
docker run -p 3001:3001 \
  -e DATABASE_URL=postgresql://... \
  ghcr.io/somkheartk/admin-panel-material-backend:latest
```

## 📁 Files

- `.github/workflows/docker-build-push.yml` - GitHub Actions workflow
- `DOCKER_BUILD_PIPELINE.md` - Detailed solution documentation
- `DOCKER_TAG_EXAMPLES.md` - Comprehensive examples and troubleshooting

## ✅ Key Features

- ✅ Valid Docker tags (no leading dashes)
- ✅ Multi-architecture support (amd64, arm64)
- ✅ Registry caching for fast builds
- ✅ Security attestations (SBOM, provenance)
- ✅ Smart push logic (build on PR, push on main)

## 🔍 Monitoring

Check workflow status:
1. Go to repository **Actions** tab
2. Select **Build and Push Docker Images**
3. View recent runs and logs

View published images:
1. Go to repository **Packages** section
2. Select **admin-panel-material-backend**
3. Browse available tags and versions

## 🛠️ Troubleshooting

### Workflow fails with "permission denied"
**Solution**: Enable package write permissions:
1. Go to Settings → Actions → General
2. Scroll to "Workflow permissions"
3. Select "Read and write permissions"

### Image not found when pulling
**Solution**: Authenticate with GitHub Container Registry:
```bash
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
```

### Build timeout
**Solution**: Increase timeout in workflow:
```yaml
jobs:
  build-and-push:
    timeout-minutes: 60  # Increase from default 360
```

## 📚 Documentation

- [DOCKER_BUILD_PIPELINE.md](./DOCKER_BUILD_PIPELINE.md) - Complete solution overview
- [DOCKER_TAG_EXAMPLES.md](./DOCKER_TAG_EXAMPLES.md) - Tag format examples and rules
- [GitHub Container Registry Docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

## 🔐 Security

- CodeQL: ✅ 0 vulnerabilities detected
- SBOM: ✅ Automatically generated
- Provenance: ✅ Build attestation included
- Permissions: ✅ Minimal required permissions

## 📝 What Was Fixed

**Problem**: Invalid Docker tag format with leading dash
```
ERROR: invalid tag "***/kyy-express-backend:-eee75eb"
                                                  ↑ Leading dash
```

**Solution**: Fixed prefixes for all tag types
```yaml
type=sha,prefix=sha-,format=short  # Always generates "sha-abc1234"
type=ref,event=pr,prefix=pr-       # Always generates "pr-42"
```

**Result**: All tags now follow valid Docker naming conventions ✅
