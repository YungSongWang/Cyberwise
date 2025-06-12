// Netlify云端AI函数 - 为所有用户提供智能文本分析
// 版本: v3.0 - 企业级AI分析服务
// 更新: 2025-06-11 - 全面升级智能分析算法

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
        return { statusCode: 200, headers, body: '' };
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

        console.log('🔍 Cloud AI analyzing:', text.substring(0, 100));

        // 执行高级AI分析
        const sentiment = analyzeSentimentAdvanced(text);
        const classification = classifyTextAdvanced(text);
        const similar_texts = findSimilarTextsAdvanced(text);

        const result = {
            sentiment,
            classification,
            similar_texts,
            server_info: {
                provider: 'Netlify Cloud Functions',
                version: '3.0',
                timestamp: new Date().toISOString()
            }
        };

        console.log('✅ Cloud AI analysis completed');
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result)
        };

    } catch (error) {
        console.error('❌ Cloud AI error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'AI服务暂时不可用，请稍后重试' })
        };
    }
};

// 高级情感分析 - 支持中英文，智能上下文理解
function analyzeSentimentAdvanced(text) {
    // 预处理文本
    const normalizedText = text.toLowerCase().trim();

    // 识别问句和学习意图
    const learningPatterns = [
        /\b(how to|how can|how do|what is|what are|why|when|where|which)\b/gi,
        /\b(如何|怎么|什么是|为什么|哪里|哪个|怎样|如何|最佳|方法|步骤)\b/g,
        /\b(learn|study|understand|guide|tutorial|help|教程|学习|指南|帮助)\b/gi
    ];

    const isLearningIntent = learningPatterns.some(pattern => pattern.test(text));

    // 防护/安全意图词汇
    const securityIntentWords = [
        'protect', 'prevent', 'defend', 'secure', 'avoid', 'stop', 'block', 'guard',
        'identify', 'detect', 'respond', 'handle', 'manage', 'configure', 'setup',
        'implement', 'establish', 'develop', 'create', 'build', 'design', 'fix',
        '保护', '防护', '防止', '避免', '识别', '检测', '应对', '处理', '配置', '建立', '修复'
    ];

    const hasSecurityIntent = securityIntentWords.some(word =>
        normalizedText.includes(word)
    );

    // 积极情感词汇（权重分级）
    const positiveWords = {
        high: ['excellent', 'perfect', 'outstanding', 'amazing', 'fantastic', '完美', '优秀', '杰出'],
        medium: ['good', 'great', 'effective', 'reliable', 'strong', 'secure', 'safe', '好', '有效', '可靠', '安全'],
        low: ['ok', 'fine', 'decent', 'acceptable', '还行', '可以', '不错']
    };

    // 消极情感词汇（只在真实威胁语境下计分）
    const negativeWords = {
        high: ['infected', 'compromised', 'breached', 'hacked', 'stolen', 'destroyed', '感染', '被黑', '被盗', '破坏'],
        medium: ['vulnerable', 'exposed', 'damaged', 'failed', 'corrupted', '脆弱', '暴露', '损坏', '失败'],
        low: ['slow', 'minor', 'small', '缓慢', '轻微', '小']
    };

    // 计算基础情感分数
    let score = 0;
    const words = normalizedText.split(/\s+/);

    words.forEach(word => {
        // 积极词汇计分
        if (positiveWords.high.includes(word)) score += 0.3;
        else if (positiveWords.medium.includes(word)) score += 0.2;
        else if (positiveWords.low.includes(word)) score += 0.1;

        // 消极词汇计分（考虑语境）
        if (!isLearningIntent && !hasSecurityIntent) {
            if (negativeWords.high.includes(word)) score -= 0.3;
            else if (negativeWords.medium.includes(word)) score -= 0.2;
            else if (negativeWords.low.includes(word)) score -= 0.1;
        }
    });

    // 语境调整
    if (isLearningIntent) {
        score += 0.15; // 学习意图是积极的
    }

    if (hasSecurityIntent) {
        score += 0.1; // 主动安全防护是积极的
    }

    // 安全术语在学习语境下的处理
    const securityTerms = ['malware', 'virus', 'attack', 'threat', 'vulnerability', 'phishing',
        '恶意软件', '病毒', '攻击', '威胁', '漏洞', '钓鱼'];
    const hasSecurityTerms = securityTerms.some(term => normalizedText.includes(term));

    if (hasSecurityTerms && (isLearningIntent || hasSecurityIntent)) {
        score += 0.05; // 在学习语境下，安全术语是中性偏积极的
    } else if (hasSecurityTerms) {
        score -= 0.1; // 在非学习语境下才是负面的
    }

    // 限制分数范围
    score = Math.max(-1, Math.min(1, score));

    // 确定情感类别
    let sentiment;
    if (score > 0.15) sentiment = 'positive';
    else if (score < -0.15) sentiment = 'negative';
    else sentiment = 'neutral';

    return {
        compound: parseFloat(score.toFixed(3)),
        sentiment: sentiment
    };
}

