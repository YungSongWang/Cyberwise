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
            typeBtn.innerHTML = item.textContent + ' <i class="ri-arrow-down-s-line"></i>';
        };
    });
    // 清空历史
    document.getElementById('quizClearBtn').onclick = () => {
        questionHistory = [];
        score = 0;
        updateScore();
        loadQuestions(currentType);
    };
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
                options: ['正确', '错误'],
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
    document.getElementById('quizScore').textContent = `连续答对次数: ${score}`;
}

function showNextQuestion() {
    document.getElementById('quizFeedback').className = 'quiz-feedback';
    document.getElementById('quizFeedback').textContent = '';
    document.getElementById('quizNextBtn').style.display = 'none';
    // 过滤掉已答过的题
    const remain = currentQuestions.filter(q => !questionHistory.includes(q.id));
    if (remain.length === 0) {
        document.getElementById('quizQuestion').textContent = '恭喜你，已完成全部题目！点击清空历史可重新开始。';
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
    feedback.textContent = isCorrect ? '答对了！' : `答错了，正确答案：${currentQuestion.answer}`;
    // 分数
    if (isCorrect) score++; else score = 0;
    updateScore();
    questionHistory.push(currentQuestion.id);
    // 显示下一题按钮
    const nextBtn = document.getElementById('quizNextBtn');
    nextBtn.style.display = 'block';
    nextBtn.onclick = showNextQuestion;
}; 