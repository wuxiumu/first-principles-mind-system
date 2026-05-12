#!/bin/bash

# Build Vite frontend first
echo "🔨 Building frontend..."
npm run build

# Create symlink: dist/api -> server/
echo "🔗 Symlinking server/ to dist/api..."
rm -rf dist/api
ln -s "$(pwd)/server" "$(pwd)/dist/api"

# Copy router.php to dist root
echo "📋 Copying router.php to dist/..."
cp server/router.php dist/router.php

echo "✅ Done. dist/api -> $(readlink dist/api)"
echo "   Run: cd dist && php -S 0.0.0.0:8080 router.php"
