// 调试分类算法
function classifyText(text) {
    const categories = {
        'Network Security': [
            // 高权重关键词（专有概念）
            { words: ['network security', 'network protection', 'network defense', '网络安全', '网络防护'], weight: 5 },
            { words: ['firewall', 'ddos', 'intrusion', 'vpn', 'router', 'gateway', 'proxy', 'wan', 'lan'], weight: 4 },
            { words: ['network', 'networking', 'internet', 'wireless', 'wifi', '网络', '防火墙'], weight: 3 }
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

    console.log('Text:', text);
    console.log('Text lower:', textLower);
    console.log('Text words:', textWords);

    // 初始化分数
    Object.keys(categories).forEach(category => {
        scores[category] = 0;
    });

    // 计算每个类别的匹配得分
    Object.entries(categories).forEach(([category, weightedGroups]) => {
        console.log(`\n--- Checking ${category} ---`);
        weightedGroups.forEach((group, groupIndex) => {
            console.log(`Group ${groupIndex + 1} (weight: ${group.weight}):`, group.words);
            group.words.forEach(keyword => {
                let matchScore = 0;

                // 完整短语匹配（最高权重）
                if (textLower.includes(keyword.toLowerCase())) {
                    matchScore = group.weight;
                    if (group.weight >= 4) hasSpecificMatch = true;
                    console.log(`  ✅ PHRASE MATCH: "${keyword}" -> +${matchScore}`);
                }
                // 单词匹配
                else if (keyword.split(' ').length === 1 && textWords.includes(keyword.toLowerCase())) {
                    matchScore = group.weight * 0.8; // 单词匹配稍微降低权重
                    if (group.weight >= 4) hasSpecificMatch = true;
                    console.log(`  ✅ WORD MATCH: "${keyword}" -> +${matchScore}`);
                }

                scores[category] += matchScore;
            });
        });
        console.log(`${category} total score: ${scores[category]}`);
    });

    console.log('\n--- Final Scores ---');
    console.log('Scores:', scores);
    console.log('Has specific match:', hasSpecificMatch);

    // 如果没有特定匹配，给General Security基础分
    if (!hasSpecificMatch) {
        scores['General Security'] = Math.max(scores['General Security'], 1);
        console.log('No specific match, boosting General Security to:', scores['General Security']);
    }

    // 找到最高得分的类别
    const maxScore = Math.max(...Object.values(scores));
    const predicted = Object.keys(scores).find(category => scores[category] === maxScore);

    console.log('Max score:', maxScore);
    console.log('Predicted:', predicted);

    return { predicted, scores };
}

// 测试
const testText = "How to protect network security?";
const result = classifyText(testText);
console.log('\n=== FINAL RESULT ===');
console.log('Predicted:', result.predicted);
console.log('Scores:', result.scores); 