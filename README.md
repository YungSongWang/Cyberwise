# CyberWise 知识管理系统

一个现代化的个人知识管理系统，支持笔记管理、AI 写作助手和多语言界面。

## ✨ 功能特点

- 🔐 **用户认证系统** - 支持邮箱和用户名登录
- 📝 **笔记管理** - 创建、编辑、删除和收藏笔记
- 🤖 **AI 写作助手** - 集成 AI 功能帮助内容创作
- 🌍 **多语言支持** - 中英文界面切换
- 📱 **响应式设计** - 适配各种设备
- ☁️ **云端同步** - 基于 Firebase 的实时数据同步

## 🚀 快速开始

### 本地运行

```bash
# 克隆项目
git clone <your-repo-url>
cd cyberwise_new

# 启动本地服务器
python3 -m http.server 8001

# 访问应用
open http://localhost:8001/templates/login.html
```

### 在线部署

#### 方法 1: Vercel (推荐)

1. 将项目推送到 GitHub
2. 访问 [vercel.com](https://vercel.com)
3. 导入 GitHub 仓库
4. 自动部署完成

#### 方法 2: Netlify

1. 将项目推送到 GitHub
2. 访问 [netlify.com](https://netlify.com)
3. 连接 GitHub 仓库
4. 设置构建命令为空
5. 设置发布目录为 `.`

#### 方法 3: GitHub Pages

1. 推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择主分支作为源
4. 访问 `https://yourusername.github.io/cyberwise`

## 🛠️ 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **后端服务**: Firebase Authentication, Firestore Database
- **样式**: 自定义 CSS + Orbitron 字体
- **图标**: RemixIcon
- **部署**: Vercel / Netlify / GitHub Pages

## 📁 项目结构

```
cyberwise_new/
├── static/
│   ├── css/
│   │   └── style.css          # 统一样式文件
│   └── js/
│       ├── firebase-init.js   # Firebase配置
│       ├── language.js        # 多语言支持
│       ├── login.js          # 登录逻辑
│       ├── register.js       # 注册逻辑
│       └── dashboard.js      # 仪表板功能
├── templates/
│   ├── login.html           # 登录页面
│   ├── register.html        # 注册页面
│   └── dashboard.html       # 仪表板页面
├── vercel.json             # Vercel配置
├── package.json            # 项目配置
└── README.md              # 项目文档
```

## 🔧 配置说明

### Firebase 配置

项目使用 Firebase 作为后端服务，配置文件位于 `static/js/firebase-init.js`。

### 语言配置

多语言配置位于 `static/js/language.js`，支持中英文切换。

## 🌐 部署 URL 示例

- **Vercel**: `https://cyberwise.vercel.app`
- **Netlify**: `https://cyberwise.netlify.app`
- **GitHub Pages**: `https://yourusername.github.io/cyberwise`

## 📝 使用说明

1. **注册账号**: 使用邮箱和用户名注册
2. **登录系统**: 支持邮箱或用户名登录
3. **管理笔记**: 在笔记模块创建和管理您的知识
4. **语言切换**: 点击右上角语言按钮切换中英文
5. **退出登录**: 点击右上角退出按钮安全退出

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进项目。

## �� 许可证

MIT License
