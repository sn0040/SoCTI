import { QUESTIONS } from './data/questions.js';
import { CHARACTERS } from './data/characters.js';
import { computeBaseScores, computeDimensionWeights, getProbabilisticTop3 } from './utils/score.js';
import { renderResult } from './utils/render.js';
import { initParticles } from './particles.js';
import { initStars } from './stars.js';

// ---------- 塔罗牌图片映射（与 QUESTIONS 顺序一一对应）----------
const tarotImages = [
    "major_arcana_00.png", "major_arcana_01.png", "major_arcana_02.png", "major_arcana_03.png",
    "major_arcana_04.png", "major_arcana_05.png", "major_arcana_06.png", "major_arcana_07.png",
    "major_arcana_08.png", "major_arcana_09.png", "major_arcana_10.png", "major_arcana_11.png",
    "major_arcana_12.png", "major_arcana_13.png", "major_arcana_14.png", "major_arcana_15.png",
    "major_arcana_16.png", "major_arcana_17.png", "major_arcana_18.png", "major_arcana_19.png",
    "major_arcana_20.png", "major_arcana_21.png"
];

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
    // 确保塔罗牌显示
    if (tarotWrapper) tarotWrapper.classList.remove('hidden');
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

function showResult() {
    // 隐藏塔罗牌并移除 top 类，避免占位
    if (tarotWrapper) {
        tarotWrapper.classList.add('hidden');
        tarotWrapper.classList.remove('top');
    }
    
    const baseScores = computeBaseScores(userAnswers, QUESTIONS);
    const weights = computeDimensionWeights(userAnswers, QUESTIONS);
    const { main, alternatives } = getProbabilisticTop3(baseScores, weights);
    renderResult(main, alternatives, baseScores, 'resultCard');
    loadingView.classList.add('hidden');
    resultView.classList.remove('hidden');
}

// 核心：单向旋转两圈，最后强制正面
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

function nextQuestion() {
    if (!quizStarted) return;
    if (userAnswers[currentIndex] === null) return;
    if (currentIndex + 1 < QUESTIONS.length) {
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
        currentIndex--;
        renderQuestion();
        setTarotImage(currentIndex);
    }
}

function resetTest() {
    if (isTransitioning) return;
    isTransitioning = true;
    
    // 重置塔罗牌：显示、居中、移除固定定位
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

function shareResult() {
    const baseScores = computeBaseScores(userAnswers, QUESTIONS);
    const weights = computeDimensionWeights(userAnswers, QUESTIONS);
    const { main } = getProbabilisticTop3(baseScores, weights);
    const char = CHARACTERS[main];
    const shareText = `【铃兰之剑·命运塔罗】我的占卜结果是：${main} · ${char.title} (${char.mbti})\n“${char.quote}”\n来抽取你的塔罗牌吧！`;
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

document.addEventListener('DOMContentLoaded', () => {
    initStars(); 
    initTarot();
    tarotCard.addEventListener('click', onTarotClick);
    retryBtn.addEventListener('click', resetTest);
    nextBtn.addEventListener('click', nextQuestion);
    prevBtn.addEventListener('click', prevQuestion);
    shareBtn.addEventListener('click', shareResult);
    saveImgBtn.addEventListener('click', saveAsImage);
    initParticles();
});