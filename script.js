// ============================================
// EFEITO DE DIGITAÇÃO
// ============================================
const elementoTexto = document.getElementById("texto-digitado");

const frases = [
    "Software Developer"
];

let fraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function digitar() {
    const fraseAtual = frases[fraseIndex];

    if (isDeleting) {
        elementoTexto.innerText = fraseAtual.substring(0, charIndex - 1);
        charIndex--;
    } else {
        elementoTexto.innerText = fraseAtual.substring(0, charIndex + 1);
        charIndex++;
    }

    let velocidade = 100;

    if (isDeleting) {
        velocidade = 50;
    }

    if (!isDeleting && charIndex === fraseAtual.length) {
        velocidade = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        fraseIndex++;
        velocidade = 500;

        if (fraseIndex === frases.length) {
            fraseIndex = 0;
        }
    }

    setTimeout(digitar, velocidade);
}

// ============================================
// PARTÍCULAS QUE SEGUEM O MOUSE
// ============================================
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.size *= 0.98;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

let particles = [];
let mouseX = 0;
let mouseY = 0;

function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Cria partículas ao mover o mouse
        if (Math.random() > 0.7) {
            particles.push(new Particle(mouseX, mouseY));
        }
    });

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles = particles.filter(particle => {
            particle.update();
            particle.draw(ctx);
            return particle.life > 0;
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// ============================================
// SISTEMA DE DESENHO NA PÁGINA
// ============================================
let isDrawing = false;
let drawingCanvas = null;
let drawingCtx = null;
let lastX = 0;
let lastY = 0;
let drawingEnabled = false;

function initDrawingSystem() {
    // Cria canvas para desenho
    drawingCanvas = document.createElement('canvas');
    drawingCanvas.id = 'drawing-canvas';
    drawingCanvas.style.position = 'fixed';
    drawingCanvas.style.top = '0';
    drawingCanvas.style.left = '0';
    drawingCanvas.style.width = '100%';
    drawingCanvas.style.height = '100%';
    drawingCanvas.style.pointerEvents = 'auto';
    drawingCanvas.style.zIndex = '5000';
    drawingCanvas.style.opacity = '0.9';
    drawingCanvas.style.cursor = 'crosshair';
    document.body.appendChild(drawingCanvas);
    
    drawingCtx = drawingCanvas.getContext('2d');
    
    function resizeDrawingCanvas() {
        drawingCanvas.width = window.innerWidth;
        drawingCanvas.height = window.innerHeight;
    }
    
    resizeDrawingCanvas();
    window.addEventListener('resize', resizeDrawingCanvas);
    
    // Configurações do desenho
    drawingCtx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    drawingCtx.lineWidth = 2;
    drawingCtx.lineCap = 'round';
    drawingCtx.lineJoin = 'round';
    
    // Desenho sempre ativo
    drawingEnabled = true;
    document.body.classList.add('drawing-mode');
    
    // Event listeners para desenho
    drawingCanvas.addEventListener('mousedown', startDrawing);
    drawingCanvas.addEventListener('mousemove', draw);
    drawingCanvas.addEventListener('mouseup', stopDrawing);
    drawingCanvas.addEventListener('mouseleave', stopDrawing);
    
    // Suporte para touch (mobile)
    drawingCanvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    drawingCanvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    drawingCanvas.addEventListener('touchend', stopDrawing);
}

function startDrawing(e) {
    // Não desenha se estiver sobre elementos interativos
    const target = e.target;
    if (target.closest('.social-button') || target.closest('header') || target.closest('a')) {
        return;
    }
    
    isDrawing = true;
    lastX = e.clientX;
    lastY = e.clientY;
    
    // Inicia um novo caminho
    drawingCtx.beginPath();
    drawingCtx.moveTo(lastX, lastY);
}

function draw(e) {
    if (!isDrawing) return;
    
    // Não desenha se estiver sobre elementos interativos
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (target && (target.closest('.social-button') || target.closest('header') || target.closest('a'))) {
        stopDrawing();
        return;
    }
    
    const currentX = e.clientX;
    const currentY = e.clientY;
    
    // Desenha linha suave
    drawingCtx.lineTo(currentX, currentY);
    drawingCtx.stroke();
    
    lastX = currentX;
    lastY = currentY;
}

function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
    }
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = drawingCanvas.getBoundingClientRect();
    const mouseEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY
    };
    startDrawing(mouseEvent);
}

function handleTouchMove(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY
    };
    draw(mouseEvent);
}

// ============================================
// EFEITO DE RIPPLE NOS BOTÕES
// ============================================
function criarRipple(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// ============================================
// CURSOR PERSONALIZADO COM TRAIL
// ============================================
let cursorTrail = [];
const trailLength = 10;

function initCursorTrail() {
    // Verifica se é dispositivo móvel
    if (window.matchMedia('(hover: none)').matches || window.innerWidth <= 480) {
        return; // Não inicializa em dispositivos móveis
    }
    
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    cursor.style.position = 'fixed';
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.border = '2px solid rgba(255, 255, 255, 0.8)';
    cursor.style.borderRadius = '50%';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '10001';
    cursor.style.transition = 'transform 0.1s ease';
    cursor.style.display = 'none';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.display = 'block';
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        
        // Adiciona ponto ao trail
        cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        if (cursorTrail.length > trailLength) {
            cursorTrail.shift();
        }
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.display = 'block';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
    });
}

// ============================================
// EFEITO DE HOVER NOS BOTÕES SOCIAIS
// ============================================
function initButtonEffects() {
    const buttons = document.querySelectorAll('.social-button');
    
    buttons.forEach(button => {
        // Ripple effect
        button.addEventListener('click', criarRipple);
        
        // Efeito de tilt 3D
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            button.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
}

// ============================================
// ANIMAÇÃO DE ENTRADA DOS ELEMENTOS
// ============================================
function initEntranceAnimations() {
    const elements = document.querySelectorAll('header, .social-links');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
}

// ============================================
// EASTER EGG: COMANDO SECRETO (removido - desenho sempre ativo)
// ============================================
function initEasterEgg() {
    // Desenho sempre ativo, não precisa de easter egg
}

// ============================================
// EFEITO DE PARALLAX SUTIL
// ============================================
function initParallax() {
    // Desabilita parallax em dispositivos móveis
    if (window.matchMedia('(hover: none)').matches || window.innerWidth <= 480) {
        return;
    }
    
    const header = document.querySelector('header');
    
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        if (header) {
            header.style.transform = `translate(${x}px, ${y}px)`;
        }
    });
}

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    digitar();
    initParticles();
    initCursorTrail();
    initButtonEffects();
    initEntranceAnimations();
    initEasterEgg();
    initParallax();
    initDrawingSystem();
    
    // Adiciona estilo para o ripple
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .social-button {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
});