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
        menuQuiz: "Quiz",
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
        quizTypeChoice: "Multiple Choice",
        quizTypeTrueFalse: "True/False",
        quizTypeMixed: "Mixed",
        consecutiveCorrect: "Consecutive Correct",
        clearHistory: "Clear",
        nextQuestion: "Next Question",
        loadingQuestions: "Loading questions...",
        answerCorrect: "Correct!",
        answerWrong: "Wrong! Correct answer: ",
        allQuestionsDone: "Congratulations! You've completed all questions in the question bank! Amazing! Now clear history to start over.",
        optionTrue: "True",
        optionFalse: "False"
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
        menuQuiz: "测验",
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
        quizTypeChoice: "选择题",
        quizTypeTrueFalse: "判断题",
        quizTypeMixed: "混合题",
        consecutiveCorrect: "连续答对次数",
        clearHistory: "清空",
        nextQuestion: "下一题",
        loadingQuestions: "题目加载中...",
        answerCorrect: "答对了！",
        answerWrong: "答错了！正确答案：",
        allQuestionsDone: "什么？你竟然做完了题库全部题目！Σヽ(ﾟД ﾟ; )ﾉ 真是不可思议！现在清空历史重新再做一遍吧",
        optionTrue: "正确",
        optionFalse: "错误"
    }
};

// 当前语言
let currentLanguage = localStorage.getItem('cyberwise-language') || 'en';

// 将currentLanguage绑定到window对象，确保全局可访问
window.currentLanguage = currentLanguage;

// 获取文本
function getText(key) {
    return languages[currentLanguage][key] || languages.en[key] || key;
}

// 切换语言
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    window.currentLanguage = currentLanguage; // 同步更新window对象上的变量
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

    // 触发语言切换事件
    document.dispatchEvent(new CustomEvent('languageChanged'));
}

// 初始化语言
function initLanguage() {
    updateLanguage();
    updateLanguageButton();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initLanguage); 