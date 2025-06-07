// CyberWise Dashboard - Version 2.2.0 - Force Cache Refresh FINAL
// Updated: 2025-05-29 - Ensure Modal Implementation Online
let currentUser = null;
let authChecked = false; // 添加认证检查标志

// 认证状态将在DOMContentLoaded中处理

// 显示加载指示器
function showLoadingIndicator() {
    const mainContent = document.querySelector('.main');
    if (mainContent) {
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #888;">
                <i class="ri-loader-4-line" style="font-size: 48px; animation: spin 1s linear infinite;"></i>
                <h3>正在验证登录状态...</h3>
                <p>请稍候...</p>
            </div>
        `;
    }
}

// 隐藏加载指示器
function hideLoadingIndicator() {
    console.log('隐藏加载指示器，恢复原始内容');

    // 恢复原始的dashboard内容
    const mainContent = document.querySelector('.main');
    if (mainContent) {
        mainContent.innerHTML = `
            <div id="start-section">
                <!-- 主欢迎区域 -->
                <div style="text-align: center; margin-bottom: 40px; background: linear-gradient(45deg, rgba(0, 234, 255, 0.1), rgba(161, 0, 255, 0.1)); border-radius: 20px; padding: 40px 30px; border: 1px solid rgba(0, 234, 255, 0.3);">
                    <h1 style="margin: 0 0 15px 0; font-size: 32px; background: linear-gradient(45deg, #00eaff, #a100ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: transparent;" data-lang="welcomeTitle">Welcome to CyberWise Knowledge Base!</h1>
                    <p style="font-size: 18px; color: #ccc; margin: 0; max-width: 600px; margin: 0 auto;" data-lang="welcomeDesc">Your personal knowledge management system. Use the sidebar to navigate between different sections.</p>
                </div>

                <!-- 特别突出的User Guide卡片 -->
                <div style="background: linear-gradient(135deg, rgba(255, 193, 7, 0.2), rgba(255, 152, 0, 0.2)); border: 2px solid rgba(255, 193, 7, 0.5); border-radius: 16px; padding: 25px; margin-bottom: 30px; position: relative; overflow: hidden;">
                    <div style="position: absolute; top: 15px; right: 15px; background: rgba(255, 193, 7, 0.3); color: #ffc107; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                        🌟 推荐新用户
                    </div>
                    <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 300px;">
                            <h2 style="color: #ffc107; margin: 0 0 10px 0; font-size: 24px; display: flex; align-items: center; gap: 10px;">
                                <i class="ri-book-open-line" style="font-size: 28px;"></i>
                                <span data-lang="userGuideTitle">📖 使用指南</span>
                            </h2>
                            <p style="color: #e0e0e0; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;" data-lang="userGuideIntro">
                                初次使用CyberWise？别担心！我们的详细使用指南将帮助您快速掌握所有功能，从AI助手到知识库搜索，让您成为网络安全专家！
                            </p>
                            <button onclick="showSection('favorites')" style="background: linear-gradient(45deg, #ffc107, #ff9800); color: #000; border: none; border-radius: 12px; padding: 15px 30px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(255, 193, 7, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(255, 193, 7, 0.3)'">
                                <i class="ri-guide-line" style="margin-right: 8px;"></i>
                                <span data-lang="viewUserGuide">查看使用指南</span>
                            </button>
                        </div>
                        <div style="flex: 0 0 auto;">
                            <div style="width: 100px; height: 100px; background: linear-gradient(45deg, #ffc107, #ff9800); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 48px;">
                                📚
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 功能卡片网格 -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 30px;">
                    
                    <!-- AI Writing 卡片 -->
                    <div style="background: rgba(0, 234, 255, 0.1); border: 1px solid rgba(0, 234, 255, 0.3); border-radius: 16px; padding: 25px; transition: all 0.3s ease; cursor: pointer;" onclick="showSection('ai')" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 25px rgba(0, 234, 255, 0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                            <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #00eaff, #0099cc); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px;">
                                🤖
                            </div>
                            <div>
                                <h3 style="color: #00eaff; margin: 0 0 5px 0; font-size: 20px;" data-lang="aiWritingFeature">AI 安全助手</h3>
                                <p style="color: #ccc; margin: 0; font-size: 12px;">智能问答 • 问题分析 • 解决方案推荐</p>
                            </div>
                        </div>
                        <p style="color: #e0e0e0; font-size: 14px; line-height: 1.5; margin-bottom: 15px;" data-lang="aiWritingDesc">
                            向AI助手描述您的网络安全问题，获得智能分析和专业解决方案。支持自然语言对话，让安全咨询变得简单高效。
                        </p>
                        <div style="display: flex; align-items: center; color: #00eaff; font-size: 14px; font-weight: 500;">
                            <span data-lang="tryAI">立即体验</span>
                            <i class="ri-arrow-right-line" style="margin-left: 8px;"></i>
                        </div>
                    </div>

                    <!-- Knowledge Base 卡片 -->
                    <div style="background: rgba(161, 0, 255, 0.1); border: 1px solid rgba(161, 0, 255, 0.3); border-radius: 16px; padding: 25px; transition: all 0.3s ease; cursor: pointer;" onclick="window.location.href='/templates/knowledge_base.html'" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 25px rgba(161, 0, 255, 0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                            <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #a100ff, #7c00d9); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px;">
                                📚
                            </div>
                            <div>
                                <h3 style="color: #a100ff; margin: 0 0 5px 0; font-size: 20px;" data-lang="knowledgeBaseFeature">知识库</h3>
                                <p style="color: #ccc; margin: 0; font-size: 12px;">智能搜索 • 分类筛选 • 385个问题</p>
                            </div>
                        </div>
                        <p style="color: #e0e0e0; font-size: 14px; line-height: 1.5; margin-bottom: 15px;" data-lang="knowledgeBaseDesc">
                            丰富的网络安全知识库，包含各类安全问题和解决方案。支持智能搜索、分类筛选，帮您快速找到所需信息。
                        </p>
                        <div style="display: flex; align-items: center; color: #a100ff; font-size: 14px; font-weight: 500;">
                            <span data-lang="browseKnowledgeBase">浏览知识库</span>
                            <i class="ri-arrow-right-line" style="margin-left: 8px;"></i>
                        </div>
                    </div>

                    <!-- Quiz 卡片 -->
                    <div style="background: rgba(46, 213, 115, 0.1); border: 1px solid rgba(46, 213, 115, 0.3); border-radius: 16px; padding: 25px; transition: all 0.3s ease; cursor: pointer;" onclick="window.location.href='/templates/quizs.html'" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 25px rgba(46, 213, 115, 0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                            <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #2ed573, #1dd1a1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px;">
                                📊
                            </div>
                            <div>
                                <h3 style="color: #2ed573; margin: 0 0 5px 0; font-size: 20px;" data-lang="quizFeature">在线测试</h3>
                                <p style="color: #ccc; margin: 0; font-size: 12px;">单选题 • 判断题 • 混合模式</p>
                            </div>
                        </div>
                        <p style="color: #e0e0e0; font-size: 14px; line-height: 1.5; margin-bottom: 15px;" data-lang="quizDesc">
                            多种题型的在线测试系统，包括单选题、判断题等。实时统计答题情况，帮您检验学习效果。
                        </p>
                        <div style="display: flex; align-items: center; color: #2ed573; font-size: 14px; font-weight: 500;">
                            <span data-lang="startQuiz">开始测试</span>
                            <i class="ri-arrow-right-line" style="margin-left: 8px;"></i>
                        </div>
                    </div>

                    <!-- Notes 卡片 -->
                    <div style="background: rgba(255, 107, 107, 0.1); border: 1px solid rgba(255, 107, 107, 0.3); border-radius: 16px; padding: 25px; transition: all 0.3s ease; cursor: pointer;" onclick="showSection('notes')" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 25px rgba(255, 107, 107, 0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                            <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #ff6b6b, #ff5252); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px;">
                                📝
                            </div>
                            <div>
                                <h3 style="color: #ff6b6b; margin: 0 0 5px 0; font-size: 20px;" data-lang="notesFeature">笔记管理</h3>
                                <p style="color: #ccc; margin: 0; font-size: 12px;">创建 • 编辑 • 收藏 • 本地存储</p>
                            </div>
                        </div>
                        <p style="color: #e0e0e0; font-size: 14px; line-height: 1.5; margin-bottom: 15px;" data-lang="notesDesc">
                            个人笔记管理系统，支持创建、编辑、收藏笔记。本地存储确保数据安全，随时记录您的学习心得。
                        </p>
                        <div style="display: flex; align-items: center; color: #ff6b6b; font-size: 14px; font-weight: 500;">
                            <span data-lang="manageNotes">管理笔记</span>
                            <i class="ri-arrow-right-line" style="margin-left: 8px;"></i>
                        </div>
                    </div>

                </div>

                <!-- 快速操作区域 -->
                <div style="background: rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 25px; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <h3 style="color: #00eaff; margin: 0 0 20px 0; font-size: 20px; display: flex; align-items: center; gap: 10px;" data-lang="quickActions">
                        <i class="ri-lightning-line"></i>
                        快速操作
                    </h3>
                    <div style="display: flex; gap: 15px; flex-wrap: wrap; align-items: center;">
                        <button onclick="createNewDocument()" style="background: linear-gradient(45deg, #00eaff, #0099cc); color: white; border: none; border-radius: 10px; padding: 12px 20px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 8px;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                            <i class="ri-add-line"></i>
                            <span data-lang="createNewDoc">新建文档</span>
                        </button>
                        
                        <button onclick="showSection('notes')" style="background: linear-gradient(45deg, #ff6b6b, #ff5252); color: white; border: none; border-radius: 10px; padding: 12px 20px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 8px;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                            <i class="ri-file-list-line"></i>
                            <span data-lang="viewNotes">查看笔记</span>
                        </button>
                        
                        <button onclick="showSection('ai')" style="background: linear-gradient(45deg, #a100ff, #7c00d9); color: white; border: none; border-radius: 10px; padding: 12px 20px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 8px;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                            <i class="ri-magic-line"></i>
                            <span data-lang="askAI">咨询AI</span>
                        </button>
                        
                        <button onclick="window.location.href='/templates/quizs.html'" style="background: linear-gradient(45deg, #2ed573, #1dd1a1); color: white; border: none; border-radius: 10px; padding: 12px 20px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 8px;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                            <i class="ri-questionnaire-line"></i>
                            <span data-lang="takeQuiz">开始测试</span>
                        </button>
                    </div>
                    
                    <!-- 统计信息 -->
                    <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px;">
                            <div style="text-align: center; background: rgba(0, 234, 255, 0.1); border-radius: 10px; padding: 15px;">
                                <div style="font-size: 24px; font-weight: bold; color: #00eaff; margin-bottom: 5px;">385</div>
                                <div style="font-size: 12px; color: #ccc;" data-lang="totalQuestions">知识库问题</div>
                            </div>
                            <div style="text-align: center; background: rgba(161, 0, 255, 0.1); border-radius: 10px; padding: 15px;">
                                <div style="font-size: 24px; font-weight: bold; color: #a100ff; margin-bottom: 5px;">8</div>
                                <div style="font-size: 12px; color: #ccc;" data-lang="mainCategories">主要分类</div>
                            </div>
                            <div style="text-align: center; background: rgba(46, 213, 115, 0.1); border-radius: 10px; padding: 15px;">
                                <div style="font-size: 24px; font-weight: bold; color: #2ed573; margin-bottom: 5px;">3</div>
                                <div style="font-size: 12px; color: #ccc;" data-lang="quizTypes">测试类型</div>
                            </div>
                            <div style="text-align: center; background: rgba(255, 107, 107, 0.1); border-radius: 10px; padding: 15px;">
                                <div style="font-size: 24px; font-weight: bold; color: #ff6b6b; margin-bottom: 5px;">∞</div>
                                <div style="font-size: 12px; color: #ccc;" data-lang="unlimitedNotes">无限笔记</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="ai-section" style="display: none;">
                <!-- ChatGPT风格的AI聊天界面 -->
                <div class="chatgpt-container">
                    <!-- 上方：消息显示区域 -->
                    <div class="chat-messages" id="aiChatMessages">
                        <!-- 欢迎消息 -->
                        <div class="welcome-message">
                            <div class="ai-message">
                                <div class="ai-avatar">🤖</div>
                                <div class="ai-message-content">
                                    <h3 data-lang="aiChatWelcomeTitle">欢迎使用AI安全助手 🤖</h3>
                                    <p data-lang="aiChatWelcome1">👋 您好！我是CyberWise的AI安全助手。</p>
                                    <p data-lang="aiChatWelcome2">请描述您遇到的网络安全问题，我将自动分析问题类型并为您匹配最相关的解决方案。</p>
                                    
                                    <div class="quick-suggestions">
                                        <p data-lang="aiChatSuggestions">💡 您可以试着问我：</p>
                                        <div class="suggestion-buttons">
                                            <button class="suggestion-btn" onclick="sendSuggestion(getText('aiChatSuggestion1Text'))" data-lang="aiChatSuggestion1">🦠 恶意软件问题</button>
                                            <button class="suggestion-btn" onclick="sendSuggestion(getText('aiChatSuggestion2Text'))" data-lang="aiChatSuggestion2">🔐 密码安全</button>
                                            <button class="suggestion-btn" onclick="sendSuggestion(getText('aiChatSuggestion3Text'))" data-lang="aiChatSuggestion3">📧 钓鱼攻击</button>
                                            <button class="suggestion-btn" onclick="sendSuggestion(getText('aiChatSuggestion4Text'))" data-lang="aiChatSuggestion4">🛡️ 网络防护</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 下方：输入区域 -->
                    <div class="chat-input-container">
                        <div class="input-wrapper">
                            <textarea 
                                id="aiChatInput" 
                                data-lang="aiChatInputPlaceholder"
                                placeholder="描述您遇到的网络安全问题..." 
                                rows="1"
                                onkeydown="handleChatKeydown(event)"
                                oninput="autoResizeTextarea(this)"
                            ></textarea>
                            <button id="aiSendBtn" onclick="sendMessage()" class="send-btn">
                                <i class="ri-send-plane-line"></i>
                            </button>
                        </div>
                        <div class="input-hint">
                            <small data-lang="aiChatFooter">AI将自动分析问题类型并匹配相关解决方案 • 回车发送，Shift+回车换行</small>
                        </div>
                    </div>
                </div>
            </div>

            <div id="notes-section" style="display: none;">
                <h1 data-lang="notesTitle">My Notes</h1>
                <p data-lang="notesDesc">Manage your personal notes and documents.</p>
                <div id="notes-list" style="margin-top: 20px;">
                    <!-- Notes will be loaded here -->
                </div>
            </div>

            <div id="favorites-section" style="display: none;">
                <div style="max-width: 1000px; margin: 0 auto; padding: 0 20px;">
                    <h1 data-lang="userGuideTitle">📖 CyberWise 使用说明书</h1>
                    <p style="font-size: 16px; color: #ccc; margin-bottom: 40px;" data-lang="userGuideDesc">欢迎使用 CyberWise 网络安全知识管理平台！本指南将帮助您快速了解和使用我们的各项功能。</p>
                    
                    <!-- 功能概览 -->
                    <div style="background: rgba(0, 234, 255, 0.1); border-radius: 12px; padding: 25px; margin-bottom: 30px; border: 1px solid rgba(0, 234, 255, 0.2);">
                        <h2 style="color: #00eaff; margin: 0 0 15px 0; font-size: 20px;" data-lang="platformOverview">🌟 平台概览</h2>
                        <p style="color: #e0e0e0; line-height: 1.6; margin: 0;" data-lang="platformOverviewDesc">CyberWise 是一个专业的网络安全知识管理和学习平台，集成了AI助手、知识库、笔记管理、在线测试等多项功能，旨在帮助用户提升网络安全意识和技能。</p>
                    </div>

                    <!-- 功能介绍 -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 40px; grid-auto-rows: 1fr;">
                        
                        <!-- AI Writing功能 -->
                        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; border: 1px solid rgba(255, 255, 255, 0.1); display: flex; flex-direction: column; height: 100%;">
                            <h3 style="color: #00eaff; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">
                                <i class="ri-magic-line"></i>
                                <span data-lang="aiWritingFeature">🤖 AI 安全助手</span>
                            </h3>
                            <p style="color: #ccc; line-height: 1.5; font-size: 14px; margin: 0 0 15px 0;" data-lang="aiWritingDesc">智能AI助手可以帮您分析网络安全问题，自动匹配相关解决方案，并提供专业建议。支持自然语言对话，让安全咨询变得简单高效。</p>
                            <div style="background: rgba(0, 234, 255, 0.1); padding: 10px; border-radius: 6px; border-left: 3px solid #00eaff; flex: 1; display: flex; flex-direction: column; justify-content: center;">
                                <strong style="color: #00eaff; font-size: 12px;" data-lang="howToUse">使用方法：</strong>
                                <p style="color: #ccc; font-size: 12px; margin: 5px 0 0 0;" data-lang="aiWritingHowTo">点击侧边栏"AI Writing"，输入您的安全问题，AI将自动分析并提供相关解决方案。</p>
                            </div>
                        </div>

                        <!-- Knowledge Base功能 -->
                        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; border: 1px solid rgba(255, 255, 255, 0.1); display: flex; flex-direction: column; height: 100%;">
                            <h3 style="color: #00eaff; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">
                                <i class="ri-book-open-line"></i>
                                <span data-lang="knowledgeBaseFeature">📚 知识库</span>
                            </h3>
                            <p style="color: #ccc; line-height: 1.5; font-size: 14px; margin: 0 0 15px 0;" data-lang="knowledgeBaseDesc">丰富的网络安全知识库，包含各类安全问题和解决方案。支持智能搜索、分类筛选，帮您快速找到所需信息。</p>
                            <div style="background: rgba(0, 234, 255, 0.1); padding: 10px; border-radius: 6px; border-left: 3px solid #00eaff; flex: 1; display: flex; flex-direction: column; justify-content: center;">
                                <strong style="color: #00eaff; font-size: 12px;" data-lang="howToUse">使用方法：</strong>
                                <p style="color: #ccc; font-size: 12px; margin: 5px 0 0 0;" data-lang="knowledgeBaseHowTo">点击"Knowledge Base"进入知识库，使用搜索框查找相关问题，或通过分类筛选浏览内容。</p>
                            </div>
                        </div>

                        <!-- Notes功能 -->
                        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; border: 1px solid rgba(255, 255, 255, 0.1); display: flex; flex-direction: column; height: 100%;">
                            <h3 style="color: #00eaff; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">
                                <i class="ri-quill-pen-line"></i>
                                <span data-lang="notesFeature">📝 笔记管理</span>
                            </h3>
                            <p style="color: #ccc; line-height: 1.5; font-size: 14px; margin: 0 0 15px 0;" data-lang="notesDesc">个人笔记管理系统，支持创建、编辑、收藏笔记。本地存储确保数据安全，随时记录您的学习心得。</p>
                            <div style="background: rgba(0, 234, 255, 0.1); padding: 10px; border-radius: 6px; border-left: 3px solid #00eaff; flex: 1; display: flex; flex-direction: column; justify-content: flex-end;">
                                <strong style="color: #00eaff; font-size: 12px;" data-lang="howToUse">使用方法：</strong>
                                <p style="color: #ccc; font-size: 12px; margin: 5px 0 0 0;" data-lang="notesHowTo">点击"Notes"进入笔记页面，使用"Create New Document"创建新笔记，支持收藏和删除操作。</p>
                            </div>
                        </div>

                        <!-- Quiz功能 -->
                        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; border: 1px solid rgba(255, 255, 255, 0.1); display: flex; flex-direction: column; height: 100%;">
                            <h3 style="color: #00eaff; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">
                                <i class="ri-questionnaire-line"></i>
                                <span data-lang="quizFeature">📊 在线测试</span>
                            </h3>
                            <p style="color: #ccc; line-height: 1.5; font-size: 14px; margin: 0 0 15px 0;" data-lang="quizDesc">多种题型的在线测试系统，包括单选题、判断题等。实时统计答题情况，帮您检验学习效果。</p>
                            <div style="background: rgba(0, 234, 255, 0.1); padding: 10px; border-radius: 6px; border-left: 3px solid #00eaff; flex: 1; display: flex; flex-direction: column; justify-content: center;">
                                <strong style="color: #00eaff; font-size: 12px;" data-lang="howToUse">使用方法：</strong>
                                <p style="color: #ccc; font-size: 12px; margin: 5px 0 0 0;" data-lang="quizHowTo">点击"Quiz"进入测试页面，选择题型开始答题，系统会自动记录您的答题历史和成绩。</p>
                            </div>
                        </div>

                    </div>

                    <!-- 快速开始 -->
                    <div style="background: rgba(161, 0, 255, 0.1); border-radius: 12px; padding: 25px; margin-bottom: 30px; border: 1px solid rgba(161, 0, 255, 0.2);">
                        <h2 style="color: #a100ff; margin: 0 0 20px 0; font-size: 20px;" data-lang="quickStart">🚀 快速开始</h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                            <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px;">
                                <h4 style="color: #00eaff; margin: 0 0 8px 0; font-size: 14px;" data-lang="step1">第一步：浏览知识库</h4>
                                <p style="color: #ccc; font-size: 12px; margin: 0;" data-lang="step1Desc">访问知识库了解常见安全问题和解决方案</p>
                            </div>
                            <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px;">
                                <h4 style="color: #00eaff; margin: 0 0 8px 0; font-size: 14px;" data-lang="step2">第二步：体验AI助手</h4>
                                <p style="color: #ccc; font-size: 12px; margin: 0;" data-lang="step2Desc">向AI助手提问，获得个性化安全建议</p>
                            </div>
                            <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px;">
                                <h4 style="color: #00eaff; margin: 0 0 8px 0; font-size: 14px;" data-lang="step3">第三步：参与测试</h4>
                                <p style="color: #ccc; font-size: 12px; margin: 0;" data-lang="step3Desc">通过在线测试检验您的安全知识掌握程度</p>
                            </div>
                        </div>
                    </div>

                    <!-- 技术特性 -->
                    <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 25px; margin-bottom: 30px; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <h2 style="color: #00eaff; margin: 0 0 20px 0; font-size: 20px;" data-lang="technicalFeatures">⚙️ 技术特性</h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                            <div style="text-align: center; padding: 15px;">
                                <i class="ri-smartphone-line" style="font-size: 32px; color: #00eaff; margin-bottom: 10px;"></i>
                                <h4 style="color: #fff; margin: 0 0 5px 0; font-size: 14px;" data-lang="responsive">响应式设计</h4>
                                <p style="color: #888; font-size: 12px; margin: 0;" data-lang="responsiveDesc">支持桌面和移动端访问</p>
                            </div>
                            <div style="text-align: center; padding: 15px;">
                                <i class="ri-database-line" style="font-size: 32px; color: #00eaff; margin-bottom: 10px;"></i>
                                <h4 style="color: #fff; margin: 0 0 5px 0; font-size: 14px;" data-lang="localStorage">本地存储</h4>
                                <p style="color: #888; font-size: 12px; margin: 0;" data-lang="localStorageDesc">数据本地保存，保护隐私</p>
                            </div>
                            <div style="text-align: center; padding: 15px;">
                                <i class="ri-global-line" style="font-size: 32px; color: #00eaff; margin-bottom: 10px;"></i>
                                <h4 style="color: #fff; margin: 0 0 5px 0; font-size: 14px;" data-lang="multiLanguage">多语言支持</h4>
                                <p style="color: #888; font-size: 12px; margin: 0;" data-lang="multiLanguageDesc">中英文界面随时切换</p>
                            </div>
                            <div style="text-align: center; padding: 15px;">
                                <i class="ri-shield-check-line" style="font-size: 32px; color: #00eaff; margin-bottom: 10px;"></i>
                                <h4 style="color: #fff; margin: 0 0 5px 0; font-size: 14px;" data-lang="security">安全可靠</h4>
                                <p style="color: #888; font-size: 12px; margin: 0;" data-lang="securityDesc">专注网络安全领域</p>
                            </div>
                        </div>
                    </div>

                    <!-- 联系我们 -->
                    <div style="text-align: center; background: rgba(0, 234, 255, 0.05); border-radius: 12px; padding: 25px; border: 1px solid rgba(0, 234, 255, 0.1);">
                        <h2 style="color: #00eaff; margin: 0 0 15px 0; font-size: 20px;" data-lang="contactUs">📞 联系我们</h2>
                        <p style="color: #ccc; line-height: 1.6; margin: 0 0 20px 0;" data-lang="contactDesc">如果您在使用过程中遇到任何问题，或有任何建议，欢迎与我们联系。我们致力于为您提供最好的网络安全学习体验。</p>
                        <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                            <div style="background: rgba(255, 255, 255, 0.05); padding: 15px 25px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
                                <i class="ri-mail-line" style="color: #00eaff; margin-right: 8px;"></i>
                                <span style="color: #ccc; font-size: 14px;">support@cyberwise.com</span>
                            </div>
                            <div style="background: rgba(255, 255, 255, 0.05); padding: 15px 25px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
                                <i class="ri-github-line" style="color: #00eaff; margin-right: 8px;"></i>
                                <span style="color: #ccc; font-size: 14px;">GitHub: CyberWise</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="community-section" style="display: none;">
                <h1 data-lang="communityTitle">Community</h1>
                <p data-lang="communityDesc">Share knowledge and collaborate with others.</p>
            </div>
        `;
    }

    // 默认显示开始页面
    showSection('start');
}

// 处理认证状态变化
function handleAuthStateChange(user) {
    console.log('认证状态变化:', user ? '已登录' : '未登录');
    authChecked = true; // 标记认证检查已完成

    const userEmailDiv = document.getElementById('userEmail');
    if (user) {
        currentUser = user;
        console.log('用户信息:', user);
        if (userEmailDiv) {
            userEmailDiv.textContent = `👤 ${user.displayName || user.email}`;
        }

        // 立即隐藏加载提示，显示dashboard内容
        console.log('隐藏加载指示器，显示dashboard内容');
        hideLoadingIndicator();

        // 异步加载用户数据，不阻塞UI显示
        loadUserData().catch(error => {
            console.error('加载用户数据失败:', error);
            // 即使加载失败也不影响dashboard显示
        });
    } else {
        console.log('用户未登录，准备重定向...');

        // 立即重定向，不需要延迟
        if (!window.location.pathname.includes('login.html')) {
            console.log('执行重定向到登录页面');
            alert(getText('notLoggedIn') || '请先登录');
            window.location.href = window.location.origin + "/templates/login.html";
        }
    }
}

// 加载用户数据
async function loadUserData() {
    try {
        const userDoc = await db.collection("users").doc(currentUser.uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            console.log("User data loaded:", userData);
        } else {
            console.log("User document not found, creating one...");
            // 如果用户文档不存在，创建一个
            await db.collection("users").doc(currentUser.uid).set({
                username: currentUser.displayName || "User",
                email: currentUser.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                notesCount: 0
            });
        }
        loadNotes();
    } catch (error) {
        console.error("Error loading user data:", error);
        // 即使加载失败，也继续加载笔记
        loadNotes();
    }
}

// 页面切换功能
function showSection(sectionName) {
    // 隐藏所有section
    const sections = ['start', 'ai', 'notes', 'favorites', 'community'];
    sections.forEach(section => {
        const element = document.getElementById(section + '-section');
        if (element) {
            element.style.display = 'none';
        }
    });

    // 显示选中的section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    // 更新菜单项样式
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // 为当前section的菜单项添加active状态
    let menuSelector = '';
    switch (sectionName) {
        case 'start':
            menuSelector = '.menu-item:has([data-lang="menuStart"])';
            break;
        case 'ai':
            menuSelector = '.menu-item:has([data-lang="menuAI"])';
            break;
        case 'notes':
            menuSelector = '.menu-item:has([data-lang="menuNotes"])';
            break;
        case 'favorites':
            // User Guide对应favorites section
            menuSelector = '.menu-item:has([data-lang="menuFavorites"])';
            break;
        case 'community':
            menuSelector = '.menu-item:has([data-lang="menuCommunity"])';
            break;
    }

    // 尝试更现代的选择器方法
    if (menuSelector) {
        const targetMenuItem = document.querySelector(menuSelector);
        if (targetMenuItem) {
            targetMenuItem.classList.add('active');
        } else {
            // 备用方法：遍历所有菜单项
            document.querySelectorAll('.menu-item').forEach(item => {
                const textElement = item.querySelector('[data-lang]');
                if (textElement) {
                    const langKey = textElement.getAttribute('data-lang');
                    if ((sectionName === 'start' && langKey === 'menuStart') ||
                        (sectionName === 'ai' && langKey === 'menuAI') ||
                        (sectionName === 'notes' && langKey === 'menuNotes') ||
                        (sectionName === 'favorites' && langKey === 'menuFavorites') ||
                        (sectionName === 'community' && langKey === 'menuCommunity')) {
                        item.classList.add('active');
                    }
                }
            });
        }
    }

    // 控制侧边栏固定状态 - 只有AI Writing页面需要固定侧边栏
    const body = document.body;
    if (sectionName === 'ai') {
        body.classList.add('ai-writing-active');
    } else {
        body.classList.remove('ai-writing-active');
    }

    // 根据section加载相应内容
    switch (sectionName) {
        case 'notes':
            loadNotes();
            break;
        case 'ai':
            // AI功能初始化 - 更新聊天界面语言
            updateAIChatLanguage();
            break;
        case 'favorites':
            loadFavorites();
            break;
        case 'community':
            loadCommunity();
            break;
    }
}

// 更新AI聊天界面语言
function updateAIChatLanguage() {
    // 更新placeholder
    const inputElement = document.getElementById('aiChatInput');
    if (inputElement) {
        inputElement.placeholder = getText('aiChatInputPlaceholder');
    }

    // 更新建议按钮的点击事件，使其使用当前语言的文本
    const suggestionButtons = document.querySelectorAll('.suggestion-item');
    if (suggestionButtons.length >= 4) {
        suggestionButtons[0].onclick = () => sendSuggestion(getText('aiChatSuggestion1Text'));
        suggestionButtons[1].onclick = () => sendSuggestion(getText('aiChatSuggestion2Text'));
        suggestionButtons[2].onclick = () => sendSuggestion(getText('aiChatSuggestion3Text'));
        suggestionButtons[3].onclick = () => sendSuggestion(getText('aiChatSuggestion4Text'));
    }
}

// 创建新文档
function createNewDocument() {
    // 显示模态框而不是使用prompt
    showCreateDocModal();
}

// 显示创建文档模态框
function showCreateDocModal() {
    const modal = document.getElementById('createDocModal');
    if (modal) {
        modal.style.display = 'flex';
        // 阻止背景滚动
        document.body.style.overflow = 'hidden';
        // 清空输入框
        document.getElementById('docTitle').value = '';
        document.getElementById('docContent').value = '';
        // 聚焦到标题输入框
        setTimeout(() => {
            document.getElementById('docTitle').focus();
        }, 100);
    }
}

// 关闭创建文档模态框
function closeCreateDocModal() {
    closeModal('createDocModal');
}

// 保存新文档
function saveNewDocument() {
    const title = document.getElementById('docTitle').value.trim();
    const content = document.getElementById('docContent').value.trim();

    if (!title) {
        alert('请输入文档标题');
        return;
    }

    // 关闭模态框
    closeCreateDocModal();

    // 创建笔记
    createNote(title, content);
}

// 创建笔记
async function createNote(title, content) {
    try {
        const noteData = {
            title: title,
            content: content,
            userId: currentUser.uid,
            username: currentUser.displayName || currentUser.email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isFavorite: false
        };

        // 只保存到本地存储
        saveNoteToLocal(noteData);

        alert("✅ " + getText('noteCreated'));
        loadNotes();
    } catch (error) {
        console.error("Error creating note:", error);
        alert("❌ Failed to create note: " + error.message);
    }
}

// 保存笔记到本地存储
function saveNoteToLocal(noteData) {
    try {
        // 获取现有的本地笔记
        const localNotes = getLocalNotes();

        // 创建本地笔记对象
        const localNote = {
            id: 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            title: noteData.title,
            content: noteData.content,
            userId: noteData.userId,
            username: noteData.username,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isFavorite: noteData.isFavorite || false,
            isLocal: true, // 标记为本地笔记
            synced: false // 标记为未同步
        };

        // 添加到本地笔记列表
        localNotes.push(localNote);

        // 保存到localStorage
        localStorage.setItem('cyberwise_local_notes', JSON.stringify(localNotes));

        console.log("笔记已保存到本地存储");
    } catch (error) {
        console.error("保存到本地存储失败:", error);
    }
}

// 获取本地笔记
function getLocalNotes() {
    try {
        const notes = localStorage.getItem('cyberwise_local_notes');
        return notes ? JSON.parse(notes) : [];
    } catch (error) {
        console.error("读取本地笔记失败:", error);
        return [];
    }
}

// 删除本地笔记
function deleteLocalNote(noteId) {
    try {
        const localNotes = getLocalNotes();
        const filteredNotes = localNotes.filter(note => note.id !== noteId);
        localStorage.setItem('cyberwise_local_notes', JSON.stringify(filteredNotes));
        console.log("本地笔记已删除");
    } catch (error) {
        console.error("删除本地笔记失败:", error);
    }
}

// 更新本地笔记收藏状态
function updateLocalNoteFavorite(noteId, isFavorite) {
    try {
        const localNotes = getLocalNotes();
        const noteIndex = localNotes.findIndex(note => note.id === noteId);
        if (noteIndex !== -1) {
            localNotes[noteIndex].isFavorite = isFavorite;
            localNotes[noteIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('cyberwise_local_notes', JSON.stringify(localNotes));
            console.log("本地笔记收藏状态已更新");
        }
    } catch (error) {
        console.error("更新本地笔记失败:", error);
    }
}

// 加载笔记
async function loadNotes() {
    try {
        const notesContainer = document.getElementById('notes-list');
        if (!notesContainer) return;

        notesContainer.innerHTML = '<p>' + getText('loadingNotes') + '</p>';

        // 只获取本地笔记
        const localNotes = getLocalNotes().filter(note => note.userId === currentUser.uid);

        if (localNotes.length === 0) {
            notesContainer.innerHTML = '<p>' + getText('noNotes') + '</p>';
            return;
        }

        // 按更新时间排序
        localNotes.sort((a, b) => {
            const dateA = new Date(a.updatedAt);
            const dateB = new Date(b.updatedAt);
            return dateB - dateA;
        });

        let notesHTML = '';
        localNotes.forEach(note => {
            const date = new Date(note.updatedAt).toLocaleDateString();

            // 创建内容预览（最多显示100个字符）
            const contentPreview = note.content ?
                (note.content.length > 100 ? note.content.substring(0, 100) + '...' : note.content) :
                '暂无内容';

            notesHTML += `
        <div class="note-item" style="background: rgba(255,255,255,0.05); padding: 20px; margin: 15px 0; border-radius: 12px; cursor: pointer; border: 1px solid rgba(0, 234, 255, 0.1); transition: all 0.3s ease;" onclick="editNote('${note.id}', true)">
          <h4 style="margin: 0 0 10px 0; color: #00eaff; font-size: 18px; font-weight: 600;">${note.title}</h4>
          <p style="margin: 0 0 15px 0; color: #ccc; font-size: 14px; line-height: 1.5;">${contentPreview}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
            <span style="color: #888; font-size: 12px;">${getText('lastUpdated')} ${date}</span>
            <div style="display: flex; gap: 10px;">
              <button onclick="event.stopPropagation(); toggleFavorite('${note.id}', ${note.isFavorite}, true)" style="background: ${note.isFavorite ? '#ffd700' : 'rgba(255,255,255,0.1)'}; color: ${note.isFavorite ? '#000' : '#fff'}; padding: 6px 12px; font-size: 12px; width: auto; border: none; border-radius: 6px; cursor: pointer; transition: all 0.3s ease;">
                ${note.isFavorite ? '★ 已收藏' : '☆ 收藏'}
              </button>
              <button onclick="event.stopPropagation(); deleteNote('${note.id}', true)" style="background: #ff6b6b; color: white; padding: 6px 12px; font-size: 12px; width: auto; border: none; border-radius: 6px; cursor: pointer; transition: all 0.3s ease;">${getText('deleteBtn')}</button>
            </div>
          </div>
        </div>
      `;
        });

        notesContainer.innerHTML = notesHTML;

        // 添加悬停效果
        document.querySelectorAll('.note-item').forEach(item => {
            item.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 8px 25px rgba(0, 234, 255, 0.15)';
                this.style.borderColor = 'rgba(0, 234, 255, 0.3)';
            });

            item.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
                this.style.borderColor = 'rgba(0, 234, 255, 0.1)';
            });
        });

    } catch (error) {
        console.error("Error loading notes:", error);
        const notesContainer = document.getElementById('notes-list');
        if (notesContainer) {
            notesContainer.innerHTML = '<p>' + getText('errorNotes') + '</p>';
        }
    }
}

// 编辑笔记
function editNote(noteId, isLocal) {
    // 暂时不执行任何操作，避免弹窗
    console.log('Edit note clicked for ID:', noteId, 'isLocal:', isLocal);
}

// 删除笔记
async function deleteNote(noteId, isLocal = false) {
    if (confirm(getText('confirmDelete'))) {
        try {
            if (isLocal) {
                // 删除本地笔记
                deleteLocalNote(noteId);
                alert("✅ " + getText('noteDeleted'));
                loadNotes();
            } else {
                // 删除Firebase笔记
                await db.collection("notes").doc(noteId).delete();

                // 尝试更新用户笔记计数，如果失败也不影响笔记删除
                try {
                    await db.collection("users").doc(currentUser.uid).update({
                        notesCount: firebase.firestore.FieldValue.increment(-1)
                    });
                } catch (updateError) {
                    console.warn("Failed to update notes count:", updateError);
                }

                alert("✅ " + getText('noteDeleted'));
                loadNotes();
            }
        } catch (error) {
            console.error("Error deleting note:", error);
            alert("❌ Failed to delete note: " + error.message);
        }
    }
}

// 切换收藏状态
async function toggleFavorite(noteId, currentStatus, isLocal = false) {
    try {
        if (isLocal) {
            // 更新本地笔记收藏状态
            updateLocalNoteFavorite(noteId, !currentStatus);
            loadNotes();
        } else {
            // 更新Firebase笔记收藏状态
            await db.collection("notes").doc(noteId).update({
                isFavorite: !currentStatus,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            loadNotes();
        }
    } catch (error) {
        console.error("Error toggling favorite:", error);
        alert("❌ Failed to update favorite status.");
    }
}

// 加载收藏夹
async function loadFavorites() {
    // 实现收藏夹加载逻辑
    console.log("Loading favorites...");
}

// 加载社区内容
async function loadCommunity() {
    // 实现社区内容加载逻辑
    console.log("Loading community...");
}

// 显示AI写作模态框
function showAIWritingModal() {
    const modal = document.getElementById('aiWritingModal');
    if (modal) {
        modal.style.display = 'block';
        // 清空输入框
        document.getElementById('aiPrompt').value = '';
        document.getElementById('aiTitle').value = '';
        document.getElementById('aiContent').value = '';
        // 隐藏保存按钮
        document.getElementById('saveAIBtn').style.display = 'none';
        // 聚焦到提示输入框
        setTimeout(() => {
            document.getElementById('aiPrompt').focus();
        }, 100);
    }
}

// 关闭AI写作模态框
function closeAIWritingModal() {
    const modal = document.getElementById('aiWritingModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// AI内容生成
function generateAIContent() {
    const prompt = document.getElementById('aiPrompt').value.trim();
    const titleField = document.getElementById('aiTitle');
    const contentField = document.getElementById('aiContent');
    const saveBtn = document.getElementById('saveAIBtn');

    if (!prompt) {
        alert('请输入写作提示');
        return;
    }

    // 模拟AI生成内容（替换为实际的AI API调用）
    const generatedContent = generateMockAIContent(prompt);

    // 自动生成标题（基于提示的前几个词）
    const autoTitle = generateAutoTitle(prompt);

    // 填充生成的内容
    titleField.value = autoTitle;
    contentField.value = generatedContent;

    // 显示保存按钮
    saveBtn.style.display = 'inline-block';

    console.log("AI content generated successfully");
}

// 保存AI生成的文档
function saveAIDocument() {
    const title = document.getElementById('aiTitle').value.trim();
    const content = document.getElementById('aiContent').value.trim();

    if (!title) {
        alert('请输入文档标题');
        return;
    }

    if (!content) {
        alert('没有内容可保存');
        return;
    }

    // 关闭模态框
    closeAIWritingModal();

    // 创建笔记
    createNote(title, content);

    // 显示在AI结果区域
    displayAIResult(title, content);
}

// 显示AI生成结果
function displayAIResult(title, content) {
    const resultsContainer = document.getElementById('ai-results');
    const resultHTML = `
        <div style="background: rgba(0, 234, 255, 0.1); border: 1px solid rgba(0, 234, 255, 0.3); border-radius: 12px; padding: 20px; margin-top: 20px;">
            <h3 style="color: #00eaff; margin-top: 0;">最新AI生成内容</h3>
            <h4 style="color: white; margin: 10px 0;">${title}</h4>
            <p style="color: #ccc; line-height: 1.6; margin-bottom: 15px;">${content.length > 200 ? content.substring(0, 200) + '...' : content}</p>
            <div style="display: flex; gap: 10px;">
                <button onclick="showSection('notes')" style="background: linear-gradient(45deg, #00eaff, #a100ff); color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">查看所有笔记</button>
                <button onclick="showAIWritingModal()" style="background: rgba(255, 255, 255, 0.1); color: white; border: 1px solid rgba(255, 255, 255, 0.3); padding: 8px 16px; border-radius: 6px; cursor: pointer;">继续AI写作</button>
            </div>
        </div>
    `;
    resultsContainer.innerHTML = resultHTML;
}

// 模拟AI内容生成（实际使用时可替换为真实的AI API）
function generateMockAIContent(prompt) {
    const templates = {
        '文章': `# ${prompt}相关文章

这是一篇关于"${prompt}"的详细文章。

## 引言
在当今快速发展的世界中，${prompt}变得越来越重要。本文将深入探讨这个话题的各个方面。

## 主要内容
1. **定义与概念**: ${prompt}的基本概念和定义
2. **重要性**: 为什么${prompt}在现代社会中如此重要
3. **应用场景**: ${prompt}的实际应用和案例
4. **未来展望**: ${prompt}的发展趋势和前景

## 结论
综上所述，${prompt}是一个值得深入研究和关注的重要话题。通过持续学习和实践，我们可以更好地理解和应用相关知识。`,

        '总结': `# ${prompt} - 要点总结

## 核心要点
- 关键概念：${prompt}的基本定义
- 主要特征：${prompt}的显著特点
- 应用价值：${prompt}的实际意义

## 详细分析
${prompt}作为一个重要概念，具有以下特点：
1. 实用性强，适用于多种场景
2. 理论基础扎实，有科学依据
3. 发展前景广阔，值得深入研究

## 行动建议
- 深入学习${prompt}的相关理论
- 实践应用${prompt}的方法技巧
- 持续关注${prompt}的最新发展`,

        '教程': `# ${prompt} 实用教程

## 准备工作
在开始学习${prompt}之前，你需要：
- 基本的理论知识
- 必要的工具和资源
- 充足的时间和耐心

## 步骤指南

### 第一步：理解基础
首先要全面了解${prompt}的基本概念和原理。

### 第二步：实践操作
通过实际操作来加深对${prompt}的理解。

### 第三步：进阶应用
掌握${prompt}的高级应用技巧。

## 注意事项
- 循序渐进，不要急于求成
- 多加练习，熟能生巧
- 保持学习，持续改进

## 总结
通过本教程，你应该已经掌握了${prompt}的基本知识和应用方法。`
    };

    // 根据提示内容选择合适的模板
    let selectedTemplate = templates['文章']; // 默认模板

    if (prompt.includes('总结') || prompt.includes('要点') || prompt.includes('概要')) {
        selectedTemplate = templates['总结'];
    } else if (prompt.includes('教程') || prompt.includes('如何') || prompt.includes('怎么') || prompt.includes('步骤')) {
        selectedTemplate = templates['教程'];
    }

    return selectedTemplate;
}

// 自动生成标题
function generateAutoTitle(prompt) {
    const words = prompt.split(' ').slice(0, 3).join(' ');
    const titles = [
        `关于${words}的思考`,
        `${words}详解`,
        `${words}实用指南`,
        `${words}深度分析`,
        `${words}应用研究`
    ];

    return titles[Math.floor(Math.random() * titles.length)];
}

// 登出功能
function logout() {
    if (confirm(getText('confirmLogout'))) {
        firebase.auth().signOut().then(() => {
            alert(getText('loggedOut'));
            window.location.href = window.location.origin + "/templates/login.html";
        }).catch(error => {
            console.error("Logout error:", error);
            alert("Logout failed. Please try again.");
        });
    }
}

// 测试知识库导航功能
function testKnowledgeBaseNav() {
    console.log('=== 知识库导航测试开始 ===');
    console.log('1. 测试函数被调用');
    console.log('2. 当前位置:', window.location.href);
    console.log('3. 当前origin:', window.location.origin);

    // 测试多种跳转方式
    const methods = [
        () => {
            console.log('方法1: 直接跳转');
            window.location.href = window.location.origin + '/templates/knowledge_base.html';
        },
        () => {
            console.log('方法2: 使用replace');
            window.location.replace(window.location.origin + '/templates/knowledge_base.html');
        },
        () => {
            console.log('方法3: 使用assign');
            window.location.assign(window.location.origin + '/templates/knowledge_base.html');
        },
        () => {
            console.log('方法4: 新窗口打开');
            window.open(window.location.origin + '/templates/knowledge_base.html', '_blank');
        }
    ];

    // 首先尝试方法1
    try {
        methods[0]();
        console.log('方法1执行完成');
    } catch (error) {
        console.error('方法1失败:', error);

        // 如果方法1失败，1秒后尝试方法2
        setTimeout(() => {
            try {
                methods[1]();
                console.log('方法2执行完成');
            } catch (error2) {
                console.error('方法2失败:', error2);

                // 如果方法2也失败，再尝试方法3
                setTimeout(() => {
                    try {
                        methods[2]();
                        console.log('方法3执行完成');
                    } catch (error3) {
                        console.error('方法3失败:', error3);

                        // 最后尝试方法4（新窗口）
                        setTimeout(() => {
                            try {
                                methods[3]();
                                console.log('方法4执行完成（新窗口）');
                            } catch (error4) {
                                console.error('所有方法都失败了:', error4);
                                alert('无法跳转到知识库页面，请手动访问：\n' + window.location.origin + '/templates/knowledge_base.html');
                            }
                        }, 1000);
                    }
                }, 1000);
            }
        }, 1000);
    }
}

// 导航到知识库页面
function goToKnowledgeBase() {
    console.log('Navigating to knowledge base...');
    console.log('Current origin:', window.location.origin);
    console.log('Current pathname:', window.location.pathname);

    try {
        // 使用相对路径导航
        const targetPath = '/templates/knowledge_base.html';
        console.log('Target path:', targetPath);

        // 添加一个小延迟以确保点击事件完全处理
        setTimeout(() => {
            window.location.href = window.location.origin + targetPath;
        }, 100);

    } catch (error) {
        console.error('Navigation error:', error);
        alert('跳转失败，请手动访问知识库页面');
    }
}

// 同步本地笔记到Firebase
async function syncLocalNotesToFirebase() {
    try {
        const localNotes = getLocalNotes().filter(note =>
            note.userId === currentUser.uid && !note.synced
        );

        if (localNotes.length === 0) {
            console.log("没有需要同步的本地笔记");
            return;
        }

        console.log(`开始同步 ${localNotes.length} 个本地笔记到Firebase`);

        let syncedCount = 0;
        for (const localNote of localNotes) {
            try {
                // 准备Firebase数据
                const firebaseData = {
                    title: localNote.title,
                    content: localNote.content,
                    userId: localNote.userId,
                    username: localNote.username,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    isFavorite: localNote.isFavorite
                };

                // 保存到Firebase
                await db.collection("notes").add(firebaseData);

                // 标记为已同步
                const allLocalNotes = getLocalNotes();
                const noteIndex = allLocalNotes.findIndex(note => note.id === localNote.id);
                if (noteIndex !== -1) {
                    allLocalNotes[noteIndex].synced = true;
                    localStorage.setItem('cyberwise_local_notes', JSON.stringify(allLocalNotes));
                }

                syncedCount++;
                console.log(`笔记 "${localNote.title}" 同步成功`);

            } catch (error) {
                console.error(`同步笔记 "${localNote.title}" 失败:`, error);
            }
        }

        if (syncedCount > 0) {
            alert(`✅ 成功同步 ${syncedCount} 个本地笔记到云端`);
            loadNotes(); // 重新加载笔记列表
        }

    } catch (error) {
        console.error("同步本地笔记失败:", error);
    }
}

// 清理已同步的本地笔记
function cleanupSyncedLocalNotes() {
    try {
        const localNotes = getLocalNotes();
        const unsyncedNotes = localNotes.filter(note => !note.synced);
        localStorage.setItem('cyberwise_local_notes', JSON.stringify(unsyncedNotes));
        console.log("已清理同步完成的本地笔记");
    } catch (error) {
        console.error("清理本地笔记失败:", error);
    }
}

// 检查网络状态并自动同步
function checkNetworkAndSync() {
    if (navigator.onLine) {
        console.log("网络已连接，尝试同步本地笔记");
        syncLocalNotesToFirebase();
    }
}

// 添加网络状态监听
window.addEventListener('online', checkNetworkAndSync);

// 获取本地笔记统计信息
function getLocalNotesStats() {
    const localNotes = getLocalNotes().filter(note => note.userId === currentUser.uid);
    const unsyncedCount = localNotes.filter(note => !note.synced).length;
    return {
        total: localNotes.length,
        unsynced: unsyncedCount
    };
}

// 初始化
document.addEventListener('DOMContentLoaded', function () {
    console.log('Dashboard页面加载完成');

    // 先显示加载状态
    showLoadingIndicator();

    // 添加Firebase加载检查
    if (typeof firebase === 'undefined') {
        console.error('Firebase未加载');
        alert('Firebase未加载，请刷新页面重试');
        return;
    }

    // 检查Firebase Auth是否可用
    if (!firebase.auth) {
        console.error('Firebase Auth未初始化');
        alert('Firebase Auth未初始化，请刷新页面重试');
        return;
    }

    // 设置认证检查超时
    const authTimeout = setTimeout(() => {
        if (!authChecked) {
            console.warn('认证检查超时，强制显示内容');
            authChecked = true;

            // 检查是否有用户信息缓存
            const currentUser = firebase.auth().currentUser;
            if (currentUser) {
                console.log('发现用户缓存，直接使用');
                handleAuthStateChange(currentUser);
            } else {
                console.log('未发现用户缓存，跳转到登录页面');
                alert('认证检查超时，请重新登录');
                window.location.href = window.location.origin + "/templates/login.html";
            }
        }
    }, 5000); // 5秒超时

    // 监听认证状态变化
    try {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            console.log('认证状态变化回调触发:', user ? '已登录' : '未登录');
            clearTimeout(authTimeout);

            if (!authChecked) {
                handleAuthStateChange(user);

                if (user) {
                    console.log('用户已登录，初始化dashboard');
                    initializeDashboard();
                } else {
                    console.log('用户未登录');
                }
            }

            // 取消订阅以避免重复调用
            if (unsubscribe) {
                unsubscribe();
            }
        });
    } catch (error) {
        console.error('设置认证监听器失败:', error);
        clearTimeout(authTimeout);
        alert('认证系统初始化失败，请刷新页面重试');
    }
});

// 初始化Dashboard
function initializeDashboard() {
    // 检查URL中的锚点，自动跳转到对应页面
    const hash = window.location.hash.substring(1); // 去掉#号
    if (hash && ['start', 'ai', 'notes', 'favorites', 'community'].includes(hash)) {
        showSection(hash);
    } else {
        // 默认显示开始页面
        showSection('start');
    }

    // 初始化语言
    if (typeof initLanguage === 'function') {
        initLanguage();
    }

    // 添加模态框外部点击关闭功能
    const modal = document.getElementById('createDocModal');
    if (modal) {
        modal.addEventListener('click', function (event) {
            if (event.target === modal) {
                closeCreateDocModal();
            }
        });
    }

    // 添加ESC键关闭模态框功能
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            const modal = document.getElementById('createDocModal');
            if (modal && modal.style.display === 'block') {
                closeCreateDocModal();
            }
        }
    });

    // 检查并同步本地笔记
    setTimeout(() => {
        checkNetworkAndSync();

        // 显示本地笔记统计信息
        const stats = getLocalNotesStats();
        if (stats.unsynced > 0) {
            console.log(`发现 ${stats.unsynced} 个未同步的本地笔记`);
        }
    }, 2000); // 延迟2秒执行，确保用户认证完成

    console.log('Dashboard初始化完成');
}

// 切换用户下拉菜单
function toggleUserDropdown() {
    const dropdown = document.querySelector('.user-info-dropdown');
    const menu = document.getElementById('userDropdownMenu');

    if (dropdown && menu) {
        dropdown.classList.toggle('open');

        // 点击其他地方关闭下拉菜单
        document.addEventListener('click', function closeDropdown(event) {
            if (!dropdown.contains(event.target)) {
                dropdown.classList.remove('open');
                document.removeEventListener('click', closeDropdown);
            }
        });
    }
}

// === AI 聊天功能 ===

// 发送消息
function sendMessage() {
    const input = document.getElementById('aiChatInput');
    const message = input.value.trim();

    if (!message) return;

    // 添加用户消息到聊天
    addUserMessage(message);

    // 清空输入框
    input.value = '';
    autoResizeTextarea(input);

    // 处理AI响应
    processAIResponse(message);
}

// 发送建议问题
function sendSuggestion(suggestionText) {
    const input = document.getElementById('aiChatInput');
    input.value = suggestionText;
    sendMessage();
}

// 添加用户消息
function addUserMessage(message) {
    const chatMessages = document.getElementById('aiChatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = 'user-message';
    messageElement.innerHTML = `
        <div class="user-avatar">👤</div>
        <div class="user-message-content">
            <p>${escapeHtml(message)}</p>
        </div>
    `;

    chatMessages.appendChild(messageElement);
    scrollToBottom();
}

// 添加AI消息
function addAIMessage(content, isTyping = false) {
    const chatMessages = document.getElementById('aiChatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = 'ai-message';

    if (isTyping) {
        messageElement.innerHTML = `
            <div class="ai-avatar">🤖</div>
            <div class="ai-message-content">
                <div class="typing-indicator">
                    ${getText('aiChatAnalyzing')}
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
    } else {
        messageElement.innerHTML = `
            <div class="ai-avatar">🤖</div>
            <div class="ai-message-content">
                ${content}
            </div>
        `;
    }

    chatMessages.appendChild(messageElement);
    scrollToBottom();

    return messageElement;
}

// 处理AI响应
async function processAIResponse(userMessage) {
    // 显示加载状态
    const typingMessage = addAIMessage('', true);

    try {
        // 模拟AI处理延迟
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 分析问题类型
        const category = classifySecurityQuestion(userMessage);

        // 匹配相似问题
        const matchedQuestions = findSimilarQuestions(userMessage, category);

        // 生成AI回复
        const aiResponse = generateAIResponse(userMessage, category, matchedQuestions);

        // 移除加载状态
        typingMessage.remove();

        // 添加AI回复
        addAIMessage(aiResponse);

    } catch (error) {
        console.error('AI处理出错:', error);
        typingMessage.remove();
        addAIMessage(`<p>${getText('aiChatError')}</p>`);
    }
}

// 问题分类函数（简化版）
function classifySecurityQuestion(question) {
    const categories = {
        'malware': ['恶意软件', '病毒', '木马', '勒索软件', '感染'],
        'password': ['密码', '口令', '登录', '认证', '二次验证'],
        'phishing': ['钓鱼', '欺诈', '诈骗', '可疑邮件', '虚假网站'],
        'network': ['网络', '防火墙', 'DDoS', '入侵', '攻击'],
        'privacy': ['隐私', '数据泄露', '个人信息', '信息安全'],
        'system': ['系统', '漏洞', '补丁', '更新', '安全配置']
    };

    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => question.includes(keyword))) {
            return category;
        }
    }

    return 'general';
}

// 查找相似问题（模拟数据）
function findSimilarQuestions(userQuestion, category) {
    // 模拟知识库数据
    const knowledgeBase = [
        {
            id: 1,
            question: "计算机感染恶意软件后的处理步骤",
            category: "malware",
            similarity: 0.95
        },
        {
            id: 2,
            question: "如何设置强密码策略",
            category: "password",
            similarity: 0.88
        },
        {
            id: 3,
            question: "识别和应对钓鱼邮件的方法",
            category: "phishing",
            similarity: 0.92
        }
    ];

    // 根据分类和相似度筛选
    return knowledgeBase
        .filter(item => item.category === category || category === 'general')
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 3);
}

