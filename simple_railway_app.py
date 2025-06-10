#!/usr/bin/env python3
"""
CyberWise AI Backend - Railway 专用简化版本
确保端口配置正确
"""

import os
import sys
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 创建Flask应用
app = Flask(__name__)
CORS(app)

# 健康检查端点
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok', 
        'message': 'CyberWise AI Backend (Railway) is running',
        'version': '1.0.0-railway',
        'port': os.environ.get('PORT', 'not_set')
    })

@app.route('/api/analyze-text', methods=['POST'])
def analyze_text_simple():
    """简化版文本分析"""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
            
        text = data['text'].lower()
        logger.info(f"Analyzing text: {text[:100]}...")
        
        # 简化的情感分析
        positive_words = ['good', 'secure', 'safe', 'protect', 'strong', 'effective', 'reliable']
        negative_words = ['attack', 'virus', 'malware', 'threat', 'vulnerable', 'breach', 'hack']
        
        score = 0
        for word in positive_words:
            if word in text:
                score += 0.1
        for word in negative_words:
            if word in text:
                score -= 0.1
                
        sentiment = 'positive' if score > 0.05 else 'negative' if score < -0.05 else 'neutral'
        
        # 简化的分类
        categories = {
            'Malware Protection': ['malware', 'virus', 'trojan', 'ransomware'],
            'Password Security': ['password', 'authentication', 'login'],
            'Network Security': ['network', 'firewall', 'ddos'],
            'Data Privacy': ['privacy', 'data', 'personal'],
            'General Security': []
        }
        
        predicted_category = 'General Security'
        for category, keywords in categories.items():
            if any(keyword in text for keyword in keywords):
                predicted_category = category
                break
        
        # 模拟相似文本
        similar_texts = [
            {'text': f'Related question about {predicted_category.lower()}', 'similarity': 0.75},
            {'text': f'Common issues in {predicted_category.lower()}', 'similarity': 0.65},
            {'text': f'Best practices for {predicted_category.lower()}', 'similarity': 0.55}
        ]
        
        result = {
            'sentiment': {
                'compound': score,
                'sentiment': sentiment
            },
            'classification': {
                'predicted': predicted_category,
                'probabilities': [
                    [predicted_category, 0.8],
                    ['General Security', 0.2]
                ]
            },
            'similar_texts': similar_texts
        }
        
        logger.info("Simple analysis completed successfully")
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in simple analysis: {e}")
        return jsonify({'error': 'Analysis service temporarily unavailable'}), 500

if __name__ == '__main__':
    # Railway会自动设置PORT环境变量
    port = int(os.environ.get('PORT', 5000))
    
    logger.info(f'🚀 Starting CyberWise Railway Backend')
    logger.info(f'📍 Port: {port}')
    logger.info(f'🌍 Environment variables:')
    logger.info(f'   PORT: {os.environ.get("PORT", "not_set")}')
    logger.info(f'   FLASK_ENV: {os.environ.get("FLASK_ENV", "not_set")}')
    
    # 启动应用
    app.run(
        debug=False, 
        port=port, 
        host='0.0.0.0', 
        threaded=True
    ) 