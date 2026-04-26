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

  // When a video first loads data, remove the placeholder class so the shimmer stops
  filmMedia.forEach(v => {
    v.addEventListener('loadeddata', () => {
      const card = v.closest('.film-card, .film-tile');
      if (card) card.classList.remove('film-card--placeholder', 'film-tile--placeholder');
      if (card && card.classList.contains('film-card')) card.classList.add('is-playing');
    }, { once: true });
  });

  const videoIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) {
        const p = v.play();
        if (p && typeof p.catch === 'function') p.catch(() => { /* silent */ });
      } else {
        try { v.pause(); } catch (err) {}
      }
    });
  }, { threshold: 0.15, rootMargin: '200px 0px' });

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

// ---------- Mobile nav drawer ----------
(function() {
  const burger = document.querySelector('.nav__burger');
  if (!burger) return;

  // Create drawer + overlay dynamically so we don't need to edit every HTML file
  const drawer = document.createElement('div');
  drawer.className = 'nav__drawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-label', 'Site navigation');
  drawer.innerHTML = `
    <button class="nav__drawer-close" aria-label="Close menu">&times;</button>
    <a href="index.html">Home</a>
    <a href="work.html">Work</a>
    <a href="services.html">Capabilities</a>
    <a href="visuals.html">Visuals</a>
    <a href="blog.html">Journal</a>
    <a href="sectors.html">Sectors</a>
    <a href="tool.html">Strategy Tool</a>
    <a href="about.html">Studio</a>
    <a href="contact.html">Contact</a>
    <div class="nav__drawer-cta"><a href="tool.html">Strategy Tool &nbsp;→</a></div>
  `;
  const overlay = document.createElement('div');
  overlay.className = 'nav__drawer-overlay';
  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  // Mark active page
  const path = window.location.pathname.split('/').pop() || 'index.html';
  drawer.querySelectorAll('a[href]').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  const open = () => {
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    document.body.classList.add('nav-open');
  };
  const close = () => {
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.classList.remove('nav-open');
  };

  burger.addEventListener('click', open);
  overlay.addEventListener('click', close);
  drawer.querySelector('.nav__drawer-close').addEventListener('click', close);
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
  });
  // Close if user taps a link (navigates away anyway, but prevents flash)
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
})();


// ---------- Films marquee: user interaction v2 ----------
// Wraps each .films__stage in a .films__viewport, moves arrows to the viewport
// (so they don't scroll with the content), and enables drag/swipe scrolling.
(function() {
  const stages = document.querySelectorAll('.films__stage');
  if (!stages.length) return;

  stages.forEach(stage => {
    const track = stage.querySelector('.films__track');
    if (!track) return;

    // Wrap stage in a viewport container so arrows sit outside the scroll context
    const viewport = document.createElement('div');
    viewport.className = 'films__viewport';
    stage.parentNode.insertBefore(viewport, stage);
    viewport.appendChild(stage);

    // Build arrows and hint, attach to VIEWPORT (not stage)
    const prev = document.createElement('button');
    prev.className = 'films__nav films__nav--prev';
    prev.setAttribute('aria-label', 'Previous films');
    prev.type = 'button';

    const next = document.createElement('button');
    next.className = 'films__nav films__nav--next';
    next.setAttribute('aria-label', 'Next films');
    next.type = 'button';

    const hint = document.createElement('div');
    hint.className = 'films__hint';
    hint.textContent = 'Drag · Swipe';

    viewport.appendChild(prev);
    viewport.appendChild(next);
    viewport.appendChild(hint);

    let interactive = false;

    function activate() {
      if (interactive) return;
      interactive = true;
      viewport.classList.add('is-active');

      // Capture current animation position before stopping it
      let currentX = 0;
      try {
        const cs = getComputedStyle(track);
        const matrix = new DOMMatrixReadOnly(cs.transform);
        currentX = matrix.m41 || 0;
      } catch (err) {
        currentX = 0;
      }

      track.style.animation = 'none';
      track.style.transform = 'none';
      stage.classList.add('is-interactive');
      stage.scrollLeft = -currentX;

      updateArrowState();
    }

    // ---------- Drag scrolling on the stage ----------
    let isDown = false, startX = 0, scrollStart = 0, hasMoved = false;

    function onPointerDown(e) {
      // Only handle direct interactions (not from button clicks)
      if (e.target.closest('.films__nav')) return;
      activate();
      isDown = true;
      hasMoved = false;
      startX = e.pageX;
      scrollStart = stage.scrollLeft;
      stage.classList.add('is-dragging');
      try { stage.setPointerCapture(e.pointerId); } catch (err) {}
    }

    function onPointerMove(e) {
      if (!isDown) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 5) hasMoved = true;
      stage.scrollLeft = scrollStart - dx;
    }

    function onPointerUp(e) {
      if (!isDown) return;
      isDown = false;
      stage.classList.remove('is-dragging');
      try { stage.releasePointerCapture(e.pointerId); } catch (err) {}
      updateArrowState();
    }

    stage.addEventListener('pointerdown', onPointerDown);
    stage.addEventListener('pointermove', onPointerMove);
    stage.addEventListener('pointerup', onPointerUp);
    stage.addEventListener('pointercancel', onPointerUp);
    stage.addEventListener('pointerleave', onPointerUp);

    // Suppress click-after-drag
    stage.addEventListener('click', (e) => {
      if (hasMoved) {
        e.stopPropagation();
        e.preventDefault();
      }
    }, true);

    // ---------- Wheel routing ----------
    stage.addEventListener('wheel', (e) => {
      if (!interactive) {
        // Activate on first wheel
        activate();
      }
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 0) {
        stage.scrollLeft += delta;
        e.preventDefault();
      }
    }, { passive: false });

    // ---------- Arrow buttons ----------
    function arrowScroll(dir) {
      activate();
      const card = stage.querySelector('.film-card');
      const cardWidth = card ? card.offsetWidth + 32 : 320;
      stage.scrollBy({ left: dir * cardWidth * 1.5, behavior: 'smooth' });
      setTimeout(updateArrowState, 350);
    }

    prev.addEventListener('click', (e) => {
      e.stopPropagation();
      arrowScroll(-1);
    });

    next.addEventListener('click', (e) => {
      e.stopPropagation();
      arrowScroll(1);
    });

    function updateArrowState() {
      if (!interactive) return;
      const max = stage.scrollWidth - stage.clientWidth;
      prev.setAttribute('aria-disabled', stage.scrollLeft <= 2 ? 'true' : 'false');
      next.setAttribute('aria-disabled', stage.scrollLeft >= max - 2 ? 'true' : 'false');
    }

    stage.addEventListener('scroll', () => {
      clearTimeout(stage._scrollTimer);
      stage._scrollTimer = setTimeout(updateArrowState, 80);
    });

    // Keyboard arrows when stage focused
    stage.setAttribute('tabindex', '0');
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); arrowScroll(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); arrowScroll(1); }
    });

    // Set initial arrow disabled state (left disabled until activated and scrolled)
    prev.setAttribute('aria-disabled', 'false');
    next.setAttribute('aria-disabled', 'false');
  });
})();
