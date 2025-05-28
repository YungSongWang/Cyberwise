#!/bin/bash

echo "🚀 CyberWise 部署脚本"
echo "===================="

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

echo "📋 选择部署方式:"
echo "1. Vercel (推荐)"
echo "2. Netlify"
echo "3. GitHub Pages"
echo "4. 本地测试"

read -p "请输入选项 (1-4): " choice

case $choice in
    1)
        echo "🔄 准备 Vercel 部署..."
        
        # 检查是否安装了 Vercel CLI
        if ! command -v vercel &> /dev/null; then
            echo "📦 安装 Vercel CLI..."
            npm install -g vercel
        fi
        
        echo "🚀 开始部署到 Vercel..."
        vercel --prod
        
        echo "✅ Vercel 部署完成!"
        echo "🌐 您的应用将在几分钟内可用"
        ;;
        
    2)
        echo "🔄 准备 Netlify 部署..."
        
        # 检查是否安装了 Netlify CLI
        if ! command -v netlify &> /dev/null; then
            echo "📦 安装 Netlify CLI..."
            npm install -g netlify-cli
        fi
        
        echo "🚀 开始部署到 Netlify..."
        netlify deploy --prod --dir .
        
        echo "✅ Netlify 部署完成!"
        ;;
        
    3)
        echo "📋 GitHub Pages 部署说明:"
        echo "1. 将项目推送到 GitHub 仓库"
        echo "2. 在仓库设置中启用 GitHub Pages"
        echo "3. 选择主分支作为源"
        echo "4. 访问 https://yourusername.github.io/cyberwise"
        
        read -p "是否现在推送到 GitHub? (y/n): " push_github
        if [ "$push_github" = "y" ]; then
            git add .
            git commit -m "Deploy: Update CyberWise for GitHub Pages"
            git push origin main
            echo "✅ 已推送到 GitHub!"
        fi
        ;;
        
    4)
        echo "🔄 启动本地测试服务器..."
        echo "🌐 访问: http://localhost:8001/templates/login.html"
        python3 -m http.server 8001
        ;;
        
    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac

echo ""
echo "🎉 部署流程完成!"
echo "�� 更多信息请查看 README.md" 