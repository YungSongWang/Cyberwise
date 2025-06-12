import sys
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import threading
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)

# 将项目根目录添加到Python路径，以确保模块可以被正确导入
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

try:
    # 从重构后的模块中导入核心逻辑函数
    from cyberwise_new.api.text_analyzer import analyze_text_logic, generate_content_logic, classify_text
    logging.info("Successfully imported logic functions from 'text_analyzer'.")
except ImportError as e:
    logging.error(f"Failed to import logic functions: {e}")
    logging.error(f"Current Python path: {sys.path}")
    sys.exit(1)

# 初始化 Flask 应用
app = Flask(__name__)
# 允许所有来源的跨域请求
CORS(app)

# 存储模型加载状态
model_status = {
    "loaded": False,
    "error": None
}

def load_model_async():
    """异步加载和预热模型"""
    global model_status
    try:
        # 调用一个实际使用模型的函数来预热，例如 classify_text
        logging.info("Warming up AI models...")
        result = classify_text("This is a warm-up text to ensure models are loaded.")
        if result and 'predicted' in result:
            logging.info("AI models warmed up successfully.")
            model_status["loaded"] = True
        else:
            raise Exception("Model warm-up failed, classify_text returned an unexpected result.")
    except Exception as e:
        logging.error(f"An error occurred during model loading/warm-up: {e}")
        model_status["error"] = str(e)

@app.route('/status', methods=['GET'])
def status():
    """提供一个端点来检查模型加载状态"""
    if model_status["error"]:
        return jsonify({
            'status': 'error',
            'message': 'Model loading failed.',
            'error': model_status['error']
        }), 500
    
    if model_status["loaded"]:
        return jsonify({'status': 'ready', 'message': 'AI server is running and model is loaded.'})
    else:
        return jsonify({'status': 'loading', 'message': 'AI model is still loading. Please try again in a moment.'}), 202

@app.route('/api/analyze-text', methods=['POST'])
def analyze_text_endpoint():
    """处理文本分析请求的API端点"""
    if not model_status["loaded"]:
        return jsonify({'error': 'Model is not ready yet. Please check the /status endpoint.'}), 503

    data = request.json
    if not data or 'text' not in data:
        return jsonify({'error': 'Invalid request: "text" field is missing.'}), 400
    
    text_to_analyze = data['text']
    
    try:
        result = analyze_text_logic(text_to_analyze)
        return jsonify(result)
    except Exception as e:
        logging.error(f"An error occurred during text analysis: {e}")
        return jsonify({'error': 'An internal server error occurred.'}), 500

@app.route('/api/generate-content', methods=['POST'])
def generate_content_endpoint():
    """处理内容生成请求的API端点"""
    if not model_status["loaded"]:
        return jsonify({'error': 'Model is not ready yet. Please check the /status endpoint.'}), 503

    data = request.json
    if not data or 'prompt' not in data:
        return jsonify({'error': 'Invalid request: "prompt" field is missing.'}), 400
    
    prompt = data['prompt']
    
    try:
        result = generate_content_logic(prompt)
        return jsonify(result)
    except Exception as e:
        logging.error(f"An error occurred during content generation: {e}")
        return jsonify({'error': 'An internal server error occurred.'}), 500

def run_server():
    """启动 Flask Web 服务器"""
    logging.info("Starting AI backend server on http://0.0.0.0:5001")
    app.run(host='0.0.0.0', port=5001, debug=False)

if __name__ == '__main__':
    # 在后台线程中加载和预热模型
    model_loader_thread = threading.Thread(target=load_model_async)
    model_loader_thread.daemon = True
    model_loader_thread.start()
    
    # 启动 Web 服务器
    run_server() 