// 生成AI回复
function generateAIResponse(userQuestion, category, matchedQuestions) {
    const categoryNames = {
        'malware': getText('aiChatCategoryMalware'),
        'password': getText('aiChatCategoryPassword'),
        'phishing': getText('aiChatCategoryPhishing'),
        'network': getText('aiChatCategoryNetwork'),
        'privacy': getText('aiChatCategoryPrivacy'),
        'system': getText('aiChatCategorySystem'),
        'general': getText('aiChatCategoryGeneral')
    };

    let response = `
        <p><strong>${getText('aiChatAnalysisComplete')}</strong></p>
        <p>${getText('aiChatCategoryIntro')} <span style="color: #00eaff; font-weight: 600;">${categoryNames[category]}</span> ${getText('aiChatCategoryEnd')}</p>
        <p>${getText('aiChatSolutionsIntro')}</p>
    `;

    if (matchedQuestions.length > 0) {
        response += `<div class="matched-questions"><h4>${getText('aiChatMatchedQuestions')}</h4>`;

        matchedQuestions.forEach(question => {
            response += `
                <div class="matched-question-item" onclick="viewQuestionDetail(${question.id})">
                    <div class="question-title">${question.question}</div>
                    <div class="question-meta">
                        <span>${getText('aiChatViewDetail')}</span>
                        <span class="similarity-score">${Math.round(question.similarity * 100)}% 匹配</span>
                    </div>
                </div>
            `;
        });

        response += '</div>';
    } else {
        response += `<p>${getText('aiChatNoMatches')}</p>`;
        response += `<p>${getText('aiChatNoMatchesTip1')}</p>`;
        response += `<p>${getText('aiChatNoMatchesTip2')}</p>`;
        response += `<p>${getText('aiChatNoMatchesTip3')}</p>`;
    }

    response += `
        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="font-size: 12px; color: #888;">
                ${getText('aiChatMoreHelp')} <span style="color: #00eaff; cursor: pointer;" onclick="goToKnowledgeBase()">${getText('aiChatKnowledgeBase')}</span> ${getText('aiChatOrConsult')}
            </p>
        </div>
    `;

    return response;
}

