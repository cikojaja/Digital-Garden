/* ═══════════════════════════════════════
   MALERFACHBETRIEB HORST KÖNIG — script.js
═══════════════════════════════════════ */

/* ─── Custom Cursor ─── */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;

if (cursor && follower && window.innerWidth > 768) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });
  function animateFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .gallery-item, .service-card, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '18px';
      cursor.style.height = '18px';
      follower.style.width  = '50px';
      follower.style.height = '50px';
      follower.style.borderColor = '#b51a1e';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '10px';
      cursor.style.height = '10px';
      follower.style.width  = '34px';
      follower.style.height = '34px';
      follower.style.borderColor = '#00346d';
    });
  });
}

/* ─── Preloader ─── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('hidden');
  }, 1900);
});

/* ─── Navbar scroll ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
}, { passive: true });

/* ─── Mobile menu ─── */
const toggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
toggle?.addEventListener('click', () => {
  toggle.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

/* ─── Smooth scroll for all .scroll-link ─── */
document.querySelectorAll('.scroll-link').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    toggle?.classList.remove('open');
    mobileMenu?.classList.remove('open');
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── Reveal animations ─── */
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = parseInt(el.dataset.delay || '0', 10);
    setTimeout(() => el.classList.add('in-view'), delay);
    revealObserver.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

/* ─── Active nav highlight ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach(l => l.classList.remove('active'));
      const match = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}
window.addEventListener('scroll', setActiveNav, { passive: true });

/* ─── Gallery filter ─── */
const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => {
      b.classList.remove('filter-btn-active');
      b.classList.add('filter-btn-outline');
    });
    btn.classList.add('filter-btn-active');
    btn.classList.remove('filter-btn-outline');
    // Future: filter gallery items by data-category attribute
  });
});

/* ─── Contact form ─── */
const form = document.getElementById('contact-form');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = '✓ Anfrage gesendet!';
  btn.style.background = '#00346d';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
    btn.disabled = false;
    form.reset();
  }, 4000);
});

/* ─── Lazy images ─── */
document.querySelectorAll('img').forEach(img => {
  img.style.opacity = '0';
  img.style.transition = 'opacity 0.5s ease';
  if (img.complete) {
    img.style.opacity = '1';
  } else {
    img.addEventListener('load', () => { img.style.opacity = '1'; });
    img.addEventListener('error', () => { img.style.opacity = '1'; });
  }
});

// Hide nav if embedded
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('embed') === 'true') {
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.style.display = 'none';
  const toggle = document.getElementById('menu-toggle');
  if (toggle) toggle.style.display = 'none';
}
