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
  if (saturnRedImg && saturnBlueImg) { saturnRedImg.style.opacity = problemFlipped ? '0' : '1'; saturnBlueImg.style.opacity = problemFlipped ? '1' : '0'; }
  flipCards.forEach((card, i) => { card.querySelector('.flip-card-inner').style.transitionDelay = FLIP_STAGGER[i] + 'ms'; card.classList.toggle('flipped', problemFlipped); card.classList.add('is-flipping'); setTimeout(() => card.classList.remove('is-flipping'), FLIP_STAGGER[i] + 550); });
  problemaSection.classList.toggle('flipped', problemFlipped);
  saturnBtn.setAttribute('aria-pressed', String(problemFlipped));
  tituloRojo.setAttribute('aria-hidden', String(problemFlipped));
  tituloAzul.setAttribute('aria-hidden', String(!problemFlipped));
}
if (saturnBtn) {
  saturnBtn.addEventListener('click', handleFlip);
  saturnBtn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleFlip(); } });
}
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
(function initMockupVideo() {
  const video = document.getElementById('mockup-video'), section = document.getElementById('mockup-section');
  if (!video || !section) return;
  let fadingOut = false;
  video.addEventListener('timeupdate', () => { if (!video.duration || fadingOut) return; if (video.currentTime > video.duration - 0.8) { fadingOut = true; video.style.opacity = '0'; } });
  video.addEventListener('ended', () => { video.currentTime = 0; video.play().catch(() => {}); requestAnimationFrame(() => { video.style.opacity = '1'; fadingOut = false; }); });
  const videoObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { video.currentTime = 0; video.play().catch(() => {}); }
    else { video.pause(); video.currentTime = 0; video.style.opacity = '1'; fadingOut = false; }
  }, { threshold: 0.5 });
  videoObs.observe(section);
})();

(function initMockupEntry() {
  const section = document.getElementById('mockup-section');
  if (!section) return;
  const entryObs = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    var t = document.getElementById('mockup-title'), p = document.getElementById('mockup-phone-wrap'), b = document.getElementById('mockup-badge'), c = document.getElementById('mockup-cta');
    if (t) t.classList.add('in-view'); if (p) p.classList.add('in-view'); if (b) b.classList.add('in-view'); if (c) c.classList.add('in-view');
    entryObs.disconnect();
  }, { threshold: 0.2 });
  entryObs.observe(section);
})();

/* ─── SECTION-FEATURES ──────────────────────────────────────── */
(function initFeaturesCarousel() {
  const section = document.getElementById('features-section');
  const track = document.getElementById('features-track');
  const cards = document.querySelectorAll('.features-card');
  const prevBtn = document.getElementById('features-prev'), nextBtn = document.getElementById('features-next');
  if (!track || !cards.length) return;
  let activeIndex = 3, isScrollByCode = false, scrollTimer;
  function updateActiveState() {
    cards.forEach((card, i) => { const dist = i - activeIndex; card.classList.remove('is-active','is-adj-l','is-adj-r','is-far-l','is-far-r'); if (dist===0) card.classList.add('is-active'); else if (dist===-1) card.classList.add('is-adj-l'); else if (dist===1) card.classList.add('is-adj-r'); else if (dist<-1) card.classList.add('is-far-l'); else card.classList.add('is-far-r'); });
  }
  function scrollToCard(index, smooth) {
    smooth = (smooth===undefined) ? true : smooth;
    activeIndex = Math.max(0, Math.min(cards.length-1, index));
    const card = cards[activeIndex];
    const target = card.offsetLeft - track.offsetWidth/2 + card.offsetWidth/2;
    isScrollByCode = true;
    track.scrollTo({ left: target, behavior: smooth ? 'smooth' : 'instant' });
    updateActiveState();
    setTimeout(() => { isScrollByCode = false; }, smooth ? 700 : 60);
  }
  function findActiveCard() {
    const center = track.scrollLeft + track.offsetWidth/2;
    let closest = activeIndex, minDist = Infinity;
    cards.forEach((card, i) => { const d = Math.abs(card.offsetLeft + card.offsetWidth/2 - center); if (d < minDist) { minDist = d; closest = i; } });
    if (closest !== activeIndex) { activeIndex = closest; updateActiveState(); }
  }
  cards.forEach((card, i) => card.addEventListener('click', () => scrollToCard(i)));
  if (prevBtn) prevBtn.addEventListener('click', () => scrollToCard(activeIndex-1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollToCard(activeIndex+1));
  track.addEventListener('scroll', () => { if (isScrollByCode) return; clearTimeout(scrollTimer); scrollTimer = setTimeout(findActiveCard, 120); }, { passive: true });
  window.addEventListener('resize', () => scrollToCard(activeIndex, false));
  updateActiveState();
  requestAnimationFrame(() => requestAnimationFrame(() => scrollToCard(3, false)));
  if (section) {
    const entryObs = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      const titleEl = document.getElementById('features-title'), ctaEl = document.getElementById('features-cta');
      if (titleEl) titleEl.classList.add('in-view');
      cards.forEach((card, i) => setTimeout(() => card.classList.add('in-view'), i * 60));
      if (ctaEl) setTimeout(() => ctaEl.classList.add('in-view'), 500);
      entryObs.disconnect();
    }, { threshold: 0.15 });
    entryObs.observe(section);
  }
})();

