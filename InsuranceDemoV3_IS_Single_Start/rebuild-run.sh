#!/bin/bash
# Full rebuild and start script
# Cleans everything, rebuilds containers, and starts services

set -e

echo "========================================="
echo "Step 1: Cleaning up existing containers and volumes"
echo "========================================="
yes | ./stop.sh --remove-all

echo ""
echo "========================================="
echo "Step 2: Building Docker images"
echo "========================================="
docker-compose build

echo ""
echo "========================================="
echo "Step 3: Starting services"
echo "========================================="
./start.sh

echo ""
echo "Complete rebuild and startup finished!"