// 高级文本分类 - 精确的20类网络安全分类
function classifyTextAdvanced(text) {
    const categories = {
        'Network Security': {
            weight: 5,
            keywords: ['network security', 'firewall', 'ddos', 'intrusion', 'vpn', 'router', 'gateway', 'proxy', 'network protection', '网络安全', '防火墙', '网络防护']
        },
        'Phishing Protection': {
            weight: 5,
            keywords: ['phishing', 'spoofing', 'deception', 'social engineering', 'fraud', 'scam', 'fake email', '钓鱼', '欺诈', '诈骗', '虚假邮件']
        },
        'Malware Protection': {
            weight: 5,
            keywords: ['malware', 'virus', 'trojan', 'ransomware', 'worm', 'spyware', 'antivirus', 'infected', '恶意软件', '病毒', '木马', '勒索软件', '杀毒']
        },
        'Password Security': {
            weight: 5,
            keywords: ['password', 'authentication', '2fa', 'mfa', 'credential', 'login', 'passcode', '密码', '认证', '登录', '双因素认证']
        },
        'System Security': {
            weight: 4,
            keywords: ['vulnerability', 'patch', 'exploit', 'cve', 'sql injection', 'xss', 'system security', '漏洞', '补丁', '系统安全', 'SQL注入']
        },
        'Privacy Protection': {
            weight: 4,
            keywords: ['privacy', 'data protection', 'personal information', 'gdpr', 'encryption', 'confidential', '隐私', '数据保护', '个人信息', '加密']
        },
        'Anomaly Detection': {
            weight: 4,
            keywords: ['anomaly detection', 'unusual behavior', 'suspicious activity', 'breach detection', 'monitoring', '异常检测', '可疑活动', '监控']
        },
        'Authentication Mechanisms': {
            weight: 4,
            keywords: ['identity verification', 'biometric', 'token', 'certificate', 'access control', 'oauth', '身份验证', '生物识别', '令牌', '访问控制']
        },
        'Cryptography': {
            weight: 4,
            keywords: ['cryptography', 'encryption', 'decryption', 'hash', 'ssl', 'tls', 'key management', '密码学', '加密', '解密', '哈希', '密钥管理']
        },
        'Configuration Management': {
            weight: 3,
            keywords: ['configuration', 'setup', 'settings', 'deployment', 'policy', 'management', '配置', '设置', '部署', '策略', '管理']
        },
        'Feature Requests': {
            weight: 3,
            keywords: ['feature request', 'enhancement', 'improvement', 'new feature', 'add functionality', '功能请求', '改进', '新功能', '增强']
        },
        'Performance Optimization': {
            weight: 3,
            keywords: ['performance', 'optimization', 'speed', 'latency', 'throughput', 'efficiency', '性能', '优化', '速度', '延迟', '效率']
        },
        'Error Handling': {
            weight: 3,
            keywords: ['error', 'exception', 'bug', 'crash', 'debug', 'troubleshoot', 'fix', '错误', '异常', '故障', '调试', '修复']
        },
        'Compatibility Issues': {
            weight: 3,
            keywords: ['compatibility', 'dependency', 'version', 'integration', 'support', 'platform', '兼容性', '依赖', '版本', '集成', '支持']
        },
        'Data Leak Detection': {
            weight: 4,
            keywords: ['data leak', 'data breach', 'leak detection', 'loss prevention', 'sensitive data', '数据泄露', '泄露检测', '敏感数据']
        },
        'Backup & Recovery': {
            weight: 3,
            keywords: ['backup', 'recovery', 'restore', 'disaster recovery', 'snapshot', 'archive', '备份', '恢复', '还原', '灾难恢复']
        },
        'Incident Response': {
            weight: 4,
            keywords: ['incident response', 'emergency', 'forensics', 'investigation', 'containment', '事件响应', '应急', '调查', '取证']
        },
        'Compliance & Audit': {
            weight: 3,
            keywords: ['compliance', 'audit', 'regulatory', 'governance', 'sox', 'gdpr', 'hipaa', '合规', '审计', '法规', '治理']
        },
        'Security Training': {
            weight: 3,
            keywords: ['security training', 'awareness', 'education', 'learning', 'certification', '安全培训', '意识', '教育', '学习', '认证']
        },
        'General Security': {
            weight: 2,
            keywords: ['security', 'safety', 'protection', 'best practices', 'guidelines', '安全', '保护', '最佳实践', '指南']
        }
    };

    // 计算每个类别的匹配分数
    const scores = {};
    const textLower = text.toLowerCase();

    Object.entries(categories).forEach(([category, config]) => {
        let score = 0;
        config.keywords.forEach(keyword => {
            if (textLower.includes(keyword)) {
                score += config.weight;
                // 精确匹配加权
                if (textLower.includes(` ${keyword} `) || textLower.startsWith(keyword) || textLower.endsWith(keyword)) {
                    score += config.weight * 0.5;
                }
            }
        });
        scores[category] = score;
    });

    // 找到最高分类别
    const maxScore = Math.max(...Object.values(scores));
    const predicted = maxScore > 0 ?
        Object.keys(scores).find(key => scores[key] === maxScore) :
        'General Security';

    // 生成概率分布
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0) || 1;
    const probabilities = Object.entries(scores)
        .filter(([, score]) => score > 0)
        .map(([category, score]) => [category, score / totalScore])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    // 如果没有匹配，使用默认
    if (probabilities.length === 0) {
        probabilities.push(['General Security', 1.0]);
    }

    return {
        predicted,
        probabilities
    };
}

