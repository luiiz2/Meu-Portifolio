// ============================================
// EFEITO DE DIGITAÇÃO
// ============================================
const elementoTexto = document.getElementById("texto-digitado");

const frases = [
    "Software Developer",
    "Full Stack Developer",
    "Web Developer"
];

let fraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function digitar() {
    if (!elementoTexto) return;
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
// PARTÍCULAS SUTIS DE FUNDO
// ============================================
function initParticles() {
    const particleCanvas = document.createElement('canvas');
    particleCanvas.id = 'particles-canvas';
    particleCanvas.style.position = 'fixed';
    particleCanvas.style.top = '0';
    particleCanvas.style.left = '0';
    particleCanvas.style.width = '100%';
    particleCanvas.style.height = '100%';
    particleCanvas.style.pointerEvents = 'none';
    particleCanvas.style.zIndex = '1';
    particleCanvas.style.opacity = '0.6';
    document.body.prepend(particleCanvas);

    const ctx = particleCanvas.getContext('2d');
    let width = particleCanvas.width = window.innerWidth;
    let height = particleCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = particleCanvas.width = window.innerWidth;
        height = particleCanvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(width > 768 ? 40 : 20, 50);

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.8 + 0.5,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.5 + 0.2
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            ctx.shadowBlur = 4;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
            ctx.fill();
        });

        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}

// ============================================
// SISTEMA DE DESENHO NA PÁGINA
// ============================================
let isDrawing = false;
let hasDrawn = false;
let drawingCanvas = null;
let drawingCtx = null;
let lastX = 0;
let lastY = 0;

function initDrawingSystem() {
    drawingCanvas = document.createElement('canvas');
    drawingCanvas.id = 'drawing-canvas';
    drawingCanvas.style.position = 'fixed';
    drawingCanvas.style.top = '0';
    drawingCanvas.style.left = '0';
    drawingCanvas.style.width = '100%';
    drawingCanvas.style.height = '100%';
    drawingCanvas.style.pointerEvents = 'none';
    drawingCanvas.style.zIndex = '5000';
    drawingCanvas.style.opacity = '0.85';
    document.body.appendChild(drawingCanvas);
    
    drawingCtx = drawingCanvas.getContext('2d');
    
    function resizeDrawingCanvas() {
        if (!drawingCanvas) return;
        drawingCanvas.width = window.innerWidth;
        drawingCanvas.height = window.innerHeight;
        drawingCtx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        drawingCtx.lineWidth = 2;
        drawingCtx.lineCap = 'round';
        drawingCtx.lineJoin = 'round';
    }
    
    resizeDrawingCanvas();
    window.addEventListener('resize', resizeDrawingCanvas);
    
    document.addEventListener('mousedown', handleDrawingStart);
    document.addEventListener('mousemove', handleDrawingMove);
    document.addEventListener('mouseup', handleDrawingEnd);
    document.addEventListener('mouseleave', handleDrawingEnd);
    
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleDrawingEnd);

    // Botão Limpar Tela
    const clearBtn = document.getElementById('clear-drawing-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            clearCanvas();
        });
    }
}

function clearCanvas() {
    if (!drawingCanvas || !drawingCtx) return;
    drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    hasDrawn = false;
    const clearBtn = document.getElementById('clear-drawing-btn');
    if (clearBtn) {
        clearBtn.classList.remove('visible');
    }
}

function isInteractiveTarget(target) {
    if (!target) return false;
    return !!(
        target.closest('.social-button') || 
        target.closest('header') || 
        target.closest('footer') ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.pigeon-btn') ||
        target.closest('.clear-drawing-btn') ||
        target.closest('#flying-pigeon') ||
        target.closest('#pigeon-easter-egg') ||
        target.closest('#pigeon-hud') ||
        target.closest('.pigeon-hud') ||
        target.closest('#pigeon-gameover-modal') ||
        target.id === 'pigeon-easter-egg' ||
        target.id === 'flying-pigeon' ||
        target.id === 'pigeon-gameover-modal'
    );
}

function handleDrawingStart(e) {
    if (isInteractiveTarget(e.target)) return;
    if (pigeonGameActive) return;

    startDrawing(e);
}

function handleDrawingMove(e) {
    if (isDrawing) {
        draw(e);
    }
}

function handleDrawingEnd() {
    stopDrawing();
}

function startDrawing(e) {
    isDrawing = true;
    lastX = e.clientX;
    lastY = e.clientY;
    
    drawingCtx.beginPath();
    drawingCtx.moveTo(lastX, lastY);
}

