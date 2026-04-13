export function initStars() {
    const canvas = document.createElement('canvas');
    canvas.id = 'starsCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    let meteors = [];
    
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initStarsArray();
    }
    
    function initStarsArray() {
        stars = [];
        const starCount = Math.floor(width * height / 8000);
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.8 + 0.2,
                speed: 0.005 + Math.random() * 0.01,
                phase: Math.random() * Math.PI * 2
            });
        }
    }
    
    function drawStars() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);
        
        // 绘制星星
        for (let star of stars) {
            const alpha = star.alpha + Math.sin(Date.now() * star.speed + star.phase) * 0.3;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 245, 200, ${Math.min(0.9, Math.max(0.1, alpha))})`;
            ctx.fill();
        }
        
        // 绘制流星（简单实现）
        if (Math.random() < 0.005) {
            meteors.push({
                x: Math.random() * width,
                y: Math.random() * height * 0.3,
                vx: (Math.random() - 0.5) * 8 - 4,
                vy: Math.random() * 5 + 3,
                life: 1.0,
                length: 40
            });
        }
        for (let i = 0; i < meteors.length; i++) {
            const m = meteors[i];
            ctx.beginPath();
            ctx.moveTo(m.x, m.y);
            ctx.lineTo(m.x - m.vx * m.length, m.y - m.vy * m.length);
            ctx.strokeStyle = `rgba(255, 255, 200, ${m.life * 0.8})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            m.x += m.vx;
            m.y += m.vy;
            m.life -= 0.02;
            if (m.life <= 0 || m.x < 0 || m.x > width || m.y > height) {
                meteors.splice(i, 1);
                i--;
            }
        }
        
        requestAnimationFrame(drawStars);
    }
    
    window.addEventListener('resize', resize);
    resize();
    drawStars();
}