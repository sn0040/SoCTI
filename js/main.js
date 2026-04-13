import { QUESTIONS } from './data/questions.js';
import { CHARACTERS } from './data/characters.js';
import { computeBaseScores, computeDimensionWeights, generateIdealOptions } from './utils/score.js';
import { renderResult } from './utils/render.js';
import { initParticles } from './particles.js';

// ---------- 塔罗牌图片映射（与 QUESTIONS 顺序一一对应）----------
const tarotImages = [
    "major_arcana_00.png", "major_arcana_01.png", "major_arcana_02.png", "major_arcana_03.png",
    "major_arcana_04.png", "major_arcana_05.png", "major_arcana_06.png", "major_arcana_07.png",
    "major_arcana_08.png", "major_arcana_09.png", "major_arcana_10.png", "major_arcana_11.png",
    "major_arcana_12.png", "major_arcana_13.png", "major_arcana_14.png", "major_arcana_15.png",
    "major_arcana_16.png", "major_arcana_17.png", "major_arcana_18.png", "major_arcana_19.png",
    "major_arcana_20.png", "major_arcana_21.png"
];

// ---------- 预计算所有角色的理想选项（基于五维分数）----------
const characterIdealOptions = {};
for (const [key, char] of Object.entries(CHARACTERS)) {
    characterIdealOptions[key] = generateIdealOptions(char.dims, QUESTIONS);
}

// ---------- DOM 元素 ----------
const landing = document.getElementById('landing');
const quizView = document.getElementById('quiz');
const loadingView = document.getElementById('loading');
const resultView = document.getElementById('result');
const retryBtn = document.getElementById('retryBtn');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const shareBtn = document.getElementById('shareBtn');
const saveImgBtn = document.getElementById('saveImgBtn');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const tarotNameSpan = document.getElementById('tarotName');
const tarotProgressSpan = document.getElementById('tarotProgress');
const progressFill = document.getElementById('progressFill');
const tarotWrapper = document.getElementById('tarotWrapper');
const tarotCard = document.getElementById('tarotCard');
const majorArcanaImg = document.getElementById('majorArcanaImg');

// ---------- 状态 ----------
let currentIndex = 0;
let userAnswers = new Array(QUESTIONS.length).fill(null);
let quizStarted = false;
let isFlipping = false;
let isTransitioning = false;

// ---------- 辅助函数 ----------
function setTarotImage(index) {
    if (majorArcanaImg) {
        majorArcanaImg.src = `assets/images/${tarotImages[index]}`;
    }
}

function initTarot() {
    if (tarotWrapper) {
        tarotWrapper.classList.remove('top');
        tarotWrapper.classList.add('center');
    }
    const inner = tarotCard.querySelector('.tarot-inner');
    if (inner) {
        inner.style.transition = '';
        inner.style.transform = 'rotateY(0deg)';
    }
    quizStarted = false;
    isFlipping = false;
    isTransitioning = false;
}

function startQuizAfterFlip() {
    if (quizStarted) return;
    quizStarted = true;
    landing.classList.add('hidden');
    quizView.classList.remove('hidden');
    currentIndex = 0;
    userAnswers = new Array(QUESTIONS.length).fill(null);
    renderQuestion();
    setTarotImage(0);
}

function renderQuestion() {
    const q = QUESTIONS[currentIndex];
    tarotNameSpan.innerText = `第${currentIndex+1}张牌【${q.name}】`;
    tarotProgressSpan.innerText = `${currentIndex+1} / ${QUESTIONS.length}`;
    questionText.innerText = q.text;
    optionsContainer.innerHTML = '';
    const selectedVal = userAnswers[currentIndex];
    q.opts.forEach((opt, idx) => {
        const optDiv = document.createElement('div');
        optDiv.className = 'quiz-option';
        if (selectedVal !== null && selectedVal === opt.val) optDiv.classList.add('selected');
        const prefix = String.fromCharCode(65+idx);
        optDiv.innerHTML = `<span style="font-weight:500;">${prefix}.</span> ${opt.text}`;
        optDiv.addEventListener('click', () => {
            userAnswers[currentIndex] = opt.val;
            renderQuestion();
            nextBtn.disabled = false;
            if (currentIndex === QUESTIONS.length-1) nextBtn.innerText = '完成 ✓';
            else nextBtn.innerText = '下一张牌 →';
        });
        optionsContainer.appendChild(optDiv);
    });
    nextBtn.disabled = (userAnswers[currentIndex] === null);
    progressFill.style.width = `${((currentIndex+1)/QUESTIONS.length)*100}%`;
    prevBtn.disabled = (currentIndex === 0);
}