function draw(e) {
    if (!isDrawing) return;
    
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (isInteractiveTarget(target)) {
        stopDrawing();
        return;
    }
    
    const currentX = e.clientX;
    const currentY = e.clientY;
    
    drawingCtx.lineTo(currentX, currentY);
    drawingCtx.stroke();
    
    lastX = currentX;
    lastY = currentY;

    if (!hasDrawn) {
        hasDrawn = true;
        const clearBtn = document.getElementById('clear-drawing-btn');
        if (clearBtn && !pigeonGameActive) {
            clearBtn.classList.add('visible');
        }
    }
}

function stopDrawing() {
    isDrawing = false;
}

function handleTouchStart(e) {
    if (!e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (isInteractiveTarget(target) || pigeonGameActive) return;

    startDrawing({ clientX: touch.clientX, clientY: touch.clientY });
}

function handleTouchMove(e) {
    if (!isDrawing || !e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    draw({ clientX: touch.clientX, clientY: touch.clientY });
}

// ============================================
// CURSOR PERSONALIZADO
// ============================================
function initCursorTrail() {
    if (window.matchMedia('(hover: none)').matches || window.innerWidth <= 768) {
        return;
    }
    
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    cursor.style.position = 'fixed';
    cursor.style.width = '18px';
    cursor.style.height = '18px';
    cursor.style.border = '2px solid rgba(255, 255, 255, 0.7)';
    cursor.style.borderRadius = '50%';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '10002';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.transition = 'transform 0.08s ease, border-color 0.2s ease, width 0.2s ease, height 0.2s ease';
    cursor.style.display = 'none';
    document.body.appendChild(cursor);
    
    let isVisible = false;
    
    document.addEventListener('mousemove', (e) => {
        if (!isVisible) {
            cursor.style.display = 'block';
            isVisible = true;
        }
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        const target = document.elementFromPoint(e.clientX, e.clientY);
        if (target && isInteractiveTarget(target)) {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.4)';
            cursor.style.borderColor = 'rgba(255, 255, 255, 1)';
            cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
        } else {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.borderColor = 'rgba(255, 255, 255, 0.7)';
            cursor.style.backgroundColor = 'transparent';
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
// EFEITOS DE RIPPLE E 3D TILT
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

function initButtonEffects() {
    const buttons = document.querySelectorAll('.social-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', criarRipple);
        
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 8;
            const rotateY = (centerX - x) / 8;
            
            button.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.02)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
}

function initEntranceAnimations() {
    const elements = document.querySelectorAll('header, .social-links, .pigeon-btn, .portfolio-footer');
    elements.forEach(el => {
        el.style.opacity = '1';
    });
}

function initParallax() {
    if (window.matchMedia('(hover: none)').matches || window.innerWidth <= 768) {
        return;
    }
    
    const header = document.querySelector('header');
    
    document.addEventListener('mousemove', (e) => {
        if (pigeonGameActive) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 15;
        const y = (e.clientY / window.innerHeight - 0.5) * 15;
        
        if (header) {
            header.style.transform = `translate(${x}px, ${y}px)`;
        }
    });
}

// ============================================
// MOTOR DE ÁUDIO SINTETIZADO (Web Audio API)
// ============================================
let audioCtx = null;
let sfxEnabled = true;
let musicMode = 'pigeon'; // 'pigeon' | 'chill' | 'off'
let musicInterval = null;

function getAudioContext() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioCtx = new AudioContext();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

const SoundFX = {
    playNote(freq, type = 'square', duration = 0.1, gainVal = 0.035) {
        if (!freq) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(gainVal, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {}
    },

    playShoot() {
        if (!sfxEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(750, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) {}
    },

    playHit() {
        if (!sfxEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(280, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.22);
            gain.gain.setValueAtTime(0.18, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.22);
            
            setTimeout(() => {
                SoundFX.playNote(520, 'sine', 0.1, 0.08);
                setTimeout(() => SoundFX.playNote(390, 'sine', 0.14, 0.08), 50);
            }, 40);
        } catch (e) {}
    },

    playEscape() {
        if (!sfxEnabled) return;
        try {
            const notes = [440, 392, 349, 261];
            notes.forEach((freq, idx) => {
                setTimeout(() => SoundFX.playNote(freq, 'sawtooth', 0.12, 0.07), idx * 75);
            });
        } catch (e) {}
    },

    playLoseLife() {
        if (!sfxEnabled) return;
        try {
            SoundFX.playNote(220, 'sawtooth', 0.15, 0.12);
            setTimeout(() => SoundFX.playNote(164.8, 'sawtooth', 0.22, 0.14), 110);
        } catch (e) {}
    },

    playGameOver() {
        if (!sfxEnabled) return;
        try {
            const notes = [293.7, 277.2, 261.6, 246.9, 196.0];
            notes.forEach((freq, idx) => {
                setTimeout(() => SoundFX.playNote(freq, 'triangle', 0.25, 0.1), idx * 190);
            });
        } catch (e) {}
    },

    playStart() {
        if (!sfxEnabled) return;
        const notes = [261.63, 329.63, 392.00, 523.25];
        notes.forEach((freq, idx) => {
            setTimeout(() => SoundFX.playNote(freq, 'square', 0.1, 0.06), idx * 70);
        });
    },

    startBackgroundMusic() {
        if (musicInterval) clearInterval(musicInterval);
        if (musicMode === 'off' || !pigeonGameActive) return;

        if (musicMode === 'pigeon') {
            const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23;
            const G4 = 392.00, A4 = 440.00, B4 = 493.88, C5 = 523.25;
            const G3 = 196.00, C3 = 130.81;

            const pigeonMelody = [
                G4, G4, E4, C4, G4, G4, E4, C4,
                G4, G4, A4, B4, C5, 0, C5, 0,
                G4, G4, E4, C4, G4, G4, E4, C4,
                D4, D4, E4, F4, D4, 0, C4, 0,
                C4, D4, E4, F4, G4, G4, A4, B4,
                C5, C5, B4, A4, G4, F4, E4, D4,
                C4, E4, G4, C5, 0, 0, 0, 0
            ];

            let step = 0;
            musicInterval = setInterval(() => {
                if (!pigeonGameActive || musicMode !== 'pigeon') {
                    clearInterval(musicInterval);
                    return;
                }
                const freq = pigeonMelody[step % pigeonMelody.length];
                if (freq > 0) {
                    SoundFX.playNote(freq, 'triangle', 0.11, 0.025);
                }
                if (step % 4 === 0) {
                    SoundFX.playNote(step % 8 === 0 ? C3 : G3, 'sine', 0.12, 0.03);
                }
                step++;
            }, 145);

        } else if (musicMode === 'chill') {
            const chillNotes = [
                261.6, 329.6, 392.0, 493.9, 523.3, 392.0, 329.6, 261.6,
                220.0, 261.6, 329.6, 392.0, 440.0, 329.6, 261.6, 220.0,
                174.6, 220.0, 261.6, 329.6, 349.2, 261.6, 220.0, 174.6,
                196.0, 261.6, 293.7, 392.0, 440.0, 293.7, 261.6, 196.0
            ];

            let step = 0;
            musicInterval = setInterval(() => {
                if (!pigeonGameActive || musicMode !== 'chill') {
                    clearInterval(musicInterval);
                    return;
                }
                const freq = chillNotes[step % chillNotes.length];
                SoundFX.playNote(freq, 'sine', 0.35, 0.018);
                step++;
            }, 240);
        }
    },

    stopMusic() {
        if (musicInterval) {
            clearInterval(musicInterval);
            musicInterval = null;
        }
    }
};

// ============================================
// EASTER EGG: MINIJOGO DO POMBO
// ============================================
let pigeonGameActive = false;
let pigeonElement = null;
let pigeonAnimation = null;
let pigeonSpeed = 4.5;
let pigeonDirection = { x: 1, y: 0.6 };
let pigeonScore = 0;
let pigeonHighScore = 0;

try {
    pigeonHighScore = parseInt(localStorage.getItem('pigeonHighScore') || '0', 10);
    if (isNaN(pigeonHighScore)) pigeonHighScore = 0;
} catch (e) {
    pigeonHighScore = 0;
}

let pigeonLives = 3;
let pigeonHud = null;
let escapeTimeout = null;
let escapeTimerInterval = null;
let pigeonMaxTime = 6000;
let pigeonTimeRemaining = 6000;

function initPigeonEasterEgg() {
    const pigeonBtn = document.getElementById('pigeon-easter-egg');
    if (!pigeonBtn) return;
    
    pigeonBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        startPigeonGame();
    });

    pigeonBtn.addEventListener('touchend', (e) => {
        e.stopPropagation();
        e.preventDefault();
        startPigeonGame();
    });
}

function getHeartsDisplay(lives) {
    let str = '';
    for (let i = 0; i < 3; i++) {
        str += i < lives ? '❤️' : '🖤';
    }
    return str;
}

function getMusicModeLabel() {
    if (musicMode === 'pigeon') return '🎵 Pegue o Pombo';
    if (musicMode === 'chill') return '🌙 Tranquila';
    return '🔇 Sem Música';
}

function createPigeonHUD() {
    if (pigeonHud) pigeonHud.remove();

    pigeonHud = document.createElement('div');
    pigeonHud.id = 'pigeon-hud';
    pigeonHud.className = 'pigeon-hud';
    pigeonHud.innerHTML = `
        <div class="hud-item hud-title">🐦 <span>PEGUE O POMBO!</span></div>
        <div class="hud-item hud-lives">Vidas: <span id="hud-lives-val">${getHeartsDisplay(pigeonLives)}</span></div>
        <div class="hud-item hud-score">🎯 Placar: <b id="hud-score-val">${pigeonScore}</b></div>
        <div class="hud-item hud-record">🏆 Recorde: <b id="hud-record-val">${pigeonHighScore}</b></div>
        <div class="hud-item hud-timer-box" title="Tempo restante antes do pombo fugir">
            ⏳ <div class="hud-timer-bar"><div id="hud-timer-progress"></div></div>
        </div>
        <div class="hud-controls">
            <button id="pigeon-music-btn" class="hud-btn" title="Alternar Música (Pegue o Pombo / Tranquila / Desligada)">${getMusicModeLabel()}</button>
            <button id="pigeon-sfx-btn" class="hud-btn" title="Ligar/Desligar Efeitos Sonoros">${sfxEnabled ? '🔊 SFX' : '🔇 SFX'}</button>
            <button id="pigeon-exit-btn" class="hud-btn hud-btn-exit" title="Sair do Jogo">✕ Sair</button>
        </div>
    `;

    document.body.appendChild(pigeonHud);

    const musicBtn = document.getElementById('pigeon-music-btn');
    if (musicBtn) {
        musicBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (musicMode === 'pigeon') {
                musicMode = 'chill';
            } else if (musicMode === 'chill') {
                musicMode = 'off';
            } else {
                musicMode = 'pigeon';
            }
            musicBtn.textContent = getMusicModeLabel();
            SoundFX.startBackgroundMusic();
        });
    }

    const sfxBtn = document.getElementById('pigeon-sfx-btn');
    if (sfxBtn) {
        sfxBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sfxEnabled = !sfxEnabled;
            sfxBtn.textContent = sfxEnabled ? '🔊 SFX' : '🔇 SFX';
        });
    }

    const exitBtn = document.getElementById('pigeon-exit-btn');
    if (exitBtn) {
        exitBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            stopPigeonGame();
        });
    }
}

