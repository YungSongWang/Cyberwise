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

// 模拟情感分析函数 - 支持中英文，智能识别咨询vs威胁
function analyzeSentiment(text) {
    // 识别问句模式 - 这些通常是中性的咨询
    const questionPatterns = [
        'how to', 'how can', 'what is', 'what are', 'why does', 'when should', 'where to',
        'which is', 'who should', 'best way', 'best practice', 'how do', 'steps to',
        '如何', '怎么', '什么是', '为什么', '哪里', '哪个', '最佳', '步骤'
    ];

    const isQuestion = questionPatterns.some(pattern =>
        text.toLowerCase().includes(pattern)
    );

    // 识别防护/保护意图的词汇
    const protectiveIntentWords = [
        'protect', 'prevent', 'defend', 'secure', 'avoid', 'stop', 'block', 'guard',
        'identify', 'detect', 'respond', 'handle', 'manage', 'configure', 'setup',
        'implement', 'establish', 'develop', 'create', 'build', 'design',
        '保护', '防护', '防止', '避免', '识别', '检测', '应对', '处理', '配置', '建立'
    ];

    const hasProtectiveIntent = protectiveIntentWords.some(word =>
        text.toLowerCase().includes(word)
    );

    // 如果是问句且含有防护意图，倾向于中性或积极
    if (isQuestion && hasProtectiveIntent) {
        return {
            compound: 0.2,
            sentiment: 'neutral'
        };
    }

    const positiveWords = [
        'good', 'safe', 'secure', 'protection', 'strong', 'excellent', 'success', 'effective',
        'reliable', 'stable', 'robust', 'optimize', 'best', 'better', 'great', 'powerful',
        'improved', 'enhanced', 'advanced', 'solid', 'trust', 'quality', 'perfect', 'solution'
    ];

    // 只有在描述实际威胁时才算负面，而不是询问防护方法时
    const negativeWords = [
        'infected', 'compromised', 'breached', 'hacked', 'stolen', 'corrupted', 'damaged',
        'failed', 'exposed', 'vulnerable', 'exploited', 'attacked', 'crashed', 'broken'
    ];

    let score = 0;
    const words = text.toLowerCase().split(/\s+/);

    // 按单词匹配
    words.forEach(word => {
        const cleanWord = word.replace(/[^\w]/g, '');

        if (positiveWords.includes(cleanWord)) {
            score += 0.15;
        }
        if (negativeWords.includes(cleanWord)) {
            score -= 0.15;
        }
    });

    // 安全相关词汇在咨询语境下是中性的
    const securityTerms = ['phishing', 'malware', 'virus', 'attack', 'threat', 'risk'];
    const hasSecurityTerms = securityTerms.some(term => text.toLowerCase().includes(term));

    if (hasSecurityTerms && (isQuestion || hasProtectiveIntent)) {
        // 在咨询语境下，安全术语是中性的
        score += 0.1; // 轻微积极，因为是主动学习安全知识
    } else if (hasSecurityTerms) {
        // 在非咨询语境下才算负面
        score -= 0.2;
    }

    // 限制在-1到1之间
    score = Math.max(-1, Math.min(1, score));

    let sentiment;
    if (score > 0.1) {
        sentiment = 'positive';
    } else if (score < -0.1) {
        sentiment = 'negative';
    } else {
        sentiment = 'neutral';
    }

    return {
        compound: parseFloat(score.toFixed(3)),
        sentiment: sentiment
    };
}

