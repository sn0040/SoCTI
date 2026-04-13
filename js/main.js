import { QUESTIONS } from './data/questions.js';
import { CHARACTERS } from './data/characters.js';
import { computeBaseScores, computeDimensionWeights, getProbabilisticTop3 } from './utils/score.js';
import { renderResult } from './utils/render.js';
import { initParticles } from './particles.js';

// ---------- 塔罗牌图片映射（与 QUESTIONS 顺序一一对应）----------
// 请根据您的实际图片文件名修改此处
const tarotImages = [
    "major_arcana_00.png",  // 愚者的天真
    "major_arcana_01.png",  // 魔术师的梦想
    "major_arcana_02.png",  // 女祭司的仁慈
    "major_arcana_03.png",  // 女皇的优雅
    "major_arcana_04.png",  // 皇帝的威严
    "major_arcana_05.png",  // 法皇的法则
    "major_arcana_06.png",  // 恋人的亲密
    "major_arcana_07.png",  // 战车的行进
    "major_arcana_08.png",  // 力量的源泉
    "major_arcana_09.png",  // 隐者的寂静
    "major_arcana_10.png",  // 命运的抉择
    "major_arcana_11.png",  // 正义的裁决
    "major_arcana_12.png",  // 倒吊人的奉献
    "major_arcana_13.png",  // 死神的呢喃
    "major_arcana_14.png",  // 节制的欲望
    "major_arcana_15.png",  // 恶魔的诱惑
    "major_arcana_16.png",  // 高塔的毁灭
    "major_arcana_17.png",  // 星星的指引
    "major_arcana_18.png",  // 月亮的盈亏
    "major_arcana_19.png",  // 太阳的光芒
    "major_arcana_20.png",  // 审判者的救赎
    "major_arcana_21.png"   // 世界的指向
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

// 塔罗牌元素
const tarotWrapper = document.getElementById('tarotWrapper');
const tarotCard = document.getElementById('tarotCard');
const majorArcanaImg = document.getElementById('majorArcanaImg');

// ---------- 状态变量 ----------
let currentIndex = 0;                // 当前题目索引
let userAnswers = new Array(QUESTIONS.length).fill(null);
let quizStarted = false;             // 是否已开始测试
let isFlipping = false;              // 防止动画冲突
let isTransitioning = false;         // 防止多次点击

// ---------- 辅助函数 ----------
// 设置塔罗牌正面图片（根据题目索引）
function setTarotImage(index) {
    if (majorArcanaImg) {
        majorArcanaImg.src = `assets/images/${tarotImages[index]}`;
    }
}

// 初始化塔罗牌（首页状态：居中，背面朝上，无漂浮）
function initTarot() {
    if (tarotWrapper) {
        tarotWrapper.classList.remove('top');
        tarotWrapper.classList.add('center');
    }
    if (tarotCard) {
        tarotCard.classList.remove('flipped', 'quick-flip');
        // 确保背面朝上（未翻转）
        // 注意：初始时 tarot-card 没有 flipped 类，所以背面显示
    }
    // 重置开始标记
    quizStarted = false;
    isFlipping = false;
    isTransitioning = false;
}

// 连续逆时针旋转多次（每次180度），最后更换图片
async function quickFlipToNext(newIndex) {
    if (isFlipping || !quizStarted) return;
    isFlipping = true;

    const inner = tarotCard.querySelector('.tarot-inner');
    if (!inner) {
        isFlipping = false;
        return;
    }

    // 确保当前角度为0（正面朝上）
    let currentDeg = 0;
    // 设置快速过渡
    inner.style.transition = 'transform 0.15s cubic-bezier(0.23, 1, 0.32, 1)';
    
    // 翻转次数（偶数次，最终回到0度）
    const flipCount = 4; // 4次旋转：每次-180，共-720度，最后重置为0
    for (let i = 0; i < flipCount; i++) {
        currentDeg -= 180;
        inner.style.transform = `rotateY(${currentDeg}deg)`;
        // 等待动画完成（过渡时长+微小延迟）
        await new Promise(r => setTimeout(r, 160));
    }
    
    // 动画完成，重置transform为0（无过渡跳跃），并更换图片
    inner.style.transform = '';
    inner.style.transition = '';
    setTarotImage(newIndex);
    
    isFlipping = false;
}


// ---------- 测试核心逻辑 ----------
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
    const baseScores = computeBaseScores(userAnswers, QUESTIONS);
    const weights = computeDimensionWeights(userAnswers, QUESTIONS);
    const { main, alternatives } = getProbabilisticTop3(baseScores, weights);
    renderResult(main, alternatives, baseScores, 'resultCard');
    loadingView.classList.add('hidden');
    resultView.classList.remove('hidden');
}

