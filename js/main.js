/* ============================================
   Virtue & Wisdom — site scripts
   ============================================ */

// ---------- Nav scroll state ----------
const nav = document.querySelector('.nav');
if (nav) {
  const onScroll = () => {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    // If the nav started dark (over hero) and we've scrolled past hero, flip to light
    if (nav.dataset.heroDark === 'true') {
      const hero = document.querySelector('.hero-cine, .hero');
      if (hero) {
        const heroBottom = hero.offsetTop + hero.offsetHeight - 80;
        if (window.scrollY > heroBottom) {
          nav.classList.remove('is-dark');
        } else {
          nav.classList.add('is-dark');
        }
      }
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ---------- Reveal on scroll ----------
const revealTargets = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealTargets.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealTargets.forEach(el => io.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add('is-in'));
}

// ---------- Work page filters ----------
const filterBtns = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project');

if (filterBtns.length && projects.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projects.forEach(p => {
        const cats = (p.dataset.category || '').split(',').map(s => s.trim());
        if (filter === 'all' || cats.includes(filter)) {
          p.classList.remove('is-hidden');
        } else {
          p.classList.add('is-hidden');
        }
      });
    });
  });
}

// ---------- Contact form: chips ----------
const chips = document.querySelectorAll('.chip');
chips.forEach(c => {
  c.addEventListener('click', () => c.classList.toggle('selected'));
});

// ---------- Contact form submission (demo) ----------
const contactForm = document.querySelector('.contact__form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    if (!btn) return;
    const original = btn.innerHTML;
    btn.innerHTML = 'Sent ✓';
    setTimeout(() => {
      btn.innerHTML = original;
      contactForm.reset();
      chips.forEach(c => c.classList.remove('selected'));
    }, 2400);
  });
}

// ---------- Year in footer ----------
const yearEls = document.querySelectorAll('[data-year]');
yearEls.forEach(el => el.textContent = new Date().getFullYear());

// ---------- Films: lazy-load + auto-play videos when in view ----------
// Videos use data-src (not src) so browsers don't download them at page load.
// When a card or tile scrolls into view, we:
//   1. Check if the MP4 exists (via HEAD request)
//   2. If yes: swap data-src → src, load, play, remove placeholder style
//   3. If no:  leave the placeholder in place (so the section still looks intentional)

const filmMedia = document.querySelectorAll('.film-card__media, .film-tile__media');

if (filmMedia.length && 'IntersectionObserver' in window) {
  const loadedSet = new Set();

  const activateVideo = (videoEl) => {
    const source = videoEl.querySelector('source[data-src]');
    if (!source) return;
    const url = source.getAttribute('data-src');
    if (loadedSet.has(url)) return;
    loadedSet.add(url);

    // If the video errors (file missing, codec issue), keep the placeholder visible.
    videoEl.addEventListener('error', () => {
      // Silent — the poster image stays visible underneath
    }, { once: true });

    // When the video has enough data to play, drop the placeholder shimmer
    videoEl.addEventListener('loadeddata', () => {
      const card = videoEl.closest('.film-card, .film-tile');
      if (card) card.classList.remove('film-card--placeholder', 'film-tile--placeholder');
      if (card && card.classList.contains('film-card')) card.classList.add('is-playing');
    }, { once: true });

    // Activate: swap data-src → src, load, play
    source.setAttribute('src', url);
    source.removeAttribute('data-src');
    videoEl.load();
    const playPromise = videoEl.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => { /* autoplay blocked or other — silent */ });
    }
  };

  const videoIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        activateVideo(e.target);
      } else {
        // Pause when out of view to save CPU
        try { e.target.pause(); } catch (err) {}
      }
    });
  }, { threshold: 0.15, rootMargin: '100px 0px' });

  filmMedia.forEach(v => videoIO.observe(v));
}

// ---------- Hover-to-play for grid tiles (extra polish on desktop) ----------
const filmTiles = document.querySelectorAll('.film-tile');
filmTiles.forEach(tile => {
  const video = tile.querySelector('.film-tile__media');
  if (!video) return;
  tile.addEventListener('mouseenter', () => {
    const src = video.querySelector('source')?.getAttribute('src');
    if (src) { video.currentTime = 0; video.play().catch(() => {}); }
  });
  tile.addEventListener('mouseleave', () => {
    try { video.pause(); } catch (e) {}
  });
});

// ---------- Cinematic hero particle field ----------
(function() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let width, height, particles = [];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticles() {
    particles = [];
    // Fewer particles on mobile / small viewports
    const count = Math.min(120, Math.max(40, Math.floor(width * height / 18000)));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        // Size: mostly small, occasional larger ones
        r: Math.random() < 0.85 ? Math.random() * 1.2 + 0.2 : Math.random() * 2.2 + 1.2,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.1 - 0.05, // slight upward drift
        // Opacity pulses
        baseOpacity: Math.random() * 0.5 + 0.15,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.008 + 0.004,
        // Color variant: mostly white, occasional gold accent
        gold: Math.random() < 0.15
      });
    }
  }

  let rafId;
  function animate(t) {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < -5) p.x = width + 5;
      if (p.x > width + 5) p.x = -5;
      if (p.y < -5) p.y = height + 5;
      if (p.y > height + 5) p.y = -5;

      // Pulse opacity
      const opacity = p.baseOpacity + Math.sin(t * p.pulseSpeed + p.phase) * 0.2;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? `rgba(176, 141, 87, ${Math.max(0, opacity)})`
        : `rgba(255, 255, 255, ${Math.max(0, opacity)})`;
      ctx.fill();
    }

    rafId = requestAnimationFrame(animate);
  }

  function init() {
    resize();
    createParticles();
    if (!reduceMotion) {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(animate);
    } else {
      // Render once without motion for reduced-motion users
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold ? 'rgba(176,141,87,0.4)' : 'rgba(255,255,255,0.3)';
        ctx.fill();
      });
    }
  }

  init();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 150);
  });

  // Pause animation when hero is offscreen (saves CPU/battery)
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          if (!reduceMotion && !rafId) rafId = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      });
    }, { threshold: 0 });
    io.observe(canvas);
  }
})();
