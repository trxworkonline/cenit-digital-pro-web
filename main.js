/* ─── PARTICLES ─────────────────────────────────────────────── */
(async () => {
  if (typeof tsParticles === 'undefined') return;
  await tsParticles.load({ id: 'particles-white', options: {
    background: { color: { value: 'transparent' } }, fullScreen: { enable: false }, fpsLimit: 60,
    particles: {
      color: { value: '#FFFFFF' },
      number: { value: 100, density: { enable: true, width: 430, height: 932 } },
      opacity: { value: { min: 0.1, max: 1 }, animation: { enable: true, speed: 1.2, sync: false } },
      size: { value: { min: 0.4, max: 1.6 } },
      move: { enable: true, speed: { min: 0.1, max: 1.2 }, direction: 'none', outModes: { default: 'out' } },
      shape: { type: 'circle' }
    }, detectRetina: true
  }});
  await tsParticles.load({ id: 'particles-blue', options: {
    background: { color: { value: 'transparent' } }, fullScreen: { enable: false }, fpsLimit: 60,
    particles: {
      color: { value: '#60C8FF' },
      number: { value: 80, density: { enable: true, width: 430, height: 932 } },
      opacity: { value: { min: 0.1, max: 0.9 }, animation: { enable: true, speed: 0.9, sync: false } },
      size: { value: { min: 0.4, max: 1.4 } },
      move: { enable: true, speed: { min: 0.1, max: 0.9 }, direction: 'none', outModes: { default: 'out' } },
      shape: { type: 'circle' }
    }, detectRetina: true
  }});
})();

/* ─── HERO ELEMENTS ─────────────────────────────────────────── */
const introVideo = document.getElementById('hero-intro');
const loopVideo  = document.getElementById('hero-loop');
const heroCopy   = document.getElementById('hero-copy');
const navbar     = document.getElementById('navbar');
const playBtn    = document.getElementById('play-btn');
const bloque1    = document.getElementById('bloque1');

document.body.classList.add('scroll-locked');

function prebufferLoop() {
  const p = loopVideo.play();
  if (p !== undefined) {
    p.then(() => { loopVideo.pause(); loopVideo.currentTime = 0; })
     .catch(() => { loopVideo.addEventListener('canplay', () => { loopVideo.pause(); loopVideo.currentTime = 0; }, { once: true }); });
  }
}

document.addEventListener('DOMContentLoaded', prebufferLoop);
if (document.readyState !== 'loading') prebufferLoop();

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

introVideo.play().catch(() => { playBtn.classList.add('visible'); });

playBtn.addEventListener('click', () => {
  playBtn.classList.remove('visible');
  introVideo.play().catch(() => {});
});

/* ─── SCROLL TRANSITION ────────────────────────────────────── */
let transitioned = false;

function triggerTransition() {
  if (transitioned) return;
  transitioned = true;
  bloque1.classList.add('exit');
  bloque1.addEventListener('transitionend', () => {
    bloque1.style.display = 'none';
    document.body.classList.remove('scroll-locked');
  }, { once: true });
}

window.addEventListener('wheel',      (e) => { if (e.deltaY > 0) triggerTransition(); }, { passive: true });
window.addEventListener('touchstart', (e) => { window._tY = e.touches[0].clientY; },    { passive: true });
window.addEventListener('touchend',   (e) => { if (window._tY - e.changedTouches[0].clientY > 30) triggerTransition(); }, { passive: true });

/* ─── EL PROBLEMA: FLIP SYSTEM ─────────────────────────────── */
const problemaSection = document.getElementById('el-problema');
const saturnBtn       = document.getElementById('saturn-btn');
const saturnWrapEl    = document.getElementById('saturn-wrap');
const flipCards       = document.querySelectorAll('.flip-card');
const tituloRojo      = document.getElementById('titulo-rojo');
const tituloAzul      = document.getElementById('titulo-azul');

let problemFlipped = false;

function isMob() { return window.innerWidth < 768; }

function handleFlip() {
  problemFlipped = !problemFlipped;
  const stagger = isMob() ? 0.04 : 0.06;

  flipCards.forEach((card, i) => {
    card.querySelector('.flip-card-inner').style.transitionDelay = (i * stagger).toFixed(2) + 's';
    card.classList.toggle('flipped', problemFlipped);
  });

  problemaSection.classList.toggle('flipped', problemFlipped);
  saturnBtn.setAttribute('aria-pressed', String(problemFlipped));
  tituloRojo.setAttribute('aria-hidden', String(problemFlipped));
  tituloAzul.setAttribute('aria-hidden', String(!problemFlipped));
}

if (saturnBtn) {
  saturnBtn.addEventListener('click', handleFlip);
  saturnBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleFlip(); }
  });
}

/* ─── INTERSECTION OBSERVER: entrada de sección ─────────────── */
if (problemaSection) {
  const obs = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    flipCards.forEach((card, i) => setTimeout(() => card.classList.add('in-view'), i * 80));
    if (saturnWrapEl) setTimeout(() => saturnWrapEl.classList.add('in-view'), 200);
    obs.disconnect();
  }, { threshold: 0.08 });
  obs.observe(problemaSection);
}