// 高级相似文本搜索 - 企业级知识库
function findSimilarTextsAdvanced(text) {
    const knowledgeBase = [
        // 网络安全类
        {
            text: "How to configure firewall rules to block malicious traffic and protect network infrastructure?",
            category: "Network Security",
            keywords: ["firewall", "network", "protection", "malicious"]
        },
        {
            text: "VPN configuration best practices for secure remote access and data protection.",
            category: "Network Security",
            keywords: ["vpn", "remote", "secure", "access"]
        },
        {
            text: "DDoS attack prevention strategies using load balancers and traffic filtering.",
            category: "Network Security",
            keywords: ["ddos", "attack", "prevention", "traffic"]
        },

        // 恶意软件防护类
        {
            text: "Malware detection and removal procedures using enterprise antivirus solutions.",
            category: "Malware Protection",
            keywords: ["malware", "detection", "antivirus", "removal"]
        },
        {
            text: "Ransomware protection strategies: backup systems and endpoint detection.",
            category: "Malware Protection",
            keywords: ["ransomware", "backup", "endpoint", "protection"]
        },
        {
            text: "Computer virus infection symptoms and systematic cleanup procedures.",
            category: "Malware Protection",
            keywords: ["virus", "infection", "symptoms", "cleanup"]
        },

        // 钓鱼防护类
        {
            text: "How to identify phishing emails and protect against social engineering attacks?",
            category: "Phishing Protection",
            keywords: ["phishing", "email", "social", "engineering"]
        },
        {
            text: "Email security configuration to prevent spoofing and fraudulent messages.",
            category: "Phishing Protection",
            keywords: ["email", "security", "spoofing", "fraud"]
        },
        {
            text: "User training programs for phishing awareness and incident reporting.",
            category: "Phishing Protection",
            keywords: ["training", "phishing", "awareness", "reporting"]
        },

        // 密码安全类
        {
            text: "Strong password creation guidelines: length, complexity, and uniqueness requirements.",
            category: "Password Security",
            keywords: ["password", "strong", "complexity", "guidelines"]
        },
        {
            text: "Multi-factor authentication (MFA) implementation for enhanced security.",
            category: "Password Security",
            keywords: ["mfa", "authentication", "security", "implementation"]
        },
        {
            text: "Password manager deployment and enterprise credential management.",
            category: "Password Security",
            keywords: ["password", "manager", "credential", "management"]
        },

        // 系统安全类
        {
            text: "Vulnerability assessment and patch management procedures for system security.",
            category: "System Security",
            keywords: ["vulnerability", "patch", "system", "security"]
        },
        {
            text: "SQL injection prevention through input validation and parameterized queries.",
            category: "System Security",
            keywords: ["sql", "injection", "validation", "queries"]
        },
        {
            text: "Cross-site scripting (XSS) protection using content security policies.",
            category: "System Security",
            keywords: ["xss", "scripting", "content", "security"]
        },

        // 隐私保护类
        {
            text: "GDPR compliance strategies for personal data protection and privacy.",
            category: "Privacy Protection",
            keywords: ["gdpr", "compliance", "data", "privacy"]
        },
        {
            text: "Data encryption methods for sensitive information protection.",
            category: "Privacy Protection",
            keywords: ["encryption", "sensitive", "information", "protection"]
        },
        {
            text: "Privacy policy development and data handling procedures.",
            category: "Privacy Protection",
            keywords: ["privacy", "policy", "data", "handling"]
        },

        // 中文知识库
        {
            text: "如何识别和预防钓鱼攻击？检查发件人地址，验证链接真实性，使用邮件安全过滤器。",
            category: "Phishing Protection",
            keywords: ["钓鱼", "攻击", "预防", "邮件"]
        },
        {
            text: "恶意软件防护最佳实践：定期更新杀毒软件，避免可疑下载，定期系统扫描。",
            category: "Malware Protection",
            keywords: ["恶意软件", "防护", "杀毒", "扫描"]
        },
        {
            text: "强密码创建指南：使用12位以上字符，包含大小写字母、数字和特殊符号。",
            category: "Password Security",
            keywords: ["密码", "创建", "字符", "安全"]
        },
        {
            text: "网络安全配置：正确设置防火墙规则，使用VPN进行远程访问，监控网络流量。",
            category: "Network Security",
            keywords: ["网络", "安全", "防火墙", "VPN"]
        },
        {
            text: "系统漏洞管理：及时安装安全补丁，定期进行安全评估，维护软件清单。",
            category: "System Security",
            keywords: ["系统", "漏洞", "补丁", "安全"]
        },
        {
            text: "数据隐私保护：加密敏感数据，实施访问控制，遵守隐私法规如GDPR。",
            category: "Privacy Protection",
            keywords: ["数据", "隐私", "加密", "法规"]
        }
    ];

    // 高级相似度计算
    const inputWords = extractKeywords(text.toLowerCase());
    const results = [];

    knowledgeBase.forEach(item => {
        const itemWords = extractKeywords(item.text.toLowerCase());
        let similarity = calculateSemanticSimilarity(inputWords, itemWords, item.keywords);

        if (similarity > 0.1) { // 过滤低相似度
            results.push({
                text: item.text,
                similarity: Math.min(similarity, 1.0),
                category: item.category
            });
        }
    });

    // 排序并返回前5个
    return results
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5);
}

