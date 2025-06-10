// Netlify函数 - 文本分析API
// 模拟text_analyzer.py的功能，用于静态部署

const handler = async (event, context) => {
    // 设置CORS头
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // 处理预检请求
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // 只处理POST请求
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        // 解析请求数据
        const { text } = JSON.parse(event.body);

        if (!text || text.trim() === '') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'No text provided' })
            };
        }

        console.log('分析文本:', text);

        // 模拟情感分析
        const sentiment = analyzeSentiment(text);

        // 模拟文本分类
        const classification = classifyText(text);

        // 模拟相似文本匹配
        const similar_texts = findSimilarTexts(text);

        const result = {
            sentiment,
            classification,
            similar_texts
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result)
        };

    } catch (error) {
        console.error('API错误:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};

// 模拟情感分析函数 - 支持中英文
function analyzeSentiment(text) {
    const positiveWords = [
        // 中文正面词汇
        '好', '安全', '保护', '强', '优秀', '成功', '有效', '完善', '可靠', '稳定', '强大', '优化',
        // 英文正面词汇
        'good', 'safe', 'secure', 'protection', 'strong', 'excellent', 'success', 'effective',
        'reliable', 'stable', 'robust', 'optimize', 'best', 'better', 'great', 'powerful',
        'improved', 'enhanced', 'advanced', 'solid', 'trust', 'quality', 'perfect'
    ];

    const negativeWords = [
        // 中文负面词汇
        '攻击', '病毒', '恶意', '危险', '漏洞', '泄露', '入侵', '破坏', '威胁', '错误', '失败', '问题',
        // 英文负面词汇
        'attack', 'virus', 'malicious', 'malware', 'dangerous', 'vulnerability', 'breach',
        'hack', 'threat', 'risk', 'damage', 'compromise', 'exploit', 'phishing', 'trojan',
        'ransomware', 'spam', 'fraud', 'scam', 'unauthorized', 'suspicious', 'infected',
        'corrupted', 'exposed', 'leak', 'steal', 'error', 'fail', 'problem', 'issue'
    ];

    let score = 0;
    const words = text.toLowerCase().split(/\s+/);

    // 更精确的匹配 - 按单词匹配而不是字符串包含
    words.forEach(word => {
        // 移除标点符号
        const cleanWord = word.replace(/[^\w]/g, '');

        if (positiveWords.includes(cleanWord)) {
            score += 0.15;
        }
        if (negativeWords.includes(cleanWord)) {
            score -= 0.15;
        }
    });

    // 特殊关键词加权
    const highRiskWords = ['breach', 'hack', 'malware', 'ransomware', 'phishing', '攻击', '病毒', '入侵'];
    const highSecurityWords = ['secure', 'protection', 'safety', 'encryption', '安全', '保护', '加密'];

    highRiskWords.forEach(word => {
        if (text.toLowerCase().includes(word)) {
            score -= 0.3;
        }
    });

    highSecurityWords.forEach(word => {
        if (text.toLowerCase().includes(word)) {
            score += 0.2;
        }
    });

    // 限制在-1到1之间
    score = Math.max(-1, Math.min(1, score));

    let sentiment;
    if (score > 0.05) {
        sentiment = 'positive';
    } else if (score < -0.05) {
        sentiment = 'negative';
    } else {
        sentiment = 'neutral';
    }

    return {
        compound: parseFloat(score.toFixed(3)),
        sentiment: sentiment
    };
}

// 模拟文本分类函数 - 支持中英文
function classifyText(text) {
    const categories = {
        'Malware Protection': [
            // 中文
            '病毒', '恶意软件', '木马', '勒索软件', '感染', '杀毒',
            // 英文
            'malware', 'virus', 'trojan', 'ransomware', 'infection', 'antivirus', 'worm', 'spyware', 'adware'
        ],
        'Password Security': [
            // 中文
            '密码', '口令', '登录', '认证', '二次验证', '验证码',
            // 英文
            'password', 'authentication', 'login', 'credential', '2fa', 'mfa', 'verification', 'passcode'
        ],
        'Phishing Protection': [
            // 中文
            '钓鱼', '欺诈', '诈骗', '虚假网站', '邮件',
            // 英文
            'phishing', 'fraud', 'scam', 'fake', 'spoofing', 'deception', 'email', 'social engineering'
        ],
        'Network Security': [
            // 中文
            '网络', '防火墙', 'DDoS', '入侵', '攻击', 'VPN',
            // 英文
            'network', 'firewall', 'ddos', 'intrusion', 'attack', 'vpn', 'router', 'gateway', 'proxy'
        ],
        'Privacy Protection': [
            // 中文
            '隐私', '数据泄露', '个人信息', '信息安全',
            // 英文
            'privacy', 'data breach', 'personal information', 'leak', 'exposure', 'confidential', 'pii'
        ],
        'System Security': [
            // 中文
            '系统', '漏洞', '补丁', '更新', '安全配置',
            // 英文
            'system', 'vulnerability', 'patch', 'update', 'configuration', 'exploit', 'cve', 'security'
        ],
        'Data Backup': [
            // 中文
            '备份', '恢复', '数据', '存储',
            // 英文
            'backup', 'recovery', 'data', 'storage', 'restore', 'archive', 'sync'
        ],
        'General Security': [
            // 中文
            '安全', '防护', '保护', '管理',
            // 英文
            'security', 'protection', 'defense', 'management', 'policy', 'compliance', 'admin', 'guide'
        ]
    };

    const scores = {};
    let totalMatches = 0;

    // 计算每个类别的匹配得分 - 更精确的匹配
    const textWords = text.toLowerCase().split(/\s+/).map(word => word.replace(/[^\w]/g, ''));

    Object.entries(categories).forEach(([category, keywords]) => {
        let matches = 0;
        keywords.forEach(keyword => {
            // 完全匹配单词
            if (textWords.includes(keyword.toLowerCase())) {
                matches += 2; // 完全匹配权重更高
                totalMatches += 2;
            }
            // 部分匹配（包含关系）
            else if (text.toLowerCase().includes(keyword.toLowerCase())) {
                matches += 1;
                totalMatches += 1;
            }
        });
        scores[category] = matches;
    });

    // 如果没有匹配，默认为General Security
    if (totalMatches === 0) {
        scores['General Security'] = 1;
        totalMatches = 1;
    }

    // 找到最高得分的类别
    const predicted = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

    // 生成概率分布
    const probabilities = Object.entries(scores)
        .map(([category, score]) => [category, score / Math.max(totalMatches, 1)])
        .sort((a, b) => b[1] - a[1]);

    return {
        predicted,
        probabilities
    };
}

// 模拟相似文本查找函数
function findSimilarTexts(text) {
    const knowledgeBase = [
        {
            text: "如何防范恶意软件和病毒攻击，保护计算机系统安全",
            category: "恶意软件防护"
        },
        {
            text: "设置强密码和启用双因素认证的最佳实践",
            category: "密码安全"
        },
        {
            text: "识别和应对钓鱼邮件的有效方法",
            category: "钓鱼攻击防护"
        },
        {
            text: "配置防火墙和网络安全策略的指南",
            category: "网络安全"
        },
        {
            text: "个人信息保护和隐私安全管理",
            category: "隐私保护"
        },
        {
            text: "系统漏洞修复和安全更新管理",
            category: "系统安全"
        },
        {
            text: "重要数据备份和灾难恢复策略",
            category: "数据备份"
        },
        {
            text: "企业网络安全管理和监控方案",
            category: "网络安全"
        },
        {
            text: "移动设备安全和应用程序权限管理",
            category: "系统安全"
        },
        {
            text: "社交工程攻击防范和安全意识培训",
            category: "综合安全"
        }
    ];

    // 简单的关键词匹配算法
    const results = knowledgeBase.map(item => {
        const similarity = calculateSimilarity(text, item.text);
        return {
            text: item.text,
            similarity: similarity
        };
    }).filter(item => item.similarity > 0.1)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5);

    return results;
}

// 简单的相似度计算函数
function calculateSimilarity(text1, text2) {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);

    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = Math.max(words1.length, words2.length);

    return commonWords.length / totalWords;
}

module.exports = { handler }; 