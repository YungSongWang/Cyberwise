/**
 * CyberWise 知识库搜索功能
 */

class KnowledgeBase {
    constructor() {
        this.questions = [];
        this.searchIndex = [];
        this.stats = {};
        this.isLoaded = false;
    }

    // 初始化知识库
    async init() {
        try {
            console.log('正在加载知识库数据...');
            await this.loadData();
            this.setupSearchInterface();
            console.log('知识库初始化完成');
        } catch (error) {
            console.error('知识库初始化失败:', error);
        }
    }

    // 加载数据
    async loadData() {
        try {
            // 并行加载所有数据文件
            const [questionsResponse, indexResponse, statsResponse] = await Promise.all([
                fetch('/static/data/questions_dataset.json'),
                fetch('/static/data/search_index.json'),
                fetch('/static/data/dataset_stats.json')
            ]);

            if (!questionsResponse.ok || !indexResponse.ok || !statsResponse.ok) {
                throw new Error('无法加载知识库数据文件');
            }

            this.questions = await questionsResponse.json();
            this.searchIndex = await indexResponse.json();
            this.stats = await statsResponse.json();

            this.isLoaded = true;
            console.log(`知识库加载完成: ${this.questions.length} 个问题`);
        } catch (error) {
            console.error('加载知识库数据失败:', error);
            throw error;
        }
    }

    // 设置搜索界面
    setupSearchInterface() {
        const searchContainer = document.getElementById('knowledge-search-container');
        if (!searchContainer) return;

        searchContainer.innerHTML = `
            <div class="knowledge-base-container">
                <div class="knowledge-base-header">
                    <h2>🔍 知识库搜索</h2>
                    <p>搜索 ${this.stats.total_questions} 个技术问题和解决方案</p>
                </div>
                
                <div class="search-controls">
                    <div class="search-input-container">
                        <input type="text" id="kb-search-input" placeholder="输入关键词搜索问题...">
                        <button id="kb-search-btn" onclick="knowledgeBase.search()">
                            <i class="ri-search-line"></i>
                        </button>
                        <button id="kb-reset-btn" onclick="knowledgeBase.resetSearch()" title="重置搜索">
                            <i class="ri-refresh-line"></i>
                        </button>
                    </div>
                    
                    <div class="filter-controls">
                        <select id="category-filter">
                            <option value="">所有分类</option>
                            ${this.stats.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                        </select>
                        
                        <select id="subcategory-filter">
                            <option value="">所有子分类</option>
                            ${this.stats.subcategories.map(sub => `<option value="${sub}">${sub}</option>`).join('')}
                        </select>
                    </div>
                </div>
                
                <div class="search-results-container">
                    <div id="search-results" class="search-results">
                        <div class="welcome-message">
                            <h3>欢迎使用知识库 🎓</h3>
                            <p>这里包含了 ${this.stats.total_questions} 个技术问题和解决方案</p>
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <span class="stat-number">${this.stats.categories.length}</span>
                                    <span class="stat-label">主要分类</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-number">${this.stats.subcategories.length}</span>
                                    <span class="stat-label">子分类</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-number">${this.questions.filter(q => q.human_answer).length}</span>
                                    <span class="stat-label">人工答案</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-number">${this.questions.filter(q => q.ai_answer).length}</span>
                                    <span class="stat-label">AI答案</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 绑定搜索事件
        document.getElementById('kb-search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.search();
            }
        });

        // 绑定筛选事件
        document.getElementById('category-filter').addEventListener('change', () => this.search());
        document.getElementById('subcategory-filter').addEventListener('change', () => this.search());
    }

    // 搜索功能
    search() {
        const query = document.getElementById('kb-search-input').value.trim();
        const categoryFilter = document.getElementById('category-filter').value;
        const subcategoryFilter = document.getElementById('subcategory-filter').value;

        console.log('搜索参数:', { query, categoryFilter, subcategoryFilter });

        let results = this.questions;

        // 关键词搜索
        if (query) {
            const searchTerms = query.toLowerCase().split(' ');
            results = results.filter(item => {
                const searchText = `${item.title} ${item.question} ${item.human_answer} ${item.ai_answer}`.toLowerCase();
                return searchTerms.some(term => searchText.includes(term));
            });
        }

        // 分类筛选
        if (categoryFilter) {
            results = results.filter(item => item.category === categoryFilter);
        }

        if (subcategoryFilter) {
            results = results.filter(item => item.subcategory === subcategoryFilter);
        }

        this.displayResults(results, query);
    }

    // 显示搜索结果
    displayResults(results, query) {
        const container = document.getElementById('search-results');

        if (results.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="ri-search-line"></i>
                    <h3>未找到相关结果</h3>
                    <p>请尝试其他关键词或调整筛选条件</p>
                </div>
            `;
            return;
        }

        const resultsHtml = `
            <div class="results-header">
                <h3>搜索结果 (${results.length} 个)</h3>
                ${query ? `<p>关键词: "${query}"</p>` : ''}
            </div>
            
            <div class="results-list">
                ${results.map(item => this.createResultCard(item)).join('')}
            </div>
        `;

        container.innerHTML = resultsHtml;

        // 滚动到顶部 - 确保搜索结果容器滚动到顶部
        const scrollContainer = document.querySelector('.search-results-container');
        if (scrollContainer) {
            scrollContainer.scrollTop = 0;
            console.log('已滚动到搜索结果顶部');
        }

