# 🤖 CyberWise AI Writing 后端服务器指南

## 🚀 快速启动

### 方法 1: 使用启动脚本 (推荐)

```bash
cd cyberwise_new
python run_ai_server.py
```

### 方法 2: 直接运行

```bash
cd cyberwise_new
python -c "
import sys
sys.path.append('.')
from api_backend.text_analyzer import app
app.run(debug=True, port=5001, host='0.0.0.0')
"
```

## 📋 功能说明

### ✅ 本地 AI 后端提供的功能：

1. **🎯 高精度情感分析** - 基于 VADER + 自定义 IT 词典
2. **🔍 智能文本分类** - 使用 SVM 分类器，支持 8 个安全类别
3. **🔗 相似文本匹配** - 基于 SentenceTransformer 的语义相似度
4. **📊 概率分布显示** - 每个类别的置信度评分

### 🌐 云端备用方案：

- 如果本地服务器无法连接，自动切换到 Netlify Functions
- 提供基础的关键词匹配分析

## 🧪 测试步骤

### 1. 启动后端服务器

```bash
python run_ai_server.py
```

看到以下信息表示启动成功：

```
🚀 Starting CyberWise AI Backend Server...
📍 Server URL: http://localhost:5001
💡 Tip: Press Ctrl+C to stop the server
🌐 Frontend will automatically connect to this backend service
--------------------------------------------------
* Running on all addresses (0.0.0.0)
* Running on http://127.0.0.1:5001
```

### 2. 测试 API 连通性

在另一个终端运行：

```bash
curl -X POST http://localhost:5001/api/analyze-text \
  -H "Content-Type: application/json" \
  -d '{"text": "malware detection and removal guide"}'
```

### 3. 前端测试

1. 访问: https://cyberwise.netlify.app
2. 登录到系统
3. 进入 AI Writing 功能
4. 输入英文安全问题，例如：
   - "malware detection and removal"
   - "password security best practices"
   - "phishing email identification"

## 🔧 故障排除

### 问题 1: 依赖包错误

```bash
pip install -r requirements.txt
```

### 问题 2: 模型文件缺失

确保以下文件存在：

- `models/svm_classifier.joblib`
- `models/scaler.joblib`
- `models/keyword_to_index.joblib`
- `models/new_dic_vader_for_IT.dic`
- `data/task_4.xlsx`

### 问题 3: 端口冲突

如果 5001 端口被占用，修改 `run_ai_server.py` 中的端口号

### 问题 4: CORS 跨域问题

本地服务器已配置 CORS，如果仍有问题，检查浏览器控制台

## 📊 API 接口文档

### POST /api/analyze-text

**请求格式:**

```json
{
  "text": "your security question here"
}
```

**响应格式:**

```json
{
  "sentiment": {
    "compound": 0.523,
    "sentiment": "positive"
  },
  "classification": {
    "predicted": "Malware Protection",
    "probabilities": [
      ["Malware Protection", 0.85],
      ["System Security", 0.12],
      ["General Security", 0.03]
    ]
  },
  "similar_texts": [
    {
      "text": "How to remove malware from infected computer",
      "similarity": 0.89
    }
  ]
}
```

## 🎯 使用示例

### 英文测试案例：

1. **恶意软件** - "malware detection and removal guide"
2. **密码安全** - "password security best practices"
3. **钓鱼攻击** - "phishing email identification tips"
4. **网络安全** - "firewall configuration for home network"
5. **隐私保护** - "data privacy protection methods"

### 预期结果：

- 情感分析: neutral (0.0) - positive (0.8)
- 分类准确率: > 80%
- 相似文本匹配: 3-5 个相关问题

## 🚀 性能指标

- **启动时间**: ~10-15 秒 (首次加载模型)
- **响应时间**: ~0.5-2 秒 (取决于文本长度)
- **内存使用**: ~500MB-1GB
- **准确率**:
  - 情感分析: 85%+
  - 文本分类: 82%+
  - 相似度匹配: 90%+

## 📝 开发模式

启用调试模式可以看到详细的处理日志：

```bash
export FLASK_DEBUG=1
python run_ai_server.py
```
