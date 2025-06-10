# 🚀 CyberWise AI Backend 部署指南

## 📋 部署方案

我们提供多种部署选项，确保 AI 功能始终可用：

### 1. Render (推荐) 🌟

**免费 tier，易部署，稳定性好**

#### 部署步骤：

1. **创建 Render 账户**: 访问 [render.com](https://render.com)
2. **连接 GitHub**: 授权 Render 访问你的 GitHub 仓库
3. **创建 Web Service**:
   - Repository: 选择你的 CyberWise 仓库
   - Branch: main
   - Root Directory: cyberwise_new
   - Environment: Python
   - Build Command: `pip install -r requirements_production.txt`
   - Start Command: `python app.py`
4. **环境变量配置**:
   ```
   FLASK_ENV=production
   PORT=10000
   ```
5. **部署**: 点击"Create Web Service"

#### 部署后的 URL：

```
https://cyberwise-ai-backend.onrender.com
```

### 2. Railway 🚄

**现代化平台，部署快速**

#### 部署步骤：

1. **安装 Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```
2. **登录并部署**:
   ```bash
   cd cyberwise_new
   railway login
   railway new
   railway up
   ```

### 3. Heroku 💜

**经典平台，需要付费计划**

#### 部署步骤：

1. **安装 Heroku CLI**
2. **创建应用**:
   ```bash
   cd cyberwise_new
   heroku create cyberwise-ai-backend
   git push heroku main
   ```

## 🔧 部署配置文件

项目已包含以下配置文件：

- **`render.yaml`** - Render 平台配置
- **`Procfile`** - Heroku/Railway 配置
- **`app.py`** - 生产环境入口文件
- **`requirements_production.txt`** - 精简依赖包

## ⚡ 本地测试

部署前请先本地测试：

```bash
# 安装生产依赖
pip install -r requirements_production.txt

# 设置环境变量
export FLASK_ENV=production
export PORT=5001

# 启动生产模式
python app.py
```

## 🌐 前端配置

前端已配置自动检测多个 API 服务器：

1. **本地开发服务器** (http://localhost:5001)
2. **线上 AI 后端** (https://cyberwise-ai-backend.onrender.com)
3. **Netlify 函数备用** (/.netlify/functions)

系统会按优先级自动切换，确保功能始终可用。

## 📊 性能优化

### 生产环境优化：

- **Gunicorn**: 多进程 WSGI 服务器
- **NumPy 版本锁定**: 避免兼容性问题
- **超时设置**: 防止长时间等待
- **错误恢复**: 自动 fallback 机制

### 监控指标：

- **启动时间**: ~30-60 秒 (首次下载模型)
- **响应时间**: ~1-3 秒
- **内存使用**: ~512MB-1GB
- **并发支持**: 2-4 个并发请求

## 🚨 故障排除

### 部署失败：

1. **检查依赖**: 确保 requirements_production.txt 正确
2. **内存限制**: 免费 tier 可能内存不足
3. **启动超时**: 增加启动时间限制

### API 无响应：

1. **检查日志**: 查看服务器错误日志
2. **模型加载**: 确保所有模型文件存在
3. **网络问题**: 检查 CORS 设置

### 性能问题：

1. **冷启动**: 免费服务器有冷启动延迟
2. **并发限制**: 考虑升级到付费计划
3. **缓存优化**: 预加载常用模型

## 🔄 更新部署

### 自动部署：

连接 GitHub 后，每次 push 到 main 分支会自动触发部署。

### 手动部署：

```bash
# Render - 通过网页界面手动触发
# Railway
railway up

# Heroku
git push heroku main
```

## 💡 最佳实践

1. **环境隔离**: 开发/测试/生产环境分离
2. **监控日志**: 定期检查应用日志
3. **性能监控**: 关注响应时间和错误率
4. **备份策略**: 多平台部署保证可用性
5. **版本管理**: 使用 Git tag 管理发布版本

## 📞 技术支持

如果遇到部署问题，请检查：

1. **GitHub 仓库**: 确保代码已推送
2. **环境变量**: 检查配置是否正确
3. **日志信息**: 查看详细错误信息
4. **资源限制**: 确认内存和时间限制

---

**🎯 部署目标**: 让 AI 分析功能在云端稳定运行，为用户提供 7x24 小时不间断的智能服务！
