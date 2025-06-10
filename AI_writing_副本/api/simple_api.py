from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app)

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.route('/api/generate-content', methods=['POST'])
def generate_content():
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        
        if not prompt:
            return jsonify({'error': '请提供写作提示'}), 400
            
        logger.info(f"Received prompt: {prompt}")
        
        # 简化的内容生成逻辑
        content = f"""# {prompt} - 分析报告

## 概述
根据您的输入 "{prompt}"，我为您生成了以下内容分析和建议。

## 主要内容

### 1. 基本概念
- 核心主题：{prompt}
- 应用领域：技术分析和内容创作
- 重要程度：高

### 2. 详细分析
针对您提供的主题 "{prompt}"，以下是详细的分析和建议：

1. **定义与背景**
   - 该主题涉及多个技术层面
   - 需要综合考虑实际应用场景

2. **实施建议**
   - 建议从基础概念开始
   - 逐步深入具体技术细节
   - 关注实际应用价值

3. **注意事项**
   - 保持内容的准确性
   - 注重实用性和可操作性
   - 考虑目标受众的技术水平

### 3. 总结
"{prompt}" 是一个值得深入探讨的主题，通过系统性的分析和实践，可以获得良好的应用效果。

## 推荐资源
- 相关技术文档
- 实践案例分析
- 专家经验分享

---
*本内容由 AI 助手生成，仅供参考。*"""
        
        title = f"{prompt} - 智能分析报告"
        
        logger.info("Content generated successfully")
        
        return jsonify({
            'title': title,
            'content': content
        })
        
    except Exception as e:
        logger.error(f"Error generating content: {e}")
        return jsonify({'error': f'生成内容时出现错误: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'API server is running'})

if __name__ == '__main__':
    logger.info("Starting simple API server...")
    app.run(debug=True, port=5002, host='0.0.0.0') 