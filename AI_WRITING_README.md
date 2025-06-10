# CyberWise AI Writing 功能说明

## 概述

CyberWise AI Writing 是一个专业的网络安全内容生成工具，集成了智能对话和文档生成功能。

## 功能特性

### 🤖 AI 智能对话

- 自然语言问答
- 网络安全问题分析
- 智能解决方案推荐
- 实时威胁分析

### ✍️ AI 内容生成

- 专业安全文档生成
- 威胁分析报告
- 安全策略制定
- 培训材料创建

## 安装与运行

### 前提条件

- Python 3.7+
- Node.js (可选，用于前端开发)

### 安装依赖

```bash
# 安装Python依赖
pip install -r requirements.txt
```

### 启动服务

#### 方法一：使用启动脚本（推荐）

```bash
# 进入项目目录
cd cyberwise_new

# 运行启动脚本
python start_server.py
```

#### 方法二：手动启动

```bash
# 启动后端API服务器
cd cyberwise_new/api
python simple_text_analyzer.py

# 在另一个终端启动前端服务器
cd cyberwise_new
python -m http.server 8080
```

### 访问应用

- **前端地址**: http://localhost:8080/templates/login.html
- **API 地址**: http://localhost:5000

## 使用指南

### 1. 登录系统

使用 Firebase 认证登录到 CyberWise 平台。

### 2. 访问 AI 功能

- 点击侧边栏的"AI Writing"
- 选择"智能问答"或"AI 写作"模式

### 3. 智能问答模式

- 输入网络安全相关问题
- AI 会自动分析问题类型
- 提供相关解决方案和建议
- 匹配知识库中的相似问题

### 4. AI 写作模式

- 输入写作提示，例如：
  - "请分析密码安全的最佳实践"
  - "如何防护 DDoS 攻击"
  - "制定企业网络安全策略"
- AI 会生成专业的安全文档
- 可以保存到笔记或复制内容

## API 接口说明

### 1. 内容生成接口

```
POST /api/generate-content
Content-Type: application/json

{
  "prompt": "请分析密码安全的最佳实践"
}
```

响应：

```json
{
  "title": "密码安全管理最佳实践",
  "content": "详细的安全文档内容...",
  "category": "密码安全"
}
```

### 2. 文本分析接口

```
POST /api/analyze-text
Content-Type: application/json

{
  "text": "如何防护网络攻击"
}
```

### 3. 健康检查接口

```
GET /api/health
```

## 支持的安全领域

### 密码安全

- 密码策略制定
- 多因素认证
- 密码管理器使用
- 密码泄露应对

### 网络安全

- 网络架构设计
- 防火墙配置
- 入侵检测防护
- 零信任架构

### 恶意软件防护

- 端点保护策略
- 威胁检测分析
- 应急响应流程
- 系统加固措施

## 技术架构

### 前端技术

- HTML5 + CSS3 + JavaScript
- Firebase Authentication
- 响应式设计
- 实时消息更新

### 后端技术

- Flask Web 框架
- CORS 跨域支持
- RESTful API 设计
- 模板化内容生成

### 部署方案

- Netlify 静态托管
- 本地开发服务器
- Docker 容器化（可选）

## 故障排除

### 常见问题

1. **API 服务器启动失败**

   - 检查端口 5000 是否被占用
   - 确认 Python 依赖已正确安装
   - 查看控制台错误信息

2. **前端无法连接 API**

   - 确认 API 服务器正在运行
   - 检查浏览器控制台错误
   - 确认 CORS 配置正确

3. **生成内容质量不佳**
   - 使用更具体的提示词
   - 描述清楚具体需求
   - 尝试不同的关键词组合

### 日志查看

API 服务器日志会显示在控制台，包含：

- 请求处理信息
- 错误详细信息
- 内容生成状态

## 开发指南

### 添加新的安全领域

1. 在`simple_text_analyzer.py`中的`SECURITY_TEMPLATES`字典添加新条目
2. 定义关键词列表
3. 编写内容模板
4. 更新分类逻辑

### 自定义内容模板

模板格式：

```python
'新领域': {
    'keywords': ['关键词1', '关键词2'],
    'content': """
# 标题

## 概述
内容描述...

## 详细内容
具体信息...
"""
}
```

### 前端功能扩展

主要文件：

- `templates/dashboard.html` - 主界面
- `static/js/dashboard.js` - 交互逻辑
- `static/css/style.css` - 样式定义

## 版本历史

### v1.0.0

- 基础 AI 对话功能
- 简化版内容生成
- 双模式界面
- 知识库集成

### 未来计划

- 更智能的内容生成
- 多语言支持
- 高级分析功能
- 企业级部署方案

## 贡献指南

欢迎提交 Issues 和 Pull Requests 来改进 AI Writing 功能。

## 许可证

MIT License

## 联系我们

如有问题，请联系开发团队。
