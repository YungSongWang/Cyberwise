#!/usr/bin/env python3
"""
AI Writing 服务器启动脚本
自动检测环境并启动合适的API服务器
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
        "models/new_dic_vader_for_IT.dic"
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

def start_full_server():
    """启动完整版API服务器"""
    print("🚀 启动完整版AI文本分析服务器...")
    print("📍 服务地址: http://localhost:5001")
    print("💡 提示: 按 Ctrl+C 停止服务器")
    print("-" * 50)
    
    try:
        os.chdir("api")
        subprocess.run([sys.executable, "text_analyzer.py"])
    except KeyboardInterrupt:
        print("\n👋 服务器已停止")
    except FileNotFoundError:
        print("❌ 未找到 api/text_analyzer.py 文件")

def start_simple_server():
    """启动简化版API服务器"""
    print("🚀 启动简化版API服务器...")
    print("📍 服务地址: http://localhost:5002")
    print("💡 提示: 按 Ctrl+C 停止服务器")
    print("-" * 50)
    
    try:
        os.chdir("api")
        subprocess.run([sys.executable, "simple_api.py"])
    except KeyboardInterrupt:
        print("\n👋 服务器已停止")
    except FileNotFoundError:
        print("❌ 未找到 api/simple_api.py 文件")

def main():
    """主函数"""
    print("🤖 AI Writing 服务器启动器")
    print("=" * 50)
    
    # 检查基础依赖
    if not check_package("flask"):
        print("❌ 缺少 Flask 包，正在尝试安装...")
        if not install_requirements():
            print("请手动安装: pip install flask flask-cors")
            return
    
    # 检查高级依赖
    has_advanced_deps = all([
        check_package("sentence_transformers"),
        check_package("sklearn"), 
        check_package("pandas"),
        check_package("vaderSentiment")
    ])
    
    if has_advanced_deps and check_model_files():
        print("\n🎯 检测到完整的AI分析环境!")
        choice = input("选择启动模式:\n1. 完整版 (包含所有AI功能)\n2. 简化版 (基础功能)\n请输入 1 或 2 [1]: ").strip()
        
        if choice == "2":
            start_simple_server()
        else:
            start_full_server()
    else:
        print("\n⚠️  部分依赖缺失，将启动简化版服务器")
        print("💡 如需完整功能，请运行: pip install -r requirements.txt")
        start_simple_server()

if __name__ == "__main__":
    # 确保在正确的目录中运行
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    main() 