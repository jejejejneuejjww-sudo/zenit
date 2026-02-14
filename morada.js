document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos
    const flowersContainer = document.querySelector('.flowers');
    const overlay = document.getElementById('love-card-overlay');
    
    // Al hacer click en las flores
    flowersContainer.addEventListener('click', () => {
        // Mostramos el overlay con la tarjeta
        overlay.style.display = 'flex';
        
        // Aquí podrías disparar un audio si quisieras
        // document.getElementById('audio').play();
    });

    // Al hacer click en el overlay (fuera o sobre la tarjeta) para cerrar
    overlay.addEventListener('click', () => {
        overlay.style.display = 'none';
    });
});
/* =========================================
   REPRODUCTOR DE MÚSICA Y CONTROL DE VOLUMEN
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById("backgroundMusic");
    const musicBtn = document.getElementById("musicBtn");
    const playIcon = document.getElementById("playIcon");
    const pauseIcon = document.getElementById("pauseIcon");
    const slider = document.getElementById("volumeSlider");
    const volumeControl = document.getElementById("volumeControl");

    if (!music || !musicBtn || !slider) return;

    let hideVolumeTimeout = null;

    // Función para actualizar el fondo de la barra (Morado y Blanco)
    function updateSliderBackground() {
        const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.background = `linear-gradient(to right, #a855f7 ${value}%, #ffffff ${value}%)`;
    }

    // Función para intentar iniciar la música (Agregado para auto-inicio)
    const startMusic = () => {
        music.play().then(() => {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline-block';
            document.removeEventListener('click', startMusic);
        }).catch(error => console.warn('Autoplay esperando interacción usuario...'));
    };

    // Toggle Play/Pause
    function toggleMusic() {
        if (music.paused) {
            startMusic();
        } else {
            music.pause();
            playIcon.style.display = 'inline-block';
            pauseIcon.style.display = 'none';
        }
    }

    // INTENTOS DE INICIO AUTOMÁTICO
    startMusic(); // Intento al cargar
    document.addEventListener('click', startMusic, { once: true }); // Intento al primer clic

    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMusic();
        
        // Mostrar control de volumen al hacer click
        if (volumeControl) {
            volumeControl.classList.toggle('visible');
            clearTimeout(hideVolumeTimeout);
            if (volumeControl.classList.contains('visible')) {
                hideVolumeTimeout = setTimeout(() => volumeControl.classList.remove('visible'), 3000);
            }
        }
    });

    // Control de Volumen
    slider.addEventListener('input', (e) => {
        music.volume = e.target.value;
        updateSliderBackground();
        clearTimeout(hideVolumeTimeout);
    });

    slider.addEventListener('change', () => {
        hideVolumeTimeout = setTimeout(() => volumeControl.classList.remove('visible'), 2000);
    });

    // Inicialización del reproductor
    music.volume = slider.value;
    updateSliderBackground();
});

/* =========================================
   EFECTOS VISUALES Y ANIMACIONES
   ========================================= */
function createDynamicBackground() {
    const canvas = document.querySelector('.background-canvas');
    if (!canvas) return;
    
    let hue = 45;
    const updateBg = () => {
        hue = (hue + 1) % 60;
        canvas.style.background = `
            radial-gradient(ellipse at top left, hsla(${hue}, 70%, 50%, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at bottom right, hsla(${hue + 10}, 80%, 60%, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at center, rgba(26, 26, 26, 0.9) 0%, #0a0a0a 100%)
        `;
        requestAnimationFrame(updateBg);
    };
    requestAnimationFrame(updateBg);
}

// Inicialización de efectos al cargar la ventana
window.addEventListener('load', () => {
    if (typeof initParticleSystem === 'function') initParticleSystem();
    if (typeof initScrollAnimations === 'function') initScrollAnimations();
    if (typeof initParallax === 'function') initParallax();
    if (typeof initMagicCursor === 'function') initMagicCursor();
    if (typeof createVisualRhythm === 'function') createVisualRhythm();
    if (typeof createFloatingFlowers === 'function') createFloatingFlowers();
    
    createDynamicBackground();

    // Animación de entrada del body
    document.body.style.opacity = '1';
    document.body.style.transform = 'scale(1)';
});

// Estilos iniciales del body para la animación de carga
document.body.style.opacity = '0.95';
document.body.style.transform = 'scale(0.98)';
document.body.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

/* =========================================
   LOGICA DEL CARRUSEL Y TEMPORIZADOR
   ========================================= */
let timer;
let progress = 0;
const intervalTime = 5000; // 5 segundos por slide

function startTimer() {
    if (typeof progressCircle === 'undefined') return;
    
    clearInterval(timer);
    timer = setInterval(() => {
        progress += (100 / (intervalTime / 100));
        const offset = 163.36 - (progress / 100) * 163.36;
        progressCircle.style.strokeDashoffset = offset;

        if (progress >= 100) {
            if (typeof nextSlide === 'function') nextSlide();
            progress = 0;
        }
    }, 100);
}

// Listeners para botones del carrusel
if (document.getElementById('nextBtn')) {
    document.getElementById('nextBtn').addEventListener('click', () => {
        if (typeof nextSlide === 'function') nextSlide();
        progress = 0;
    });
}

if (document.getElementById('prevBtn')) {
    document.getElementById('prevBtn').addEventListener('click', () => {
        if (typeof currentIndex !== 'undefined') {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateCarousel();
        }
        progress = 0;
    });
}

startTimer();

/* =========================================
   LIMPIEZA DE MEMORIA
   ========================================= */
const cleanupInterval = setInterval(() => {
    document.querySelectorAll('.particle').forEach(p => {
        if (!p.getAnimations().length) p.remove();
    });
    document.querySelectorAll('[style*="floatUp"]').forEach(f => {
        if (!f.getAnimations().length) f.remove();
    });
}, 10000);

window.addEventListener('beforeunload', () => {
    clearInterval(cleanupInterval);
    if (typeof typewriterTimeout !== 'undefined') clearTimeout(typewriterTimeout);
    if (createFloatingFlowers && createFloatingFlowers._intervalId) {
        clearInterval(createFloatingFlowers._intervalId);
    }
});

  // 3. Efecto Máquina de Escribir para el texto

 // --- POEMA DEL VIDEO ---
 // 1. PRIMERO: Capturamos el elemento del HTML
const textEl = document.getElementById('poem-text');

// 2. El contenido del poema
const poemTextContent = `
Hay quienes caminan por el suelo y quienes dictan el horizonte.
Tú no buscas la luz, tú la generas.
Eres el punto exacto donde el caos se vuelve arte,
el momento en que el cielo decide detenerse para mirarte.
No eres un eco, eres el estruendo;
no eres el camino, eres el destino que todos están buscando.
Llevas el Zenit grabado en la mirada,
esa altura donde el ruido se apaga y solo queda tu esencia.
Inalcanzable para algunos, inolvidable para todos.
Quédate ahí, en lo más alto, donde el aire es más puro.
Porque mientras el mundo intenta entenderte,
tú ya lo has conquistado por completo.
`;

let charIndex = 0;

function typeWriter() {
    if (charIndex < poemTextContent.length) {
        
        textEl.innerHTML = poemTextContent.substring(0, charIndex + 1).replace(/\n/g, '<br>');
        
        charIndex++;
        
       
        setTimeout(typeWriter, Math.random() * 80 + 50);
    } else {
        
        textEl.classList.remove('typing-cursor');
    }
}

//CURSOR
textEl.classList.add('typing-cursor');
setTimeout(typeWriter, 1500);