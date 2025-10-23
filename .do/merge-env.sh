#!/bin/bash
# Script to merge environment variables from env.yaml into app.yaml
# This allows separation of sensitive env vars from the main app configuration

set -e

# Check if env.yaml exists
if [ ! -f ".do/env.yaml" ]; then
  echo "Error: .do/env.yaml not found"
  echo "Please create .do/env.yaml from .do/env.yaml.example"
  exit 1
fi

# Check if yq is installed
if ! command -v yq &> /dev/null; then
  echo "Installing yq..."
  sudo wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64
  sudo chmod +x /usr/local/bin/yq
fi

# Create a temporary merged spec file
cp .do/app.yaml /tmp/app-merged.yaml

# Extract envs from env.yaml and merge into app.yaml
yq eval-all 'select(fileIndex == 0).services[0].envs = select(fileIndex == 1).envs | select(fileIndex == 0)' \
  /tmp/app-merged.yaml .do/env.yaml > /tmp/app-final.yaml

echo "Environment variables merged successfully"
cat /tmp/app-final.yaml
