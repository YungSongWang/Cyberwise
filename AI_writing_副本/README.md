# 🤖 AI Writing 模块

这是一个独立的 AI 写作分析模块，可以轻松集成到任何网站项目中。该模块提供智能文本分析和内容生成功能。

## 📁 文件结构

```
AI_writing/
├── README.md                    # 本文档
├── requirements.txt             # Python依赖列表
├── api/                        # 后端API服务器
│   ├── text_analyzer.py        # 完整版API服务器（包含所有AI功能）
│   └── simple_api.py           # 简化版API服务器（轻量级）
├── models/                     # 机器学习模型文件
│   ├── svm_classifier.joblib    # SVM文本分类器模型
│   ├── scaler.joblib           # 数据标准化器
│   ├── keyword_to_index.joblib # 关键词索引映射
│   └── new_dic_vader_for_IT.dic # IT领域情感分析词典
├── data/                       # 数据文件
│   └── task_4.xlsx             # 用于相似文本匹配的数据集
├── frontend/                   # 前端集成示例
│   ├── ai_writing_client.js    # JavaScript客户端库
│   └── example.html            # 使用示例页面
└── docs/                       # 文档目录
    └── API.md                  # API文档（待创建）
```

## 🎯 功能特性

### ✨ 核心功能

- **情感分析**: 基于 VADER 算法 + IT 专业词典
- **文本分类**: SVM 机器学习分类器，支持 20 个类别
- **相似文本匹配**: 基于 SentenceTransformer 语义相似度
- **智能内容生成**: 综合分析结果生成结构化内容

### 📊 分析输出

- 情感倾向和得分
- 文本分类结果和概率分布
- 相似文本推荐（Top 5）
- 智能写作建议

## 🚀 快速开始

### 1. 安装依赖

```bash
cd AI_writing
pip install -r requirements.txt
```

### 2. 启动 API 服务器

```bash
# 完整版（包含所有AI功能）
python api/text_analyzer.py

# 或者简化版（轻量级）
python api/simple_api.py
```

### 3. 测试功能

打开 `frontend/example.html` 在浏览器中测试功能

### 4. API 调用示例

```javascript
// 引入客户端库
const aiClient = new AIWritingClient("http://localhost:5001");

// 生成内容
aiClient
  .generateContent("人工智能技术")
  .then((result) => {
    console.log("标题:", result.title);
    console.log("内容:", result.content);
  })
  .catch((error) => {
    console.error("错误:", error.message);
  });
```

## 📝 核心文件说明

### 🔧 API 服务器文件

#### `api/text_analyzer.py` - 完整版 API 服务器

**作用**: 提供完整的 AI 文本分析功能
**包含功能**:

- 情感分析（VADER + IT 词典）
- SVM 文本分类
- 语义相似度匹配
- 智能内容生成

**运行要求**:

- Python 3.8+
- 约 90MB 的 SentenceTransformer 模型（首次运行自动下载）
- 内存需求: ~1GB

#### `api/simple_api.py` - 简化版 API 服务器

**作用**: 提供轻量级的内容生成服务
**包含功能**:

- 基础模板内容生成
- 简化的 API 接口

**运行要求**:

- 只需 Flask 和基础库
- 内存需求: ~50MB

### 🧠 机器学习模型文件

#### `models/svm_classifier.joblib` (223KB)

**作用**: 文本分类器，支持 20 个 IT 技术类别
**功能**: 将输入文本分类到具体的技术领域

#### `models/new_dic_vader_for_IT.dic` (430KB)

**作用**: IT 领域专业情感词典
**功能**: 提高情感分析在技术文本上的准确性

#### `models/scaler.joblib` (1.9KB)

**作用**: 数据标准化器
**功能**: 对特征向量进行标准化处理

#### `models/keyword_to_index.joblib` (573B)

**作用**: 关键词索引映射
**功能**: 将文本特征转换为模型输入格式

### 📊 数据文件

#### `data/task_4.xlsx` (141KB)

**作用**: 相似文本匹配数据库
**内容**: 包含 385 个技术问题和答案
**功能**: 用于语义相似度匹配和推荐

### 🌐 前端集成文件

#### `frontend/ai_writing_client.js`

**作用**: JavaScript 客户端库
**功能**:

- 封装 API 调用逻辑
- 错误处理
- 服务器健康检查

#### `frontend/example.html`

**作用**: 完整的使用示例
**功能**:

- 可视化测试界面
- API 调用演示
- 结果展示

## 🔌 集成到你的项目

### 方法 1: 直接引入 JavaScript 客户端

```html
<script src="path/to/AI_writing/frontend/ai_writing_client.js"></script>
<script>
  const aiClient = new AIWritingClient("http://your-api-server:5001");
  // 使用客户端...
</script>
```

### 方法 2: 复制核心文件

1. 复制 `api/` 和 `models/` 目录到你的项目
2. 安装依赖: `pip install -r requirements.txt`
3. 启动 API 服务器
4. 使用 HTTP 请求调用 API

### 方法 3: Docker 部署（推荐生产环境）

```dockerfile
# 可以创建Dockerfile来容器化部署
FROM python:3.9
COPY AI_writing/ /app/
WORKDIR /app
RUN pip install -r requirements.txt
CMD ["python", "api/text_analyzer.py"]
```

## 📡 API 接口文档

### POST `/api/generate-content`

**请求体**:

```json
{
  "prompt": "你的写作提示"
}
```

**响应**:

```json
{
  "title": "生成的标题",
  "content": "完整的分析内容（包含情感分析、分类结果、相似文本等）"
}
```

## 🛠️ 自定义和扩展

### 更换分类模型

1. 替换 `models/svm_classifier.joblib`
2. 更新 `models/keyword_to_index.joblib`
3. 重启 API 服务器

### 添加新的情感词汇

1. 编辑 `models/new_dic_vader_for_IT.dic`
2. 格式: `词汇\t情感值\t强度`

### 扩展数据集

1. 更新 `data/task_4.xlsx`
2. 保持相同的列结构

## 🔧 故障排除

### 常见问题

1. **模块导入错误**

   ```bash
   pip install flask flask-cors sentence-transformers scikit-learn pandas openpyxl vaderSentiment
   ```

2. **端口被占用**

   - 修改 API 文件中的端口号
   - 或者终止占用端口的进程

3. **模型文件缺失**

   - 确保所有 `models/` 目录下的文件完整
   - 检查文件权限

4. **内存不足**
   - 使用 `simple_api.py` 替代完整版
   - 或增加服务器内存

## 📈 性能优化

- **生产环境**: 使用 Gunicorn 或 uWSGI 部署
- **缓存**: 可以添加 Redis 缓存常用结果
- **负载均衡**: 支持多实例部署

## 📄 许可证

本模块基于原项目许可证，请确保遵守相关条款。

---

**开发者提示**: 这个模块是从 CyberWise 项目中提取的核心 AI 功能，经过重新组织和文档化，方便独立使用和集成。