/* ─── BACKGROUND-SPACE-CSS ──────────────────────────────────────── */
(function initSpaceBackground() {
  const farLayer = document.getElementById('stars-layer-far'), midLayer = document.getElementById('stars-layer-mid'), nearLayer = document.getElementById('stars-layer-near'), brightLayer = document.getElementById('stars-bright');
  if (!farLayer) return;
  const isMobile = window.innerWidth < 768, vw = window.innerWidth, vh = window.innerHeight;
  const spreadX = Math.max(vw * 1.5, 800), spreadY = Math.max(vh * 4, 2000);
  function makeStars(count, sx, sy, colorPool) {
    var parts = []; for (var i = 0; i < count; i++) { var x = Math.round((Math.random()-0.5)*sx*2), y = Math.round((Math.random()-0.5)*sy*2), c = colorPool[Math.floor(Math.random()*colorPool.length)]; parts.push(x+'px '+y+'px 0 0 '+c); } return parts.join(',');
  }
  function makeBrightStars(count) {
    var parts = []; for (var i = 0; i < count; i++) { var x = Math.round((Math.random()-0.5)*spreadX*2), y = Math.round((Math.random()-0.5)*spreadY*2); parts.push(x+'px '+y+'px 0 2px rgba(255,255,255,1),'+x+'px '+y+'px 8px 4px rgba(255,255,255,0.3)'); } return parts.join(',');
  }
  var colorsFar = ['rgba(255,255,255,0.3)','rgba(255,255,255,0.4)','rgba(255,255,255,0.5)','rgba(255,255,255,0.6)','rgba(255,255,255,0.7)'];
  var colorsMid = ['rgba(255,255,255,0.8)','rgba(255,255,255,0.8)','rgba(255,255,255,0.8)','rgba(255,255,255,0.8)','rgba(96,200,255,0.6)','rgba(96,200,255,0.6)','rgba(96,200,255,0.6)'];
  var colorsNear = ['rgba(255,255,255,0.8)','rgba(255,255,255,0.9)','rgba(255,255,255,1.0)','rgba(96,200,255,0.7)','rgba(96,200,255,0.8)'];
  farLayer.style.boxShadow = makeStars(isMobile?100:200, spreadX, spreadY, colorsFar);
  midLayer.style.boxShadow = makeStars(isMobile?60:120, spreadX*0.8, spreadY, colorsMid);
  nearLayer.style.boxShadow = makeStars(isMobile?25:50, spreadX*0.6, spreadY, colorsNear);
  brightLayer.style.boxShadow = makeBrightStars(isMobile?8:15);
  var scrollY=0, curFarX=0, curFarY=0, tgtFarX=0, tgtFarY=0, curMidX=0, curMidY=0, tgtMidX=0, tgtMidY=0, curNearX=0, curNearY=0, tgtNearX=0, tgtNearY=0, LERP=0.04;
  function applyTransforms() {
    farLayer.style.transform = 'translate3d('+curFarX+'px,'+(scrollY*0.02+curFarY)+'px,0)';
    midLayer.style.transform = 'translate3d('+curMidX+'px,'+(scrollY*0.05+curMidY)+'px,0)';
    nearLayer.style.transform = 'translate3d('+curNearX+'px,'+(scrollY*0.10+curNearY)+'px,0)';
    brightLayer.style.transform = 'translate3d('+curFarX+'px,'+(scrollY*0.02+curFarY)+'px,0)';
  }
  if (typeof Lenis !== 'undefined') {
    var lenis = new Lenis({ duration: 1.2, easing: function(t) { return 1 - Math.pow(1-t, 4); } });
    lenis.on('scroll', function(e) { scrollY = e.scroll; });
    function lenisLoop(ts) {
      lenis.raf(ts);
      curFarX+=(tgtFarX-curFarX)*LERP; curFarY+=(tgtFarY-curFarY)*LERP; curMidX+=(tgtMidX-curMidX)*LERP; curMidY+=(tgtMidY-curMidY)*LERP; curNearX+=(tgtNearX-curNearX)*LERP; curNearY+=(tgtNearY-curNearY)*LERP;
      applyTransforms(); requestAnimationFrame(lenisLoop);
    }
    requestAnimationFrame(lenisLoop);
  } else {
    window.addEventListener('scroll', function() { scrollY = window.scrollY; }, { passive: true });
    function fallbackLoop() { curFarX+=(tgtFarX-curFarX)*LERP; curFarY+=(tgtFarY-curFarY)*LERP; curMidX+=(tgtMidX-curMidX)*LERP; curMidY+=(tgtMidY-curMidY)*LERP; curNearX+=(tgtNearX-curNearX)*LERP; curNearY+=(tgtNearY-curNearY)*LERP; applyTransforms(); requestAnimationFrame(fallbackLoop); }
    requestAnimationFrame(fallbackLoop);
  }
  if (!isMobile) {
    window.addEventListener('mousemove', function(e) {
      tgtFarX=(e.clientX/window.innerWidth-0.5)*15; tgtFarY=(e.clientY/window.innerHeight-0.5)*10;
      tgtMidX=(e.clientX/window.innerWidth-0.5)*25; tgtMidY=(e.clientY/window.innerHeight-0.5)*18;
      tgtNearX=(e.clientX/window.innerWidth-0.5)*40; tgtNearY=(e.clientY/window.innerHeight-0.5)*28;
    }, { passive: true });
  }
})();

