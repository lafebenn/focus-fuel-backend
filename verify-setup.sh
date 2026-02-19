#!/bin/bash

# FocusFuel Setup Verification Script
# This script checks if all components are properly configured

echo "🔍 FocusFuel Setup Verification"
echo "================================"
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "  Node.js installed: $NODE_VERSION"
else
    echo "  ❌ Node.js not found. Please install Node.js v18+"
    exit 1
fi

# Check npm
echo "✓ Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "  npm installed: $NPM_VERSION"
else
    echo "  ❌ npm not found."
    exit 1
fi

# Check PostgreSQL
echo "✓ Checking PostgreSQL..."
if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version)
    echo "  PostgreSQL installed: $PSQL_VERSION"
else
    echo "  ❌ PostgreSQL not found. Please install PostgreSQL 16+"
    exit 1
fi

# Check if PostgreSQL is running
echo "✓ Checking PostgreSQL status..."
if pg_isready &> /dev/null; then
    echo "  PostgreSQL is running ✓"
else
    echo "  ⚠️  PostgreSQL is not running or not accessible"
fi

# Check backend dependencies
echo "✓ Checking backend dependencies..."
if [ -d "backend/node_modules" ]; then
    echo "  Backend dependencies installed ✓"
else
    echo "  ⚠️  Backend dependencies not installed. Run: cd backend && npm install"
fi

# Check frontend dependencies
echo "✓ Checking frontend dependencies..."
if [ -d "frontend/node_modules" ]; then
    echo "  Frontend dependencies installed ✓"
else
    echo "  ⚠️  Frontend dependencies not installed. Run: cd frontend && npm install"
fi

# Check .env files
echo "✓ Checking environment configuration..."
if [ -f "backend/.env" ]; then
    echo "  Backend .env exists ✓"
else
    echo "  ⚠️  Backend .env not found. Copy from .env.example"
fi

if [ -f "frontend/.env" ]; then
    echo "  Frontend .env exists ✓"
else
    echo "  ℹ️  Frontend .env not found (optional, defaults will work)"
fi

echo ""
echo "================================"
echo "✅ Verification complete!"
echo ""
echo "Next steps:"
echo "1. If backend .env missing: cd backend && cp .env.example .env"
echo "2. Create database: psql -U postgres -c 'CREATE DATABASE focusfuel_db;'"
echo "3. Run schema: psql -U postgres -d focusfuel_db -f backend/db/schema.sql"
echo "4. Run seed: psql -U postgres -d focusfuel_db -f backend/db/seed.sql"
echo "5. Start backend: cd backend && npm run dev"
echo "6. Start frontend: cd frontend && npm run dev"
