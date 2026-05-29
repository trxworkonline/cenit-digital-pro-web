/* ─── HERO ELEMENTS ───────────────────────────────────────────── */
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
playBtn.addEventListener('click', () => { playBtn.classList.remove('visible'); introVideo.play().catch(() => {}); });

/* ─── SCROLL TRANSITION ─────────────────────────────────────── */
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

/* ─── SECTION-PROBLEMA: FLIP SYSTEM ────────────────────────────── */
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
  if (saturnRedImg && saturnBlueImg) {
    saturnRedImg.style.opacity  = problemFlipped ? '0' : '1';
    saturnBlueImg.style.opacity = problemFlipped ? '1' : '0';
  }
  flipCards.forEach((card, i) => {
    card.querySelector('.flip-card-inner').style.transitionDelay = FLIP_STAGGER[i] + 'ms';
    card.classList.toggle('flipped', problemFlipped);
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

/* ─── INTERSECTION OBSERVER: entrada PROBLEMA ───────────────────── */
if (problemaSection) {
  const obs = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    flipCards.forEach((card, i) => setTimeout(() => card.classList.add('in-view'), i * 50));
    if (saturnWrapEl) setTimeout(() => saturnWrapEl.classList.add('in-view'), 300);
    obs.disconnect();
  }, { threshold: 0.08 });
  obs.observe(problemaSection);
}

/* ─── SECTION-MOCKUP ───────────────────────────────────────── */

