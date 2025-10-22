# Docker Build Pipeline Setup

## Problem Statement

The issue was to set up a Docker build and push pipeline that avoids invalid Docker tag formats. The specific error that needed to be prevented was:

```
ERROR: failed to build: invalid tag "***/kyy-express-backend:-eee75eb": invalid reference format
```

This error occurs when Docker tags are created with a leading dash (e.g., `:-eee75eb`), which violates Docker's tag naming rules.

## Root Cause

The invalid tag format typically occurs when using `docker/metadata-action` with improper tag configuration, such as:
- Using dynamic prefixes that could be empty (e.g., `prefix={{branch}}-`)
- Not specifying explicit prefixes for tag types
- Creating tags directly from git SHAs without proper prefixing

Docker tag naming rules:
- Tags must not start with a period or dash
- Tags are limited to 128 characters
- Tags can contain lowercase/uppercase letters, digits, underscores, periods, and dashes

## Solution

Created a GitHub Actions workflow (`.github/workflows/docker-build-push.yml`) that properly formats Docker tags:

### Key Features

1. **Fixed Prefixes**: Uses static prefixes to ensure tags never start with a dash
   - `type=sha,prefix=sha-,format=short` → Generates tags like `sha-abc1234`
   - `type=ref,event=pr,prefix=pr-` → Generates tags like `pr-123`
   - `type=ref,event=branch` → Generates tags like `main` or `develop`

2. **Multi-Architecture Support**: Builds for both `linux/amd64` and `linux/arm64`

3. **Caching**: Implements registry caching for faster builds

4. **Security**: Includes SBOM generation and build provenance attestation

5. **Conditional Push**: Only pushes images on non-PR events

### Generated Tags

For a PR (pull request #5):
- `pr-5`
- `sha-abc1234`

For main branch:
- `main`
- `latest`
- `sha-abc1234`

## Workflow Configuration

The workflow is triggered on:
- Push to `main` branch (when backend or workflow files change)
- Pull requests to `main` branch
- Manual workflow dispatch

## Testing

The workflow configuration has been validated with:
- YAML syntax validation using yamllint
- Tag format verification against Docker naming conventions
- Proper permission scopes for GitHub Container Registry

## Usage

Once merged, the workflow will automatically:
1. Build Docker images when backend code changes
2. Push images to GitHub Container Registry (ghcr.io)
3. Generate proper tags without leading dashes
4. Create security attestations

## Security Considerations

- Uses GitHub's OIDC token for authentication
- Generates SBOM (Software Bill of Materials)
- Creates build provenance attestations
- Follows principle of least privilege with minimal permissions
