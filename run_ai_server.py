#!/usr/bin/env python3
import sys
import os

# 确保在正确的目录
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

# 添加当前目录到Python路径
sys.path.append('.')

from api_backend.text_analyzer import app

print('🚀 Starting CyberWise AI Backend Server...')
print('📍 Server URL: http://localhost:5001')
print('💡 Tip: Press Ctrl+C to stop the server')
print('🌐 Frontend will automatically connect to this backend service')
print('-' * 50)

if __name__ == '__main__':
    # 支持云平台的动态端口分配
    port = int(os.environ.get('PORT', 5001))
    debug_mode = os.environ.get('FLASK_ENV', 'development') == 'development'
    
    print(f'🌐 Server starting on port: {port}')
    app.run(debug=debug_mode, port=port, host='0.0.0.0') 