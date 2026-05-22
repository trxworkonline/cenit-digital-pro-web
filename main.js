/* ─── PARTICLES ─────────────────────────────────────────────── */
(async () => {
  if (typeof tsParticles === 'undefined') return;

  await tsParticles.load({
    id: 'particles-white',
    options: {
      background: { color: { value: 'transparent' } },
      fullScreen: { enable: false },
      fpsLimit: 60,
      particles: {
        color: { value: '#FFFFFF' },
        number: { value: 100, density: { enable: true, width: 430, height: 932 } },
        opacity: { value: { min: 0.1, max: 1 }, animation: { enable: true, speed: 1.2, sync: false } },
        size: { value: { min: 0.4, max: 1.6 } },
        move: { enable: true, speed: { min: 0.1, max: 1.2 }, direction: 'none', outModes: { default: 'out' } },
        shape: { type: 'circle' }
      },
      detectRetina: true
    }
  });

  await tsParticles.load({
    id: 'particles-blue',
    options: {
      background: { color: { value: 'transparent' } },
      fullScreen: { enable: false },
      fpsLimit: 60,
      particles: {
        color: { value: '#60C8FF' },
        number: { value: 80, density: { enable: true, width: 430, height: 932 } },
        opacity: { value: { min: 0.1, max: 0.9 }, animation: { enable: true, speed: 0.9, sync: false } },
        size: { value: { min: 0.4, max: 1.4 } },
        move: { enable: true, speed: { min: 0.1, max: 0.9 }, direction: 'none', outModes: { default: 'out' } },
        shape: { type: 'circle' }
      },
      detectRetina: true
    }
  });
})();

/* ─── ELEMENTOS ─────────────────────────────────────────────── */
const introVideo = document.getElementById('hero-intro');
const loopVideo  = document.getElementById('hero-loop');
const heroCopy   = document.getElementById('hero-copy');
const navbar     = document.getElementById('navbar');
const bloque3    = document.getElementById('bloque3');
const playBtn    = document.getElementById('play-btn');

/* ─── PRE-BUFFER LOOP VIDEO ─────────────────────────────────── */
function prebufferLoop() {
  const p = loopVideo.play();
  if (p !== undefined) {
    p.then(() => {
      loopVideo.pause();
      loopVideo.currentTime = 0;
    }).catch(() => {
      loopVideo.addEventListener('canplay', () => {
        loopVideo.pause();
        loopVideo.currentTime = 0;
      }, { once: true });
    });
  }
}

document.addEventListener('DOMContentLoaded', prebufferLoop);
if (document.readyState !== 'loading') prebufferLoop();

/* ─── HERO REVEAL ───────────────────────────────────────────── */
function revealHero() {
  introVideo.style.transition = 'opacity 0.4s ease-in-out';
  loopVideo.style.transition  = 'opacity 0.4s ease-in-out';
  introVideo.style.opacity    = '0';
  loopVideo.style.opacity     = '1';
  loopVideo.classList.remove('hero-video--hidden');
  loopVideo.play().catch(() => {});

  navbar.classList.add('reveal');
  heroCopy.classList.add('reveal');
}

introVideo.addEventListener('ended', revealHero);

/* ─── AUTOPLAY FALLBACK ─────────────────────────────────────── */
introVideo.play().catch(() => {
  playBtn.classList.add('visible');
});

playBtn.addEventListener('click', () => {
  playBtn.classList.remove('visible');
  introVideo.play().catch(() => {});
});

/* ─── SCROLL TRANSITION (BLOQUE 1 → BLOQUE 3) ──────────────── */
const bloque1 = document.getElementById('bloque1');
let transitioned = false;

function triggerTransition() {
  if (transitioned) return;
  transitioned = true;

  bloque3.classList.add('active');
  bloque1.classList.add('exit');

  bloque1.addEventListener('transitionend', () => {
    bloque1.style.display = 'none';
  }, { once: true });
}

window.addEventListener('wheel', (e) => {
  if (e.deltaY > 0) triggerTransition();
}, { passive: true });

let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchend', (e) => {
  const deltaY = touchStartY - e.changedTouches[0].clientY;
  if (deltaY > 30) triggerTransition();
}, { passive: true });
