# Quick Reference: Environment Variables

## 🚀 Quick Start

### For CI/CD (No action needed)
Environment variables are automatically managed through GitHub Secrets.

### For Manual Deployment

```bash
# 1. Create your env file
cp .do/env.yaml.example .do/env.yaml

# 2. Edit with your values
nano .do/env.yaml

# 3. Deploy
cd .do && ./merge-env.sh
doctl apps update <APP_ID> --spec /tmp/app-final.yaml
```

## 📋 File Structure

```
.do/
├── app.yaml              # Main config (no secrets)
├── env.yaml.example      # Template (safe to commit)
├── env.yaml              # Your values (DO NOT COMMIT)
├── merge-env.sh          # Helper script
└── README.md            # Full documentation
```

## 🔐 Required Secrets

GitHub Secrets (Settings → Secrets → Actions):
- `DIGITALOCEAN_ACCESS_TOKEN`
- `MONGODB_URI`

## ⚙️ Environment Variables

| Variable | Value | Scope |
|----------|-------|-------|
| `PORT` | `3001` | Standard |
| `NODE_ENV` | `production` | Standard |
| `MONGODB_URI` | Connection string | SECRET |

## ✅ Checklist

- [ ] `.do/env.yaml` is in `.gitignore`
- [ ] GitHub Secrets are configured
- [ ] `.do/env.yaml.example` is up to date
- [ ] Workflow uses merged configuration

## 🔧 Troubleshooting

**Error: "env.yaml not found"**
```bash
cp .do/env.yaml.example .do/env.yaml
```

**Error: "yq not found"**
```bash
# macOS: brew install yq
# Linux: See ENV_SEPARATION_GUIDE.md
```

**Need help?**
- See: `ENV_SEPARATION_GUIDE.md`
- See: `.do/README.md`

## 🎯 Best Practices

✅ Use GitHub Secrets for sensitive data
✅ Keep `.do/env.yaml` local only
✅ Update `.do/env.yaml.example` when adding variables
✅ Test locally before pushing

❌ Never commit `.do/env.yaml`
❌ Never hardcode secrets in workflows
❌ Never share production secrets

---

**Quick Links:**
- [Full Guide](../ENV_SEPARATION_GUIDE.md)
- [Deployment Guide](../backend/DEPLOYMENT_APP_PLATFORM.md)
