// quizs_new.js - 新版Quiz页面交互

let currentType = 'choice';
let currentQuestions = [];
let currentQuestion = null;
let questionHistory = [];
let score = 0;

const questionSources = {
    choice: '../static/data/choise.json',
    trueFalse: '../static/data/TF.json',
    mixed: ['../static/data/choise.json', '../static/data/TF.json']
};

// Firebase用户认证检查
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log('用户已登录:', user);
        const userEmailElement = document.getElementById('userEmail');
        if (userEmailElement) {
            userEmailElement.textContent = user.displayName || user.email || 'Unknown User';
        }
    } else {
        console.log('用户未登录，重定向到登录页面');
        setTimeout(() => {
            alert('请先登录');
            window.location.href = window.location.origin + '/templates/login.html';
        }, 1000);
    }
});

// 退出登录函数
function logout() {
    if (confirm('确定要退出登录吗？')) {
        firebase.auth().signOut().then(() => {
            alert('已退出登录');
            window.location.href = window.location.origin + '/templates/login.html';
        }).catch(error => {
            console.error('退出登录失败:', error);
            alert('退出登录失败，请重试');
        });
    }
}

// 用户下拉菜单切换
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

// 页面导航函数（quizs.html中的侧边栏可能会调用）
function showSection(sectionName) {
    // Quiz页面没有多个section，这个函数主要是为了兼容
    console.log('showSection called:', sectionName);
}

function createNewDocument() {
    // 跳转到dashboard页面的创建文档功能
    window.location.href = window.location.origin + '/templates/dashboard.html';
}

// 初始化
window.addEventListener('DOMContentLoaded', () => {
    bindToolbar();
    loadQuestions('choice');
});

function bindToolbar() {
    // 题型下拉
    const typeBtn = document.getElementById('quizTypeBtn');
    const typeList = document.getElementById('quizTypeList');
    typeBtn.onclick = () => {
        typeList.style.display = typeList.style.display === 'none' ? 'block' : 'none';
    };
    document.querySelectorAll('.quiz-type-item').forEach(item => {
        item.onclick = () => {
            typeList.style.display = 'none';
            loadQuestions(item.dataset.type);
            const typeText = item.textContent;
            typeBtn.innerHTML = `<span data-lang="${item.getAttribute('data-lang')}">${typeText}</span> <i class="ri-arrow-down-s-line"></i>`;
        };
    });
    // 清空历史
    document.getElementById('quizClearBtn').onclick = () => {
        questionHistory = [];
        score = 0;
        updateScore();
        loadQuestions(currentType);
    };

    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.quiz-type-dropdown')) {
            typeList.style.display = 'none';
        }
    });
}

async function loadQuestions(type) {
    currentType = type;
    questionHistory = [];
    score = 0;
    updateScore();
    currentQuestions = [];
    let sources = questionSources[type];
    if (!Array.isArray(sources)) sources = [sources];
    for (const src of sources) {
        const questions = await fetchQuestions(src);
        currentQuestions.push(...questions);
    }
    shuffleArray(currentQuestions);
    showNextQuestion();
}

async function fetchQuestions(url) {
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    if (Array.isArray(data.questions)) {
        if (url.includes('choise')) {
            return data.questions.map(q => ({
                id: 'choice_' + q.id,
                type: 'choice',
                text: q.question,
                options: [q.options.A, q.options.B, q.options.C, q.options.D],
                answer: q.correct_answer
            }));
        }
        if (url.includes('TF')) {
            return data.questions.map(q => ({
                id: 'tf_' + q.id,
                type: 'trueFalse',
                text: q.question,
                options: [
                    window.getText ? getText('optionTrue') : 'True',
                    window.getText ? getText('optionFalse') : 'False'
                ],
                answer: q.correct_answer === true ? 'A' : 'B'
            }));
        }
    }
    return [];
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateScore() {
    const scoreText = window.getText ? getText('consecutiveCorrect') : 'Consecutive Correct';
    document.getElementById('quizScore').innerHTML = `<span data-lang="consecutiveCorrect">${scoreText}</span>: ${score}`;
}

// 更新当前问题的选项语言
function updateCurrentQuestionOptions() {
    if (!currentQuestion || currentQuestion.type !== 'trueFalse') return;

    const options = document.querySelectorAll('.quiz-option');
    if (options.length === 2) {
        // 更新判断题选项文本
        const trueText = window.getText ? getText('optionTrue') : 'True';
        const falseText = window.getText ? getText('optionFalse') : 'False';

        const option1 = options[0].querySelector('span:last-child');
        const option2 = options[1].querySelector('span:last-child');

        if (option1) option1.textContent = trueText;
        if (option2) option2.textContent = falseText;

        // 同时更新当前问题对象中的选项
        currentQuestion.options = [trueText, falseText];
    }
}

function showNextQuestion() {
    document.getElementById('quizFeedback').className = 'quiz-feedback';
    document.getElementById('quizFeedback').textContent = '';
    document.getElementById('quizNextBtn').style.display = 'none';
    // 过滤掉已答过的题
    const remain = currentQuestions.filter(q => !questionHistory.includes(q.id));
    if (remain.length === 0) {
        const doneText = window.getText ? getText('allQuestionsDone') : 'Congratulations! You\'ve completed all questions in the question bank! Amazing! Now clear history to start over.';
        document.getElementById('quizQuestion').textContent = doneText;
        document.getElementById('quizOptions').innerHTML = '';
        return;
    }
    currentQuestion = remain[Math.floor(Math.random() * remain.length)];
    document.getElementById('quizQuestion').textContent = currentQuestion.text;
    let optionsHtml = '';
    currentQuestion.options.forEach((opt, idx) => {
        const abcd = String.fromCharCode(65 + idx);
        optionsHtml += `
            <button class="quiz-option" data-abcd="${abcd}" onclick="selectQuizOption(this)">
                <span class="quiz-option-label">${abcd}</span>
                <span>${opt}</span>
            </button>
        `;
    });
    document.getElementById('quizOptions').innerHTML = optionsHtml;
}

window.selectQuizOption = function (btn) {
    if (!currentQuestion) return;
    // 禁用所有按钮
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.disabled = true;
        opt.classList.remove('selected', 'correct', 'wrong');
    });
    btn.classList.add('selected');
    const userAnswer = btn.getAttribute('data-abcd');
    const isCorrect = userAnswer === currentQuestion.answer;
    // 高亮正确/错误
    document.querySelectorAll('.quiz-option').forEach(opt => {
        const abcd = opt.getAttribute('data-abcd');
        if (abcd === currentQuestion.answer) {
            opt.classList.add('correct');
        }
        if (opt === btn && !isCorrect) {
            opt.classList.add('wrong');
        }
    });
    // 反馈
    const feedback = document.getElementById('quizFeedback');
    feedback.className = 'quiz-feedback visible ' + (isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
        const correctText = window.getText ? getText('answerCorrect') : 'Correct!';
        feedback.textContent = correctText;
    } else {
        const wrongText = window.getText ? getText('answerWrong') : 'Wrong!';
        feedback.textContent = wrongText;
    }
    // 分数
    if (isCorrect) score++; else score = 0;
    updateScore();
    questionHistory.push(currentQuestion.id);
    // 显示下一题按钮
    const nextBtn = document.getElementById('quizNextBtn');
    nextBtn.style.display = 'block';
    nextBtn.onclick = showNextQuestion;
};

// 将需要在HTML中调用的函数绑定到window对象
window.updateCurrentQuestionOptions = updateCurrentQuestionOptions; 