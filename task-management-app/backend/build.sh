#!/bin/bash
# Simple build script for Render deployment

echo "Starting build process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Clean dist directory
echo "Cleaning dist directory..."
rm -rf dist

# Build TypeScript
echo "Building TypeScript..."
npx tsc

echo "Build completed successfully!"

# List the contents of dist to verify build
echo "Contents of dist directory:"
ls -la dist/