function updatePigeonHUD() {
    const scoreVal = document.getElementById('hud-score-val');
    const recordVal = document.getElementById('hud-record-val');
    const livesVal = document.getElementById('hud-lives-val');
    if (scoreVal) scoreVal.textContent = pigeonScore;
    if (recordVal) recordVal.textContent = pigeonHighScore;
    if (livesVal) livesVal.textContent = getHeartsDisplay(pigeonLives);
}

function updateTimerProgress(percentage) {
    const progressBar = document.getElementById('hud-timer-progress');
    if (progressBar) {
        progressBar.style.width = Math.max(0, Math.min(100, percentage)) + '%';
        if (percentage < 30) {
            progressBar.style.backgroundColor = '#ff3344';
        } else if (percentage < 60) {
            progressBar.style.backgroundColor = '#ffbb00';
        } else {
            progressBar.style.backgroundColor = '#00ffcc';
        }
    }
}

function startPigeonGame() {
    if (pigeonGameActive) return;
    
    const existingModal = document.getElementById('pigeon-gameover-modal');
    if (existingModal) existingModal.remove();

    getAudioContext();
    pigeonGameActive = true;
    pigeonScore = 0;
    pigeonLives = 3;
    pigeonSpeed = 4.5;
    pigeonMaxTime = 6000;
    
    document.body.classList.add('pigeon-game-active');

    const pigeonBtn = document.getElementById('pigeon-easter-egg');
    if (pigeonBtn) {
        pigeonBtn.style.transform = 'scale(0)';
        setTimeout(() => { pigeonBtn.style.display = 'none'; }, 300);
    }

    const clearBtn = document.getElementById('clear-drawing-btn');
    if (clearBtn) {
        clearBtn.classList.remove('visible');
    }
    
    createPigeonHUD();
    SoundFX.playStart();
    SoundFX.startBackgroundMusic();
    
    showBannerMessage('🎯 PEGUE O POMBO! Não deixe ele fugir!');
    
    spawnNextRound();

    window.addEventListener('click', handleGameShot);
}

