#!/bin/bash

# CalisVerse Live Deployment Script
# Run this script to push changes to your live website

echo "🚀 Deploying CalisVerse changes to live website..."

# Add all changes
git add .

# Get commit message from user or use default
if [ -z "$1" ]; then
    COMMIT_MSG="Update CalisVerse website"
else
    COMMIT_MSG="$1"
fi

# Commit changes
git commit -m "$COMMIT_MSG"

# Push to GitHub (goes live automatically)
git push

echo "✅ Changes pushed! Your website will be live in 1-2 minutes at:"
echo "https://ariatmohamed.github.io/calisverse-store/calisverse-enhanced.html"
