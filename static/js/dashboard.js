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
    const title = prompt("Enter document title:");
    if (title) {
        createNote(title, "");
    }
}

// 创建笔记
async function createNote(title, content) {
    try {
        const noteData = {
            title: title,
            content: content,
            userId: currentUser.uid,
            username: currentUser.displayName || currentUser.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            isFavorite: false
        };

        await db.collection("notes").add(noteData);

        // 尝试更新用户笔记计数，如果失败也不影响笔记创建
        try {
            await db.collection("users").doc(currentUser.uid).update({
                notesCount: firebase.firestore.FieldValue.increment(1)
            });
        } catch (updateError) {
            console.warn("Failed to update notes count:", updateError);
        }

        alert("✅ " + getText('noteCreated'));
        loadNotes();
    } catch (error) {
        console.error("Error creating note:", error);
        alert("❌ Failed to create note: " + error.message);
    }
}

// 加载笔记
async function loadNotes() {
    try {
        const notesContainer = document.getElementById('notes-list');
        if (!notesContainer) return;

        notesContainer.innerHTML = '<p>' + getText('loadingNotes') + '</p>';

        const notesSnapshot = await db.collection("notes")
            .where("userId", "==", currentUser.uid)
            .orderBy("updatedAt", "desc")
            .get();

        if (notesSnapshot.empty) {
            notesContainer.innerHTML = '<p>' + getText('noNotes') + '</p>';
            return;
        }

        let notesHTML = '';
        notesSnapshot.forEach(doc => {
            const note = doc.data();
            const date = note.updatedAt ? note.updatedAt.toDate().toLocaleDateString() : 'Unknown';

            notesHTML += `
        <div class="note-item" style="background: rgba(255,255,255,0.05); padding: 15px; margin: 10px 0; border-radius: 8px; cursor: pointer;" onclick="editNote('${doc.id}')">
          <h4 style="margin: 0 0 10px 0; color: #00eaff;">${note.title}</h4>
          <p style="margin: 0; color: #ccc; font-size: 14px;">${getText('lastUpdated')} ${date}</p>
          <div style="margin-top: 10px;">
            <button onclick="event.stopPropagation(); deleteNote('${doc.id}')" style="background: #ff6b6b; padding: 5px 10px; font-size: 12px; width: auto;">${getText('deleteBtn')}</button>
            <button onclick="event.stopPropagation(); toggleFavorite('${doc.id}', ${note.isFavorite})" style="background: ${note.isFavorite ? '#ffd700' : '#666'}; padding: 5px 10px; font-size: 12px; width: auto; margin-left: 10px;">
              ${note.isFavorite ? '★' : '☆'}
            </button>
          </div>
        </div>
      `;
        });

        notesContainer.innerHTML = notesHTML;
    } catch (error) {
        console.error("Error loading notes:", error);
        const notesContainer = document.getElementById('notes-list');
        if (notesContainer) {
            notesContainer.innerHTML = '<p>' + getText('errorNotes') + '</p>';
        }
    }
}

// 编辑笔记
function editNote(noteId) {
    // 暂时不执行任何操作，避免弹窗
    console.log('Edit note clicked for ID:', noteId);
}

// 删除笔记
async function deleteNote(noteId) {
    if (confirm(getText('confirmDelete'))) {
        try {
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
        } catch (error) {
            console.error("Error deleting note:", error);
            alert("❌ Failed to delete note: " + error.message);
        }
    }
}

// 切换收藏状态
async function toggleFavorite(noteId, currentStatus) {
    try {
        await db.collection("notes").doc(noteId).update({
            isFavorite: !currentStatus,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        loadNotes();
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

// AI内容生成
function generateAIContent() {
    const prompt = document.querySelector('#ai-section textarea').value;
    if (!prompt) {
        console.log("No prompt entered");
        return;
    }

    // 暂时不执行任何操作，避免弹窗
    console.log("AI content generation requested with prompt:", prompt);
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

    console.log('Dashboard初始化完成');
} 