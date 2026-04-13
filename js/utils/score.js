import { CHARACTERS } from '../data/characters.js';

export function computeBaseScores(userAnswers, questions) {
    let scores = { belief: 0, action: 0, empathy: 0, principle: 0, confidence: 0 };
    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const ans = userAnswers[i];
        if (ans === null) continue;
        if (q.dim === 'belief' || q.dim === 'action' || q.dim === 'empathy' || q.dim === 'principle' || q.dim === 'confidence') {
            scores[q.dim] += ans;
        }
    }
    return scores;
}

export function computeDimensionWeights(userAnswers, questions) {
    let weights = { belief: 1, action: 1, empathy: 1, principle: 1, confidence: 1 };
    const w1Ans = userAnswers[20];
    if (w1Ans !== null) {
        const opt = questions[20].opts.find(o => o.val === w1Ans);
        if (opt && opt.weightEffect) {
            if (opt.weightEffect.belief) weights.belief *= opt.weightEffect.belief;
            if (opt.weightEffect.empathy) weights.empathy *= opt.weightEffect.empathy;
        }
    }
    const w2Ans = userAnswers[21];
    if (w2Ans !== null) {
        const opt = questions[21].opts.find(o => o.val === w2Ans);
        if (opt && opt.weightEffect) {
            if (opt.weightEffect.action) weights.action *= opt.weightEffect.action;
            if (opt.weightEffect.principle) weights.principle *= opt.weightEffect.principle;
        }
    }
    let sum = weights.belief + weights.action + weights.empathy + weights.principle + weights.confidence;
    let factor = 5 / sum;
    weights.belief *= factor;
    weights.action *= factor;
    weights.empathy *= factor;
    weights.principle *= factor;
    weights.confidence *= factor;
    return weights;
}

export function weightedManhattanDistance(userScores, charDims, weights) {
    return Math.abs(userScores.belief - charDims[0]) * weights.belief +
           Math.abs(userScores.action - charDims[1]) * weights.action +
           Math.abs(userScores.empathy - charDims[2]) * weights.empathy +
           Math.abs(userScores.principle - charDims[3]) * weights.principle +
           Math.abs(userScores.confidence - charDims[4]) * weights.confidence;
}

export function getProbabilisticTop3(userScores, weights) {
    let distances = [];
    for (let key of Object.keys(CHARACTERS)) {
        const d = weightedManhattanDistance(userScores, CHARACTERS[key].dims, weights);
        distances.push({ key, dist: d });
    }
    distances.sort((a, b) => a.dist - b.dist);
    const top3 = distances.slice(0, 3);
    let invSum = 0;
    let invs = top3.map(item => { let inv = 1 / (item.dist + 0.1); invSum += inv; return inv; });
    let probs = invs.map(inv => inv / invSum);
    let rand = Math.random();
    let accum = 0;
    let selectedIndex = 0;
    for (let i = 0; i < probs.length; i++) {
        accum += probs[i];
        if (rand <= accum) { selectedIndex = i; break; }
    }
    const mainResult = top3[selectedIndex].key;
    const alternatives = top3.filter((_, idx) => idx !== selectedIndex).map(item => item.key);
    return { main: mainResult, alternatives };
}
// 根据角色的五维分数，生成22道题的理想选项（0表示A，1表示B，2表示C）
export function generateIdealOptions(characterDims, questions) {
    const [belief, action, empathy, principle, confidence] = characterDims;
    const ideal = [];
    for (let i = 0; i < questions.length; i++) {
        const dim = questions[i].dim;
        let score;
        switch (dim) {
            case 'belief': score = belief; break;
            case 'action': score = action; break;
            case 'empathy': score = empathy; break;
            case 'principle': score = principle; break;
            case 'confidence': score = confidence; break;
            default: score = 10; // 权重题，默认中间
        }
        // 分数映射到选项：≥14 → A(0)，≤6 → C(2)，中间 → B(1)
        if (score >= 14) ideal.push(0);
        else if (score <= 6) ideal.push(2);
        else ideal.push(1);
    }
    return ideal;
}