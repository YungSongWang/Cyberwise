#!/usr/bin/env python3
"""
CyberWise AI Backend - 生产环境入口
"""

import os
import sys
import logging

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# 确保在正确的目录
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

# 添加当前目录到Python路径
sys.path.append('.')

try:
    from api_backend.text_analyzer import app
    logger.info("✅ AI Backend application loaded successfully")
except Exception as e:
    logger.error(f"❌ Failed to load AI Backend application: {e}")
    # 创建一个简单的错误应用
    from flask import Flask, jsonify
    from flask_cors import CORS
    
    app = Flask(__name__)
    CORS(app)
    
    @app.route('/health', methods=['GET'])
    def health():
        return jsonify({'status': 'error', 'message': 'AI models not available'})
    
    @app.route('/api/analyze-text', methods=['POST'])
    def analyze_fallback():
        return jsonify({'error': 'AI analysis service temporarily unavailable'}), 503

# 健康检查端点
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok', 
        'message': 'CyberWise AI Backend is running',
        'version': '1.0.0'
    })

if __name__ == '__main__':
    # Railway自动提供PORT环境变量，本地使用5002
    port = int(os.environ.get('PORT', 5002))
    debug_mode = os.environ.get('FLASK_ENV', 'production') == 'development'
    
    logger.info(f'🚀 Starting CyberWise AI Backend on port: {port}')
    logger.info(f'🔧 Debug mode: {debug_mode}')
    logger.info(f'🌍 Environment: {os.environ.get("FLASK_ENV", "production")}')
    
    # 强制绑定到所有接口，使用Railway提供的端口
    app.run(debug=debug_mode, port=port, host='0.0.0.0', threaded=True) 