function showLoading() {
    landing.classList.add('hidden');
    quizView.classList.add('hidden');
    resultView.classList.add('hidden');
    loadingView.classList.remove('hidden');
}

// ---------- 淘汰制匹配角色 ----------
function matchCharacterByElimination(answers) {
    let candidates = Object.keys(CHARACTERS);
    
    for (let i = 0; i < answers.length; i++) {
        const userVal = answers[i];
        if (userVal === null) continue;
        // 将用户选项分值(5,2,1)转换为选项索引(0,1,2)
        let userOpt;
        if (userVal === 5) userOpt = 0;
        else if (userVal === 2) userOpt = 1;
        else userOpt = 2;
        
        candidates = candidates.filter(key => characterIdealOptions[key][i] === userOpt);
        if (candidates.length === 0) break;
    }
    
    if (candidates.length > 0) {
        // 如果剩余多个，随机选一个（保证有结果）
        return candidates[Math.floor(Math.random() * candidates.length)];
    }
    
    // 回退：计算匹配度（汉明距离）最小的角色
    let bestKey = null;
    let minMismatch = Infinity;
    for (const key of Object.keys(CHARACTERS)) {
        const ideal = characterIdealOptions[key];
        let mismatch = 0;
        for (let i = 0; i < answers.length; i++) {
            const userVal = answers[i];
            if (userVal === null) continue;
            let userOpt = userVal === 5 ? 0 : (userVal === 2 ? 1 : 2);
            if (ideal[i] !== userOpt) mismatch++;
        }
        if (mismatch < minMismatch) {
            minMismatch = mismatch;
            bestKey = key;
        }
    }
    return bestKey;
}

// ---------- 结果展示 ----------
function showResult() {
    // 隐藏塔罗牌并移除 top 类，消除占位边距
    if (tarotWrapper) {
        tarotWrapper.classList.add('hidden');
        tarotWrapper.classList.remove('top');
    }
    
    // 使用淘汰制匹配角色
    const matchedKey = matchCharacterByElimination(userAnswers);
    const char = CHARACTERS[matchedKey];
    
    const baseScores = computeBaseScores(userAnswers, QUESTIONS);
    const weights = computeDimensionWeights(userAnswers, QUESTIONS);
    
    renderResult(matchedKey, [], baseScores, 'resultCard');
    loadingView.classList.add('hidden');
    resultView.classList.remove('hidden');
}

// ---------- 题目切换 ----------
function nextQuestion() {
    if (!quizStarted) return;
    if (userAnswers[currentIndex] === null) return;
    if (currentIndex + 1 < QUESTIONS.length) {
        // 快速翻转动画（与原有一致）
        quickFlipToNext(currentIndex + 1);
        currentIndex++;
        renderQuestion();
    } else {
        showLoading();
        setTimeout(() => {
            showResult();
        }, 1200);
    }
}

function prevQuestion() {
    if (!quizStarted) return;
    if (currentIndex > 0) {
        quickFlipToNext(currentIndex - 1);
        currentIndex--;
        renderQuestion();
    }
}

// ---------- 快速翻转动画（与原有一致）----------
function quickFlipToNext(newIndex) {
    if (isFlipping || !quizStarted) return;
    isFlipping = true;
    const inner = tarotCard.querySelector('.tarot-inner');
    if (!inner) {
        isFlipping = false;
        return;
    }
    inner.classList.add('spin');
    setTimeout(() => {
        setTarotImage(newIndex);
    }, 250);
    const onAnimationEnd = () => {
        inner.classList.remove('spin');
        inner.style.transition = 'none';
        inner.style.transform = 'rotateY(180deg)';
        inner.offsetHeight;
        inner.style.transition = '';
        isFlipping = false;
    };
    inner.addEventListener('animationend', onAnimationEnd);
}

