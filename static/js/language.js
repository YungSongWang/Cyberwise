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
        menuFavorites: "Favorites",
        menuCommunity: "Community",
        knowledgeBase: "Knowledge Base",
        logOut: "Log Out",

        // AI页面
        aiTitle: "AI Writing Assistant",
        aiDesc: "Use AI to help with your writing and knowledge creation.",
        aiPlaceholder: "Enter your prompt here...",
        generateBtn: "Generate Content",

        // 笔记页面
        notesTitle: "My Notes",
        notesDesc: "Manage your personal notes and documents.",
        noNotes: "No notes yet. Create your first note!",
        loadingNotes: "Loading notes...",
        errorNotes: "Error loading notes. Please try refreshing the page.",
        lastUpdated: "Last updated:",
        deleteBtn: "Delete",

        // 收藏页面
        favoritesTitle: "Favorites",
        favoritesDesc: "Your starred documents and important references.",

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
        quizTypeChoice: "Choice",
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
        aiChatStatFast: "Real-time Response"
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
        menuFavorites: "收藏",
        menuCommunity: "社区",
        knowledgeBase: "知识库",
        logOut: "退出登录",

        // AI页面
        aiTitle: "AI 写作助手",
        aiDesc: "使用 AI 帮助您进行写作和知识创作。",
        aiPlaceholder: "在此输入您的提示...",
        generateBtn: "生成内容",

        // 笔记页面
        notesTitle: "我的笔记",
        notesDesc: "管理您的个人笔记和文档。",
        noNotes: "还没有笔记。创建您的第一个笔记吧！",
        loadingNotes: "正在加载笔记...",
        errorNotes: "加载笔记时出错。请尝试刷新页面。",
        lastUpdated: "最后更新：",
        deleteBtn: "删除",

        // 收藏页面
        favoritesTitle: "收藏夹",
        favoritesDesc: "您收藏的文档和重要参考资料。",

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
        quizTypeChoice: "Choice",
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
        aiChatSuggestions: "💡 您可以试着问我：",
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
        aiChatStatFast: "实时响应"
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