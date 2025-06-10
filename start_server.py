#!/usr/bin/env python3
"""
CyberWise 服务器启动脚本
同时启动AI API服务器和静态文件服务器
"""

import os
import sys
import subprocess
import time
import signal
import threading
from pathlib import Path

# 获取项目根目录
BASE_DIR = Path(__file__).parent
API_DIR = BASE_DIR / 'api'
API_FILE = API_DIR / 'text_analyzer.py'

def start_api_server():
    """启动AI API服务器"""
    print("🚀 启动AI API服务器...")
    
    # 优先尝试完整版API
    full_api_file = API_DIR / 'text_analyzer.py'
    simple_api_file = API_DIR / 'simple_text_analyzer.py'
    
    # 检查哪个API文件可用
    api_file_to_use = None
    api_type = ""
    
    if full_api_file.exists():
        # 检查是否有必要的依赖和模型文件
        try:
            import sentence_transformers
            import joblib
            # 检查模型文件
            models_dir = BASE_DIR / 'models'
            if models_dir.exists() and any(models_dir.glob('*.joblib')):
                api_file_to_use = full_api_file
                api_type = "完整版AI API"
            else:
                print("⚠️  缺少模型文件，将使用简化版API")
                api_file_to_use = simple_api_file
                api_type = "简化版AI API"
        except ImportError:
            print("⚠️  缺少高级依赖，将使用简化版API")
            api_file_to_use = simple_api_file
            api_type = "简化版AI API"
    else:
        api_file_to_use = simple_api_file
        api_type = "简化版AI API"
    
    if not api_file_to_use.exists():
        print(f"❌ API文件不存在: {api_file_to_use}")
        return None
        
    try:
        # 启动选定的API服务器
        process = subprocess.Popen([
            sys.executable, str(api_file_to_use)
        ], cwd=str(API_DIR))
        
        print(f"✅ {api_type}已启动 (PID: {process.pid})")
        print("📡 API地址: http://localhost:5000")
        return process
        
    except Exception as e:
        print(f"❌ 启动AI API服务器失败: {e}")
        return None

def start_static_server():
    """启动静态文件服务器"""
    print("🌐 启动静态文件服务器...")
    try:
        # 使用Python内置的HTTP服务器
        process = subprocess.Popen([
            sys.executable, '-m', 'http.server', '8080'
        ], cwd=str(BASE_DIR))
        
        print(f"✅ 静态文件服务器已启动 (PID: {process.pid})")
        print("🌍 前端地址: http://localhost:8080")
        return process
        
    except Exception as e:
        print(f"❌ 启动静态文件服务器失败: {e}")
        return None

def check_dependencies():
    """检查Python依赖"""
    required_packages = [
        'flask', 'flask_cors', 'pandas', 'numpy', 
        'scikit-learn', 'sentence_transformers', 
        'vaderSentiment', 'joblib', 'openpyxl'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print("⚠️  缺少以下Python依赖包:")
        for package in missing_packages:
            print(f"   - {package}")
        print("\n💡 请运行以下命令安装依赖:")
        print(f"   pip install -r {BASE_DIR}/requirements.txt")
        return False
    
    return True

def signal_handler(signum, frame):
    """处理退出信号"""
    print("\n🛑 收到退出信号，正在关闭服务器...")
    sys.exit(0)

def main():
    """主函数"""
    print("=" * 60)
    print("🎯 CyberWise 服务器启动器")
    print("=" * 60)
    
    # 检查依赖
    if not check_dependencies():
        print("\n❌ 依赖检查失败，请先安装所需依赖包")
        return
    
    # 注册信号处理器
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    processes = []
    
    try:
        # 启动API服务器
        api_process = start_api_server()
        if api_process:
            processes.append(api_process)
        
        # 等待API服务器启动
        print("⏳ 等待API服务器启动...")
        time.sleep(3)
        
        # 启动静态文件服务器
        static_process = start_static_server()
        if static_process:
            processes.append(static_process)
        
        if processes:
            print("\n" + "=" * 60)
            print("🎉 所有服务器已启动成功!")
            print("=" * 60)
            print("📱 前端地址: http://localhost:8080/templates/login.html")
            print("🔌 API地址: http://localhost:5000")
            print("💡 按 Ctrl+C 停止所有服务器")
            print("=" * 60)
            
            # 等待进程结束
            for process in processes:
                process.wait()
        else:
            print("❌ 没有成功启动任何服务器")
            
    except KeyboardInterrupt:
        pass
    except Exception as e:
        print(f"❌ 启动过程中出现错误: {e}")
    finally:
        # 清理进程
        print("\n🧹 正在清理进程...")
        for process in processes:
            try:
                process.terminate()
                process.wait(timeout=5)
            except:
                try:
                    process.kill()
                except:
                    pass
        
        print("✅ 清理完成，再见!")

if __name__ == '__main__':
    main() 