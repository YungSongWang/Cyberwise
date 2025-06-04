// quiz.js - CyberWise Quiz Functionality

let currentUser = null;
let questionHistory = []; // 存储已答过的问题的id
let score = 0; // 连续答对次数
let currentQuestions = []; // 当前题库所有题
let currentType = 'choice'; // 当前题库类型
let currentQuestion = null; // 当前题目对象
let allQuestionsFinished = false; // 新增：标记是否全部答完

const questionSources = {
    choice: '../static/data/choise.json',
    trueFalse: '../static/data/TF.json',
    mixed: ['../static/data/choise.json', '../static/data/TF.json']
};

// 页面加载默认选择题
document.addEventListener('DOMContentLoaded', () => {
    loadQuestions('choice');
    updateScoreDisplay();
});

// 加载题库
async function loadQuestions(type) {
    currentType = type;
    questionHistory = [];
    score = 0;
    updateScoreDisplay();
    currentQuestions = [];
    let sources = questionSources[type];
    if (!Array.isArray(sources)) sources = [sources];
    for (const src of sources) {
        const questions = await fetchQuestions(src);
        currentQuestions.push(...questions);
    }
    shuffleArray(currentQuestions);
    updateQuestionTypeText(type);
    displayNextQuestion();
}

// 获取题目
async function fetchQuestions(url) {
    const response = await fetch(url);
    if (!response.ok) {
        alert('网络错误，无法加载题目');
        return [];
    }
    const data = await response.json();
    // 兼容不同题型
    if (Array.isArray(data.questions)) {
        // 选择题
        if (url.includes('choise')) {
            return data.questions.map(q => ({
                id: 'choice_' + q.id,
                type: 'choice',
                text: q.question,
                options: [
                    q.options.A,
                    q.options.B,
                    q.options.C,
                    q.options.D
                ],
                answer: q.correct_answer
            }));
        }
        // 判断题
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

// 随机打乱
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 更新题库名称
function updateQuestionTypeText(type) {
    const map = { choice: '选择题', trueFalse: '判断题', mixed: '混合题' };
    document.getElementById('question-type').innerText = map[type] || '选择题';
}

// 展示下一题
function displayNextQuestion() {
    document.getElementById('answer-section').innerHTML = '';
    // 过滤掉已答过的题
    const remain = currentQuestions.filter(q => !questionHistory.includes(q.id));
    if (remain.length === 0) {
        allQuestionsFinished = true; // 标记为已全部答完
        document.getElementById('question-container').innerHTML = `<div style="color:#fff;text-align:center;font-size:20px;" id="all-done-msg">
            ${window.getText ? getText('allQuestionsDone') : '什么？你竟然做完了题库全部题目！Σヽ(ﾟД ﾟ; )ﾉ\<br\>真是不可思议！\<br\>\<br\>现在清空历史重新再做一遍吧'}
        </div>`;
        return;
    }
    allQuestionsFinished = false; // 还有题目
    currentQuestion = remain[Math.floor(Math.random() * remain.length)];
    let optionsHtml = '';
    if (currentQuestion.type === 'choice') {
        currentQuestion.options.forEach((opt, idx) => {
            const abcd = String.fromCharCode(65 + idx);
            optionsHtml += `
                <div class="exam-option" data-abcd="${abcd}" onclick="selectOption(this)">
                    <span class="exam-option-label">${abcd}</span>
                    <span class="exam-option-content">${opt}</span>
                </div>
            `;
        });
    } else if (currentQuestion.type === 'trueFalse') {
        // A: 正确，B: 错误
        ['正确', '错误'].forEach((opt, idx) => {
            const abcd = String.fromCharCode(65 + idx);
            optionsHtml += `
                <div class="exam-option" data-abcd="${abcd}" onclick="selectOption(this)">
                    <span class="exam-option-label">${abcd}</span>
                    <span class="exam-option-content">${opt}</span>
                </div>
            `;
        });
    }
    document.getElementById('question-container').innerHTML = `
        <div class="exam-question-block" style="background:#181818;border-radius:10px;padding:24px 24px 12px 24px;">
            <div class="exam-question-title" style="font-size:18px;font-weight:bold;margin-bottom:18px;color:#fff;">
                ${currentQuestion.text}
            </div>
            <div class="exam-options-list" style="display:flex;flex-direction:column;gap:12px;">
                ${optionsHtml}
            </div>
        </div>
        <button class="view-answer" onclick="showAnswer()" style="margin-top:24px;background:#3a7afe;color:#fff;border:none;border-radius:6px;padding:8px 24px;font-size:16px;cursor:pointer;">查看答案</button>
    `;
    styleExamOptions();
}

// 选项高亮
window.selectOption = function (element) {
    document.querySelectorAll('.exam-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
};

// 查看答案
window.showAnswer = function (isRefresh) {
    const selected = document.querySelector('.exam-option.selected');
    const answerSection = document.getElementById('answer-section');
    const answer = currentQuestion.answer;
    let userAnswer = '';
    if (selected) userAnswer = selected.getAttribute('data-abcd');
    let isCorrect = userAnswer === answer;
    // 高亮
    document.querySelectorAll('.exam-option').forEach(opt => {
        const abcd = opt.getAttribute('data-abcd');
        if (abcd === answer) {
            opt.style.background = '#1abc9c';
            opt.style.color = '#fff';
        }
        if (opt.classList.contains('selected')) {
            if (isCorrect) {
                opt.style.background = '#1abc9c';
                opt.style.color = '#fff';
            } else {
                opt.style.background = '#e74c3c';
                opt.style.color = '#fff';
            }
        }
        opt.style.pointerEvents = 'none';
    });
    // 答案区
    let answerText = '';
    if (currentQuestion.type === 'choice') {
        answerText = `${answer}：${currentQuestion.options[answer.charCodeAt(0) - 65]}`;
    } else if (currentQuestion.type === 'trueFalse') {
        answerText = answer === 'A'
            ? `A：${window.getText ? getText('optionTrue') : '正确'}`
            : `B：${window.getText ? getText('optionFalse') : '错误'}`;
    }
    answerSection.innerHTML = `
        <div class="result" style="margin-top:18px;font-size:16px;color:#fff;">
            ${window.getText ? getText('correctAnswer') : '正确答案'}: <span style="color:#1abc9c;font-weight:bold;">${answerText}</span>
        </div>
        <div class="result">
            ${isCorrect
            ? `<span class='correct'>${window.getText ? getText('answerRight') : '答对了！'}</span>`
            : `<span class='wrong'>${window.getText ? getText('answerWrong') : '答错了！'}</span>`
        }
        </div>
        <button class="next-question" onclick="nextQuestion()" style="float:right;margin-top:16px;background:#3a7afe;color:#fff;border:none;border-radius:6px;padding:8px 24px;font-size:16px;cursor:pointer;">
            ${window.getText ? getText('nextQuestion') : '下一题'}
        </button>
    `;
    // 只在正常答题时计分和记录历史
    if (!isRefresh) {
        if (isCorrect) {
            score++;
        } else {
            score = 0;
        }
        updateScoreDisplay();
        questionHistory.push(currentQuestion.id);
        // 隐藏查看答案按钮
        document.querySelector('.view-answer').style.display = 'none';
    }
};

// 下一题
window.nextQuestion = function () {
    displayNextQuestion();
    document.getElementById('answer-section').innerHTML = '';
};

// 分数显示
function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('score-display');
    if (scoreDisplay) {
        scoreDisplay.textContent =
            (window.getText ? getText('consecutiveCorrect') : '连续答对次数') + `: ${score}`;
    }
}

// 清空历史
window.clearHistory = function () {
    questionHistory = [];
    score = 0;
    updateScoreDisplay();
    loadQuestions(currentType);
};

// 切换题库
window.changeQuestionType = function (type) {
    document.getElementById('dropdownMenu').style.display = 'none';
    loadQuestions(type);
};

// 选项样式
function styleExamOptions() {
    const style = document.createElement('style');
    style.innerHTML = `
    .exam-option {
        background: #232323;
        border-radius: 6px;
        padding: 12px 18px;
        cursor: pointer;
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #fff;
        border: 2px solid transparent;
        transition: background 0.2s, border 0.2s;
    }
    .exam-option.selected {
        border: 2px solid #3a7afe;
        background: #2d3a4b;
    }
    .exam-option-label {
        font-weight: bold;
        margin-right: 16px;
        font-size: 18px;
        color: #3a7afe;
    }
    `;
    document.head.appendChild(style);
}

// 登出
window.logout = function () {
    score = 0;
    updateScoreDisplay();
    alert('已登出');
    window.location.href = '/templates/login.html';
};

window.updateQuizLang = function () {
    // 题库下拉
    document.querySelectorAll('.dropdown-item[data-lang]').forEach(item => {
        const key = item.getAttribute('data-lang');
        item.textContent = window.getText ? getText(key) : item.textContent;
    });
    // 题库类型显示
    const typeMap = {
        choice: 'questionTypeChoice',
        trueFalse: 'questionTypeTrueFalse',
        mixed: 'questionTypeMixed'
    };
    const typeKey = typeMap[currentType] || 'questionTypeChoice';
    const typeSpan = document.getElementById('question-type');
    if (typeSpan && window.getText) typeSpan.textContent = getText(typeKey);

    // 清空历史按钮
    const clearBtn = document.getElementById('clear-history-btn');
    if (clearBtn && window.getText) clearBtn.textContent = getText('clearHistory');

    // 刷新当前题目和答案区（如果有题目正在显示）
    if (allQuestionsFinished) {
        // 只刷新"全部答完"提示
        const container = document.getElementById('question-container');
        if (container) {
            container.innerHTML = `<div style="color:#fff;text-align:center;font-size:20px;" id="all-done-msg">
                ${window.getText ? getText('allQuestionsDone') : '什么？你竟然做完了题库全部题目！真是不可思议！现在清空历史重新再做一遍吧'}
            </div>`;
        }
    } else if (currentQuestion) {
        displayCurrentQuestionWithLang();
    }
    // 新增：刷新分数显示
    updateScoreDisplay();
};

// 新增：根据当前语言刷新题目和答案区
function displayCurrentQuestionWithLang() {
    // 判断是否已答题
    const hasAnswered = document.getElementById('answer-section').innerHTML.trim() !== '';

    // 重新渲染当前题目
    let optionsHtml = '';
    if (currentQuestion.type === 'choice') {
        currentQuestion.options.forEach((opt, idx) => {
            const abcd = String.fromCharCode(65 + idx);
            optionsHtml += `
                <div class="exam-option${document.querySelector('.exam-option.selected') && document.querySelector('.exam-option.selected').getAttribute('data-abcd') === abcd ? ' selected' : ''}" data-abcd="${abcd}" onclick="selectOption(this)">
                    <span class="exam-option-label">${abcd}</span>
                    <span class="exam-option-content">${opt}</span>
                </div>
            `;
        });
    } else if (currentQuestion.type === 'trueFalse') {
        ['optionTrue', 'optionFalse'].forEach((key, idx) => {
            const abcd = String.fromCharCode(65 + idx);
            optionsHtml += `
                <div class="exam-option${document.querySelector('.exam-option.selected') && document.querySelector('.exam-option.selected').getAttribute('data-abcd') === abcd ? ' selected' : ''}" data-abcd="${abcd}" onclick="selectOption(this)">
                    <span class="exam-option-label">${abcd}</span>
                    <span class="exam-option-content">${window.getText ? getText(key) : (key === 'optionTrue' ? '正确' : '错误')}</span>
                </div>
            `;
        });
    }
    document.getElementById('question-container').innerHTML = `
        <div class="exam-question-block" style="background:#181818;border-radius:10px;padding:24px 24px 12px 24px;">
            <div class="exam-question-title" style="font-size:18px;font-weight:bold;margin-bottom:18px;color:#fff;">
                ${currentQuestion.text}
            </div>
            <div class="exam-options-list" style="display:flex;flex-direction:column;gap:12px;">
                ${optionsHtml}
            </div>
        </div>
        ${!hasAnswered ? `<button class="view-answer" onclick="showAnswer()" style="margin-top:24px;background:#3a7afe;color:#fff;border:none;border-radius:6px;padding:8px 24px;font-size:16px;cursor:pointer;">
            ${window.getText ? getText('viewanswer') : '查看答案'}
        </button>` : ''}
    `;
    // 如果答案区有内容，也刷新，但不重复计分
    if (hasAnswered) {
        window.showAnswer(true);
    }
    styleExamOptions();
}