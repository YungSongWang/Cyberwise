#!/usr/bin/env python3
"""
AI Writing 后端服务器启动脚本
用于CyberWise项目的AI分析功能
"""

import os
import sys
import subprocess
import importlib.util

def check_package(package_name):
    """检查Python包是否已安装"""
    spec = importlib.util.find_spec(package_name)
    return spec is not None

def install_requirements():
    """安装依赖包"""
    requirements_file = "requirements.txt"
    if os.path.exists(requirements_file):
        print("🔧 正在安装依赖包...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", requirements_file])
            print("✅ 依赖包安装完成！")
            return True
        except subprocess.CalledProcessError:
            print("❌ 依赖包安装失败！")
            return False
    else:
        print("⚠️  未找到 requirements.txt 文件")
        return False

def check_model_files():
    """检查模型文件是否存在"""
    model_files = [
        "models/svm_classifier.joblib",
        "models/scaler.joblib", 
        "models/keyword_to_index.joblib",
        "models/new_dic_vader_for_IT.dic",
        "data/task_4.xlsx"
    ]
    
    missing_files = []
    for file_path in model_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if missing_files:
        print("❌ 缺少以下模型文件:")
        for file in missing_files:
            print(f"   - {file}")
        return False
    else:
        print("✅ 所有模型文件检查完成！")
        return True

def start_ai_server():
    """启动AI分析服务器"""
    print("🚀 启动CyberWise AI分析服务器...")
    print("📍 服务地址: http://localhost:5001")
    print("💡 提示: 按 Ctrl+C 停止服务器")
    print("🌐 前端将自动连接到此后端服务")
    print("-" * 50)
    
    try:
        # 修改text_analyzer.py的端口和HOST
        import api_backend.text_analyzer as analyzer
        analyzer.app.run(debug=True, port=5001, host='0.0.0.0')
    except KeyboardInterrupt:
        print("\n👋 AI分析服务器已停止")
    except Exception as e:
        print(f"❌ 启动服务器时出错: {e}")

def main():
    """主函数"""
    print("🤖 CyberWise AI Writing 后端启动器")
    print("=" * 50)
    
    # 检查基础依赖
    basic_packages = ["flask", "flask_cors", "pandas", "numpy", "sklearn"]
    missing_basic = [pkg for pkg in basic_packages if not check_package(pkg)]
    
    if missing_basic:
        print(f"❌ 缺少基础包: {missing_basic}")
        print("正在尝试安装...")
        if not install_requirements():
            print("请手动安装依赖: pip install -r requirements.txt")
            return
    
    # 检查高级依赖
    advanced_packages = ["sentence_transformers", "vaderSentiment", "joblib"]
    missing_advanced = [pkg for pkg in advanced_packages if not check_package(pkg)]
    
    if missing_advanced:
        print(f"❌ 缺少高级包: {missing_advanced}")
        if not install_requirements():
            print("请手动安装依赖: pip install -r requirements.txt")
            return
    
    # 检查模型文件
    if not check_model_files():
        print("❌ 模型文件检查失败，无法启动完整功能")
        return
    
    print("\n🎯 所有依赖检查完成，启动AI服务器...")
    start_ai_server()

if __name__ == "__main__":
    # 确保在正确的目录中运行
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    main() 