/* ─── SECTION-COMO-FUNCIONA — GSAP + ScrollTrigger + SplitType ─── */
(function initComoFunciona() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  var section = document.getElementById('como-funciona');
  if (!section) return;
  var cfHeadline = document.getElementById('cf-headline'), cfCards = Array.from(document.querySelectorAll('.cf-card')), cfLines = Array.from(document.querySelectorAll('.cf-line')), cfCta = document.getElementById('cf-cta'), cfTitle = document.getElementById('cf-title');
  var isMobile = window.innerWidth < 1024;
  if (cfTitle) { ScrollTrigger.create({ trigger: section, start: 'top 80%', onEnter: function() { gsap.from(cfTitle, { opacity: 0, y: 30, duration: 0.7, ease: 'power2.out' }); }, once: true }); }
  if (cfHeadline && typeof SplitType !== 'undefined') {
    var split = new SplitType(cfHeadline, { types: 'chars' });
    if (split.chars && split.chars.length) {
      gsap.set(split.chars, { opacity: 0, y: 40 });
      ScrollTrigger.create({ trigger: cfHeadline, start: 'top 85%', onEnter: function() { gsap.to(split.chars, { opacity: 1, y: 0, stagger: 0.04, duration: 0.7, ease: 'power2.out' }); }, once: true });
    }
  }
  if (isMobile) {
    cfCards.forEach(function(card) {
      var deg = parseFloat(getComputedStyle(card).getPropertyValue('--cf-rotate').trim()) || 0;
      gsap.set(card, { opacity: 0, y: 80, rotation: deg, scale: 0.92 });
      ScrollTrigger.create({ trigger: card, start: 'top 85%', onEnter: function() { gsap.to(card, { opacity: 1, y: 0, rotation: deg, scale: 1, duration: 0.8, ease: 'power2.out' }); }, once: true });
    });
    cfLines.forEach(function(line) {
      gsap.set(line, { scaleY: 0, transformOrigin: 'top' });
      ScrollTrigger.create({ trigger: line, start: 'top 90%', onEnter: function() { gsap.to(line, { scaleY: 1, duration: 0.6, ease: 'power2.out' }); }, once: true });
    });
  } else {
    var stepBig = document.getElementById('cf-step-big'), stepLabel = document.getElementById('cf-step-label');
    var stepData = [{ num: '01', name: 'CONVERSACIÓN INICIAL' },{ num: '02', name: 'FORMULARIO EN 10 MINUTOS' },{ num: '03', name: 'REVISIÓN Y AJUSTES' },{ num: '04', name: 'ENTREGA Y ACTIVACIÓN' }];
    function showStep(i) { if (!stepBig || !stepLabel) return; gsap.to([stepBig, stepLabel], { opacity: 0, duration: 0.2, onComplete: function() { stepBig.textContent = stepData[i].num; stepLabel.textContent = stepData[i].name; gsap.to([stepBig, stepLabel], { opacity: 1, duration: 0.4 }); } }); }
    cfCards.forEach(function(card, i) {
      gsap.from(card, { opacity: 0, y: 30, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: card, start: 'top 80%', once: true } });
      ScrollTrigger.create({ trigger: card, start: 'top 55%', end: 'bottom 45%', onEnter: function() { showStep(i); }, onEnterBack: function() { showStep(i); } });
    });
  }
  if (cfCta) { ScrollTrigger.create({ trigger: cfCta, start: 'top 90%', onEnter: function() { cfCta.classList.add('in-view'); }, once: true }); }
})();