function spawnNextRound() {
    if (!pigeonGameActive) return;
    
    clearTimers();
    createPigeon();
    
    pigeonTimeRemaining = pigeonMaxTime;
    updateTimerProgress(100);

    const intervalStep = 50;
    escapeTimerInterval = setInterval(() => {
        if (!pigeonGameActive) {
            clearInterval(escapeTimerInterval);
            return;
        }
        pigeonTimeRemaining -= intervalStep;
        const pct = (pigeonTimeRemaining / pigeonMaxTime) * 100;
        updateTimerProgress(pct);

        if (pigeonTimeRemaining <= 1800 && pigeonElement) {
            pigeonElement.classList.add('pigeon-warning');
        }

        if (pigeonTimeRemaining <= 0) {
            clearInterval(escapeTimerInterval);
            pigeonEscape();
        }
    }, intervalStep);

    setTimeout(() => {
        if (pigeonGameActive) {
            animatePigeon();
        }
    }, 150);
}

function clearTimers() {
    if (escapeTimerInterval) {
        clearInterval(escapeTimerInterval);
        escapeTimerInterval = null;
    }
    if (escapeTimeout) {
        clearTimeout(escapeTimeout);
        escapeTimeout = null;
    }
}

function handleGameShot(e) {
    if (!pigeonGameActive) return;
    if (e.target && isInteractiveTarget(e.target)) return;
    SoundFX.playShoot();
}

