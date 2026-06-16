/* ═══════════════════════════════════════
   PLANTEN COFFEE — script.js
   Lenis smooth scroll + premium animations
═══════════════════════════════════════ */

/* ─── Lenis Smooth Scroll ─── */
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 0.9,
  touchMultiplier: 1.5,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Anchor links with Lenis
document.querySelectorAll('[data-scroll]').forEach(el => {
  el.addEventListener('click', e => {
    const href = el.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -80, duration: 1.6 });
    // close mobile nav
    mobileNav.classList.remove('open');
    burger.classList.remove('open');
  });
});

/* ─── Preloader ─── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('done');
    document.documentElement.classList.remove('no-js');
    // trigger hero text after preloader
    splitAndAnimate();
  }, 2100);
});

/* ─── Custom cursor ─── */
const cursor = document.getElementById('cursor');
const dot = cursor?.querySelector('.cursor-dot');
const ring = cursor?.querySelector('.cursor-ring');
let cx = 0, cy = 0, rx = 0, ry = 0;

if (cursor && window.innerWidth > 768) {
  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    dot.style.left = cx + 'px';
    dot.style.top  = cy + 'px';
  });

  (function followRing() {
    rx += (cx - rx) * 0.1;
    ry += (cy - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(followRing);
  })();

  document.querySelectorAll('a, button, .menu-card, .g-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ─── Nav scroll state ─── */
const nav = document.getElementById('nav');
lenis.on('scroll', ({ scroll }) => {
  nav.classList.toggle('scrolled', scroll > 60);
});

/* ─── Mobile Nav ─── */
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobile-nav');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileNav.classList.toggle('open');
  if (mobileNav.classList.contains('open')) lenis.stop(); else lenis.start();
});

/* ─── Hero parallax (Lenis scroll-linked) ─── */
const heroImg = document.getElementById('hero-img');
lenis.on('scroll', ({ scroll }) => {
  if (heroImg && scroll < window.innerHeight * 1.5) {
    heroImg.style.transform = `scale(1.08) translateY(${scroll * 0.25}px)`;
  }
});

/* ─── Split text animation ─── */
function splitAndAnimate() {
  document.querySelectorAll('.split-text').forEach((el, i) => {
    const text = el.textContent;
    el.innerHTML = '';
    [...text].forEach((char, j) => {
      const span = document.createElement('span');
      span.className = 'split-char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.transitionDelay = `${i * 80 + j * 22}ms`;
      el.appendChild(span);
    });
    requestAnimationFrame(() => {
      el.querySelectorAll('.split-char').forEach(s => s.classList.add('visible'));
    });
  });
}

/* ─── Scroll reveal (IntersectionObserver) ─── */
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const delay = parseInt(e.target.dataset.delay || '0', 10);
    setTimeout(() => e.target.classList.add('visible'), delay);
    revObs.unobserve(e.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ─── Parallax images on scroll (Lenis) ─── */
const parallaxEls = document.querySelectorAll('.parallax-img');
lenis.on('scroll', ({ scroll }) => {
  parallaxEls.forEach(el => {
    const rect = el.closest('[class]').getBoundingClientRect();
    const speed = parseFloat(el.dataset.speed || '0.1');
    const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
    el.style.transform = `translateY(${offset}px) scale(1.1)`;
  });
});

/* ─── Horizontal gallery drag scroll ─── */
const track = document.getElementById('gallery-track');
if (track) {
  let isDown = false, startX, scrollLeft;

  track.addEventListener('mousedown', e => {
    isDown = true; track.style.cursor = 'grabbing';
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });
  track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = 'grab'; });
  track.addEventListener('mouseup', () => { isDown = false; track.style.cursor = 'grab'; });
  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
}

/* ─── Lazy image fade ─── */
document.querySelectorAll('img').forEach(img => {
  img.style.opacity = '0';
  img.style.transition = 'opacity 0.7s ease';
  const show = () => { img.style.opacity = '1'; };
  if (img.complete) show();
  else { img.addEventListener('load', show); img.addEventListener('error', show); }
});

// Hide nav if embedded
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('embed') === 'true') {
  const nav = document.getElementById('nav');
  if (nav) nav.style.display = 'none';
  const burger = document.getElementById('burger');
  if (burger) burger.style.display = 'none';
}