// 开始测试（在翻转完成后调用）
function startQuizAfterFlip() {
    if (quizStarted) return;
    quizStarted = true;
    // 显示测试视图
    landing.classList.add('hidden');
    quizView.classList.remove('hidden');
    // 重置题目状态
    currentIndex = 0;
    userAnswers = new Array(QUESTIONS.length).fill(null);
    renderQuestion();
    // 设置当前塔罗牌正面图片（第一张）
    setTarotImage(0);
}

// 下一题
function nextQuestion() {
    if (!quizStarted) return;
    if (userAnswers[currentIndex] === null) return;
    if (currentIndex + 1 < QUESTIONS.length) {
        // 快速翻转并更换到下一张图片
        quickFlipToNext(currentIndex + 1);
        currentIndex++;
        renderQuestion();
    } else {
        // 完成测试
        showLoading();
        setTimeout(() => {
            showResult();
        }, 1200);
    }
}

// 上一题
function prevQuestion() {
    if (!quizStarted) return;
    if (currentIndex > 0) {
        quickFlipToNext(currentIndex - 1);
        currentIndex--;
        renderQuestion();
    }
}

// 重新测试
function resetTest() {
    if (isTransitioning) return;
    isTransitioning = true;
    // 重置所有状态
    quizStarted = false;
    currentIndex = 0;
    userAnswers = new Array(QUESTIONS.length).fill(null);
    // 隐藏所有视图，显示首页
    landing.classList.remove('hidden');
    quizView.classList.add('hidden');
    loadingView.classList.add('hidden');
    resultView.classList.add('hidden');
    nextBtn.disabled = true;
    nextBtn.innerText = '下一张牌 →';
    // 重置塔罗牌到初始状态
    initTarot();
    // 重新绑定翻转事件（因为卡片可能被重新创建？不需要，只是重置类）
    // 延迟一点点以确保动画重置
    setTimeout(() => {
        isTransitioning = false;
    }, 500);
}

// 分享结果
function shareResult() {
    if (!quizStarted) return;
    const baseScores = computeBaseScores(userAnswers, QUESTIONS);
    const weights = computeDimensionWeights(userAnswers, QUESTIONS);
    const { main } = getProbabilisticTop3(baseScores, weights);
    const char = CHARACTERS[main];
    const shareText = `【铃兰之剑·命运塔罗】我的占卜结果是：${main} · ${char.title} (${char.mbti})\n“${char.quote}”\n来抽取你的塔罗牌吧！`;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => alert("结果已复制，快去分享吧！"));
    } else alert(shareText);
}

// 保存截图
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
    // 如果已经翻转，不重复处理
    if (tarotCard.classList.contains('flipped')) return;
    isTransitioning = true;
    // 添加翻转类
    tarotCard.classList.add('flipped');
    // 监听翻转动画结束
    const onTransitionEnd = (e) => {
        if (e.propertyName === 'transform') {
            tarotCard.removeEventListener('transitionend', onTransitionEnd);
            // 将塔罗牌移到顶部
            if (tarotWrapper) {
                tarotWrapper.classList.remove('center');
                tarotWrapper.classList.add('top');
            }
            // 开始测试
            startQuizAfterFlip();
            isTransitioning = false;
        }
    };
    tarotCard.addEventListener('transitionend', onTransitionEnd);
}

// ---------- 事件绑定 ----------
document.addEventListener('DOMContentLoaded', () => {
    // 初始化塔罗牌
    initTarot();
    // 绑定塔罗牌点击事件
    if (tarotCard) {
        tarotCard.addEventListener('click', onTarotClick);
    }
    // 按钮事件
    if (retryBtn) retryBtn.addEventListener('click', resetTest);
    if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
    if (prevBtn) prevBtn.addEventListener('click', prevQuestion);
    if (shareBtn) shareBtn.addEventListener('click', shareResult);
    if (saveImgBtn) saveImgBtn.addEventListener('click', saveAsImage);
    // 启动粒子背景
    initParticles();
});