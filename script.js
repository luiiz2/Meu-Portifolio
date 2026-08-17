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
    drawingCanvas.style.pointerEvents = 'none';
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
    
    // Event listeners para desenho - usando document para capturar melhor
    document.addEventListener('mousedown', handleDrawingStart);
    document.addEventListener('mousemove', handleDrawingMove);
    document.addEventListener('mouseup', handleDrawingEnd);
    document.addEventListener('mouseleave', handleDrawingEnd);
    
    // Suporte para touch (mobile)
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleDrawingEnd);
}

function handleDrawingStart(e) {
    // Não desenha se clicar em elementos interativos
    const target = e.target;
    if (target.closest('.social-button') || 
        target.closest('header') || 
        target.closest('a') ||
        target.closest('.pigeon-btn') ||
        target.closest('#flying-pigeon') ||
        target.closest('#pigeon-easter-egg') ||
        target.id === 'pigeon-easter-egg') {
        return;
    }
    
    // Ativa pointer events no canvas temporariamente para desenhar
    if (drawingCanvas) {
        drawingCanvas.style.pointerEvents = 'auto';
    }
    
    // Só desenha se o evento for no canvas ou em área vazia
    if (target === drawingCanvas || target === document.body || target === document.documentElement) {
        startDrawing(e);
    }
}

function handleDrawingMove(e) {
    if (isDrawing) {
        draw(e);
    }
}

function handleDrawingEnd(e) {
    stopDrawing();
}

