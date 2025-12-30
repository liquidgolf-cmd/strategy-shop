#!/bin/bash

# Dad Advice App - Quick Start Script
# This script helps you set up the development environment

set -e  # Exit on error

echo "👨 Dad Advice App - Quick Start"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the dad-advice-app directory"
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed. Please install Node.js and npm first."
    exit 1
fi

echo "📦 Step 1: Installing dependencies..."
echo ""
npm install

echo ""
echo "✅ Dependencies installed!"
echo ""

# Check if .env exists
if [ -f ".env" ]; then
    echo "✅ .env file found"
else
    echo "⚠️  No .env file found"
    echo ""
    echo "📝 Creating .env from template..."
    if [ -f "env.example" ]; then
        cp env.example .env
        echo "✅ Created .env file"
        echo ""
        echo "🔑 IMPORTANT: You need to add your API keys to the .env file"
        echo ""
        echo "Please add these API keys to .env:"
        echo "  1. ANTHROPIC_API_KEY (from console.anthropic.com)"
        echo "  2. GOOGLE_CLOUD_TTS_API_KEY (from console.cloud.google.com)"
        echo "  3. YOUTUBE_API_KEY (from console.cloud.google.com)"
        echo ""
        echo "See API_SETUP_GUIDE.md for detailed instructions"
        echo ""
        read -p "Press Enter when you've added your API keys..."
    else
        echo "❌ env.example not found. Please create .env manually."
        exit 1
    fi
fi

echo ""
echo "🚀 Everything is set up!"
echo ""
echo "Next steps:"
echo "  1. Make sure your API keys are in .env"
echo "  2. Run: npm run dev"
echo "  3. Open: http://localhost:5173"
echo ""
echo "📚 Documentation:"
echo "  - API_SETUP_GUIDE.md - How to get API keys"
echo "  - DEPLOYMENT.md - How to deploy to Vercel"
echo "  - PROJECT_SUMMARY.md - Complete project overview"
echo ""
echo "Happy coding! 👨‍💻"

