#!/usr/bin/env python3
"""
简化版CyberWise AI文本分析器
用于在没有完整模型文件时提供基本的AI写作功能
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import re
import logging

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # 启用 CORS

# 网络安全知识模板
SECURITY_TEMPLATES = {
    '密码安全': {
        'keywords': ['密码', '口令', '登录', '认证', '二次验证', '多因素'],
        'content': """
# 密码安全管理最佳实践

## 概述
密码是保护数字身份的第一道防线。随着网络威胁的不断演进，建立强健的密码安全策略比以往任何时候都更加重要。

## 强密码标准

### 密码复杂度要求
- **长度**: 至少12个字符，推荐16个字符以上
- **复杂性**: 包含大小写字母、数字和特殊字符
- **唯一性**: 每个账户使用不同的密码
- **可记忆性**: 使用密码短语或助记方法

### 避免的密码类型
- 个人信息（生日、姓名、电话号码）
- 常见密码（123456、password、qwerty）
- 字典单词的简单组合
- 键盘模式（asdf、1234）

## 密码管理策略

### 密码管理器使用
1. **选择可信的密码管理器**
   - 1Password、LastPass、Bitwarden等
   - 确保提供商有良好的安全记录
   
2. **主密码设置**
   - 使用最强的密码保护密码管理器
   - 考虑使用密码短语
   - 定期更新主密码

### 多因素认证(MFA)
- **短信验证**: 基础级别保护
- **认证应用**: Google Authenticator、Authy
- **硬件令牌**: YubiKey、RSA SecurID
- **生物识别**: 指纹、面部识别

## 密码策略实施

### 组织级策略
1. **密码政策制定**
   - 明确密码复杂度要求
   - 设置密码更新周期
   - 禁止密码重用

2. **员工培训**
   - 定期安全意识培训
   - 密码管理工具培训
   - 社会工程攻击防范

### 技术实施
- **单点登录(SSO)**: 减少密码数量
- **定期密码审计**: 检查弱密码
- **账户锁定策略**: 防止暴力破解
- **密码同步机制**: 确保策略一致性

## 密码泄露应对

### 检测密码泄露
- 使用HaveIBeenPwned等服务
- 监控暗网密码泄露
- 设置安全警报

### 泄露后处理
1. **立即更改密码**
2. **检查账户活动**
3. **启用额外安全措施**
4. **通知相关人员**

## 最佳实践总结

### 个人用户
- 使用密码管理器
- 启用双因素认证
- 定期检查账户安全
- 避免在公共设备上保存密码

### 企业用户
- 实施全面的密码政策
- 部署企业级密码管理方案
- 进行定期安全培训
- 建立密码泄露应急响应机制

---
*定期审查和更新密码安全策略，确保与最新威胁和技术发展保持同步。*
""",
    },
    
    '网络安全': {
        'keywords': ['网络', '防火墙', 'DDoS', '入侵', '攻击', '网络防护'],
        'content': """
# 网络安全防护综合指南

## 概述
网络安全是保护组织数字资产、维护业务连续性的核心要素。本指南涵盖了现代网络安全防护的各个层面。

## 网络安全架构

### 网络分段策略
- **DMZ区域**: 隔离对外服务
- **内网分区**: 按业务功能划分
- **VLAN隔离**: 逻辑网络分割
- **微分段**: 细粒度访问控制

### 边界防护
1. **防火墙配置**
   - 状态检测防火墙
   - 下一代防火墙(NGFW)
   - Web应用防火墙(WAF)
   
2. **入侵检测与防护**
   - 网络入侵检测系统(NIDS)
   - 主机入侵检测系统(HIDS)
   - 入侵防护系统(IPS)

## 常见网络威胁

### DDoS攻击防护
1. **攻击类型识别**
   - 容量耗尽攻击
   - 协议攻击
   - 应用层攻击

2. **防护措施**
   - 流量清洗服务
   - CDN加速服务
   - 弹性扩容机制
   - 黑洞路由

### 恶意软件防护
- **端点保护**: 企业级杀毒软件
- **沙箱分析**: 可疑文件隔离检测
- **行为分析**: 异常行为监控
- **威胁情报**: 实时威胁信息更新

## 网络监控与分析

### 安全运营中心(SOC)
1. **24/7监控**
   - 实时安全事件监控
   - 威胁狩猎活动
   - 事件响应协调

2. **安全信息与事件管理(SIEM)**
   - 日志聚合分析
   - 关联规则引擎
   - 自动化响应

### 网络流量分析
- **基准建立**: 正常流量模式
- **异常检测**: 偏离基准的活动
- **深度包检测**: 应用层内容分析
- **元数据分析**: 通信模式分析

## 零信任网络架构

### 核心原则
1. **永不信任，始终验证**
2. **最小权限原则**
3. **假设网络已被入侵**

### 实施步骤
1. **身份验证强化**
   - 多因素认证
   - 设备证书验证
   - 持续身份验证

2. **微分段实施**
   - 软件定义边界
   - 应用层安全策略
   - 动态访问控制

