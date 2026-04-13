export function initParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    // 可选：清空容器，避免重复添加（如果希望完全重置，取消注释下一行）
    // container.innerHTML = '';
    for (let i = 0; i < 200; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        const size = Math.random() * 4 + 1;
        const duration = Math.random() * 8 + 4;
        const delay = Math.random() * 5;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        // 强制指定动画名称、时长、延迟、无限循环
        p.style.animation = `floatParticle ${duration}s linear ${delay}s infinite`;
        container.appendChild(p);
    }
}