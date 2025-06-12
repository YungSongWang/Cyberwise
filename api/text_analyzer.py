import os
import re
import joblib
import numpy as np
import pandas as pd
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.metrics.pairwise import cosine_similarity
import logging
import traceback

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 定义目录
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, '..', 'models')
DATA_DIR = os.path.join(BASE_DIR, '..', 'data')

# 定义模型路径
SVM_MODEL_PATH = os.path.join(MODELS_DIR, 'svm_classifier.joblib')
SCALER_PATH = os.path.join(MODELS_DIR, 'scaler.joblib')
KEYWORD_INDEX_PATH = os.path.join(MODELS_DIR, 'keyword_to_index.joblib')
CUSTOM_DICT_PATH = os.path.join(DATA_DIR, 'custom_sentiment_dict.txt')

def check_model_files():
    """检查所有模型文件是否存在"""
    logger.info("Checking model files...")
    paths_to_check = [SVM_MODEL_PATH, SCALER_PATH, KEYWORD_INDEX_PATH]
    for path in paths_to_check:
        if not os.path.exists(path):
            logger.error(f"Model file not found: {path}")
            raise FileNotFoundError(f"Model file not found: {path}")
    logger.info("All model files found.")

# 加载NLTK数据
def download_nltk_data():
    try:
        nltk.data.find('sentiment/vader_lexicon.zip')
    except LookupError:
        logger.info("Downloading NLTK vader_lexicon...")
        nltk.download('vader_lexicon')
        logger.info("Download complete.")

# 执行检查和下载
check_model_files()
download_nltk_data()

# 加载所有模型
logger.info("Loading models...")
try:
    logger.info("Loading SentenceTransformer model...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    logger.info("SentenceTransformer model loaded successfully")

    logger.info("Loading SVM classifier...")
    svm = joblib.load(SVM_MODEL_PATH)
    logger.info("SVM classifier loaded successfully")

    logger.info("Loading scaler...")
    scaler = joblib.load(SCALER_PATH)
    logger.info("Scaler loaded successfully")

    logger.info("Loading keyword index...")
    keyword_to_index = joblib.load(KEYWORD_INDEX_PATH)
    logger.info("Keyword index loaded successfully")
    
    logger.info("All models loaded successfully")

except Exception as e:
    logger.error(f"Error loading models: {e}")
    raise

def load_custom_dictionary(dictionary_path=None):
    """加载自定义情感词典"""
    if dictionary_path is None:
        dictionary_path = CUSTOM_DICT_PATH
        
    custom_dict = {}
    if os.path.exists(dictionary_path):
        try:
            with open(dictionary_path, 'r', encoding='utf-8') as f:
                for line in f:
                    parts = line.strip().split()
                    if len(parts) == 2:
                        word, score = parts
                        custom_dict[word] = float(score)
            logger.info("Custom sentiment dictionary loaded successfully.")
        except Exception as e:
            logger.error(f"Error loading custom dictionary: {e}")
    else:
        logger.warning("Custom sentiment dictionary not found, using default.")
        
    return custom_dict

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
        excel_path = os.path.join(DATA_DIR, 'task_4.xlsx')
    
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

def analyze_text_logic(text):
    """处理文本分析请求的核心逻辑"""
    try:
        if not text or not text.strip():
            logger.error("Empty text provided for analysis")
            return {'error': 'Empty text provided'}
        
        logger.info(f"Analyzing text: {text[:100]}...")
        
        sentiment_result = analyze_sentiment(text)
        classification_result = classify_text(text)
        similar_texts = find_similar_texts(text)
        
        result = {
            'sentiment': sentiment_result,
            'classification': classification_result,
            'similar_texts': similar_texts
        }
        
        logger.info("Analysis completed successfully")
        return result
        
    except Exception as e:
        logger.error(f"Error in analyze_text_logic: {e}")
        logger.error(traceback.format_exc())
        return {'error': str(e)}

def generate_content_logic(prompt):
    """生成建议内容的核心逻辑"""
    try:
        if not prompt or not prompt.strip():
            return {'error': '请提供写作提示'}

        sentiment = analyze_sentiment(prompt)
        classification = classify_text(prompt)
        similar_texts = find_similar_texts(prompt)
        
        if not sentiment or not classification:
            return {'error': 'Failed to analyze prompt for content generation.'}

        classification_probs_str = "\n".join([f'  - {cat}: {prob*100:.1f}%' for cat, prob in classification['probabilities']])
        similar_texts_str = "\n".join([f'{i+1}. {text["text"]}\n   相似度: {text["similarity"]*100:.1f}%' for i, text in enumerate(similar_texts)])

        content = f"""# 文本分析结果

## 情感分析
- 情感得分: {sentiment['compound']:.3f}
- 情感倾向: {sentiment['sentiment']}

## 文本分类
- 预测类别: {classification['predicted']}
- 类别概率:
{classification_probs_str}

## 相似文本
{similar_texts_str}

## 建议内容

基于分析结果，我建议从以下几个方面展开：

1.  **基本概念和定义**：根据分类结果"{classification['predicted']}"进行详细解释，并结合相似文本中的关键概念。
2.  **核心原理和机制**：分析情感倾向"{sentiment['sentiment']}"对内容的影响，并参考相似文本中的技术细节。
3.  **实际应用场景**：基于分类概率最高的几个类别，结合相似文本中的实际案例进行阐述。
4.  **最佳实践和注意事项**：根据情感分析结果调整表达方式，参考相似文本中的经验总结。
5.  **未来发展趋势**：基于分类结果预测发展方向，并结合相似文本中的前瞻性观点。

希望这些建议对您有所帮助！"""
        
        return {
            'title': f"{classification['predicted']} - {prompt}",
            'content': content
        }
        
    except Exception as e:
        logger.error(f"Error generating content: {e}")
        logger.error(traceback.format_exc())
        return {'error': str(e)} 