function stopPigeonGame() {
    pigeonGameActive = false;
    clearTimers();
    SoundFX.stopMusic();
    window.removeEventListener('click', handleGameShot);
    
    document.body.classList.remove('pigeon-game-active');

    if (pigeonAnimation) {
        cancelAnimationFrame(pigeonAnimation);
        pigeonAnimation = null;
    }

    if (pigeonElement) {
        pigeonElement.remove();
        pigeonElement = null;
    }

    if (pigeonHud) {
        pigeonHud.remove();
        pigeonHud = null;
    }

    const modal = document.getElementById('pigeon-gameover-modal');
    if (modal) modal.remove();

    const pigeonBtn = document.getElementById('pigeon-easter-egg');
    if (pigeonBtn) {
        pigeonBtn.style.display = 'flex';
        setTimeout(() => {
            pigeonBtn.style.transform = 'scale(1)';
        }, 50);
    }

    if (hasDrawn) {
        const clearBtn = document.getElementById('clear-drawing-btn');
        if (clearBtn) clearBtn.classList.add('visible');
    }
}

function createPigeon() {
    if (pigeonElement) {
        pigeonElement.remove();
    }
    
    pigeonElement = document.createElement('img');
    pigeonElement.id = 'flying-pigeon';
    pigeonElement.src = 'img/pombo.png';
    pigeonElement.alt = 'Pombo Voador';
    pigeonElement.className = 'flying-pigeon-element';
    
    const margin = 80;
    const maxX = Math.max(window.innerWidth - margin * 2, 200);
    const maxY = Math.max(window.innerHeight - margin * 2, 200);
    const startX = margin + Math.random() * maxX;
    const startY = margin + Math.random() * maxY;
    
    pigeonElement.style.left = startX + 'px';
    pigeonElement.style.top = startY + 'px';
    
    const angle = Math.random() * Math.PI * 2;
    pigeonDirection = {
        x: Math.cos(angle) || 1,
        y: Math.sin(angle) || 0.5
    };
    
    document.body.appendChild(pigeonElement);
    
    pigeonElement.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        killPigeon();
    });

    pigeonElement.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        e.preventDefault();
        killPigeon();
    }, { passive: false });
}

function animatePigeon() {
    if (!pigeonGameActive || !pigeonElement) return;
    if (!document.body.contains(pigeonElement)) return;
    
    const pigeonWidth = pigeonElement.offsetWidth || 65;
    const pigeonHeight = pigeonElement.offsetHeight || 65;
    let currentX = parseFloat(pigeonElement.style.left) || 0;
    let currentY = parseFloat(pigeonElement.style.top) || 0;
    
    let newX = currentX + (pigeonDirection.x * pigeonSpeed);
    let newY = currentY + (pigeonDirection.y * pigeonSpeed);
    
    const boundMargin = 20;
    if (newX <= boundMargin) {
        pigeonDirection.x = Math.abs(pigeonDirection.x);
        newX = boundMargin;
    } else if (newX >= window.innerWidth - pigeonWidth - boundMargin) {
        pigeonDirection.x = -Math.abs(pigeonDirection.x);
        newX = window.innerWidth - pigeonWidth - boundMargin;
    }
    
    if (newY <= boundMargin + 70) {
        pigeonDirection.y = Math.abs(pigeonDirection.y);
        newY = boundMargin + 70;
    } else if (newY >= window.innerHeight - pigeonHeight - boundMargin) {
        pigeonDirection.y = -Math.abs(pigeonDirection.y);
        newY = window.innerHeight - pigeonHeight - boundMargin;
    }
    
    if (Math.random() < 0.035) {
        const randAngle = (Math.random() - 0.5) * 1.3;
        const cos = Math.cos(randAngle);
        const sin = Math.sin(randAngle);
        const newDirX = pigeonDirection.x * cos - pigeonDirection.y * sin;
        const newDirY = pigeonDirection.x * sin + pigeonDirection.y * cos;
        pigeonDirection.x = newDirX;
        pigeonDirection.y = newDirY;
    }
    
    const wingFlap = Math.sin(Date.now() / 110) * 12;
    const scaleX = pigeonDirection.x >= 0 ? 1 : -1;
    
    pigeonElement.style.transform = `scaleX(${scaleX}) rotate(${wingFlap}deg)`;
    pigeonElement.style.left = newX + 'px';
    pigeonElement.style.top = newY + 'px';
    
    pigeonAnimation = requestAnimationFrame(animatePigeon);
}