/* ─── SECTION-GARANTIA — GSAP + ScrollTrigger + SplitType ───────── */
(function initGarantia() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  var section = document.getElementById('garantia');
  if (!section) return;
  var hlC = document.getElementById('garantia-hl-c'), shield = document.getElementById('garantia-shield'), text = document.getElementById('garantia-text'), cards = Array.from(document.querySelectorAll('.garantia-card')), grid = section.querySelector('.garantia-grid'), main = document.getElementById('garantia-main');
  if (hlC && typeof SplitType !== 'undefined') {
    var split = new SplitType(hlC, { types: 'chars' });
    if (split.chars && split.chars.length) {
      gsap.set(split.chars, { opacity: 0, y: 30 });
      ScrollTrigger.create({ trigger: hlC, start: 'top 85%', onEnter: function() { gsap.to(split.chars, { opacity: 1, y: 0, stagger: 0.05, duration: 0.6, ease: 'power2.out' }); }, once: true });
    }
  }
  if (shield && main) {
    gsap.set(shield, { opacity: 0, x: 60, scale: 0.9 });
    ScrollTrigger.create({ trigger: main, start: 'top 80%', onEnter: function() { gsap.to(shield, { opacity: 1, x: 0, scale: 1, duration: 1, delay: 0.2, ease: 'power2.out' }); }, once: true });
    gsap.to(shield, { y: -30, ease: 'none', scrollTrigger: { trigger: main, start: 'top bottom', end: 'bottom top', scrub: 1 } });
  }
  if (text && main) {
    gsap.set(text, { opacity: 0, x: -30 });
    ScrollTrigger.create({ trigger: main, start: 'top 80%', onEnter: function() { gsap.to(text, { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }); }, once: true });
  }
  if (cards.length && grid) {
    gsap.set(cards, { opacity: 0, y: 20 });
    ScrollTrigger.create({ trigger: grid, start: 'top 85%', onEnter: function() { gsap.to(cards, { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, delay: 0.3, ease: 'power2.out' }); }, once: true });
  }
})();