// 模拟文本分类函数 - 支持中英文，增强精确度
function classifyText(text) {
    const categories = {
        'Network Security': [
            // 高权重关键词（专有概念）
            { words: ['network security', 'network protection', 'network defense', '网络安全', '网络防护'], weight: 5 },
            { words: ['firewall', 'ddos', 'intrusion', 'vpn', 'router', 'gateway', 'proxy', 'wan', 'lan'], weight: 4 },
            { words: ['network', 'networking', 'internet', 'wireless', 'wifi', '网络', '防火墙'], weight: 3 }
        ],
        'Phishing Protection': [
            { words: ['phishing protection', 'anti-phishing', '钓鱼防护'], weight: 5 },
            { words: ['phishing', 'spoofing', 'deception', 'social engineering', '钓鱼', '欺诈'], weight: 4 },
            { words: ['fraud', 'scam', 'fake', 'suspicious email', '诈骗', '虚假网站'], weight: 3 }
        ],
        'Malware Protection': [
            { words: ['malware protection', 'antivirus', 'anti-malware', '恶意软件防护', '杀毒'], weight: 5 },
            { words: ['malware', 'virus', 'trojan', 'ransomware', 'worm', 'spyware', '病毒', '木马'], weight: 4 },
            { words: ['infection', 'infected', 'adware', '感染', '勒索软件'], weight: 3 }
        ],
        'Password Security': [
            { words: ['password security', 'authentication', 'credential management', '密码安全'], weight: 5 },
            { words: ['password', '2fa', 'mfa', 'verification', 'credential', '密码', '认证'], weight: 4 },
            { words: ['login', 'passcode', 'verification code', '登录', '验证码'], weight: 3 }
        ],
        'System Security': [
            { words: ['system security', 'vulnerability', 'patch management', '系统安全'], weight: 5 },
            { words: ['vulnerability', 'patch', 'exploit', 'cve', 'sql injection', '漏洞', '补丁'], weight: 4 },
            { words: ['system', 'update', 'configuration', 'server', '系统', '更新'], weight: 3 }
        ],
        'Privacy Protection': [
            { words: ['privacy protection', 'data protection', 'personal information', '隐私保护'], weight: 5 },
            { words: ['privacy', 'data breach', 'leak', 'exposure', 'confidential', '隐私', '数据泄露'], weight: 4 },
            { words: ['pii', 'personal data', 'information security', '个人信息'], weight: 3 }
        ],
        'Data Backup': [
            { words: ['data backup', 'backup strategy', 'disaster recovery', '数据备份'], weight: 5 },
            { words: ['backup', 'recovery', 'restore', 'archive', '备份', '恢复'], weight: 4 },
            { words: ['data', 'storage', 'sync', '数据', '存储'], weight: 3 }
        ],
        'General Security': [
            { words: ['security management', 'security policy', 'cybersecurity', '安全管理'], weight: 5 },
            { words: ['security', 'protection', 'defense', 'compliance', '安全', '防护'], weight: 2 }, // 降低通用词权重
            { words: ['management', 'policy', 'admin', 'guide', '管理', '保护'], weight: 1 }
        ]
    };

    const scores = {};
    let hasSpecificMatch = false;

    // 预处理文本
    const textLower = text.toLowerCase();
    const textWords = textLower.split(/\s+/).map(word => word.replace(/[^\w]/g, ''));

    // 初始化分数
    Object.keys(categories).forEach(category => {
        scores[category] = 0;
    });

    // 计算每个类别的匹配得分
    Object.entries(categories).forEach(([category, weightedGroups]) => {
        weightedGroups.forEach(group => {
            group.words.forEach(keyword => {
                let matchScore = 0;

                // 完整短语匹配（最高权重）
                if (textLower.includes(keyword.toLowerCase())) {
                    matchScore = group.weight;
                    if (group.weight >= 4) hasSpecificMatch = true;
                }
                // 单词匹配
                else if (keyword.split(' ').length === 1 && textWords.includes(keyword.toLowerCase())) {
                    matchScore = group.weight * 0.8; // 单词匹配稍微降低权重
                    if (group.weight >= 4) hasSpecificMatch = true;
                }

                scores[category] += matchScore;
            });
        });
    });

    // 如果没有特定匹配，给General Security基础分
    if (!hasSpecificMatch) {
        scores['General Security'] = Math.max(scores['General Security'], 1);
    }

    // 找到最高得分的类别
    const maxScore = Math.max(...Object.values(scores));
    const predicted = Object.keys(scores).find(category => scores[category] === maxScore);

    // 生成更清晰的概率分布
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0) || 1;

    const probabilities = Object.entries(scores)
        .map(([category, score]) => {
            // 增强主导类别的概率
            let probability = score / totalScore;
            if (category === predicted && hasSpecificMatch) {
                probability = Math.max(probability, 0.6); // 确保主导类别至少60%
            }
            return [category, probability];
        })
        .sort((a, b) => b[1] - a[1]);

    // 重新标准化概率
    const probSum = probabilities.reduce((sum, [, prob]) => sum + prob, 0);
    const normalizedProbabilities = probabilities.map(([category, prob]) => [
        category,
        parseFloat((prob / probSum).toFixed(3))
    ]);

    return {
        predicted,
        probabilities: normalizedProbabilities
    };
}

