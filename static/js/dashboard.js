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
                <h1 data-lang="welcomeTitle">Welcome to CyberWise Knowledge Base!</h1>
                <p data-lang="welcomeDesc">Your personal knowledge management system. Use the sidebar to navigate between different sections.</p>
                <div style="margin-top: 30px;">
                    <h3 data-lang="quickActions">Quick Actions:</h3>
                    <button onclick="createNewDocument()" style="margin: 10px; width: auto; padding: 10px 20px;" data-lang="createNewDoc">Create New Document</button>
                    <button onclick="showSection('notes')" style="margin: 10px; width: auto; padding: 10px 20px;" data-lang="viewNotes">View Notes</button>
                    <button onclick="goToKnowledgeBase()" style="margin: 10px; width: auto; padding: 10px 20px; background: linear-gradient(45deg, #00eaff, #a100ff);">🔍 浏览知识库</button>
                    <a href="/templates/knowledge_base.html" style="margin: 10px; width: auto; padding: 10px 20px; background: linear-gradient(45deg, #ff6b6b, #ff8e53); color: white; text-decoration: none; border-radius: 8px; display: inline-block;">📚 知识库 (直接链接)</a>
                </div>
            </div>

            <div id="ai-section" style="display: none;">
                <h1 data-lang="aiTitle">AI Writing Assistant</h1>
                <p data-lang="aiDesc">Use AI to help with your writing and knowledge creation.</p>
                <textarea data-lang="aiPlaceholder" placeholder="Enter your prompt here..." style="width: 100%; height: 200px; margin: 20px 0; padding: 15px; border-radius: 8px; background: rgba(255,255,255,0.1); color: white; border: none;"></textarea>
                <button onclick="generateAIContent()" style="width: auto; padding: 10px 20px;" data-lang="generateBtn">Generate Content</button>
            </div>

            <div id="notes-section" style="display: none;">
                <h1 data-lang="notesTitle">My Notes</h1>
                <p data-lang="notesDesc">Manage your personal notes and documents.</p>
                <div id="notes-list" style="margin-top: 20px;">
                    <!-- Notes will be loaded here -->
                </div>
            </div>

            <div id="favorites-section" style="display: none;">
                <h1 data-lang="favoritesTitle">Favorites</h1>
                <p data-lang="favoritesDesc">Your starred documents and important references.</p>
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

    // 根据section加载相应内容
    switch (sectionName) {
        case 'notes':
            loadNotes();
            break;
        case 'ai':
            // AI功能初始化
            break;
        case 'favorites':
            loadFavorites();
            break;
        case 'community':
            loadCommunity();
            break;
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
        modal.style.display = 'block';
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
    const modal = document.getElementById('createDocModal');
    if (modal) {
        modal.style.display = 'none';
    }
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