// ---------- 重置测试 ----------
function resetTest() {
    if (isTransitioning) return;
    isTransitioning = true;
    
    // 重置塔罗牌显示状态：移除隐藏和顶部固定，恢复居中
    if (tarotWrapper) {
        tarotWrapper.classList.remove('hidden', 'top');
        tarotWrapper.classList.add('center');
    }
    
    quizStarted = false;
    currentIndex = 0;
    userAnswers = new Array(QUESTIONS.length).fill(null);
    landing.classList.remove('hidden');
    quizView.classList.add('hidden');
    loadingView.classList.add('hidden');
    resultView.classList.add('hidden');
    nextBtn.disabled = true;
    nextBtn.innerText = '下一张牌 →';
    initTarot();
    setTimeout(() => {
        isTransitioning = false;
    }, 500);
}

// ---------- 分享与截图 ----------
function shareResult() {
    // 淘汰制下，直接使用匹配到的角色（与结果页一致）
    const matchedKey = matchCharacterByElimination(userAnswers);
    const char = CHARACTERS[matchedKey];
    const shareText = `【铃兰之剑·命运塔罗】我的占卜结果是：${matchedKey} · ${char.title} (${char.mbti})\n“${char.quote}”\n来抽取你的塔罗牌吧！`;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => alert("结果已复制，快去分享吧！"));
    } else alert(shareText);
}

async function saveAsImage() {
    const originalCard = document.getElementById('resultCard');
    if (!originalCard) return;
    const cloneCard = originalCard.cloneNode(true);
    cloneCard.classList.add('clone-screenshot');
    cloneCard.style.position = 'fixed';
    cloneCard.style.top = '-9999px';
    cloneCard.style.left = '-9999px';
    cloneCard.style.width = originalCard.offsetWidth + 'px';
    document.body.appendChild(cloneCard);
    const cloneCanvas = cloneCard.querySelector('#radarCanvas');
    if (cloneCanvas) {
        const baseScores = computeBaseScores(userAnswers, QUESTIONS);
        const radarData = [baseScores.belief, baseScores.action, baseScores.empathy, baseScores.principle, baseScores.confidence];
        const { renderRadarChart } = await import('./utils/render.js');
        renderRadarChart(cloneCanvas, radarData);
    }
    try {
        const canvas = await html2canvas(cloneCard, { scale: 2.5, backgroundColor: '#121623', logging: false });
        const link = document.createElement('a');
        link.download = 'tarot_result.png';
        link.href = canvas.toDataURL();
        link.click();
    } catch (e) {
        alert("生成牌面失败，可尝试截图");
    } finally {
        document.body.removeChild(cloneCard);
    }
}

// ---------- 塔罗牌点击翻转并开始测试 ----------
function onTarotClick() {
    if (quizStarted || isTransitioning) return;
    isTransitioning = true;
    const inner = tarotCard.querySelector('.tarot-inner');
    if (!inner) return;
    inner.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
    inner.style.transform = 'rotateY(180deg)';
    const onTransitionEnd = () => {
        inner.removeEventListener('transitionend', onTransitionEnd);
        if (tarotWrapper) {
            tarotWrapper.classList.remove('center');
            tarotWrapper.classList.add('top');
        }
        startQuizAfterFlip();
        isTransitioning = false;
    };
    inner.addEventListener('transitionend', onTransitionEnd);
}

// ---------- 事件绑定 ----------
document.addEventListener('DOMContentLoaded', () => {
    initTarot();
    tarotCard.addEventListener('click', onTarotClick);
    retryBtn.addEventListener('click', resetTest);
    nextBtn.addEventListener('click', nextQuestion);
    prevBtn.addEventListener('click', prevQuestion);
    shareBtn.addEventListener('click', shareResult);
    saveImgBtn.addEventListener('click', saveAsImage);
    initParticles();
});