// 提取关键词
function extractKeywords(text) {
    // 移除常见停用词
    const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
        'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
        '的', '了', '在', '是', '我', '你', '他', '她', '它', '们', '这', '那', '有', '用', '和'
    ]);

    return text.split(/\s+/)
        .map(word => word.replace(/[^\w]/g, ''))
        .filter(word => word.length > 2 && !stopWords.has(word));
}

// 语义相似度计算
function calculateSemanticSimilarity(words1, words2, categoryKeywords = []) {
    // 基础词汇重叠
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    let similarity = intersection.length / union.length;

    // 类别关键词匹配加权
    const categoryMatches = categoryKeywords.filter(keyword =>
        words1.some(word => word.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(word))
    );
    similarity += categoryMatches.length * 0.15;

    // 安全领域专业术语加权
    const securityTerms = [
        'security', 'protection', 'attack', 'threat', 'vulnerability', 'malware', 'virus',
        'phishing', 'password', 'encryption', 'firewall', 'vpn', 'authentication',
        '安全', '保护', '攻击', '威胁', '漏洞', '恶意', '病毒', '钓鱼', '密码', '加密', '防火墙'
    ];

    const securityOverlap = intersection.filter(word =>
        securityTerms.some(term => word.includes(term) || term.includes(word))
    );
    similarity += securityOverlap.length * 0.1;

    return similarity;
}

module.exports = { handler }; 