## 无线网络安全

### 企业WiFi安全
- **WPA3加密**: 最新加密标准
- **802.1X认证**: 企业级身份验证
- **网络访问控制(NAC)**: 设备准入控制
- **访客网络隔离**: 分离访客和企业网络

### 移动设备管理
- **移动设备管理(MDM)**: 设备策略管理
- **移动应用管理(MAM)**: 应用安全控制
- **容器化技术**: 工作与个人数据分离

## 云网络安全

### 云原生安全
1. **云安全配置**
   - 安全组配置
   - 网络ACL设置
   - VPC安全设计

2. **容器网络安全**
   - 容器网络策略
   - 服务网格安全
   - 镜像安全扫描

## 事件响应与恢复

### 响应流程
1. **检测与分析**
2. **遏制与根除**
3. **恢复与跟进**
4. **经验教训总结**

### 业务连续性
- **灾难恢复计划**
- **数据备份策略**
- **冗余系统设计**
- **故障切换机制**

---
*网络安全是一个持续演进的过程，需要定期评估和更新防护策略。*
""",
    },
    
    '恶意软件防护': {
        'keywords': ['恶意软件', '病毒', '木马', '勒索软件', '感染', '清除'],
        'content': """
# 恶意软件防护完整指南

## 概述
恶意软件是当今数字环境中最大的威胁之一。本指南提供了识别、防护和清除恶意软件的全面策略。

## 恶意软件类型分析

### 常见恶意软件类型
1. **病毒(Virus)**
   - 自我复制程序
   - 感染其他文件
   - 需要宿主程序运行

2. **木马(Trojan)**
   - 伪装成合法软件
   - 创建后门访问
   - 窃取敏感信息

3. **勒索软件(Ransomware)**
   - 加密用户文件
   - 要求赎金解密
   - 造成严重业务中断

4. **间谍软件(Spyware)**
   - 监控用户活动
   - 收集个人信息
   - 发送数据给攻击者

5. **广告软件(Adware)**
   - 显示不想要的广告
   - 跟踪浏览习惯
   - 降低系统性能

## 防护策略

### 多层防护机制
1. **端点保护**
   - 企业级反病毒软件
   - 实时行为监控
   - 启发式检测引擎
   - 机器学习威胁检测

2. **网络层防护**
   - 网关反病毒扫描
   - DNS过滤服务
   - 网络流量分析
   - 恶意域名阻断

3. **邮件安全**
   - 附件沙箱分析
   - 链接安全检查
   - 反钓鱼过滤
   - 垃圾邮件过滤

### 系统加固措施
1. **操作系统安全**
   - 及时安装安全补丁
   - 禁用不必要的服务
   - 配置用户账户控制
   - 启用系统防火墙

2. **应用程序安全**
   - 保持软件最新版本
   - 使用官方软件源
   - 配置应用程序沙箱
   - 限制应用程序权限

## 感染检测

### 感染征象识别
1. **性能异常**
   - 系统运行缓慢
   - 异常网络流量
   - 磁盘空间不足
   - 内存使用率高

2. **行为异常**
   - 未知进程运行
   - 文件被加密或删除
   - 浏览器首页被修改
   - 弹出异常窗口

3. **网络异常**
   - 连接到可疑域名
   - 大量对外连接
   - DNS查询异常
   - 数据泄露迹象

### 检测工具
- **在线扫描工具**: VirusTotal、Hybrid Analysis
- **离线扫描工具**: Malwarebytes、ESET Online Scanner
- **系统分析工具**: Process Monitor、Wireshark
- **内存分析工具**: Volatility、Rekall

## 清除与恢复

### 恶意软件清除步骤
1. **隔离感染系统**
   - 断开网络连接
   - 防止横向传播
   - 保护其他系统

2. **数据备份**
   - 备份重要文件
   - 扫描备份文件
   - 验证备份完整性

3. **系统清理**
   - 使用专业清除工具
   - 手动删除恶意文件
   - 清理注册表项
   - 重置系统设置

4. **系统重建**
   - 考虑系统重装
   - 恢复干净备份
   - 重新安装应用程序
   - 恢复用户数据

### 勒索软件特殊处理
1. **不要支付赎金**
   - 没有解密保证
   - 资助犯罪活动
   - 可能再次被攻击

2. **寻求专业帮助**
   - 联系网络安全专家
   - 报告执法部门
   - 查找免费解密工具

3. **数据恢复策略**
   - 使用备份恢复
   - 文件版本历史
   - 影子复制恢复
   - 专业数据恢复服务

## 预防措施

### 用户教育
1. **安全意识培训**
   - 识别可疑邮件
   - 安全下载习惯
   - 社会工程防范
   - 密码安全管理

2. **最佳实践**
   - 定期数据备份
   - 软件及时更新
   - 避免使用管理员权限
   - 不点击可疑链接

### 技术防护
1. **备份策略**
   - 3-2-1备份规则
   - 离线备份存储
   - 定期备份测试
   - 版本控制管理