/* ─── SECTION-PRICING — Sección 7: Precios y planes ────────────── */
(function initPricing() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var section = document.getElementById('pricing-section');
  if (!section) return;

  var track  = document.getElementById('pricing-track');
  var cards  = Array.from(document.querySelectorAll('.pricing-card'));
  var footer = document.getElementById('pricing-footer');
  if (!track || cards.length < 3) return;

  /* ─ Footer states ─ */
  var footerStates = {
    seo:   document.getElementById('pf-state-seo'),
    elite: document.getElementById('pf-state-elite'),
    auto:  document.getElementById('pf-state-auto')
  };
  var currentPlan = 'elite';

  function switchFooter(plan) {
    if (plan === currentPlan || !footerStates[plan]) return;
    var outEl = footerStates[currentPlan];
    var inEl  = footerStates[plan];
    gsap.to(outEl, { opacity: 0, duration: 0.3, onComplete: function() {
      outEl.style.display = 'none';
      inEl.style.display  = 'flex';
      gsap.fromTo(inEl, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    }});
    currentPlan = plan;
  }

  /* ─ Card index → plan map ─ */
  var cardPlans = cards.map(function(c) { return c.dataset.plan; }); // ['seo','elite','auto']

  /* ─ Carousel logic ─ */
  var activeIndex = 1; // Elite centered by default
  var isScrollByCode = false;
  var scrollTimer;

  function updateCardStates(newIndex, animate) {
    cards.forEach(function(card, i) {
      var active = (i === newIndex);
      var ry = i < newIndex ? 5 : (i > newIndex ? -5 : 0);
      var tgt = active
        ? { scale: 1.04, y: -6, opacity: 1,   rotationY: 0,  duration: 0.45, ease: 'power2.out' }
        : { scale: 0.92, y:  0, opacity: 0.7,  rotationY: ry, duration: 0.45, ease: 'power2.out' };
      if (animate) gsap.to(card, tgt);
      else         gsap.set(card, tgt);
    });
    switchFooter(cardPlans[newIndex]);
    activeIndex = newIndex;
  }

  function scrollToCard(index, smooth) {
    smooth = (smooth !== false);
    var card     = cards[index];
    var halfTrack = track.offsetWidth  / 2;
    var halfCard  = card.offsetWidth   / 2;
    var target    = card.offsetLeft - halfTrack + halfCard;
    isScrollByCode = true;
    track.scrollTo({ left: target, behavior: smooth ? 'smooth' : 'instant' });
    updateCardStates(index, smooth);
    setTimeout(function() { isScrollByCode = false; }, smooth ? 500 : 60);
  }

  function findClosestCard() {
    var center = track.scrollLeft + track.offsetWidth / 2;
    var closest = 0, minDist = Infinity;
    cards.forEach(function(card, i) {
      var d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (d < minDist) { minDist = d; closest = i; }
    });
    return closest;
  }

  cards.forEach(function(card, i) {
    card.addEventListener('click', function() { scrollToCard(i); });
  });

  track.addEventListener('scroll', function() {
    if (isScrollByCode) return;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function() {
      var closest = findClosestCard();
      if (closest !== activeIndex) scrollToCard(closest);
    }, 150);
  }, { passive: true });

  window.addEventListener('resize', function() { scrollToCard(activeIndex, false); });

  /* ─ SplitType on "DIGITAL" ─ */
  var digitalEl = document.getElementById('pricing-hl-digital');
  if (digitalEl && typeof SplitType !== 'undefined') {
    var split = new SplitType(digitalEl, { types: 'chars' });
    if (split.chars && split.chars.length) {
      gsap.set(split.chars, { opacity: 0, y: 30 });
      ScrollTrigger.create({
        trigger: digitalEl,
        start: 'top 85%',
        onEnter: function() { gsap.to(split.chars, { opacity: 1, y: 0, stagger: 0.05, duration: 0.6, ease: 'power2.out' }); },
        once: true
      });
    }
  }

  /* ─ GSAP entry: cards rise from below with stagger ─ */
  gsap.set(cards[0], { opacity: 0, y: 80, scale: 0.92, transformPerspective: 800, rotationY:  5 });
  gsap.set(cards[1], { opacity: 0, y: 80, scale: 0.9,  transformPerspective: 800, rotationY:  0 });
  gsap.set(cards[2], { opacity: 0, y: 80, scale: 0.92, transformPerspective: 800, rotationY: -5 });

  ScrollTrigger.create({
    trigger: section,
    start: 'top 75%',
    onEnter: function() {
      /* SEO — left */
      gsap.to(cards[0], { opacity: 0.7, y: 0, scale: 0.92, rotationY:  5, duration: 0.9, ease: 'power3.out', delay: 0 });
      /* ELITE — center (most dramatic) */
      gsap.to(cards[1], { opacity: 1,   y: -6, scale: 1.04, rotationY:  0, duration: 0.9, ease: 'power3.out', delay: 0.15 });
      /* AUTO — right */
      gsap.to(cards[2], { opacity: 0.7, y: 0, scale: 0.92, rotationY: -5, duration: 0.9, ease: 'power3.out', delay: 0.30 });
    },
    once: true
  });

  /* ─ Footer entry animation ─ */
  if (footer) {
    gsap.set(footer, { opacity: 0, y: 20 });
    ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      onEnter: function() { gsap.to(footer, { opacity: 1, y: 0, duration: 0.7, delay: 0.6, ease: 'power2.out' }); },
      once: true
    });
  }

  /* ─ Initialize ─ */
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      scrollToCard(1, false); // center Elite on load
    });
  });
})();
