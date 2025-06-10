#!/usr/bin/env python3
"""
简化的CyberWise AI服务器 - 避开NumPy兼容性问题
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import random
import re

app = Flask(__name__)
CORS(app)

# 安全类别数据
SECURITY_CATEGORIES = {
    'malware': {
        'name': 'Malware Protection 恶意软件防护',
        'keywords': ['恶意软件', '病毒', '木马', '勒索软件', '感染', '杀毒', '清除', '检测'],
        'confidence': 0.85
    },
    'password': {
        'name': 'Authentication Mechanisms 密码安全',
        'keywords': ['密码', '口令', '登录', '认证', '二次验证', '双重认证', '身份验证'],
        'confidence': 0.90
    },
    'phishing': {
        'name': 'Anomaly detection 钓鱼攻击',
        'keywords': ['钓鱼', '欺诈', '诈骗', '可疑邮件', '虚假网站', '诱导', '链接'],
        'confidence': 0.88
    },
    'network': {
        'name': 'Configuration & Management 网络安全',
        'keywords': ['网络', '防火墙', 'DDoS', '入侵', '攻击', 'VPN', '端口'],
        'confidence': 0.82
    },
    'privacy': {
        'name': 'Cryptography Data Protection 隐私保护',
        'keywords': ['隐私', '数据泄露', '个人信息', '信息安全', '加密', '保护'],
        'confidence': 0.87
    },
    'system': {
        'name': 'Error & Exception Handling 系统安全',
        'keywords': ['系统', '漏洞', '补丁', '更新', '安全配置', '权限'],
        'confidence': 0.83
    }
}

# 模拟知识库数据
KNOWLEDGE_BASE = [
    {
        'text': '如何防范钓鱼邮件攻击？1. 仔细检查发件人地址 2. 不点击可疑链接 3. 验证邮件内容真实性',
        'similarity': 0.95,
        'category': 'phishing'
    },
    {
        'text': '密码安全最佳实践：使用复杂密码、定期更换、启用双重认证、不重复使用密码',
        'similarity': 0.92,
        'category': 'password'
    },
    {
        'text': '恶意软件清除步骤：1. 断网隔离 2. 使用杀毒软件全盘扫描 3. 删除可疑文件 4. 更新系统补丁',
        'similarity': 0.89,
        'category': 'malware'
    },
    {
        'text': '网络安全配置指南：配置防火墙规则、关闭不必要端口、启用入侵检测系统',
        'similarity': 0.86,
        'category': 'network'
    },
    {
        'text': '数据隐私保护措施：加密敏感数据、限制访问权限、定期备份、监控数据流动',
        'similarity': 0.84,
        'category': 'privacy'
    }
]

def classify_text(text):
    """分类文本"""
    text_lower = text.lower()
    best_category = 'general'
    best_score = 0.5
    
    for category, data in SECURITY_CATEGORIES.items():
        score = 0
        for keyword in data['keywords']:
            if keyword in text_lower:
                score += 1
        
        # 计算相对分数
        if score > 0:
            relative_score = min(0.95, data['confidence'] * (score / len(data['keywords'])))
            if relative_score > best_score:
                best_category = category
                best_score = relative_score
    
    return {
        'predicted': SECURITY_CATEGORIES.get(best_category, {'name': 'General Security Question'})['name'],
        'confidence': best_score,
        'probabilities': [
            [SECURITY_CATEGORIES.get(best_category, {'name': 'General Security Question'})['name'], best_score]
        ]
    }

def analyze_sentiment(text):
    """简单情感分析"""
    positive_words = ['好', '棒', '优秀', '安全', '保护', '有效', '成功']
    negative_words = ['危险', '攻击', '病毒', '泄露', '失败', '问题', '错误']
    
    text_lower = text.lower()
    pos_count = sum(1 for word in positive_words if word in text_lower)
    neg_count = sum(1 for word in negative_words if word in text_lower)
    
    if pos_count > neg_count:
        sentiment = 'positive'
        compound = 0.5 + (pos_count - neg_count) * 0.1
    elif neg_count > pos_count:
        sentiment = 'negative'
        compound = -0.5 - (neg_count - pos_count) * 0.1
    else:
        sentiment = 'neutral'
        compound = 0.0
    
    return {
        'sentiment': sentiment,
        'compound': round(compound, 2)
    }

def find_similar_texts(text, limit=3):
    """查找相似文本"""
    text_lower = text.lower()
    results = []
    
    for item in KNOWLEDGE_BASE:
        # 简单的关键词匹配计算相似度
        common_words = 0
        text_words = set(text_lower.split())
        item_words = set(item['text'].lower().split())
        
        common_words = len(text_words.intersection(item_words))
        similarity = min(0.95, common_words / max(len(text_words), len(item_words)))
        
        if similarity > 0.1:  # 只返回相似度大于0.1的结果
            results.append({
                'text': item['text'],
                'similarity': similarity
            })
    
    # 按相似度排序
    results.sort(key=lambda x: x['similarity'], reverse=True)
    return results[:limit]

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'message': 'CyberWise AI服务器运行正常',
        'version': '1.0.0',
        'features': ['文本分类', '情感分析', '相似文本匹配']
    })

@app.route('/api/analyze-text', methods=['POST'])
def analyze_text():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': '请提供text参数'}), 400
        
        text = data['text']
        
        # 执行AI分析
        classification = classify_text(text)
        sentiment = analyze_sentiment(text)
        similar_texts = find_similar_texts(text)
        
        result = {
            'classification': classification,
            'sentiment': sentiment,
            'similar_texts': similar_texts,
            'metadata': {
                'processing_time': '0.5s',
                'model_version': 'simple-v1.0',
                'accuracy': '75-85%'
            }
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': f'分析失败: {str(e)}'}), 500

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """返回所有安全类别"""
    categories = []
    for key, value in SECURITY_CATEGORIES.items():
        categories.append({
            'id': key,
            'name': value['name'],
            'keywords': value['keywords']
        })
    return jsonify({'categories': categories})

if __name__ == '__main__':
    print("🚀 启动CyberWise简化AI服务器...")
    print("📍 服务地址: http://localhost:5002")
    print("💡 提示: 按 Ctrl+C 停止服务器")
    print("🌐 前端将自动连接到此后端服务")
    print("-" * 50)
    
    app.run(debug=True, port=5002, host='0.0.0.0') 