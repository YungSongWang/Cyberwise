#!/usr/bin/env python3
"""
CyberWise AI Backend API - Vercel云端部署版本
轻量级AI分析服务，支持情感分析、文本分类和相似度检索
"""

import json
import re
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
import random

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """处理CORS预检请求"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        """处理POST请求"""
        # 设置CORS头
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()

        try:
            # 获取请求路径
            path = urlparse(self.path).path
            
            # 读取请求体
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))

            if path == '/api/analyze-text':
                result = self.analyze_text(data)
            elif path == '/api/generate-content':
                result = self.generate_content(data)
            else:
                result = {'error': 'Endpoint not found'}

            self.wfile.write(json.dumps(result, ensure_ascii=False).encode('utf-8'))

        except Exception as e:
            error_result = {'error': f'Server error: {str(e)}'}
            self.wfile.write(json.dumps(error_result, ensure_ascii=False).encode('utf-8'))

    def analyze_text(self, data):
        """文本分析主函数"""
        text = data.get('text', '').strip()
        if not text:
            return {'error': 'No text provided'}

        # 执行各种分析
        sentiment = self.analyze_sentiment(text)
        classification = self.classify_text(text)
        similar_texts = self.find_similar_texts(text)

        return {
            'sentiment': sentiment,
            'classification': classification,
            'similar_texts': similar_texts
        }

    def generate_content(self, data):
        """内容生成函数"""
        prompt = data.get('prompt', '').strip()
        if not prompt:
            return {'error': '请提供写作提示'}

        # 分析提示文本
        sentiment = self.analyze_sentiment(prompt)
        classification = self.classify_text(prompt)
        similar_texts = self.find_similar_texts(prompt)

        # 生成内容
        content = f"""# 文本分析结果

## 情感分析
- 情感得分: {sentiment['compound']:.3f}
- 情感倾向: {sentiment['sentiment']}

## 文本分类
- 预测类别: {classification['predicted']}
- 类别概率:
""" + '\n'.join([f'  - {cat}: {prob*100:.1f}%' for cat, prob in classification['probabilities'][:5]]) + f"""

## 相似文本
""" + '\n'.join([f'{i+1}. {text["text"]}\n   相似度: {text["similarity"]*100:.1f}%' for i, text in enumerate(similar_texts)]) + f"""

## 建议内容

基于分析结果，我建议从以下几个方面展开：

1. **基本概念和定义**
   - 根据分类结果 {classification['predicted']} 进行详细解释
   - 结合相似文本中的关键概念

2. **核心原理和机制**
   - 分析情感倾向 {sentiment['sentiment']} 对内容的影响
   - 参考相似文本中的技术细节

3. **实际应用场景**
   - 基于分类概率最高的几个类别
   - 结合相似文本中的实际案例

4. **最佳实践和注意事项**
   - 根据情感分析结果调整表达方式
   - 参考相似文本中的经验总结

5. **未来发展趋势**
   - 基于分类结果预测发展方向
   - 结合相似文本中的前瞻性观点

