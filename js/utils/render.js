import { CHARACTERS } from '../data/characters.js';

export function renderRadarChart(canvas, scores) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = 400;
    const h = canvas.height = 400;
    const centerX = w / 2, centerY = h / 2;
    const radius = 140;
    const angles = [-Math.PI / 2, -Math.PI / 2 + 2 * Math.PI / 5, -Math.PI / 2 + 4 * Math.PI / 5, -Math.PI / 2 + 6 * Math.PI / 5, -Math.PI / 2 + 8 * Math.PI / 5];
    const labels = ["信念(理想)", "行动(主动)", "情感(热忱)", "原则(守序)", "自信(坚定)"];
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#0a0c15";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#4b5563";
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "12px 'Segoe UI'";
    for (let level = 1; level <= 4; level++) {
        ctx.beginPath();
        let r = radius * level / 4;
        for (let i = 0; i < 5; i++) {
            let x = centerX + r * Math.cos(angles[i]);
            let y = centerY + r * Math.sin(angles[i]);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = "#334155";
        ctx.stroke();
    }
    for (let i = 0; i < 5; i++) {
        let x = centerX + radius * Math.cos(angles[i]);
        let y = centerY + radius * Math.sin(angles[i]);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = "#475569";
        ctx.stroke();
        let labelX = centerX + (radius + 15) * Math.cos(angles[i]);
        let labelY = centerY + (radius + 15) * Math.sin(angles[i]);
        ctx.fillStyle = "#facc15";
        ctx.fillText(labels[i], labelX - 15, labelY - 5);
    }
    let points = [];
    for (let i = 0; i < 5; i++) {
        let value = Math.min(20, Math.max(0, scores[i])) / 20;
        let r = radius * value;
        let x = centerX + r * Math.cos(angles[i]);
        let y = centerY + r * Math.sin(angles[i]);
        points.push({ x, y });
    }
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
        if (i === 0) ctx.moveTo(points[i].x, points[i].y);
        else ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(245,158,11,0.3)";
    ctx.fill();
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.stroke();
    for (let p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "#fbbf24";
        ctx.fill();
    }
}

export function renderResult(mainChar, alternatives, baseScores, containerId) {
    const char = CHARACTERS[mainChar];
    const radarData = [baseScores.belief, baseScores.action, baseScores.empathy, baseScores.principle, baseScores.confidence];
    const traitsHtml = char.traits.map(t => `<span class="trait-badge">${t}</span>`).join('');
    const alternativesHtml = alternatives.length ? `<div class="similar-badges">✨ 牌阵中还回响着：${alternatives.map(a => CHARACTERS[a].title).join('、')} ✨</div>` : '';
    const resultHtml = `
        <div style="text-align:center;">
            <div class="icon">🔮</div>
            <h2 class="serif-title gold-text" style="font-size:2rem;">${mainChar}</h2>
            <p style="color:#fbbf24; letter-spacing:2px;">${char.title} · ${char.mbti}</p>
            <p style="background:rgba(0,0,0,0.4); border-radius:30px; padding:0.3rem 1rem; display:inline-block;">${char.faction}</p>
            <div style="margin:1rem 0;">${traitsHtml}</div>
            <div class="quote" style="padding:1rem;"><p>“${char.quote}”</p></div>
            <p style="text-align:left; line-height:1.5;">${char.desc}</p>
            <div class="radar-container" id="radarCanvasWrap">
                <canvas id="radarCanvas" width="400" height="400" style="max-width:100%; height:auto; background:#0a0c15; border-radius:20px;"></canvas>
            </div>
            ${alternativesHtml}
            <p style="font-size:0.75rem; color:#aaa;">※ 塔罗五维：信念/行动/情感/原则/自信</p>
        </div>
    `;
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = resultHtml;
    const canvas = document.getElementById('radarCanvas');
    if (canvas) renderRadarChart(canvas, radarData);
}