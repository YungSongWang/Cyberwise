// 语言配置
const languages = {
    en: {
        // 登录页面
        title: "CyberWise",
        usernamePlaceholder: "Email",
        passwordPlaceholder: "Password",
        signInBtn: "Sign In",
        signUpLink: "Don't have an account? Sign Up",

        // 注册页面
        createAccount: "Create Account",
        usernamePlaceholder2: "Username",
        emailPlaceholder: "Email",
        confirmPasswordPlaceholder: "Confirm Password",
        registerBtn: "Register",
        signInLink: "Already have an account? Sign In",
        registerSuccessful: "Registration successful! Welcome to CyberWise!",
        passwordMismatch: "Password mismatch",

        // Dashboard
        welcomeTitle: "Welcome to CyberWise Knowledge Base!",
        welcomeDesc: "Your personal knowledge management system. Use the sidebar to navigate between different sections.",
        quickActions: "Quick Actions:",
        createNewDoc: "Create New Document",
        viewNotes: "View Notes",
        browseKnowledgeBase: "🔍 Browse Knowledge Base",

        // 侧边栏
        searchPlaceholder: "Search Knowledge Base",
        menuStart: "Start",
        menuAI: "AI Writing",
        menuNotes: "Notes",
        menuFavorites: "User Guide",
        menuCommunity: "Community",
        knowledgeBase: "Knowledge Base",
        menuQuiz: "Quiz",
        logOut: "Log Out",

        // AI页面
        aiTitle: "AI Writing Assistant",
        aiDesc: "Use AI to help with your writing and knowledge creation.",
        aiPlaceholder: "Enter your prompt here...",
        generateBtn: "Generate Content",

        // 笔记页面
        notesTitle: "My Notes",
        notesDesc: "Personal note management system that supports creating, editing, and favoriting notes. Local storage ensures data security and supports rich text editing.",
        createNewNote: "Create New Document",
        noNotes: "No notes yet. Create your first note!",
        loadingNotes: "Loading notes...",
        errorNotes: "Error loading notes. Please try refreshing the page.",
        lastUpdated: "Last updated:",
        deleteBtn: "Delete",

        // 收藏页面
        favoritesTitle: "User Guide",
        favoritesDesc: "Your starred documents and important references.",
        userGuideTitle: "📖 CyberWise User Guide",
        userGuideDesc: "Welcome to CyberWise Cybersecurity Knowledge Management Platform! This guide will help you quickly understand and use our various features.",
        platformOverview: "🌟 Platform Overview",
        platformOverviewDesc: "CyberWise is a professional cybersecurity knowledge management and learning platform that integrates AI assistant, knowledge base, note management, online testing and other functions, aiming to help users improve cybersecurity awareness and skills.",
        aiWritingFeature: "🤖 AI Security Assistant",
        aiWritingDesc: "Intelligent AI assistant can help you analyze cybersecurity issues, automatically match related solutions, and provide professional advice. Supports natural language conversation.",
        knowledgeBaseFeature: "📚 Knowledge Base",
        knowledgeBaseDesc: "Rich cybersecurity knowledge base containing various security issues and solutions. Supports intelligent search and category filtering to help you quickly find the information you need.",
        notesFeature: "📝 Note Management",
        notesDesc: "Personal note management system that supports creating, editing, and favoriting notes. Local storage ensures data security and supports rich text editing.",
        quizFeature: "📊 Online Testing",
        quizDesc: "Online testing system with multiple question types including single choice and true/false questions. Real-time statistics help you test your learning effectiveness.",
        howToUse: "How to Use:",
        aiWritingHowTo: "Click 'AI Writing' in the sidebar, enter your security question, and AI will automatically analyze and provide relevant solutions.",
        knowledgeBaseHowTo: "Click 'Knowledge Base' to enter the knowledge base, use the search box to find related questions, or browse content through category filtering.",
        notesHowTo: "Click 'Notes' to enter the notes page, use 'Create New Document' to create new notes, supports favoriting and deleting operations.",
        quizHowTo: "Click 'Quiz' to enter the test page, select question type to start answering, the system will automatically record your answer history and scores.",
        quickStart: "🚀 Quick Start",
        step1: "Step 1: Browse Knowledge Base",
        step1Desc: "Visit the knowledge base to understand common security issues and solutions",
        step2: "Step 2: Experience AI Assistant",
        step2Desc: "Ask the AI assistant questions and get personalized security advice",
        step3: "Step 3: Take Tests",
        step3Desc: "Test your cybersecurity knowledge mastery through online tests",
        technicalFeatures: "⚙️ Technical Features",
        responsive: "Responsive Design",
        responsiveDesc: "Supports desktop and mobile access",
        localStorage: "Local Storage",
        localStorageDesc: "Data saved locally, protecting privacy",
        multiLanguage: "Multi-language Support",
        multiLanguageDesc: "Switch between Chinese and English interfaces anytime",
        security: "Secure & Reliable",
        securityDesc: "Focused on cybersecurity field",
        contactUs: "📞 Contact Us",
        contactDesc: "If you encounter any problems during use or have any suggestions, please feel free to contact us. We are committed to providing you with the best cybersecurity learning experience.",

        // 社区页面
        communityTitle: "Community",
        communityDesc: "Share knowledge and collaborate with others.",

        // 消息提示
        fillAllFields: "Please fill out all fields.",
        loginSuccessful: "Login successful!",
        loginFailed: "Login failed:",
        registrationSuccessful: "Registration successful! Welcome to CyberWise!",
        registrationFailed: "Registration failed:",
        noteCreated: "Note created successfully!",
        noteDeleted: "Note deleted successfully!",
        confirmDelete: "Are you sure you want to delete this note?",
        confirmLogout: "Are you sure you want to log out?",
        loggedOut: "You have been logged out.",
        notLoggedIn: "You are not logged in. Redirecting to login page...",

        // 工具栏
        language: "Language",
        logout: "Logout",

        // 创建文档模态框
        documentTitle: "Document Title",
        documentContent: "Document Content",
        titlePlaceholder: "Enter document title...",
        contentPlaceholder: "Enter document content...",
        cancelBtn: "Cancel",
        saveBtn: "Save Document",

        // AI Writing 模态框
        aiWritingTitle: "AI Writing Assistant",
        aiPromptLabel: "Writing Prompt",
        aiPromptPlaceholder: "Enter your writing prompt here...",

        // Quiz页面
        clearHistory: "clear",
        quizTypeChoice: "Single Choice",
        quizTypeTrueFalse: "True/False",
        quizTypeMixed: "Mixed",
        consecutiveCorrect: "Consecutive Correct",
        nextQuestion: "Next Question",
        optionTrue: "True",
        optionFalse: "False",
        answerCorrect: "Correct!",
        answerWrong: "Wrong!",
        allQuestionsDone: "Congratulations! You've completed all questions in the question bank! Amazing! Now clear history to start over.",

        // AI Writing 相关文本
        aiChatTitle: "🤖 AI Security Assistant",
        aiChatDesc: "Ask about cybersecurity questions and get intelligent recommendations",
        aiChatInputPlaceholder: "Describe your cybersecurity question...",
        aiChatFooter: "AI will automatically analyze problem types and match relevant solutions • Press Enter to send, Shift+Enter for new line",
        aiChatWelcome1: "👋 Hello! I'm CyberWise's AI security assistant.",
        aiChatWelcome2: "Please describe the cybersecurity issues you encounter, and I will automatically analyze the problem type and match the most relevant solutions for you.",
        aiChatSuggestions: "💡 You can try asking me:",
        aiChatSuggestion1: "🦠 Malware Issues",
        aiChatSuggestion2: "🔐 Password Security",
        aiChatSuggestion3: "📧 Phishing Attacks",
        aiChatSuggestion4: "🛡️ Network Protection",
        aiChatSuggestion1Text: "My computer seems to be infected with malware, how should I handle it?",
        aiChatSuggestion2Text: "How to set strong password policies?",
        aiChatSuggestion3Text: "How to identify and respond to phishing emails?",
        aiChatSuggestion4Text: "How to protect network security?",
        aiChatAnalyzing: "AI is analyzing your question...",
        aiChatError: "❌ Sorry, AI analysis failed, please try again.",
        aiChatAnalysisComplete: "✅ Analysis Complete!",
        aiChatCategoryIntro: "Problem category:",
        aiChatCategoryEnd: "category",
        aiChatSolutionsIntro: "Based on the analysis, I found the following relevant solutions:",
        aiChatMatchedQuestions: "📚 Related Questions:",
        aiChatViewDetail: "👁️ View details",
        aiChatNoMatches: "🔍 No directly matching solutions found in the knowledge base.",
        aiChatNoMatchesTip1: "💡 Recommendation 1: Try using more specific keywords",
        aiChatNoMatchesTip2: "💡 Recommendation 2: Browse the knowledge base for more solutions",
        aiChatNoMatchesTip3: "💡 Recommendation 3: Ask our cybersecurity experts for help",
        aiChatMoreHelp: "Need more help? You can browse",
        aiChatKnowledgeBase: "Knowledge Base",
        aiChatOrConsult: "or consult our experts.",
        aiChatCategoryMalware: "Malware & Virus",
        aiChatCategoryPassword: "Password Security",
        aiChatCategoryPhishing: "Phishing Attack",
        aiChatCategoryNetwork: "Network Security",
        aiChatCategoryPrivacy: "Privacy Protection",
        aiChatCategorySystem: "System Security",
        aiChatCategoryGeneral: "General Security",

        // AI Writing 新增文本
        aiChatInputLabel: "Ask about cybersecurity questions",
        aiChatSendBtn: "Send",
        aiChatConversation: "Conversation",
        aiChatWelcomeTitle: "Welcome to AI Security Assistant 🤖",
        aiChatStatSecurity: "Security Analysis",
        aiChatStatMatching: "Smart Matching",
        aiChatStatSolutions: "Solution Recommendations",
        aiChatStatFast: "Real-time Response",

        // Dashboard Start页面新增文本
        userGuideIntro: "New to CyberWise? Don't worry! Our detailed user guide will help you quickly master all features, from AI assistant to knowledge base search, making you a cybersecurity expert!",
        viewUserGuide: "View User Guide",
        tryAI: "Try Now",
        startQuiz: "Start Quiz",
        manageNotes: "Manage Notes",
        askAI: "Ask AI",
        takeQuiz: "Take Quiz",
        totalQuestions: "Knowledge Base Questions",
        mainCategories: "Main Categories",
        quizTypes: "Quiz Types",
        unlimitedNotes: "Unlimited Notes"
    },
    zh: {
        // 登录页面
        title: "CyberWise",
        usernamePlaceholder: "邮箱",
        passwordPlaceholder: "密码",
        signInBtn: "登录",
        signUpLink: "没有账户？立即注册",

        // 注册页面
        createAccount: "创建账号",
        usernamePlaceholder2: "用户名",
        emailPlaceholder: "邮箱",
        confirmPasswordPlaceholder: "确认密码",
        registerBtn: "注册",
        signInLink: "已有账号？立即登录",
        registerSuccessful: "注册成功！",
        passwordMismatch: "密码不匹配",

        // Dashboard
        welcomeTitle: "欢迎使用 CyberWise 知识库！",
        welcomeDesc: "您的个人知识管理系统。使用左侧边栏在不同功能间切换。",
        quickActions: "快速操作：",
        createNewDoc: "创建新文档",
        viewNotes: "查看笔记",
        browseKnowledgeBase: "🔍 浏览知识库",

        // 侧边栏
        searchPlaceholder: "搜索知识库",
        menuStart: "开始",
        menuAI: "AI 写作",
        menuNotes: "笔记",
        menuFavorites: "用户指南",
        menuCommunity: "社区",
        knowledgeBase: "知识库",
        menuQuiz: "Quiz",
        logOut: "退出登录",

        // AI页面
        aiTitle: "AI 写作助手",
        aiDesc: "使用 AI 帮助您进行写作和知识创作。",
        aiPlaceholder: "在此输入您的提示...",
        generateBtn: "生成内容",

        // 笔记页面
        notesTitle: "我的笔记",
        notesDesc: "个人笔记管理系统，支持创建、编辑和收藏笔记。本地存储确保数据安全，支持富文本编辑功能。",
        createNewNote: "创建新文档",
        noNotes: "还没有笔记。创建您的第一个笔记吧！",
        loadingNotes: "正在加载笔记...",
        errorNotes: "加载笔记时出错。请尝试刷新页面。",
        lastUpdated: "最后更新：",
        deleteBtn: "删除",

        // 收藏页面
        favoritesTitle: "用户指南",
        favoritesDesc: "您收藏的文档和重要参考资料。",
        userGuideTitle: "📖 CyberWise 用户指南",
        userGuideDesc: "欢迎使用 CyberWise 网络安全知识管理平台！本指南将帮助您快速了解和使用我们的各种功能。",
        platformOverview: "🌟 平台概览",
        platformOverviewDesc: "CyberWise 是一个专业的网络安全知识管理和学习平台，集成了 AI 助手、知识库、笔记管理、在线测试等功能，旨在帮助用户提高网络安全意识和技能。",
        aiWritingFeature: "🤖 AI 安全助手",
        aiWritingDesc: "智能AI助手可以帮助您分析网络安全问题，自动匹配相关解决方案，并提供专业建议。支持自然语言对话。",
        knowledgeBaseFeature: "📚 知识库",
        knowledgeBaseDesc: "丰富的网络安全知识库，包含各种安全问题和解决方案。支持智能搜索和分类过滤，帮助您快速找到所需信息。",
        notesFeature: "📝 笔记管理",
        notesDesc: "个人笔记管理系统，支持创建、编辑和收藏笔记。本地存储确保数据安全，支持富文本编辑功能。",
        quizFeature: "📊 在线测试",
        quizDesc: "在线测试系统，包含单选题和判断题等多种题型。实时统计帮助您测试学习效果。",
        howToUse: "如何使用：",
        aiWritingHowTo: "点击左侧边栏的 'AI 写作'，输入安全问题，AI 将自动分析并提供相关解决方案。",
        knowledgeBaseHowTo: "点击 '知识库' 进入知识库，使用搜索框查找相关问题，或通过分类过滤浏览内容。",
        notesHowTo: "点击 '笔记' 进入笔记页面，使用 '创建新文档' 创建新笔记，支持收藏和删除操作。",
        quizHowTo: "点击 'Quiz' 进入测试页面，选择题型开始答题，系统将自动记录您的答题历史和分数。",
        quickStart: "🚀 快速开始",
        step1: "步骤 1：浏览知识库",
        step1Desc: "访问知识库以了解常见安全问题和解决方案",
        step2: "步骤 2：体验 AI 助手",
        step2Desc: "向 AI 助手提问并获取个性化安全建议",
        step3: "步骤 3：参加测试",
        step3Desc: "通过在线测试测试您的网络安全知识掌握程度",
        technicalFeatures: "⚙️ 技术特性",
        responsive: "响应式设计",
        responsiveDesc: "支持桌面和移动访问",
        localStorage: "本地存储",
        localStorageDesc: "数据本地保存，保护隐私",
        multiLanguage: "多语言支持",
        multiLanguageDesc: "随时切换中文和英文界面",
        security: "安全可靠",
        securityDesc: "专注于网络安全领域",
        contactUs: "📞 联系我们",
        contactDesc: "如果您在使用过程中遇到任何问题或有任何建议，请随时联系我们。我们致力于为您提供最佳的网络安全学习体验。",

        // 社区页面
        communityTitle: "社区",
        communityDesc: "与他人分享知识并协作。",

        // 消息提示
        fillAllFields: "请填写所有字段。",
        loginSuccessful: "登录成功！",
        loginFailed: "登录失败：",
        registrationSuccessful: "注册成功！欢迎使用 CyberWise！",
        registrationFailed: "注册失败：",
        noteCreated: "笔记创建成功！",
        noteDeleted: "笔记删除成功！",
        confirmDelete: "您确定要删除这个笔记吗？",
        confirmLogout: "您确定要退出登录吗？",
        loggedOut: "您已退出登录。",
        notLoggedIn: "您未登录。正在跳转到登录页面...",

        // 工具栏
        language: "语言",
        logout: "退出",

        // 创建文档模态框
        documentTitle: "文档标题",
        documentContent: "文档内容",
        titlePlaceholder: "输入文档标题...",
        contentPlaceholder: "输入文档内容...",
        cancelBtn: "取消",
        saveBtn: "保存文档",

        // AI Writing 模态框
        aiWritingTitle: "AI 写作助手",
        aiPromptLabel: "写作提示",
        aiPromptPlaceholder: "在此输入您的写作提示...",

        // Quiz页面
        clearHistory: "clear",
        quizTypeChoice: "Single Choice",
        quizTypeTrueFalse: "True/False",
        quizTypeMixed: "Mixed",
        consecutiveCorrect: "连续答对",
        nextQuestion: "下一题",
        optionTrue: "True",
        optionFalse: "False",
        answerCorrect: "正确！",
        answerWrong: "错误！",
        allQuestionsDone: "恭喜！您已完成题库中的所有题目！太棒了！现在清空历史记录重新开始吧。",

        // AI Writing 相关文本
        aiChatTitle: "🤖 AI 安全助手",
        aiChatDesc: "询问网络安全问题，获得智能推荐",
        aiChatInputPlaceholder: "描述您遇到的网络安全问题...",
        aiChatFooter: "AI将自动分析问题类型并匹配相关解决方案 • 回车发送，Shift+回车换行",
        aiChatWelcome1: "👋 您好！我是CyberWise的AI安全助手。",
        aiChatWelcome2: "请描述您遇到的网络安全问题，我将自动分析问题类型并为您匹配最相关的解决方案。",
        aiChatSuggestions: "💡 You can try asking me:",
        aiChatSuggestion1: "🦠 恶意软件问题",
        aiChatSuggestion2: "🔐 密码安全",
        aiChatSuggestion3: "📧 钓鱼攻击",
        aiChatSuggestion4: "🛡️ 网络防护",
        aiChatSuggestion1Text: "我的电脑似乎感染了恶意软件，应该如何处理？",
        aiChatSuggestion2Text: "如何设置强密码策略？",
        aiChatSuggestion3Text: "如何识别和应对钓鱼邮件？",
        aiChatSuggestion4Text: "如何保护网络安全？",
        aiChatAnalyzing: "AI正在分析您的问题...",
        aiChatError: "❌ 抱歉，AI分析失败，请重试。",
        aiChatAnalysisComplete: "✅ 分析完成！",
        aiChatCategoryIntro: "问题类别：",
        aiChatCategoryEnd: "类",
        aiChatSolutionsIntro: "根据分析，我找到了以下相关解决方案：",
        aiChatMatchedQuestions: "📚 相关问题：",
        aiChatViewDetail: "👁️ 查看详情",
        aiChatNoMatches: "🔍 知识库中未找到直接匹配的解决方案。",
        aiChatNoMatchesTip1: "💡 建议1：尝试使用更具体的关键词",
        aiChatNoMatchesTip2: "💡 建议2：浏览知识库寻找更多解决方案",
        aiChatNoMatchesTip3: "💡 建议3：咨询我们的网络安全专家",
        aiChatMoreHelp: "需要更多帮助？您可以浏览",
        aiChatKnowledgeBase: "知识库",
        aiChatOrConsult: "或咨询我们的专家。",
        aiChatCategoryMalware: "恶意软件和病毒",
        aiChatCategoryPassword: "密码安全",
        aiChatCategoryPhishing: "钓鱼攻击",
        aiChatCategoryNetwork: "网络安全",
        aiChatCategoryPrivacy: "隐私保护",
        aiChatCategorySystem: "系统安全",
        aiChatCategoryGeneral: "常规安全",

        // AI Writing 新增文本
        aiChatInputLabel: "询问网络安全问题",
        aiChatSendBtn: "发送",
        aiChatConversation: "对话",
        aiChatWelcomeTitle: "欢迎使用AI安全助手 🤖",
        aiChatStatSecurity: "安全分析",
        aiChatStatMatching: "智能匹配",
        aiChatStatSolutions: "解决方案推荐",
        aiChatStatFast: "实时响应",

        // Dashboard Start页面新增文本
        userGuideIntro: "初次使用CyberWise？别担心！我们的详细使用指南将帮助您快速掌握所有功能，从AI助手到知识库搜索，让您成为网络安全专家！",
        viewUserGuide: "查看使用指南",
        tryAI: "立即体验",
        startQuiz: "开始测试",
        manageNotes: "管理笔记",
        askAI: "咨询AI",
        takeQuiz: "开始测试",
        totalQuestions: "知识库问题",
        mainCategories: "主要分类",
        quizTypes: "测试类型",
        unlimitedNotes: "无限笔记"
    }
};

// 当前语言
let currentLanguage = localStorage.getItem('cyberwise-language') || 'en';

// 获取文本
function getText(key) {
    return languages[currentLanguage][key] || languages.en[key] || key;
}

// 切换语言
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    localStorage.setItem('cyberwise-language', currentLanguage);
    updateLanguage();
    updateLanguageButton();
}

// 更新语言按钮显示
function updateLanguageButton() {
    const langBtn = document.getElementById('language-btn');
    if (langBtn) {
        langBtn.textContent = currentLanguage === 'en' ? '中文' : 'English';
        langBtn.classList.toggle('active', currentLanguage === 'zh');
    }
}

// 更新页面语言
function updateLanguage() {
    // 更新所有带有 data-lang 属性的元素
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        const text = getText(key);

        if (element.tagName === 'INPUT') {
            element.placeholder = text;
        } else {
            element.textContent = text;
        }
    });

    // 更新页面标题
    const titleKey = document.body.getAttribute('data-page');
    if (titleKey) {
        document.title = getText('title') + ' - ' + getText(titleKey);
    }
}

// 初始化语言
function initLanguage() {
    updateLanguage();
    updateLanguageButton();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initLanguage); 