function killPigeon() {
    if (!pigeonGameActive || !pigeonElement) return;
    
    clearTimers();

    if (pigeonAnimation) {
        cancelAnimationFrame(pigeonAnimation);
        pigeonAnimation = null;
    }
    
    pigeonScore++;
    let isNewRecord = false;
    if (pigeonScore > pigeonHighScore) {
        pigeonHighScore = pigeonScore;
        try {
            localStorage.setItem('pigeonHighScore', pigeonHighScore.toString());
        } catch (e) {}
        isNewRecord = true;
    }
    updatePigeonHUD();
    
    SoundFX.playHit();
    
    const rect = pigeonElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    createFeatherExplosion(centerX, centerY);
    showFloatingPoints(centerX, centerY, isNewRecord ? `+100 🏆 RECORDE!` : `+100 🎯`);
    
    pigeonElement.style.transition = 'transform 0.35s ease-out, opacity 0.35s ease-out';
    pigeonElement.style.transform = 'scale(0) rotate(720deg)';
    pigeonElement.style.opacity = '0';
    
    setTimeout(() => {
        if (pigeonElement) {
            pigeonElement.remove();
            pigeonElement = null;
        }
        
        pigeonSpeed = Math.min(pigeonSpeed + 0.5, 12);
        pigeonMaxTime = Math.max(3200, pigeonMaxTime - 250);
        
        if (pigeonGameActive) {
            spawnNextRound();
        }
    }, 400);
}

function pigeonEscape() {
    if (!pigeonGameActive || !pigeonElement) return;
    
    clearTimers();

    if (pigeonAnimation) {
        cancelAnimationFrame(pigeonAnimation);
        pigeonAnimation = null;
    }

    pigeonLives--;
    updatePigeonHUD();
    SoundFX.playEscape();
    SoundFX.playLoseLife();

    document.body.classList.add('screen-shake');
    setTimeout(() => document.body.classList.remove('screen-shake'), 400);

    pigeonElement.style.transition = 'transform 0.6s ease-in, top 0.6s ease-in, opacity 0.6s ease-in';
    pigeonElement.style.top = '-150px';
    pigeonElement.style.transform = 'scale(1.5) rotate(-30deg)';
    pigeonElement.style.opacity = '0';

    showBannerMessage(`💨 O POMBO FUGIU! Restam ${pigeonLives} vida(s)`);

    setTimeout(() => {
        if (pigeonElement) {
            pigeonElement.remove();
            pigeonElement = null;
        }

        if (pigeonLives <= 0) {
            triggerGameOver();
        } else if (pigeonGameActive) {
            spawnNextRound();
        }
    }, 700);
}

// ============================================
// SISTEMA DE TABELA DE RECORDES (LEADERBOARD)
// ============================================
function getLeaderboard() {
    try {
        const data = localStorage.getItem('pigeonLeaderboard');
        if (!data) return [];
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
            return parsed.sort((a, b) => b.score - a.score);
        }
        return [];
    } catch (e) {
        return [];
    }
}

function saveLeaderboard(list) {
    try {
        localStorage.setItem('pigeonLeaderboard', JSON.stringify(list));
    } catch (e) {}
}

function escapeHtml(str) {
    return (str || '').replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

function savePlayerScore(rawName, score) {
    const name = (rawName || '').trim();
    if (!name) {
        return { error: 'Por favor, digite seu nome ou apelido!' };
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });

    const leaderboard = getLeaderboard();
    const existingIndex = leaderboard.findIndex(item => item.name.toLowerCase() === name.toLowerCase());

    if (existingIndex !== -1) {
        const existing = leaderboard[existingIndex];
        if (score > existing.score) {
            const oldScore = existing.score;
            existing.score = score;
            existing.date = dateStr;
            existing.name = name; // Mantém a grafia mais recente
            leaderboard.sort((a, b) => b.score - a.score);
            saveLeaderboard(leaderboard);
            const rank = leaderboard.findIndex(item => item.name.toLowerCase() === name.toLowerCase()) + 1;
            return {
                status: 'improved',
                name: existing.name,
                oldScore: oldScore,
                newScore: score,
                rank: rank
            };
        } else {
            return {
                status: 'not_improved',
                name: existing.name,
                oldScore: existing.score,
                currentScore: score
            };
        }
    } else {
        leaderboard.push({ name: name, score: score, date: dateStr });
        leaderboard.sort((a, b) => b.score - a.score);
        saveLeaderboard(leaderboard);
        const rank = leaderboard.findIndex(item => item.name.toLowerCase() === name.toLowerCase()) + 1;
        return {
            status: 'new_entry',
            name: name,
            score: score,
            rank: rank
        };
    }
}

