/* ─── PARTICLES ─────────────────────────────────────────── */
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

/* ─── HERO ELEMENTS ───────────────────────────────────────── */
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

/* ─── SCROLL TRANSITION ──────────────────────────────────── */
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

/* ─── SECTION-PROBLEMA: FLIP SYSTEM ──────────────────────────── */
const problemaSection = document.getElementById('el-problema');
const saturnBtn       = document.getElementById('saturn-btn');
const saturnWrapEl    = document.getElementById('saturn-wrap');
const saturnRedImg    = document.getElementById('saturn-red');
const saturnBlueImg   = document.getElementById('saturn-blue');
const flipCards       = document.querySelectorAll('.flip-card');
const tituloRojo      = document.getElementById('titulo-rojo');
const tituloAzul      = document.getElementById('titulo-azul');

let problemFlipped = false;

const FLIP_STAGGER = [0, 60, 120, 180, 240, 300, 360, 420];

function handleFlip() {
  problemFlipped = !problemFlipped;

  /* Crossfade imágenes Saturn */
  if (saturnRedImg && saturnBlueImg) {
    saturnRedImg.style.opacity  = problemFlipped ? '0' : '1';
    saturnBlueImg.style.opacity = problemFlipped ? '1' : '0';
  }

  flipCards.forEach((card, i) => {
    card.querySelector('.flip-card-inner').style.transitionDelay = FLIP_STAGGER[i] + 'ms';
    card.classList.toggle('flipped', problemFlipped);
    /* Bloquea hover durante la animación de flip (CAMBIO 4) */
    card.classList.add('is-flipping');
    setTimeout(() => card.classList.remove('is-flipping'), FLIP_STAGGER[i] + 550);
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

/* ─── INTERSECTION OBSERVER: entrada de sección PROBLEMA ─────────── */
if (problemaSection) {
  const obs = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    flipCards.forEach((card, i) => setTimeout(() => card.classList.add('in-view'), i * 50));
    if (saturnWrapEl) setTimeout(() => saturnWrapEl.classList.add('in-view'), 300);
    obs.disconnect();
  }, { threshold: 0.08 });
  obs.observe(problemaSection);
}

/* ─── SECTION-MOCKUP ────────────────────────────────────────── */

/* MOCKUP-AMBIENT: campo de estrellas en canvas */
(function initMockupStars() {
  const canvas = document.getElementById('mockup-stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width  = canvas.offsetWidth  || canvas.parentElement.offsetWidth;
    canvas.height = canvas.offsetHeight || canvas.parentElement.offsetHeight;
    stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      o: Math.random() * 0.5 + 0.2
    }));
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.o})`;
      ctx.fill();
    });
  }

  resize();
  window.addEventListener('resize', resize);
})();

/* MOCKUP-VIDEO: play/pause controlado por IntersectionObserver */
(function initMockupVideo() {
  const video   = document.getElementById('mockup-video');
  const section = document.getElementById('mockup-section');
  if (!video || !section) return;

  let fadingOut = false;

  /* Loop suave con crossfade de opacidad */
  video.addEventListener('timeupdate', () => {
    if (!video.duration || fadingOut) return;
    if (video.currentTime > video.duration - 0.8) {
      fadingOut = true;
      video.style.opacity = '0';
    }
  });

  video.addEventListener('ended', () => {
    video.currentTime = 0;
    video.play().catch(() => {});
    requestAnimationFrame(() => {
      video.style.opacity = '1';
      fadingOut = false;
    });
  });

  const videoObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
      video.style.opacity = '1';
      fadingOut = false;
    }
  }, { threshold: 0.5 });

  videoObs.observe(section);
})();

/* MOCKUP: animaciones de entrada */
(function initMockupEntry() {
  const section     = document.getElementById('mockup-section');
  const titleEl     = document.getElementById('mockup-title');
  const phoneWrapEl = document.getElementById('mockup-phone-wrap');
  const badgeEl     = document.getElementById('mockup-badge');
  const ctaEl       = document.getElementById('mockup-cta');
  if (!section) return;

  const entryObs = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    if (titleEl)     titleEl.classList.add('in-view');
    if (phoneWrapEl) phoneWrapEl.classList.add('in-view');
    if (badgeEl)     badgeEl.classList.add('in-view');
    if (ctaEl)       ctaEl.classList.add('in-view');
    entryObs.disconnect();
  }, { threshold: 0.2 });

  entryObs.observe(section);
})();