        // 备用方案：如果上面的滚动不工作，尝试滚动整个容器
        setTimeout(() => {
            const knowledgeContainer = document.getElementById('knowledge-search-container');
            if (knowledgeContainer) {
                knowledgeContainer.scrollTop = 0;
            }
        }, 100);
    }

    // 创建结果卡片
    createResultCard(item) {
        return `
            <div class="result-card" data-id="${item.id}">
                <div class="result-header">
                    <div class="result-title">
                        <span class="index-badge">#${item.index}</span>
                        <h4>${this.highlightText(item.title)}</h4>
                    </div>
                    <div class="result-meta">
                        <span class="category-tag">${item.category}</span>
                        ${item.subcategory ? `<span class="subcategory-tag">${item.subcategory}</span>` : ''}
                    </div>
                </div>
                
                <div class="result-content">
                    <div class="question-section">
                        <h5><i class="ri-question-line"></i> 问题</h5>
                        <p>${this.truncateText(item.question, 200)}</p>
                    </div>
                    
                    ${item.human_answer ? `
                        <div class="answer-section human-answer">
                            <h5><i class="ri-user-line"></i> 人工答案</h5>
                            <p>${this.truncateText(item.human_answer, 200)}</p>
                        </div>
                    ` : ''}
                    
                    ${item.ai_answer ? `
                        <div class="answer-section ai-answer">
                            <h5><i class="ri-robot-line"></i> AI答案</h5>
                            <p>${this.truncateText(item.ai_answer, 200)}</p>
                        </div>
                    ` : ''}
                </div>
                
                <div class="result-actions">
                    <button onclick="knowledgeBase.viewDetails('${item.id}')" class="view-btn">
                        <i class="ri-eye-line"></i> 查看详情
                    </button>
                    <button onclick="knowledgeBase.saveToNotes('${item.id}')" class="save-btn">
                        <i class="ri-bookmark-line"></i> 保存到笔记
                    </button>
                </div>
            </div>
        `;
    }

    // 查看详情
    viewDetails(itemId) {
        const item = this.questions.find(q => q.id === itemId);
        if (!item) return;

        // 创建详情模态框
        const modal = document.createElement('div');
        modal.className = 'knowledge-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>#${item.index} - ${item.title}</h3>
                    <button onclick="this.closest('.knowledge-modal').remove()" class="close-btn">
                        <i class="ri-close-line"></i>
                    </button>
                </div>
                
                <div class="modal-body">
                    <div class="meta-info">
                        <span class="category-tag">${item.category}</span>
                        ${item.subcategory ? `<span class="subcategory-tag">${item.subcategory}</span>` : ''}
                    </div>
                    
                    <div class="content-section">
                        <h4><i class="ri-question-line"></i> 问题</h4>
                        <div class="content-text">${item.question}</div>
                    </div>
                    
                    ${item.human_answer ? `
                        <div class="content-section">
                            <h4><i class="ri-user-line"></i> 人工答案</h4>
                            <div class="content-text human-answer-text">${item.human_answer}</div>
                        </div>
                    ` : ''}
                    
                    ${item.ai_answer ? `
                        <div class="content-section">
                            <h4><i class="ri-robot-line"></i> AI答案</h4>
                            <div class="content-text ai-answer-text">${item.ai_answer}</div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="modal-footer">
                    <button onclick="knowledgeBase.saveToNotes('${item.id}')" class="save-btn">
                        <i class="ri-bookmark-line"></i> 保存到笔记
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // 保存到笔记
    async saveToNotes(itemId) {
        const item = this.questions.find(q => q.id === itemId);
        if (!item) return;

        try {
            const user = firebase.auth().currentUser;
            if (!user) {
                alert('请先登录');
                return;
            }

            // 创建笔记内容
            const noteContent = `# ${item.title}

**分类**: ${item.category}
${item.subcategory ? `**子分类**: ${item.subcategory}` : ''}
**索引**: #${item.index}

## 问题
${item.question}

${item.human_answer ? `## 人工答案
${item.human_answer}` : ''}

${item.ai_answer ? `## AI答案
${item.ai_answer}` : ''}

---
*保存时间: ${new Date().toLocaleString()}*
*来源: CyberWise知识库*`;

            // 保存到 Firestore
            await db.collection("notes").add({
                title: `知识库 #${item.index} - ${item.title}`,
                content: noteContent,
                userId: user.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                source: 'knowledge_base',
                originalIndex: item.index,
                category: item.category,
                subcategory: item.subcategory
            });

            alert('✅ 已保存到笔记！');
        } catch (error) {
            console.error('保存到笔记失败:', error);
            alert('❌ 保存失败，请重试');
        }
    }

    // 辅助函数：高亮文本
    highlightText(text) {
        // 简单实现，可以后续优化
        return text;
    }

    // 辅助函数：截断文本
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    // 按分类获取问题
    getQuestionsByCategory(category) {
        return this.questions.filter(q => q.category === category);
    }

    // 按索引获取问题
    getQuestionByIndex(index) {
        return this.questions.find(q => q.index === index);
    }

    // 重置搜索
    resetSearch() {
        document.getElementById('kb-search-input').value = '';
        document.getElementById('category-filter').value = '';
        document.getElementById('subcategory-filter').value = '';

        // 显示欢迎页面
        const container = document.getElementById('search-results');
        container.innerHTML = `
            <div class="welcome-message">
                <h3>欢迎使用知识库 🎓</h3>
                <p>这里包含了 ${this.stats.total_questions} 个技术问题和解决方案</p>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-number">${this.stats.categories.length}</span>
                        <span class="stat-label">主要分类</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${this.stats.subcategories.length}</span>
                        <span class="stat-label">子分类</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${this.questions.filter(q => q.human_answer).length}</span>
                        <span class="stat-label">人工答案</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${this.questions.filter(q => q.ai_answer).length}</span>
                        <span class="stat-label">AI答案</span>
                    </div>
                </div>
            </div>
        `;
    }
}

// 全局实例
const knowledgeBase = new KnowledgeBase();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('knowledge-search-container')) {
        knowledgeBase.init();
    }
}); 