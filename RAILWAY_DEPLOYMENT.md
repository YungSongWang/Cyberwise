# 🚄 Railway 部署指南

## 📋 **准备工作完成**

- ✅ Railway CLI 已安装
- ✅ 配置文件已优化
- ✅ 依赖包已设置

## 🚀 **部署步骤**

### **方法 1：自动脚本（推荐）**

```bash
chmod +x deploy_railway.sh
./deploy_railway.sh
```

### **方法 2：手动步骤**

#### 1. **登录 Railway**

```bash
railway login
```

_会打开浏览器，用 GitHub 账号登录_

#### 2. **创建新项目**

```bash
railway new
```

_项目名称建议：cyberwise-ai-backend_

#### 3. **设置环境变量**

```bash
railway variables set PYTHON_VERSION=3.11
railway variables set FLASK_ENV=production
railway variables set PORT=8080
```

#### 4. **部署代码**

```bash
railway up
```

#### 5. **获取 URL**

```bash
railway domain
```

## 🔧 **配置详情**

### **自动检测配置**

Railway 会自动：

- 📦 检测 Python 项目
- 📋 使用 requirements_production.txt
- 🚀 运行 `python app.py`
- 🌐 分配域名

### **内存配置**

- 💾 **默认**: 2GB 内存
- 💾 **可升级**: 最高 32GB
- 💰 **费用**: $5/月起

## 📊 **预期部署时间**

1. **登录**: 30 秒
2. **创建项目**: 30 秒
3. **上传代码**: 2-3 分钟
4. **构建**: 3-5 分钟
5. **启动 AI 模型**: 2-3 分钟

**总计**: 8-12 分钟

## 🎯 **成功标志**

部署成功后您会看到：

```
✅ Deployment successful
🌐 Your service is live at: https://cyberwise-ai-backend-production.railway.app
```

## 🔍 **监控和调试**

```bash
# 查看日志
railway logs

# 查看状态
railway status

# 查看域名
railway domain
```

## 💡 **费用说明**

- **免费试用**: $5 账户余额
- **正式使用**: $5/月起
- **内存**: 2GB 够用，如需更多可升级

## 🆘 **常见问题**

### **Q: 如果部署失败？**

A: 查看日志 `railway logs` 诊断问题

### **Q: 如何更新代码？**

A: 直接运行 `railway up`

### **Q: 费用如何？**

A: 只有使用时才计费，每月大约$5-10

## 🎉 **下一步**

部署成功后：

1. 测试 API 端点
2. 更新前端配置
3. 享受云端 AI 功能！