希望这些建议对您有所帮助！"""

        return {
            'title': f"{classification['predicted']} - {prompt}",
            'content': content
        }

    def analyze_sentiment(self, text):
        """情感分析 - 支持中英文，智能识别咨询vs威胁"""
        # 识别问句模式
        question_patterns = [
            r'\b(how to|how can|what is|what are|why does|when should|where to)\b',
            r'\b(which is|who should|best way|best practice|how do|steps to)\b',
            r'(如何|怎么|什么是|为什么|哪里|哪个|最佳|步骤)'
        ]
        
        is_question = any(re.search(pattern, text.lower()) for pattern in question_patterns)
        
        # 防护意图词汇
        protective_words = [
            'protect', 'prevent', 'defend', 'secure', 'avoid', 'stop', 'block', 'guard',
            'identify', 'detect', 'respond', 'handle', 'manage', 'configure', 'setup',
            'implement', 'establish', 'develop', 'create', 'build', 'design',
            '保护', '防护', '防止', '避免', '识别', '检测', '应对', '处理', '配置', '建立'
        ]
        
        has_protective_intent = any(word in text.lower() for word in protective_words)
        
        # 积极词汇
        positive_words = [
            'good', 'safe', 'secure', 'protection', 'strong', 'excellent', 'success', 'effective',
            'reliable', 'stable', 'robust', 'optimize', 'best', 'better', 'great', 'powerful',
            'improved', 'enhanced', 'advanced', 'solid', 'trust', 'quality', 'perfect', 'solution',
            '好', '安全', '保护', '强大', '优秀', '成功', '有效', '可靠', '稳定', '最佳', '完美'
        ]
        
        # 消极词汇（只在实际威胁描述时计为负面）
        negative_words = [
            'infected', 'compromised', 'breached', 'hacked', 'stolen', 'corrupted', 'damaged',
            'failed', 'exposed', 'vulnerable', 'exploited', 'attacked', 'crashed', 'broken',
            '感染', '被黑', '被盗', '损坏', '失败', '暴露', '脆弱', '攻击', '崩溃', '破坏'
        ]
        
        score = 0
        words = re.findall(r'\w+', text.lower())
        
        for word in words:
            if word in positive_words:
                score += 0.15
            elif word in negative_words and not (is_question or has_protective_intent):
                score -= 0.15
        
        # 安全术语在咨询语境下是中性的
        security_terms = ['phishing', 'malware', 'virus', 'attack', 'threat', 'risk', '钓鱼', '恶意软件', '病毒', '威胁']
        has_security_terms = any(term in text.lower() for term in security_terms)
        
        if has_security_terms and (is_question or has_protective_intent):
            score += 0.1  # 主动学习安全知识是积极的
        elif has_security_terms:
            score -= 0.2
        
        score = max(-1, min(1, score))
        
        if score > 0.1:
            sentiment = 'positive'
        elif score < -0.1:
            sentiment = 'negative'
        else:
            sentiment = 'neutral'
        
        return {
            'compound': round(score, 3),
            'sentiment': sentiment
        }

    def classify_text(self, text):
        """文本分类 - 20个网络安全类别"""
        categories = {
            'Network Security': [
                ['network security', 'network protection', 'network defense', '网络安全', '网络防护'],
                ['firewall', 'ddos', 'intrusion', 'vpn', 'router', 'gateway', 'proxy'],
                ['network', 'networking', 'internet', 'wireless', 'wifi', '网络', '防火墙']
            ],
            'Phishing Protection': [
                ['phishing protection', 'anti-phishing', '钓鱼防护'],
                ['phishing', 'spoofing', 'deception', 'social engineering', '钓鱼', '欺诈'],
                ['fraud', 'scam', 'fake', 'suspicious email', '诈骗', '虚假网站']
            ],
            'Malware Protection': [
                ['malware protection', 'antivirus', 'anti-malware', '恶意软件防护', '杀毒'],
                ['malware', 'virus', 'trojan', 'ransomware', 'worm', 'spyware', '病毒', '木马'],
                ['infection', 'infected', 'adware', '感染', '勒索软件']
            ],
            'Password Security': [
                ['password security', 'authentication', 'credential management', '密码安全'],
                ['password', '2fa', 'mfa', 'verification', 'credential', '密码', '认证'],
                ['login', 'passcode', 'verification code', '登录', '验证码']
            ],
            'System Security': [
                ['system security', 'vulnerability', 'patch management', '系统安全'],
                ['vulnerability', 'patch', 'exploit', 'cve', 'sql injection', '漏洞', '补丁'],
                ['system', 'update', 'configuration', 'server', '系统', '更新']
            ],
            'Privacy Protection': [
                ['privacy protection', 'data protection', 'personal information', '隐私保护'],
                ['privacy', 'data breach', 'leak', 'exposure', 'confidential', '隐私', '数据泄露'],
                ['pii', 'personal data', 'information security', '个人信息']
            ],
            'Anomaly Detection': [
                ['anomaly detection', 'breach detection', '异常检测'],
                ['anomaly', 'unusual', 'suspicious', 'detection', '异常', '可疑'],
                ['monitor', 'alert', 'detection system', '监控', '警报']
            ],
            'Authentication Mechanisms': [
                ['authentication mechanisms', 'user identity verification', '身份验证机制'],
                ['authentication', 'identity', 'verification', 'access control', '身份', '验证'],
                ['biometric', 'token', 'certificate', '生物识别', '令牌', '证书']
            ],
            'Cryptography': [
                ['cryptography', 'encryption', 'key management', '密码学', '加密'],
                ['encryption', 'decrypt', 'cipher', 'hash', 'cryptographic', '加密', '解密'],
                ['ssl', 'tls', 'aes', 'rsa', 'key', '密钥', '证书']
            ],
            'Configuration Management': [
                ['configuration management', 'security configuration', '配置管理'],
                ['configuration', 'setup', 'settings', 'deploy', '配置', '设置'],
                ['management', 'policy', 'standard', '管理', '策略', '标准']
            ],
            'Feature Requests': [
                ['feature requests', 'enhancements', 'improvement', '功能请求'],
                ['feature', 'enhancement', 'improvement', 'request', '功能', '改进'],
                ['new', 'add', 'implement', 'develop', '新增', '开发']
            ],
            'Performance Optimization': [
                ['performance optimization', 'resource usage optimization', '性能优化'],
                ['performance', 'optimization', 'speed', 'resource', '性能', '优化'],
                ['latency', 'throughput', 'efficiency', '延迟', '吞吐量', '效率']
            ],
            'Error Handling': [
                ['error handling', 'exception handling', 'runtime errors', '错误处理'],
                ['error', 'exception', 'bug', 'crash', '错误', '异常'],
                ['debug', 'troubleshoot', 'fix', '调试', '故障排除', '修复']
            ],
            'Compatibility Issues': [
                ['compatibility', 'dependencies', 'third-party', '兼容性'],
                ['compatible', 'dependency', 'version', '兼容', '依赖', '版本'],
                ['integration', 'support', 'platform', '集成', '支持', '平台']
            ],
            'Data Leak Detection': [
                ['data leak detection', 'data loss prevention', '数据泄露检测'],
                ['data leak', 'leak detection', 'loss prevention', '数据泄露', '泄露检测'],
                ['sensitive data', 'confidential', 'protection', '敏感数据', '机密', '保护']
            ],
            'Backup & Recovery': [
                ['backup', 'recovery', 'restore', '备份', '恢复'],
                ['backup system', 'data recovery', 'disaster recovery', '备份系统', '数据恢复'],
                ['restore', 'snapshot', 'archive', '还原', '快照', '归档']
            ],
            'Incident Response': [
                ['incident response', 'emergency response', '事件响应'],
                ['incident', 'response', 'emergency', 'forensics', '事件', '响应'],
                ['investigation', 'containment', 'recovery', '调查', '遏制', '恢复']
            ],
            'Compliance & Audit': [
                ['compliance', 'audit', 'regulatory', '合规', '审计'],
                ['regulation', 'standard', 'policy', 'governance', '法规', '标准'],
                ['sox', 'gdpr', 'hipaa', 'iso', '合规性', '治理']
            ],
            'Security Training': [
                ['security training', 'awareness', 'education', '安全培训'],
                ['training', 'education', 'awareness', 'learning', '培训', '教育'],
                ['skill', 'knowledge', 'certification', '技能', '知识', '认证']
            ],
            'General Security': [
                ['general security', 'overall security', '通用安全'],
                ['security', 'safety', 'protection', '安全', '保护'],
                ['best practices', 'guidelines', 'recommendations', '最佳实践', '指南']
            ]
        }
        
        scores = {}
        text_lower = text.lower()
        
        for category, keyword_groups in categories.items():
            score = 0
            for i, keywords in enumerate(keyword_groups):
                weight = [5, 4, 3][i]  # 高权重关键词优先
                for keyword in keywords:
                    if keyword in text_lower:
                        score += weight
            scores[category] = score
        
        # 找到最高分类别
        if scores and max(scores.values()) > 0:
            predicted = max(scores, key=scores.get)
        else:
            predicted = 'General Security'
        
        # 生成概率分布
        total_score = sum(scores.values()) or 1
        probabilities = []
        for category, score in sorted(scores.items(), key=lambda x: x[1], reverse=True):
            if score > 0:
                prob = score / total_score
                probabilities.append([category, prob])
        
        # 如果没有匹配，使用默认分布
        if not probabilities:
            probabilities = [['General Security', 1.0]]
        
        return {
            'predicted': predicted,
            'probabilities': probabilities[:10]  # 返回前10个类别
        }

    def find_similar_texts(self, text):
        """查找相似文本"""
        knowledge_base = [
            "How to identify and prevent phishing attacks? Check sender addresses, verify links before clicking, and use email security filters.",
            "Malware protection best practices: Keep antivirus updated, avoid suspicious downloads, and regularly scan your system.",
            "Strong password creation guidelines: Use 12+ characters, include mixed case, numbers, and symbols. Enable 2FA when possible.",
            "Network security configuration: Configure firewalls properly, use VPN for remote access, and monitor network traffic regularly.",
            "System vulnerability management: Apply security patches promptly, conduct regular security assessments, and maintain updated software inventory.",
            "Data privacy protection measures: Encrypt sensitive data, implement access controls, and comply with privacy regulations like GDPR.",
            "如何识别和预防钓鱼攻击？检查发件人地址，点击前验证链接，使用邮件安全过滤器。",
            "恶意软件防护最佳实践：保持杀毒软件更新，避免可疑下载，定期扫描系统。",
            "强密码创建指南：使用12位以上字符，包含大小写、数字和符号。尽可能启用双因素认证。",
            "网络安全配置：正确配置防火墙，远程访问使用VPN，定期监控网络流量。",
            "系统漏洞管理：及时应用安全补丁，定期进行安全评估，维护最新的软件清单。",
            "数据隐私保护措施：加密敏感数据，实施访问控制，遵守GDPR等隐私法规。"
        ]
        
        # 简化的相似度计算
        results = []
        text_words = set(re.findall(r'\w+', text.lower()))
        
        for kb_text in knowledge_base:
            kb_words = set(re.findall(r'\w+', kb_text.lower()))
            
            # 计算词汇重叠度
            common_words = text_words.intersection(kb_words)
            if len(common_words) > 0:
                similarity = len(common_words) / len(text_words.union(kb_words))
                
                # 安全关键词加权
                security_keywords = ['security', 'protect', 'attack', 'malware', 'password', 'network']
                security_overlap = sum(1 for word in common_words if word in security_keywords)
                similarity += security_overlap * 0.1
                
                results.append({
                    'text': kb_text,
                    'similarity': min(similarity, 1.0)
                })
        
        # 排序并返回前5个
        results.sort(key=lambda x: x['similarity'], reverse=True)
        return results[:5] 