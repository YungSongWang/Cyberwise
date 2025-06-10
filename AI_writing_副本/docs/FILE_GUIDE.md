# 📋 文件作用详细说明

## 🚀 一句话总结

这个 `AI_writing` 文件夹包含了从 CyberWise 项目中提取的核心 AI 文本分析功能，您可以直接复制这个文件夹到任何项目中使用。

## 📁 文件详细说明

### 📱 核心启动文件

| 文件               | 作用                | 使用方法                          |
| ------------------ | ------------------- | --------------------------------- |
| `start_server.py`  | 🎯 **一键启动脚本** | `python start_server.py`          |
| `requirements.txt` | 📦 **依赖包列表**   | `pip install -r requirements.txt` |

### 🔧 后端 API 服务器 (`api/` 文件夹)

| 文件               | 功能完整度    | 内存需求 | 主要功能                       |
| ------------------ | ------------- | -------- | ------------------------------ |
| `text_analyzer.py` | 🔴 **完整版** | ~1GB     | 情感分析、文本分类、相似度匹配 |
| `simple_api.py`    | 🟡 **简化版** | ~50MB    | 基础内容生成                   |

**选择建议:**

- ✅ 如果您需要完整的文本分析结果（如您看到的那种），使用 `text_analyzer.py`
- ✅ 如果只需要简单的内容生成，使用 `simple_api.py`

### 🧠 机器学习模型 (`models/` 文件夹)

| 文件                       | 大小  | 必需性  | 作用        |
| -------------------------- | ----- | ------- | ----------- |
| `svm_classifier.joblib`    | 223KB | 🔴 必需 | 文本分类器  |
| `new_dic_vader_for_IT.dic` | 430KB | 🔴 必需 | IT 情感词典 |
| `scaler.joblib`            | 1.9KB | 🔴 必需 | 数据标准化  |
| `keyword_to_index.joblib`  | 573B  | 🔴 必需 | 关键词映射  |

**重要**: 这些文件缺一不可，如果您想得到完整的分析结果！

### 📊 数据文件 (`data/` 文件夹)

| 文件          | 大小  | 作用                               |
| ------------- | ----- | ---------------------------------- |
| `task_4.xlsx` | 141KB | 385 个技术问题库，用于相似文本匹配 |

### 🌐 前端集成 (`frontend/` 文件夹)

| 文件                   | 用途                | 适用场景       |
| ---------------------- | ------------------- | -------------- |
| `ai_writing_client.js` | JavaScript 客户端库 | 集成到现有网站 |
| `example.html`         | 完整测试页面        | 功能测试和演示 |

## 🎯 快速使用提示词

### 情况 1: 我想在新网站中集成 AI 写作功能

```bash
# 1. 复制整个 AI_writing 文件夹到你的项目
cp -r AI_writing /path/to/your/project/

# 2. 进入文件夹并启动
cd /path/to/your/project/AI_writing
python start_server.py

# 3. 在你的HTML中引入客户端
<script src="AI_writing/frontend/ai_writing_client.js"></script>
```

### 情况 2: 我只想要简单的内容生成

```bash
# 只需要这些文件:
- api/simple_api.py
- requirements.txt (只安装 flask flask-cors)
- frontend/ai_writing_client.js

# 启动方式:
python api/simple_api.py
```

### 情况 3: 我想要完整的 AI 分析功能（像您看到的结果）

```bash
# 需要所有文件，特别是:
- api/text_analyzer.py
- models/* (所有模型文件)
- data/task_4.xlsx
- requirements.txt (完整依赖)

# 启动方式:
python start_server.py
```

## 🔌 集成代码示例

### JavaScript 调用

```javascript
// 基础调用
const aiClient = new AIWritingClient("http://localhost:5001");
const result = await aiClient.generateContent("人工智能");
console.log(result.content); // 就是您看到的分析结果
```

### Python 直接调用

```python
import requests

response = requests.post(
    'http://localhost:5001/api/generate-content',
    json={'prompt': '人工智能'}
)
result = response.json()
print(result['content'])  # 分析结果
```

### PHP 调用

```php
$data = json_encode(['prompt' => '人工智能']);
$ch = curl_init('http://localhost:5001/api/generate-content');
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
$analysis = json_decode($result, true);
echo $analysis['content']; // 分析结果
```

## 🎛️ 核心配置选项

### 端口配置

```python
# 在 api/text_analyzer.py 最后一行修改:
app.run(debug=True, port=5001)  # 改为你需要的端口

# 在前端调用时对应修改:
const aiClient = new AIWritingClient('http://localhost:新端口');
```

### API 地址配置

```javascript
// 生产环境使用
const aiClient = new AIWritingClient("https://your-domain.com");
```

## 📈 分析结果结构

您看到的分析结果包含以下部分：

```
# 文本分析结果

## 情感分析
- 情感得分: 数值
- 情感倾向: positive/negative/neutral

## 文本分类
- 预测类别: 技术领域分类
- 类别概率: 各类别的可能性百分比

## 相似文本
1-5. 相关的技术问题和相似度

## 建议内容
基于分析结果的写作建议
```

## 🚨 常见问题解决

| 问题                   | 解决方案                          |
| ---------------------- | --------------------------------- |
| ❌ ModuleNotFoundError | `pip install -r requirements.txt` |
| ❌ 端口被占用          | 修改 API 文件中的端口号           |
| ❌ 模型文件缺失        | 确保 `models/` 目录完整           |
| ❌ 内存不足            | 使用 `simple_api.py`              |

## 💡 最重要的提示

**如果您想得到和当前完全一样的 AI 分析结果**，您需要：

1. ✅ 使用 `api/text_analyzer.py`（不是 simple 版本）
2. ✅ 保证 `models/` 文件夹中所有 4 个文件完整
3. ✅ 安装完整的依赖包
4. ✅ 确保有足够的内存（建议 1GB 以上）

这样您就能得到包含情感分析、文本分类、相似文本匹配的完整结果！