// 模拟相似文本查找函数
function findSimilarTexts(text) {
    const knowledgeBase = [
        {
            text: "How to prevent malware and virus attacks to protect computer systems? Install reliable antivirus software, update virus databases regularly, avoid downloading software from unknown sources, and perform regular system scans.",
            category: "Malware Protection"
        },
        {
            text: "Best practices for setting strong passwords and enabling two-factor authentication. Passwords should contain uppercase letters, lowercase letters, numbers and special characters, at least 12 characters long, and be changed regularly.",
            category: "Password Security"
        },
        {
            text: "Effective methods to identify and respond to phishing emails. Check sender address authenticity, watch for spelling errors, don't click suspicious links, and verify email content.",
            category: "Phishing Protection"
        },
        {
            text: "Guidelines for configuring firewalls and network security policies. Set inbound and outbound rules, block unnecessary ports, enable logging, and regularly review firewall rules.",
            category: "Network Security"
        },
        {
            text: "Personal information protection and privacy security management strategies. Limit personal information sharing, use encrypted storage for sensitive data, and regularly check privacy settings.",
            category: "Privacy Protection"
        },
        {
            text: "System vulnerability patching and security update management processes. Install security patches promptly, enable automatic updates, regularly check system vulnerabilities, and establish patch management strategies.",
            category: "System Security"
        },
        {
            text: "Important data backup and disaster recovery strategy development. Implement 3-2-1 backup strategy, regularly test recovery processes, and combine cloud backup with local backup.",
            category: "Data Backup"
        },
        {
            text: "Enterprise network security management and monitoring solution design. Deploy network intrusion detection systems, establish security operations centers, and implement zero trust architecture.",
            category: "Network Security"
        },
        {
            text: "Mobile device security and application permission management strategies. Enable screen locks, carefully grant app permissions, and use enterprise mobile device management solutions.",
            category: "System Security"
        },
        {
            text: "Social engineering attack prevention and security awareness training programs. Educate employees to recognize social engineering techniques, establish security reporting mechanisms, and conduct regular security drills.",
            category: "General Security"
        },
        {
            text: "How to identify and handle suspicious email attachments? Check file extensions, use sandbox environments for testing, and don't open attachments from unknown sources.",
            category: "Phishing Protection"
        },
        {
            text: "Common characteristics and protection measures against phishing attacks. Watch for URL spelling errors, check SSL certificates, and use browser security plugins.",
            category: "Phishing Protection"
        },
        {
            text: "Ransomware protection best practices and emergency response. Regularly backup data, deploy endpoint detection response systems, and develop ransomware emergency plans.",
            category: "Malware Protection"
        },
        {
            text: "Secure remote work configuration and VPN usage guidelines. Use enterprise-grade VPN, enable multi-factor authentication, and regularly update remote access credentials.",
            category: "Network Security"
        },
        {
            text: "Cloud service security configuration and data protection measures. Configure identity access management, enable data encryption, and implement cloud security policies.",
            category: "Privacy Protection"
        },
        {
            text: "SQL injection attack protection and code audit methods. Use parameterized queries, implement input validation, and conduct regular code security audits.",
            category: "System Security"
        },
        {
            text: "Cross-site scripting (XSS) attack protection strategies. Encode user input, use content security policies, and implement output filtering.",
            category: "System Security"
        },
        {
            text: "Wireless network security configuration and encryption settings. Use WPA3 encryption, hide SSID broadcast, and regularly change WiFi passwords.",
            category: "Network Security"
        },
        {
            text: "Secure software development lifecycle (SDLC) implementation guide. Integrate security testing, conduct threat modeling, and implement code reviews.",
            category: "System Security"
        },
        {
            text: "Database security configuration and access control strategies. Implement principle of least privilege, enable database auditing, and use database encryption.",
            category: "Privacy Protection"
        },
        {
            text: "Security incident response and forensic investigation processes. Establish incident response teams, develop response plans, and protect evidence integrity.",
            category: "General Security"
        },
        {
            text: "Encryption technology selection and key management best practices. Use strong encryption algorithms, implement key rotation, and establish key escrow strategies.",
            category: "Privacy Protection"
        },
        {
            text: "Container and microservices security configuration guidelines. Implement container image scanning, configure network isolation, and use service mesh security policies.",
            category: "System Security"
        },
        {
            text: "IoT device security configuration and management. Change default passwords, regularly update firmware, and isolate IoT networks.",
            category: "System Security"
        },
        {
            text: "Enterprise email security configuration and spam filtering. Configure SPF, DKIM and DMARC records, and deploy email security gateways.",
            category: "Phishing Protection"
        }
    ];

    // 改进的相似度计算算法
    const results = knowledgeBase.map(item => {
        const similarity = calculateAdvancedSimilarity(text, item.text);
        return {
            text: item.text,
            similarity: similarity
        };
    });

    const filteredResults = results.filter(item => item.similarity > 0.05);
    const finalResults = filteredResults
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5);

    return finalResults;
}