function startDrawing(e) {
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
    if (target && (target.closest('.social-button') || 
                   target.closest('header') || 
                   target.closest('a') ||
                   target.closest('.pigeon-btn') ||
                   target.closest('#flying-pigeon') ||
                   target.closest('#pigeon-easter-egg') ||
                   target.id === 'pigeon-easter-egg')) {
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
    
    // Desativa pointer events no canvas quando não está desenhando
    if (drawingCanvas) {
        drawingCanvas.style.pointerEvents = 'none';
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
    
    // Esconde o cursor padrão apenas em desktop
    document.body.style.cursor = 'none';
    
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    cursor.style.position = 'fixed';
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.border = '2px solid rgba(255, 255, 255, 0.8)';
    cursor.style.borderRadius = '50%';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '10002';
    cursor.style.transition = 'transform 0.1s ease';
    cursor.style.display = 'none';
    cursor.style.boxShadow = 'none';
    cursor.style.textShadow = 'none';
    cursor.style.filter = 'none';
    document.body.appendChild(cursor);
    
    let isVisible = false;
    
    document.addEventListener('mousemove', (e) => {
        if (!isVisible) {
            cursor.style.display = 'block';
            isVisible = true;
        }
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
        isVisible = true;
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
        isVisible = false;
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
// EASTER EGG: MINIJOGO DO POMBO
// ============================================
let pigeonGameActive = false;
let pigeonElement = null;
let pigeonAnimation = null;
let pigeonMusic = null;
let pigeonSpeed = 3;
let pigeonDirection = { x: 1, y: 0.5 };

function initPigeonEasterEgg() {
    const pigeonBtn = document.getElementById('pigeon-easter-egg');
    pigeonMusic = document.getElementById('pigeon-music');
    
    if (!pigeonBtn) return;
    
    pigeonBtn.addEventListener('click', startPigeonGame);
}

function startPigeonGame(e) {
    if (pigeonGameActive) return;
    
    // Previne que o evento se propague
    if (e) {
        e.stopPropagation();
        e.preventDefault();
    }
    
    pigeonGameActive = true;
    
    // Esconde o botão
    const pigeonBtn = document.getElementById('pigeon-easter-egg');
    if (pigeonBtn) {
        pigeonBtn.style.display = 'none';
    }
    
    // Toca a música "Pegue o Pombo"
    if (pigeonMusic) {
        // Se você tiver o arquivo de áudio, descomente e ajuste o caminho:
        // pigeonMusic.src = 'audio/pegue-o-pombo.mp3';
        
        // Por enquanto, usa uma música de exemplo (substitua pelo arquivo real)
        if (!pigeonMusic.src || pigeonMusic.src.includes('about:blank')) {
            // Tenta tocar uma música de exemplo (você pode remover isso quando adicionar o arquivo real)
            pigeonMusic.volume = 0.3;
            // A música só tocará se você adicionar o arquivo de áudio no HTML
        }
        
        pigeonMusic.play().catch(e => {
            console.log('Não foi possível tocar a música. Adicione o arquivo de áudio no HTML:', e);
        });
    }
    
    // Cria o pombo
    createPigeon();
    
    // Inicia a animação do pombo após um pequeno delay para garantir que o elemento foi criado
    setTimeout(() => {
        animatePigeon();
    }, 100);
}

function createPigeon() {
    // Remove pombo anterior se existir
    if (pigeonElement) {
        pigeonElement.remove();
    }
    
    pigeonElement = document.createElement('img');
    pigeonElement.id = 'flying-pigeon';
    pigeonElement.src = 'img/pombo.png';
    pigeonElement.alt = 'Pombo';
    pigeonElement.style.position = 'fixed';
    pigeonElement.style.width = '60px';
    pigeonElement.style.height = '60px';
    pigeonElement.style.objectFit = 'contain';
    pigeonElement.style.zIndex = '10001';
    pigeonElement.style.cursor = 'crosshair';
    pigeonElement.style.userSelect = 'none';
    pigeonElement.style.pointerEvents = 'auto';
    pigeonElement.style.transition = 'transform 0.1s linear';
    
    // Posição inicial aleatória
    const startX = Math.random() * (window.innerWidth - 100);
    const startY = Math.random() * (window.innerHeight - 100);
    
    pigeonElement.style.left = startX + 'px';
    pigeonElement.style.top = startY + 'px';
    
    // Direção inicial aleatória
    pigeonDirection = {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2
    };
    
    // Normaliza a direção
    const magnitude = Math.sqrt(pigeonDirection.x ** 2 + pigeonDirection.y ** 2);
    pigeonDirection.x /= magnitude;
    pigeonDirection.y /= magnitude;
    
    document.body.appendChild(pigeonElement);
    
    // Adiciona evento de clique para abater o pombo
    pigeonElement.addEventListener('click', killPigeon);
    
    // Adiciona efeito de hover
    pigeonElement.addEventListener('mouseenter', () => {
        const currentScaleX = pigeonDirection.x > 0 ? 1 : -1;
        pigeonElement.style.transform = `scaleX(${currentScaleX * 1.2}) scaleY(1.2)`;
    });
    
    pigeonElement.addEventListener('mouseleave', () => {
        const currentScaleX = pigeonDirection.x > 0 ? 1 : -1;
        const rotation = Math.sin(Date.now() / 200) * 8;
        pigeonElement.style.transform = `scaleX(${currentScaleX}) rotate(${rotation}deg)`;
    });
}

function animatePigeon() {
    if (!pigeonGameActive || !pigeonElement) {
        return;
    }
    
    // Verifica se o elemento ainda existe no DOM
    if (!document.body.contains(pigeonElement)) {
        return;
    }
    
    const rect = pigeonElement.getBoundingClientRect();
    const pigeonWidth = rect.width || 60;
    const pigeonHeight = rect.height || 60;
    let currentX = parseFloat(pigeonElement.style.left) || 0;
    let currentY = parseFloat(pigeonElement.style.top) || 0;
    let newX = currentX + (pigeonDirection.x * pigeonSpeed);
    let newY = currentY + (pigeonDirection.y * pigeonSpeed);
    
    // Bate nas bordas e muda de direção
    if (newX <= 0 || newX >= window.innerWidth - pigeonWidth) {
        pigeonDirection.x *= -1;
        newX = Math.max(0, Math.min(window.innerWidth - pigeonWidth, newX));
    }
    
    if (newY <= 0 || newY >= window.innerHeight - pigeonHeight) {
        pigeonDirection.y *= -1;
        newY = Math.max(0, Math.min(window.innerHeight - pigeonHeight, newY));
    }
    
    // Ocasionalmente muda de direção aleatoriamente
    if (Math.random() < 0.02) {
        pigeonDirection.x = (Math.random() - 0.5) * 2;
        pigeonDirection.y = (Math.random() - 0.5) * 2;
        const magnitude = Math.sqrt(pigeonDirection.x ** 2 + pigeonDirection.y ** 2);
        pigeonDirection.x /= magnitude;
        pigeonDirection.y /= magnitude;
    }
    
    // Aplica animação de voo e inversão de direção
    const rotation = Math.sin(Date.now() / 200) * 8; // Animação de balanço
    const scaleX = pigeonDirection.x > 0 ? 1 : -1; // Inverte quando vai para esquerda
    pigeonElement.style.transform = `scaleX(${scaleX}) rotate(${rotation}deg)`;
    pigeonElement.style.left = newX + 'px';
    pigeonElement.style.top = newY + 'px';
    
    // Aumenta a velocidade gradualmente
    pigeonSpeed += 0.001;
    
    pigeonAnimation = requestAnimationFrame(animatePigeon);
}

function killPigeon() {
    if (!pigeonGameActive) return;
    
    // Para a animação
    if (pigeonAnimation) {
        cancelAnimationFrame(pigeonAnimation);
        pigeonAnimation = null;
    }
    
    // Para a música
    if (pigeonMusic) {
        pigeonMusic.pause();
        pigeonMusic.currentTime = 0;
    }
    
    // Efeito de morte do pombo com partículas
    if (pigeonElement) {
        const rect = pigeonElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Cria partículas de explosão
        createExplosionParticles(centerX, centerY);
        
        pigeonElement.style.transition = 'all 0.5s ease-out';
        pigeonElement.style.transform = 'rotate(720deg) scale(0)';
        pigeonElement.style.opacity = '0';
        
        setTimeout(() => {
            if (pigeonElement) {
                pigeonElement.remove();
                pigeonElement = null;
            }
        }, 500);
    }
    
    // Mostra mensagem de vitória
    showVictoryMessage();
    
    // Reseta o jogo
    setTimeout(() => {
        pigeonGameActive = false;
        pigeonSpeed = 3;
        const pigeonBtn = document.getElementById('pigeon-easter-egg');
        if (pigeonBtn) {
            pigeonBtn.style.display = 'flex';
        }
    }, 2000);
}

function createExplosionParticles(x, y) {
    const particleCount = 15;
    const colors = ['#ffffff', '#e0e0e0', '#b8b8b8'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '10001';
        particle.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 3 + Math.random() * 3;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let posX = x;
        let posY = y;
        let opacity = 1;
        let size = 6;
        
        function animate() {
            posX += vx;
            posY += vy + 1; // gravidade
            opacity -= 0.03;
            size *= 0.98;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        }
        
        animate();
    }
}

function showVictoryMessage() {
    const message = document.createElement('div');
    message.id = 'victory-message';
    message.textContent = '🎯 Pombo abatido!';
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.fontSize = '3rem';
    message.style.fontWeight = 'bold';
    message.style.color = '#ffffff';
    message.style.zIndex = '10001';
    message.style.textShadow = '0 0 20px rgba(255, 255, 255, 0.8)';
    message.style.animation = 'fadeInUp 0.5s ease-out';
    message.style.pointerEvents = 'none';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'fadeOut 0.5s ease-out forwards';
        setTimeout(() => {
            message.remove();
        }, 500);
    }, 1500);
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
    initPigeonEasterEgg();
    
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
        
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            to {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
        }
    `;
    document.head.appendChild(style);
});