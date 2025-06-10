from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import os
import logging
import traceback

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # 启用 CORS

# 获取项目根目录的绝对路径
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 检查模型文件是否存在
def check_model_files():
    required_files = [
        os.path.join(BASE_DIR, 'models', 'svm_classifier.joblib'),
        os.path.join(BASE_DIR, 'models', 'scaler.joblib'),
        os.path.join(BASE_DIR, 'models', 'keyword_to_index.joblib'),
        os.path.join(BASE_DIR, 'models', 'new_dic_vader_for_IT.dic'),
        os.path.join(BASE_DIR, 'data', 'task_4.xlsx')
    ]
    
    missing_files = []
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
            logger.error(f"Missing file: {file}")
            # 检查源文件是否存在
            source_file = file.replace(os.path.join(BASE_DIR, 'models', ''), 
                                     os.path.join(BASE_DIR, 'test', '')).replace(
                                     os.path.join(BASE_DIR, 'data', ''), 
                                     os.path.join(BASE_DIR, 'test', ''))
            if os.path.exists(source_file):
                logger.info(f"Source file exists: {source_file}")
            else:
                logger.error(f"Source file not found: {source_file}")
    
    if missing_files:
        logger.error(f"Missing required files: {missing_files}")
        return False
    return True

# 加载模型和资源
try:
    logger.info("Checking model files...")
    if not check_model_files():
        raise FileNotFoundError("Required model files are missing")
        
    logger.info("Loading models...")
    logger.info("Loading SentenceTransformer model...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    logger.info("SentenceTransformer model loaded successfully")
    
    logger.info("Loading SVM classifier...")
    svm = joblib.load(os.path.join(BASE_DIR, 'models', 'svm_classifier.joblib'))
    logger.info("SVM classifier loaded successfully")
    
    logger.info("Loading scaler...")
    scaler = joblib.load(os.path.join(BASE_DIR, 'models', 'scaler.joblib'))
    logger.info("Scaler loaded successfully")
    
    logger.info("Loading keyword index...")
    keyword_to_index = joblib.load(os.path.join(BASE_DIR, 'models', 'keyword_to_index.joblib'))
    logger.info("Keyword index loaded successfully")
    
    logger.info("All models loaded successfully")
except Exception as e:
    logger.error("Error loading models:")
    logger.error(traceback.format_exc())
    raise

def load_custom_dictionary(dictionary_path=None):
    """加载自定义情感词典"""
    if dictionary_path is None:
        dictionary_path = os.path.join(BASE_DIR, 'models', 'new_dic_vader_for_IT.dic')
    
    custom_dict = {}
    try:
        with open(dictionary_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                try:
                    parts = line.split('\t')
                    if len(parts) >= 2:
                        word = parts[0].strip()
                        score = float(parts[1].strip())
                        custom_dict[word] = score
                except ValueError:
                    continue
        logger.info(f"Loaded {len(custom_dict)} words from dictionary")
        return custom_dict
    except Exception as e:
        logger.error(f"Error loading dictionary: {e}")
        return None

def analyze_sentiment(text, use_custom_dict=True):
    """分析文本情感"""
    try:
        analyzer = SentimentIntensityAnalyzer()
        
        if use_custom_dict:
            custom_dict = load_custom_dictionary()
            if custom_dict:
                analyzer.lexicon.update(custom_dict)
        
        sentiment_scores = analyzer.polarity_scores(text)
        compound = sentiment_scores['compound']
        
        if compound > 0.05:
            sentiment = 'positive'
        elif compound < -0.05:
            sentiment = 'negative'
        else:
            sentiment = 'neutral'
            
        return {
            'compound': compound,
            'sentiment': sentiment
        }
    except Exception as e:
        logger.error(f"Error in sentiment analysis: {e}")
        return None

def classify_text(text):
    """分类文本"""
    try:
        # 创建特征向量
        features = np.zeros(len(keyword_to_index))
        for keyword in text.lower().split():
            if keyword in keyword_to_index:
                features[keyword_to_index[keyword]] = 1
        
        # 缩放特征
        features_scaled = scaler.transform(features.reshape(1, -1))
        
        # 预测
        prediction = svm.predict(features_scaled)[0]
        probabilities = svm.predict_proba(features_scaled)[0]
        
        # 获取所有类别的概率
        classes = svm.classes_
        class_probs = [(classes[i], float(prob)) for i, prob in enumerate(probabilities)]
        class_probs.sort(key=lambda x: x[1], reverse=True)
        
        return {
            'predicted': prediction,
            'probabilities': class_probs
        }
    except Exception as e:
        logger.error(f"Error in text classification: {e}")
        return None

def find_similar_texts(text, excel_path=None, top_n=5):
    """查找相似文本"""
    if excel_path is None:
        excel_path = os.path.join(BASE_DIR, 'data', 'task_4.xlsx')
    
    try:
        df = pd.read_excel(excel_path)
        texts = df.iloc[:, 0].astype(str).tolist()
        
        # 编码
        input_emb = model.encode(text)
        texts_emb = model.encode(texts)
        
        # 计算相似度
        sims = cosine_similarity([input_emb], texts_emb)[0]
        
        # 获取最相似的文本
        top_indices = sims.argsort()[-top_n:][::-1]
        
        similar_texts = []
        for idx in top_indices:
            similar_texts.append({
                'text': texts[idx],
                'similarity': float(sims[idx])
            })
            
        return similar_texts
    except Exception as e:
        logger.error(f"Error finding similar texts: {e}")
        return []

@app.route('/api/analyze-text', methods=['POST'])
def analyze_text():
    """处理文本分析请求"""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            logger.error("No text provided in request")
            return jsonify({'error': 'No text provided'}), 400
            
        text = data['text']
        if not text.strip():
            logger.error("Empty text provided")
            return jsonify({'error': 'Empty text provided'}), 400
        
        logger.info(f"Analyzing text: {text[:100]}...")
        
        # 执行分析
        logger.info("Starting sentiment analysis...")
        sentiment_result = analyze_sentiment(text)
        logger.info(f"Sentiment analysis result: {sentiment_result}")
        
        logger.info("Starting text classification...")
        classification_result = classify_text(text)
        logger.info(f"Classification result: {classification_result}")
        
        logger.info("Finding similar texts...")
        similar_texts = find_similar_texts(text)
        logger.info(f"Found {len(similar_texts)} similar texts")
        
        # 返回结果
        result = {
            'sentiment': sentiment_result,
            'classification': classification_result,
            'similar_texts': similar_texts
        }
        
        logger.info("Analysis completed successfully")
        logger.info(f"Final result: {result}")
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in analyze_text endpoint: {e}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-content', methods=['POST'])
def generate_content():
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        
        if not prompt:
            return jsonify({'error': '请提供写作提示'}), 400
            
        # 分析文本
        sentiment = analyze_sentiment(prompt)
        classification = classify_text(prompt)
        similar_texts = find_similar_texts(prompt)
        
        # 生成内容
        content = f"""# 文本分析结果

## 情感分析
- 情感得分: {sentiment['compound']:.3f}
- 情感倾向: {sentiment['sentiment']}

## 文本分类
- 预测类别: {classification['predicted']}
- 类别概率:
{chr(10).join([f'  - {cat}: {prob*100:.1f}%' for cat, prob in classification['probabilities']])}

## 相似文本
{chr(10).join([f'{i+1}. {text["text"]}\n   相似度: {text["similarity"]*100:.1f}%' for i, text in enumerate(similar_texts)])}

## 建议内容

基于分析结果，我建议从以下几个方面展开：

1. 基本概念和定义
   - 根据分类结果 {classification['predicted']} 进行详细解释
   - 结合相似文本中的关键概念

2. 核心原理和机制
   - 分析情感倾向 {sentiment['sentiment']} 对内容的影响
   - 参考相似文本中的技术细节

3. 实际应用场景
   - 基于分类概率最高的几个类别
   - 结合相似文本中的实际案例

4. 最佳实践和注意事项
   - 根据情感分析结果调整表达方式
   - 参考相似文本中的经验总结

5. 未来发展趋势
   - 基于分类结果预测发展方向
   - 结合相似文本中的前瞻性观点

希望这些建议对您有所帮助！"""
        
        return jsonify({
            'title': f"{classification['predicted']} - {prompt}",
            'content': content
        })
        
    except Exception as e:
        logger.error(f"Error generating content: {e}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 