2. **访问控制**
   - 最小权限原则
   - 特权账户管理
   - 文件访问控制
   - 网络分段隔离

## 应急响应计划

### 响应流程
1. **检测与评估**
2. **遏制与隔离**
3. **清除与恢复**
4. **跟进与改进**

### 沟通机制
- **内部通知流程**
- **客户沟通策略**
- **媒体应对预案**
- **监管报告要求**

---
*恶意软件威胁持续演进，防护策略需要不断更新和完善。*
""",
    }
}

def classify_prompt(prompt):
    """分类用户输入的提示"""
    prompt_lower = prompt.lower()
    
    for category, info in SECURITY_TEMPLATES.items():
        if any(keyword in prompt_lower for keyword in info['keywords']):
            return category
    
    return '网络安全'  # 默认分类

def generate_title(prompt, category):
    """生成文档标题"""
    title_templates = {
        '密码安全': [
            '密码安全管理最佳实践',
            '企业密码策略制定指南',
            '密码安全防护方案',
            '多因素认证实施指南'
        ],
        '网络安全': [
            '网络安全防护策略',
            '企业网络安全架构设计',
            '网络威胁防护指南',
            '零信任网络安全方案'
        ],
        '恶意软件防护': [
            '恶意软件防护完整方案',
            '企业反恶意软件策略',
            '恶意软件应急响应预案',
            '端点安全防护指南'
        ]
    }
    
    templates = title_templates.get(category, ['网络安全分析报告'])
    
    # 根据提示内容选择更精确的标题
    if '分析' in prompt:
        return f'{category}威胁分析报告'
    elif '策略' in prompt or '方案' in prompt:
        return f'{category}防护策略方案'
    elif '培训' in prompt or '教程' in prompt:
        return f'{category}培训教程'
    else:
        return random.choice(templates)

def enhance_content_with_prompt(base_content, prompt):
    """根据用户提示增强内容"""
    enhanced_content = f"# 基于您的询问：{prompt}\n\n"
    enhanced_content += base_content
    
    # 添加针对性的建议
    enhanced_content += f"\n\n## 针对您的具体需求\n\n"
    enhanced_content += f"根据您的询问\"{prompt}\"，我们特别建议：\n\n"
    
    if '企业' in prompt:
        enhanced_content += "- 制定全面的企业级安全策略\n"
        enhanced_content += "- 实施分层防护机制\n"
        enhanced_content += "- 建立安全运营中心(SOC)\n"
        enhanced_content += "- 定期进行安全培训和演练\n"
    elif '个人' in prompt:
        enhanced_content += "- 使用强密码和密码管理器\n"
        enhanced_content += "- 启用双因素认证\n"
        enhanced_content += "- 定期更新软件和系统\n"
        enhanced_content += "- 提高安全意识，谨慎点击链接\n"
    else:
        enhanced_content += "- 评估当前安全状况\n"
        enhanced_content += "- 制定针对性防护措施\n"
        enhanced_content += "- 建立监控和响应机制\n"
        enhanced_content += "- 持续改进安全策略\n"
    
    enhanced_content += f"\n---\n*本分析基于您的询问生成，建议结合具体环境进行调整。*"
    
    return enhanced_content

@app.route('/api/analyze-text', methods=['POST'])
def analyze_text():
    """分析文本的简化版本"""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
            
        text = data['text']
        if not text.strip():
            return jsonify({'error': 'Empty text provided'}), 400
        
        logger.info(f"Analyzing text: {text[:100]}...")
        
        # 简化的分析结果
        category = classify_prompt(text)
        
        result = {
            'sentiment': {
                'compound': 0.0,
                'sentiment': 'neutral'
            },
            'classification': {
                'predicted': category,
                'probabilities': [(category, 0.95), ('网络安全', 0.05)]
            },
            'similar_texts': [
                {
                    'text': f'{category}相关问题1',
                    'similarity': 0.85
                },
                {
                    'text': f'{category}相关问题2',
                    'similarity': 0.78
                }
            ]
        }
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in analyze_text: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-content', methods=['POST'])
def generate_content():
    """生成内容"""
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        
        if not prompt:
            return jsonify({'error': '请提供写作提示'}), 400
            
        logger.info(f"Generating content for prompt: {prompt}")
        
        # 分类用户提示
        category = classify_prompt(prompt)
        
        # 获取基础内容模板
        base_content = SECURITY_TEMPLATES[category]['content']
        
        # 根据提示增强内容
        enhanced_content = enhance_content_with_prompt(base_content, prompt)
        
        # 生成标题
        title = generate_title(prompt, category)
        
        result = {
            'title': title,
            'content': enhanced_content,
            'category': category
        }
        
        logger.info("Content generated successfully")
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error generating content: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查接口"""
    return jsonify({
        'status': 'healthy',
        'service': 'CyberWise Simple AI Text Analyzer',
        'version': '1.0.0'
    })

if __name__ == '__main__':
    logger.info("Starting CyberWise Simple AI Text Analyzer...")
    logger.info("服务地址: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000) 