#!/bin/bash

# CDPTA Platform Deployment Script
# This script builds and prepares the application for deployment

echo "🚀 Starting CDPTA Platform Deployment..."
echo ""

# Step 1: Clean previous build
echo "📦 Cleaning previous build..."
rm -rf dist

# Step 2: Install dependencies (if needed)
echo "📥 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Step 3: Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📊 Build Statistics:"
    du -sh dist
    
    echo ""
    echo "📁 Output directory: dist/"
    echo ""
    echo "🎉 Deployment package is ready!"
    echo ""
    echo "Next steps:"
    echo "1. Upload the 'dist' folder to your hosting provider"
    echo "2. Configure your web server for SPA routing"
    echo "3. Set up environment variables (if needed)"
    echo ""
    echo "For testing locally, run: npm run preview"
else
    echo ""
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