// 查看问题详情
function viewQuestionDetail(questionId) {
    alert(`查看问题详情 ID: ${questionId}\n\n这里未来会跳转到具体的问题详情页面。`);
    // 未来可以跳转到knowledge_base.html并定位到具体问题
}

// 处理键盘事件
function handleChatKeydown(event) {
    if (event.key === 'Enter') {
        if (event.shiftKey) {
            // Shift+Enter 换行
            return true;
        } else {
            // Enter 发送消息
            event.preventDefault();
            sendMessage();
        }
    }
}

// 自动调整textarea高度
function autoResizeTextarea(textarea) {
    textarea.style.height = '20px';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

// 滚动到底部
function scrollToBottom() {
    const chatMessages = document.getElementById('aiChatMessages');
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

// HTML转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 页面初始化时绑定事件
document.addEventListener('DOMContentLoaded', function () {
    console.log('Dashboard AI chat functions loaded');

    // 监听语言切换事件，更新AI聊天界面
    document.addEventListener('languageChanged', function () {
        console.log('Language changed, updating AI chat interface');
        // 如果当前显示的是AI界面，更新语言
        const aiSection = document.getElementById('ai-section');
        if (aiSection && aiSection.style.display !== 'none') {
            updateAIChatLanguage();
        }
    });

    // 添加模态框事件监听器
    setupModalEvents();
});

// 设置模态框事件监听器
function setupModalEvents() {
    // 获取所有模态框
    const modals = ['createDocModal', 'aiWritingModal'];

    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            // 点击模态框背景关闭
            modal.addEventListener('click', function (event) {
                if (event.target === modal) {
                    closeModal(modalId);
                }
            });

            // 阻止模态框内容区域的点击事件冒泡
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.addEventListener('click', function (event) {
                    event.stopPropagation();
                });
            }
        }
    });

    // ESC键关闭模态框
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            modals.forEach(modalId => {
                const modal = document.getElementById(modalId);
                if (modal && modal.style.display === 'flex') {
                    closeModal(modalId);
                }
            });
        }
    });
}

// 通用关闭模态框函数
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        // 恢复页面滚动
        document.body.style.overflow = 'auto';
    }
} 