function renderLeaderboardRows(highlightName = null) {
    const list = getLeaderboard();
    if (list.length === 0) {
        return `<div class="leaderboard-empty">🏆 Nenhum recorde salvo ainda. Seja o primeiro a registrar!</div>`;
    }

    let rowsHtml = `
        <table class="leaderboard-table">
            <thead>
                <tr>
                    <th class="col-rank">#</th>
                    <th class="col-name">Jogador</th>
                    <th class="col-score">Pombos</th>
                    <th class="col-date">Data</th>
                </tr>
            </thead>
            <tbody>
    `;

    list.slice(0, 8).forEach((item, index) => {
        const isCurrent = highlightName && item.name.toLowerCase() === highlightName.toLowerCase();
        let medal = `${index + 1}º`;
        if (index === 0) medal = '🥇 1º';
        else if (index === 1) medal = '🥈 2º';
        else if (index === 2) medal = '🥉 3º';

        rowsHtml += `
            <tr class="leaderboard-row ${isCurrent ? 'current-player-row' : ''}">
                <td class="col-rank">${medal}</td>
                <td class="col-name"><strong>${escapeHtml(item.name)}</strong></td>
                <td class="col-score"><span class="score-badge">${item.score}</span></td>
                <td class="col-date">${item.date || '-'}</td>
            </tr>
        `;
    });

    rowsHtml += `
            </tbody>
        </table>
    `;

    return rowsHtml;
}

