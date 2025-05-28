let currentUser = null;

// 用户认证状态监听
firebase.auth().onAuthStateChanged(user => {
    const userEmailDiv = document.getElementById('userEmail');
    if (user) {
        currentUser = user;
        userEmailDiv.textContent = `👤 ${user.displayName || user.email}`;
        loadUserData();
    } else {
        alert(getText('notLoggedIn'));
        window.location.href = "login.html";
    }
});

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
    // 这里可以实现笔记编辑功能
    alert("Note editing feature will be implemented here. Note ID: " + noteId);
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
        alert("Please enter a prompt first.");
        return;
    }

    // 这里可以集成AI API
    alert("AI content generation feature will be implemented here.\nPrompt: " + prompt);
}

// 登出功能
function logout() {
    if (confirm(getText('confirmLogout'))) {
        firebase.auth().signOut().then(() => {
            alert(getText('loggedOut'));
            window.location.href = "login.html";
        }).catch(error => {
            console.error("Logout error:", error);
        });
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function () {
    // 默认显示开始页面
    showSection('start');
}); 