// 智能相似度计算函数
function calculateAdvancedSimilarity(text1, text2) {
    // 预处理：转换为小写并分词
    const words1 = text1.toLowerCase().split(/\s+/).map(word => word.replace(/[^\w]/g, ''));
    const words2 = text2.toLowerCase().split(/\s+/).map(word => word.replace(/[^\w]/g, ''));

    // 同义词映射
    const synonymGroups = {
        'protection': ['protect', 'defense', 'guard', 'shield', 'secure', 'safety'],
        'identification': ['identify', 'detect', 'recognize', 'spot', 'find', 'discover'],
        'prevention': ['prevent', 'avoid', 'stop', 'block', 'counter', 'thwart'],
        'email': ['mail', 'message', 'correspondence', 'communication'],
        'attack': ['assault', 'threat', 'breach', 'intrusion', 'exploit'],
        'configuration': ['config', 'setup', 'setting', 'configure', 'establish'],
        'management': ['manage', 'handle', 'control', 'administer', 'govern'],
        'response': ['respond', 'react', 'reply', 'answer', 'counter'],
        'security': ['secure', 'safety', 'protection', 'safeguard']
    };

    // 将词汇映射到同义词组
    function mapToSynonymGroup(word) {
        for (const [base, synonyms] of Object.entries(synonymGroups)) {
            if (synonyms.includes(word) || base === word) {
                return base;
            }
        }
        return word;
    }

    // 映射词汇到同义词组
    const mappedWords1 = words1.map(mapToSynonymGroup);
    const mappedWords2 = words2.map(mapToSynonymGroup);

    // 基础词汇匹配（使用同义词映射）
    const commonWords = mappedWords1.filter(word =>
        mappedWords2.includes(word) && word.length > 2
    );
    let similarity = commonWords.length / Math.max(mappedWords1.length, mappedWords2.length);

    // 安全关键词精确匹配加权
    const securityKeywords = [
        'phishing', 'malware', 'virus', 'password', 'security', 'attack', 'protection', 'encryption',
        'firewall', 'backup', 'vulnerability', 'threat', 'authentication', 'network', 'privacy',
        'ransomware', 'trojan', 'spyware', 'adware', 'fraud', 'scam', 'breach', 'exploit'
    ];

    let keywordMatches = 0;
    securityKeywords.forEach(keyword => {
        if (text1.toLowerCase().includes(keyword) && text2.toLowerCase().includes(keyword)) {
            keywordMatches++;
        }
    });

    const keywordBonus = keywordMatches * 0.12; // 每个匹配的关键词加12%

    // 问题类型匹配加权
    const questionTypes = {
        'how': ['how', 'method', 'way', 'approach', 'technique'],
        'what': ['what', 'which', 'definition', 'meaning'],
        'why': ['why', 'reason', 'cause', 'purpose'],
        'when': ['when', 'time', 'timing', 'schedule'],
        'where': ['where', 'location', 'place']
    };

    let questionTypeBonus = 0;
    for (const [type, indicators] of Object.entries(questionTypes)) {
        const text1HasType = indicators.some(ind => text1.toLowerCase().includes(ind));
        const text2HasType = indicators.some(ind => text2.toLowerCase().includes(ind));
        if (text1HasType && text2HasType) {
            questionTypeBonus += 0.15;
            break; // 只匹配一种问题类型
        }
    }

    // 动作词匹配加权（identify, respond, prevent等）
    const actionWords = ['identify', 'respond', 'prevent', 'protect', 'configure', 'implement',
        'establish', 'develop', 'manage', 'handle', 'detect', 'monitor'];
    let actionMatches = 0;
    actionWords.forEach(action => {
        if (text1.toLowerCase().includes(action) && text2.toLowerCase().includes(action)) {
            actionMatches++;
        }
    });

    const actionBonus = actionMatches * 0.08; // 每个匹配的动作词加8%

    // 主题专业度匹配
    const topics = {
        'email_security': ['email', 'phishing', 'attachment', 'sender', 'spam'],
        'malware': ['malware', 'virus', 'trojan', 'ransomware', 'antivirus'],
        'network': ['network', 'firewall', 'vpn', 'router', 'ddos'],
        'authentication': ['password', 'authentication', 'credential', '2fa', 'mfa'],
        'data_protection': ['backup', 'encryption', 'privacy', 'data', 'recovery']
    };

    let topicBonus = 0;
    for (const [topic, keywords] of Object.entries(topics)) {
        const text1TopicCount = keywords.filter(kw => text1.toLowerCase().includes(kw)).length;
        const text2TopicCount = keywords.filter(kw => text2.toLowerCase().includes(kw)).length;

        if (text1TopicCount > 0 && text2TopicCount > 0) {
            topicBonus += Math.min(text1TopicCount, text2TopicCount) * 0.06;
        }
    }

    // 计算最终相似度
    const finalSimilarity = similarity + keywordBonus + questionTypeBonus + actionBonus + topicBonus;

    return Math.min(finalSimilarity, 1.0);
}

module.exports = { handler }; 