/* MOCKUP-VIDEO */
(function initMockupVideo() {
  const video   = document.getElementById('mockup-video');
  const section = document.getElementById('mockup-section');
  if (!video || !section) return;

  let fadingOut = false;

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
    requestAnimationFrame(() => { video.style.opacity = '1'; fadingOut = false; });
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

/* ─── SECTION-FEATURES ──────────────────────────────────────── */

/* FEATURES-CAROUSEL */
(function initFeaturesCarousel() {
  const section = document.getElementById('features-section');
  const track   = document.getElementById('features-track');
  const cards   = document.querySelectorAll('.features-card');
  const prevBtn = document.getElementById('features-prev');
  const nextBtn = document.getElementById('features-next');
  if (!track || !cards.length) return;

  let activeIndex    = 3;
  let isScrollByCode = false;
  let scrollTimer;

  function updateActiveState() {
    cards.forEach((card, i) => {
      const dist = i - activeIndex;
      card.classList.remove('is-active', 'is-adj-l', 'is-adj-r', 'is-far-l', 'is-far-r');
      if (dist === 0)       card.classList.add('is-active');
      else if (dist === -1) card.classList.add('is-adj-l');
      else if (dist === 1)  card.classList.add('is-adj-r');
      else if (dist < -1)   card.classList.add('is-far-l');
      else                  card.classList.add('is-far-r');
    });
  }

  function scrollToCard(index, smooth) {
    smooth = (smooth === undefined) ? true : smooth;
    activeIndex = Math.max(0, Math.min(cards.length - 1, index));
    const card      = cards[activeIndex];
    const halfTrack = track.offsetWidth / 2;
    const halfCard  = card.offsetWidth  / 2;
    const target    = card.offsetLeft - halfTrack + halfCard;
    isScrollByCode  = true;
    track.scrollTo({ left: target, behavior: smooth ? 'smooth' : 'instant' });
    updateActiveState();
    setTimeout(() => { isScrollByCode = false; }, smooth ? 700 : 60);
  }

  function findActiveCard() {
    const center = track.scrollLeft + track.offsetWidth / 2;
    let closest = activeIndex, minDist = Infinity;
    cards.forEach((card, i) => {
      const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (d < minDist) { minDist = d; closest = i; }
    });
    if (closest !== activeIndex) { activeIndex = closest; updateActiveState(); }
  }

  cards.forEach((card, i) => card.addEventListener('click', () => scrollToCard(i)));
  if (prevBtn) prevBtn.addEventListener('click', () => scrollToCard(activeIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollToCard(activeIndex + 1));

  track.addEventListener('scroll', () => {
    if (isScrollByCode) return;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(findActiveCard, 120);
  }, { passive: true });

  window.addEventListener('resize', () => scrollToCard(activeIndex, false));

  updateActiveState();
  requestAnimationFrame(() => requestAnimationFrame(() => scrollToCard(3, false)));

  if (section) {
    const entryObs = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      const titleEl = document.getElementById('features-title');
      const ctaEl   = document.getElementById('features-cta');
      if (titleEl) titleEl.classList.add('in-view');
      cards.forEach((card, i) => setTimeout(() => card.classList.add('in-view'), i * 60));
      if (ctaEl) setTimeout(() => ctaEl.classList.add('in-view'), 500);
      entryObs.disconnect();
    }, { threshold: 0.15 });
    entryObs.observe(section);
  }
})();

/* ─── BACKGROUND-SPACE-3D ──────────────────────────────────────── */
/* BACKGROUND-SPACE-3D — Fondo espacial Three.js global, reemplaza todos los canvas de partículas existentes */
(function initSpaceBackground() {
  if (typeof THREE === 'undefined') return;

  const isMobile = window.innerWidth < 768;

  /* Renderer */
  const canvas   = document.getElementById('space-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x010612, 1);

  /* Scene & Camera */
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 500;

  /* Helper: random positions in a volume */
  function makePos(count, xR, yR, zMin, zMax) {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i*3]   = (Math.random() - 0.5) * xR * 2;
      arr[i*3+1] = (Math.random() - 0.5) * yR * 2;
      arr[i*3+2] = -(Math.random() * (zMax - zMin) + zMin);
    }
    return arr;
  }

  /* Particle counts (reduced on mobile) */
  const N1 = isMobile ? 1500 : 3000;
  const N2 = isMobile ?  800 : 1500;
  const N3 = isMobile ?  200 :  400;

  /* ─ Layer 1: Far stars */
  const geo1 = new THREE.BufferGeometry();
  geo1.setAttribute('position', new THREE.BufferAttribute(makePos(N1, 1500, 1500, 500, 2000), 3));
  const layer1 = new THREE.Points(geo1, new THREE.PointsMaterial({
    size: 0.8, color: 0xEAF4FF, opacity: 0.6, transparent: true, sizeAttenuation: true
  }));
  scene.add(layer1);

  /* ─ Layer 2: Mid stars (15% blue) */
  const geo2  = new THREE.BufferGeometry();
  geo2.setAttribute('position', new THREE.BufferAttribute(makePos(N2, 1000, 1000, 100, 1500), 3));
  const cols2 = new Float32Array(N2 * 3);
  for (let i = 0; i < N2; i++) {
    if (Math.random() < 0.15) {
      cols2[i*3] = 0.376; cols2[i*3+1] = 0.784; cols2[i*3+2] = 1.0;
    } else {
      cols2[i*3] = 0.918; cols2[i*3+1] = 0.957; cols2[i*3+2] = 1.0;
    }
  }
  geo2.setAttribute('color', new THREE.BufferAttribute(cols2, 3));
  const layer2 = new THREE.Points(geo2, new THREE.PointsMaterial({
    size: 1.4, opacity: 0.8, transparent: true, sizeAttenuation: true, vertexColors: true
  }));
  scene.add(layer2);

  /* ─ Layer 3: Close stars with twinkle shader (20% blue) */
  const geo3     = new THREE.BufferGeometry();
  geo3.setAttribute('position', new THREE.BufferAttribute(makePos(N3, 600, 600, 0, 400), 3));
  const offs3    = new Float32Array(N3);
  const cols3    = new Float32Array(N3 * 3);
  for (let i = 0; i < N3; i++) {
    offs3[i] = Math.random() * Math.PI * 2;
    if (Math.random() < 0.20) {
      cols3[i*3] = 0.376; cols3[i*3+1] = 0.784; cols3[i*3+2] = 1.0;
    } else {
      cols3[i*3] = 1.0; cols3[i*3+1] = 1.0; cols3[i*3+2] = 1.0;
    }
  }
  geo3.setAttribute('randomOffset', new THREE.BufferAttribute(offs3, 1));
  geo3.setAttribute('color',        new THREE.BufferAttribute(cols3, 3));

  const mat3 = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0.0 } },
    vertexShader: [
      'attribute float randomOffset;',
      'attribute vec3 color;',
      'uniform float time;',
      'varying vec3  vColor;',
      'varying float vAlpha;',
      'void main() {',
      '  vColor = color;',
      '  vAlpha = 0.8 + sin(time + randomOffset) * 0.2;',
      '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
      '  gl_PointSize = 2.5 * (300.0 / -mv.z);',
      '  gl_Position  = projectionMatrix * mv;',
      '}'
    ].join('\n'),
    fragmentShader: [
      'varying vec3  vColor;',
      'varying float vAlpha;',
      'void main() {',
      '  float r = length(gl_PointCoord - vec2(0.5));',
      '  if (r > 0.5) discard;',
      '  gl_FragColor = vec4(vColor, vAlpha * (1.0 - r * 1.5));',
      '}'
    ].join('\n'),
    transparent:  true,
    blending:     THREE.AdditiveBlending,
    depthWrite:   false
  });
  const layer3 = new THREE.Points(geo3, mat3);
  scene.add(layer3);

  /* ─ Nebulae (desktop only) */
  if (!isMobile) {
    [
      { r: 400, x: -300, y:  200, z:  -800, c: 0x041840, o: 0.15 },
      { r: 350, x:  400, y: -150, z:  -600, c: 0x060B20, o: 0.12 },
      { r: 500, x:    0, y:    0, z: -1200, c: 0x010612, o: 0.08 }
    ].forEach(d => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(d.r, 16, 16),
        new THREE.MeshBasicMaterial({
          color: d.c, transparent: true, opacity: d.o,
          blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide
        })
      );
      mesh.position.set(d.x, d.y, d.z);
      scene.add(mesh);
    });
  }

  /* ─ GSAP ScrollTrigger: camera Z + parallax rotations */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    const st = { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 2 };
    gsap.to(camera.position, { z: 200,   ease: 'none', scrollTrigger: st });
    gsap.to(layer1.rotation, { y: 0.150, x: 0.050, ease: 'none', scrollTrigger: st });
    gsap.to(layer2.rotation, { y: 0.075, x: 0.025, ease: 'none', scrollTrigger: st });
    gsap.to(layer3.rotation, { y: 0.038, x: 0.013, ease: 'none', scrollTrigger: st });
  }

  /* ─ Lenis smooth scroll */
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: t => 1 - Math.pow(1 - t, 4)
    });
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
    }
    if (typeof gsap !== 'undefined') {
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ─ Mouse / device-orientation parallax */
  let tRotX = 0, tRotY = 0, cRotX = 0, cRotY = 0;

  if (!isMobile) {
    window.addEventListener('mousemove', e => {
      tRotY =  (e.clientX / window.innerWidth  - 0.5) *  0.12;
      tRotX = -(e.clientY / window.innerHeight - 0.5) *  0.08;
    }, { passive: true });
  } else {
    window.addEventListener('deviceorientation', e => {
      if (e.gamma !== null) tRotY =  e.gamma * (Math.PI / 180) * 0.02;
      if (e.beta  !== null) tRotX = -e.beta  * (Math.PI / 180) * 0.02;
    }, { passive: true });
  }

  /* ─ Animation loop */
  function animate(time) {
    requestAnimationFrame(animate);

    layer1.rotation.y += 0.00008; layer1.rotation.x += 0.00003;
    layer2.rotation.y += 0.00012; layer2.rotation.x += 0.00005;
    layer3.rotation.y += 0.00018; layer3.rotation.x += 0.00007;

    cRotX += (tRotX - cRotX) * 0.03;
    cRotY += (tRotY - cRotY) * 0.03;
    camera.rotation.x = cRotX;
    camera.rotation.y = cRotY;

    mat3.uniforms.time.value = time * 0.001;

    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);

  /* ─ Resize handler */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    }, 250);
  });

})();