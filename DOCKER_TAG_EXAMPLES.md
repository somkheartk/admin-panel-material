# Docker Build Pipeline - Tag Format Examples

## Problem Fixed

The original error showed an invalid Docker tag format:
```
ERROR: failed to build: invalid tag "***/kyy-express-backend:-eee75eb": invalid reference format
```

The tag `:-eee75eb` is invalid because Docker tags cannot start with a dash or period.

## Solution Implementation

### Tag Generation Rules

Our workflow uses `docker/metadata-action@v5` with carefully configured tag types:

```yaml
tags: |
  type=ref,event=branch           # Branch name as-is
  type=ref,event=pr,prefix=pr-    # PR number with 'pr-' prefix
  type=sha,prefix=sha-,format=short  # Git SHA with 'sha-' prefix
  type=raw,value=latest,enable={{is_default_branch}}  # 'latest' for default branch
```

### Why This Works

1. **Fixed Prefixes**: Each tag type uses a static prefix (`sha-`, `pr-`) that ensures the tag never starts with a dash
2. **No Dynamic Prefixes**: Avoided patterns like `prefix={{branch}}-` which could result in `:-abc123` if branch name is empty
3. **Explicit Format**: Clear specification of what each tag should look like

## Tag Examples by Scenario

### Scenario 1: Main Branch Push
```
Event: Push to main branch
Commit: abc1234567890

Generated Tags:
✅ ghcr.io/somkheartk/admin-panel-material-backend:main
✅ ghcr.io/somkheartk/admin-panel-material-backend:latest
✅ ghcr.io/somkheartk/admin-panel-material-backend:sha-abc1234
```

### Scenario 2: Pull Request
```
Event: Pull request #42
Commit: def4567890123

Generated Tags (built but not pushed):
✅ ghcr.io/somkheartk/admin-panel-material-backend:pr-42
✅ ghcr.io/somkheartk/admin-panel-material-backend:sha-def4567
```

### Scenario 3: Feature Branch
```
Event: Push to feature/api-v2
Commit: ghi7890123456

Generated Tags:
✅ ghcr.io/somkheartk/admin-panel-material-backend:feature-api-v2
✅ ghcr.io/somkheartk/admin-panel-material-backend:sha-ghi7890
```

## Docker Tag Naming Rules

Docker tags must follow these rules:
- ✅ Can contain: lowercase/uppercase letters, digits, underscores, periods, dashes
- ❌ Cannot start with: period (.) or dash (-)
- ❌ Cannot end with: period (.)
- ✅ Maximum length: 128 characters
- ✅ Valid examples: `v1.0.0`, `sha-abc123`, `pr-42`, `main`, `2024-10-22`
- ❌ Invalid examples: `-abc123`, `.hidden`, `tag.`, `:orphan`

## Comparison: Before vs After

### Before (Problematic Pattern)
```yaml
# This could generate invalid tags
tags: |
  type=sha,prefix={{branch}}-,format=short
  # If branch is empty or contains only "-": results in ":-abc123"
```

**Result**: `:-eee75eb` ❌ (Invalid - starts with dash)

### After (Fixed Pattern)
```yaml
# This always generates valid tags
tags: |
  type=sha,prefix=sha-,format=short
  # Always results in "sha-abc123"
```

**Result**: `:sha-eee75eb` ✅ (Valid - has proper prefix)

## Workflow Features

### Multi-Architecture Support
Builds images for both AMD64 and ARM64 architectures:
```yaml
platforms: linux/amd64,linux/arm64
```

### Registry Caching
Uses registry cache for faster subsequent builds:
```yaml
cache-from: type=registry,ref=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:buildcache
cache-to: type=registry,ref=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:buildcache,mode=max
```

### Security Features
- SBOM (Software Bill of Materials) generation
- Build provenance attestation
- Minimal permissions (principle of least privilege)

### Smart Push Logic
```yaml
push: ${{ github.event_name != 'pull_request' }}
```
- Builds on PRs but doesn't push (saves registry space)
- Pushes on main branch and manual triggers

## Testing the Workflow

To test the workflow:

1. **Trigger on PR**: Open a PR that modifies backend code
   - Workflow will build but not push
   - Check Actions tab for build logs

2. **Trigger on Push**: Merge PR to main
   - Workflow will build and push to registry
   - Images available at `ghcr.io/somkheartk/admin-panel-material-backend`

3. **Manual Trigger**: Use workflow_dispatch
   - Go to Actions → Build and Push Docker Images → Run workflow

## Verifying Tags

After a successful run, verify tags:

```bash
# List all tags for the image
docker pull ghcr.io/somkheartk/admin-panel-material-backend:main
docker images | grep admin-panel-material-backend

# Check tag format
echo "ghcr.io/somkheartk/admin-panel-material-backend:sha-abc1234" | grep -E "^[a-zA-Z0-9._/-]+:[a-zA-Z0-9._-]+$" && echo "Valid" || echo "Invalid"
```

## Troubleshooting

### Issue: Tags still have leading dashes
**Solution**: Ensure you're using fixed prefixes, not dynamic ones. Check the `prefix=` value in tag configuration.

### Issue: Workflow fails with authentication error
**Solution**: Verify that the repository has package write permissions enabled in Settings → Actions → General.

### Issue: Multi-arch builds timing out
**Solution**: Increase timeout or reduce to single architecture initially:
```yaml
platforms: linux/amd64  # Start with one platform
```

## References

- [Docker Tag Naming Rules](https://docs.docker.com/engine/reference/commandline/tag/)
- [docker/metadata-action Documentation](https://github.com/docker/metadata-action)
- [docker/build-push-action Documentation](https://github.com/docker/build-push-action)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
