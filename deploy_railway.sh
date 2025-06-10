#!/bin/bash

echo "🚄 Starting Railway Deployment for CyberWise AI..."

# 检查Railway CLI
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# 登录Railway
echo "🔐 Login to Railway (will open browser)..."
railway login

# 创建项目
echo "🏗️ Creating Railway project..."
railway new

echo "🔧 Setting up environment variables..."
railway variables set PYTHON_VERSION=3.11
railway variables set FLASK_ENV=production
railway variables set PORT=8080

echo "📤 Deploying to Railway..."
railway up

echo "✅ Deployment initiated! Check Railway dashboard for progress."
echo "🌐 Your app will be available at: https://your-app.railway.app"

# 显示状态
railway status 