function triggerGameOver() {
    pigeonGameActive = false;
    clearTimers();
    SoundFX.stopMusic();
    SoundFX.playGameOver();
    window.removeEventListener('click', handleGameShot);

    if (pigeonHud) {
        pigeonHud.remove();
        pigeonHud = null;
    }

    const modal = document.createElement('div');
    modal.id = 'pigeon-gameover-modal';
    modal.className = 'pigeon-modal-overlay';
    modal.innerHTML = `
        <div class="pigeon-modal-card leaderboard-modal">
            <div class="gameover-icon">☠️</div>
            <h2>FIM DE JOGO!</h2>
            <p class="gameover-subtitle">O pombo conseguiu escapar e suas vidas acabaram!</p>
            
            <div class="gameover-stats">
                <div class="stat-box">
                    <span class="stat-label">Pombos Abatidos</span>
                    <span class="stat-value">${pigeonScore}</span>
                </div>
                <div class="stat-box">
                    <span class="stat-label">Melhor Recorde Geral</span>
                    <span class="stat-value record">${pigeonHighScore}</span>
                </div>
            </div>

            <!-- Seção de Salvar Nome no Ranking -->
            <div class="leaderboard-save-box">
                <label for="player-name-input" class="save-label">Digite seu nome para salvar no Ranking:</label>
                <div class="save-input-group">
                    <input type="text" id="player-name-input" placeholder="Seu nome ou apelido..." maxlength="18" autocomplete="off" />
                    <button id="btn-save-score" class="game-action-btn btn-save" type="button">Salvar 💾</button>
                </div>
                <div id="ranking-feedback" class="ranking-feedback"></div>
            </div>

            <!-- Tabela de Classificação -->
            <div class="leaderboard-section">
                <div class="leaderboard-title">🏆 TABELA DE RECORDES</div>
                <div id="leaderboard-table-container" class="leaderboard-table-container">
                    ${renderLeaderboardRows()}
                </div>
            </div>

            <div class="gameover-actions">
                <button id="btn-replay" class="game-action-btn btn-primary">🔄 Jogar Novamente</button>
                <button id="btn-quit" class="game-action-btn btn-secondary">✕ Sair</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const nameInput = document.getElementById('player-name-input');
    const saveBtn = document.getElementById('btn-save-score');
    const feedbackBox = document.getElementById('ranking-feedback');
    const tableContainer = document.getElementById('leaderboard-table-container');

    // Recupera o último nome usado
    try {
        const lastPlayer = localStorage.getItem('lastPlayerName');
        if (lastPlayer && nameInput) {
            nameInput.value = lastPlayer;
        }
    } catch (e) {}

    const handleSave = () => {
        if (!nameInput) return;
        const enteredName = nameInput.value.trim();
        if (!enteredName) {
            feedbackBox.className = 'ranking-feedback feedback-warning';
            feedbackBox.innerHTML = '⚠️ Por favor, digite seu nome!';
            nameInput.focus();
            return;
        }

        try {
            localStorage.setItem('lastPlayerName', enteredName);
        } catch (e) {}

        const result = savePlayerScore(enteredName, pigeonScore);

        if (result.error) {
            feedbackBox.className = 'ranking-feedback feedback-warning';
            feedbackBox.innerHTML = `⚠️ ${result.error}`;
        } else if (result.status === 'improved') {
            feedbackBox.className = 'ranking-feedback feedback-success';
            feedbackBox.innerHTML = `🎉 <b>Parabéns, ${escapeHtml(result.name)}!</b> Você superou seu recorde anterior (${result.oldScore} ➔ <b>${result.newScore}</b> pontos)! Ficou em <b>${result.rank}º lugar</b>!`;
            SoundFX.playHit();
        } else if (result.status === 'not_improved') {
            feedbackBox.className = 'ranking-feedback feedback-warning';
            feedbackBox.innerHTML = `⚠️ <b>${escapeHtml(result.name)}</b>, você <u>não se superou</u>! Seu recorde permanece <b>${result.oldScore} pontos</b>. Nesta rodada você fez ${result.currentScore} pontos.`;
        } else if (result.status === 'new_entry') {
            feedbackBox.className = 'ranking-feedback feedback-success';
            feedbackBox.innerHTML = `✨ <b>${escapeHtml(result.name)}</b> registrado com sucesso! <b>${result.score} pontos</b> (Posição: <b>${result.rank}º lugar</b>).`;
            SoundFX.playHit();
        }

        if (tableContainer) {
            tableContainer.innerHTML = renderLeaderboardRows(enteredName);
        }
    };

    if (saveBtn) {
        saveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleSave();
        });
    }

    if (nameInput) {
        nameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.stopPropagation();
                handleSave();
            }
        });
    }

    document.getElementById('btn-replay').addEventListener('click', (e) => {
        e.stopPropagation();
        modal.remove();
        startPigeonGame();
    });

    document.getElementById('btn-quit').addEventListener('click', (e) => {
        e.stopPropagation();
        modal.remove();
        stopPigeonGame();
    });
}

function createFeatherExplosion(x, y) {
    const particleCount = 20;
    const colors = ['#ffffff', '#f0f0f0', '#d8d8d8', '#ffdf70', '#888888'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'feather-particle';
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = Math.random() * 8 + 4 + 'px';
        particle.style.height = Math.random() * 8 + 4 + 'px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px 8px 2px 8px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '10005';
        particle.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.8)';
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5);
        const velocity = 4 + Math.random() * 6;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let posX = x;
        let posY = y;
        let opacity = 1;
        
        function animate() {
            posX += vx;
            posY += vy + 1.2;
            opacity -= 0.025;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        }
        
        animate();
    }
}

function showFloatingPoints(x, y, text) {
    const points = document.createElement('div');
    points.className = 'floating-score-tag';
    points.textContent = text;
    points.style.position = 'fixed';
    points.style.left = x + 'px';
    points.style.top = y + 'px';
    points.style.transform = 'translate(-50%, -50%)';
    points.style.color = '#ffdf70';
    points.style.fontWeight = 'bold';
    points.style.fontSize = '1.4rem';
    points.style.textShadow = '0 0 10px rgba(255, 223, 112, 0.8)';
    points.style.zIndex = '10006';
    points.style.pointerEvents = 'none';
    points.style.transition = 'all 0.6s cubic-bezier(0.1, 1, 0.1, 1)';
    
    document.body.appendChild(points);
    
    requestAnimationFrame(() => {
        points.style.transform = 'translate(-50%, -90px) scale(1.2)';
        points.style.opacity = '0';
    });
    
    setTimeout(() => points.remove(), 600);
}

function showBannerMessage(text) {
    const banner = document.createElement('div');
    banner.className = 'pigeon-banner-message';
    banner.textContent = text;
    document.body.appendChild(banner);
    
    setTimeout(() => {
        banner.style.opacity = '0';
        banner.style.transform = 'translate(-50%, -60%) scale(0.9)';
        setTimeout(() => banner.remove(), 400);
    }, 1800);
}

// ============================================
// INICIALIZAÇÃO GERAL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    digitar();
    initParticles();
    initCursorTrail();
    initButtonEffects();
    initEntranceAnimations();
    initParallax();
    initDrawingSystem();
    initPigeonEasterEgg();

    // Ativa áudio no primeiro clique do usuário
    const unlockAudio = () => {
        getAudioContext();
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
    };
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });
});