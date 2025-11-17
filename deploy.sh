#!/bin/bash

# =====================================================
# Beerzen.com.ar Deployment Script
# =====================================================
# Deployment and restart script for Beerzen application
# Adapted from LegalAxIA deployment script
# Usage:
#   ./deploy.sh         - Normal deployment (git pull)
#   ./deploy.sh --force - Force deployment (reset to remote)
# =====================================================

set -e  # Exit on error

# Configuration
APP_NAME="beerzen.com.ar"
APP_DIR="/var/www/html/beerzen"
APP_PORT=3030
PM2_APP_NAME="beerzen.com.ar"
GIT_BRANCH="main"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}=====================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}=====================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if force mode
FORCE_MODE=false
if [ "$1" = "--force" ]; then
    FORCE_MODE=true
    print_warning "Force mode enabled - will reset to remote state"
fi

# =====================================================
# Step 1: Kill processes on port 3030
# =====================================================
print_header "Step 1: Checking port $APP_PORT"

if lsof -Pi :$APP_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "Port $APP_PORT is in use"
    PID=$(lsof -Pi :$APP_PORT -sTCP:LISTEN -t)
    print_info "Killing process $PID on port $APP_PORT"
    kill -9 $PID 2>/dev/null || true
    sleep 2
    print_success "Port $APP_PORT freed"
else
    print_success "Port $APP_PORT is available"
fi

# =====================================================
# Step 2: Stop PM2 application
# =====================================================
print_header "Step 2: Stopping PM2 application"

if pm2 describe "$PM2_APP_NAME" > /dev/null 2>&1; then
    pm2 stop "$PM2_APP_NAME" || true
    pm2 delete "$PM2_APP_NAME" || true
    print_success "PM2 application stopped"
else
    print_info "PM2 application not running"
fi

# =====================================================
# Step 3: Navigate to application directory
# =====================================================
print_header "Step 3: Navigating to $APP_DIR"

cd "$APP_DIR" || {
    print_error "Failed to navigate to $APP_DIR"
    exit 1
}
print_success "Current directory: $(pwd)"

# =====================================================
# Step 4: Clean cache and temporary files
# =====================================================
print_header "Step 4: Cleaning cache files"

# Frontend cache
rm -rf frontend/.vite
rm -rf frontend/dist
rm -rf frontend/node_modules/.cache

# Backend cache
rm -rf backend/node_modules/.cache

print_success "Cache cleaned"

# =====================================================
# Step 5: Git operations
# =====================================================
print_header "Step 5: Updating code from Git"

# Test GitHub connection
print_info "Testing GitHub connection..."
if ! ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    print_error "Cannot connect to GitHub via SSH"
    exit 1
fi
print_success "GitHub connection OK"

if [ "$FORCE_MODE" = true ]; then
    print_warning "Force mode: Creating backup stash"
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    git stash save "auto-backup-before-force-$TIMESTAMP" || true

    print_info "Fetching latest changes..."
    git fetch origin

    print_info "Resetting to origin/$GIT_BRANCH..."
    git reset --hard origin/$GIT_BRANCH

    print_info "Cleaning untracked files..."
    git clean -fd

    print_success "Force reset completed"
else
    print_info "Pulling latest changes..."

    if ! git pull origin $GIT_BRANCH; then
        print_error "Git pull failed!"
        print_info "Possible causes:"
        print_info "  - Local changes conflict with remote"
        print_info "  - Branches have diverged"
        print_info "Solutions:"
        print_info "  1. Run with --force flag to reset to remote"
        print_info "  2. Manually resolve conflicts"
        exit 1
    fi

    print_success "Code updated from Git"
fi

# =====================================================
# Step 6: Install dependencies
# =====================================================
print_header "Step 6: Installing dependencies"

# Frontend dependencies
print_info "Installing frontend dependencies..."
cd frontend
npm install --timeout=300000 || {
    print_error "Frontend npm install failed"
    exit 1
}
print_success "Frontend dependencies installed"

# Backend dependencies
print_info "Installing backend dependencies..."
cd ../backend
npm install --timeout=300000 || {
    print_error "Backend npm install failed"
    exit 1
}
print_success "Backend dependencies installed"

cd ..

# =====================================================
# Step 7: Verify environment variables
# =====================================================
print_header "Step 7: Verifying environment variables"

# Check frontend .env.local
if [ ! -f "frontend/.env.local" ]; then
    print_error "frontend/.env.local not found!"
    print_info "Please create frontend/.env.local with required variables"
    exit 1
fi

# Check backend .env
if [ ! -f "backend/.env" ]; then
    print_error "backend/.env not found!"
    print_info "Please create backend/.env with required variables"
    exit 1
fi

# Verify critical backend variables
ENV_FILE="backend/.env"
REQUIRED_VARS=("SUPABASE_URL" "SUPABASE_SERVICE_ROLE_KEY" "SUPABASE_JWT_SECRET")

for VAR in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^$VAR=" "$ENV_FILE"; then
        print_error "Missing required variable: $VAR in $ENV_FILE"
        exit 1
    fi
done

print_success "Environment variables verified"

# =====================================================
# Step 8: Build frontend
# =====================================================
print_header "Step 8: Building frontend"

cd frontend

if ! npm run build; then
    print_error "Frontend build failed!"
    print_info "Troubleshooting:"
    print_info "  1. Check frontend/.env.local variables"
    print_info "  2. Review build errors above"
    print_info "  3. Test locally: cd frontend && npm run build"
    exit 1
fi

print_success "Frontend build completed"
cd ..

# =====================================================
# Step 9: Start application with PM2
# =====================================================
print_header "Step 9: Starting application with PM2"

cd backend

# Start with PM2
pm2 start src/server.js \
    --name "$PM2_APP_NAME" \
    --node-args="--max-old-space-size=512" \
    --time \
    --log-date-format "YYYY-MM-DD HH:mm:ss Z"

# Save PM2 configuration
pm2 save

print_success "Application started with PM2"

# =====================================================
# Step 10: Deployment summary
# =====================================================
print_header "Deployment Summary"

echo ""
print_success "🍺 Beerzen deployment completed successfully!"
echo ""
print_info "Application: $APP_NAME"
print_info "Port: $APP_PORT"
print_info "Environment: production"
print_info "Frontend: Built and ready"
print_info "Backend: Running on PM2"
echo ""
print_info "Useful commands:"
echo "  - View logs:    pm2 logs $PM2_APP_NAME"
echo "  - Monitor:      pm2 monit"
echo "  - Status:       pm2 status"
echo "  - Restart:      pm2 restart $PM2_APP_NAME"
echo "  - Stop:         pm2 stop $PM2_APP_NAME"
echo ""
print_info "Health check: http://localhost:$APP_PORT/health"
echo ""
print_success "Deployment finished! 🎉"
echo ""
