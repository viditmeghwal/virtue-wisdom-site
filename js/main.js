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
    <a href="about.html">Studio</a>
    <a href="contact.html">Contact</a>
    <div class="nav__drawer-cta"><a href="contact.html">Start a project &nbsp;→</a></div>
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

// ---------- Films marquee: user interaction (drag, swipe, arrows) ----------
(function() {
  const stages = document.querySelectorAll('.films__stage');
  if (!stages.length) return;

  stages.forEach(stage => {
    const track = stage.querySelector('.films__track');
    if (!track) return;

    // Inject nav arrows + hint
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
    stage.appendChild(prev);
    stage.appendChild(next);
    stage.appendChild(hint);

    // Switch to interactive mode (cancel CSS animation, enable scroll)
    let interactive = false;
    function activate() {
      if (interactive) return;
      interactive = true;

      // Read the current animation translateX so we can preserve scroll position
      const cs = getComputedStyle(track);
      const matrix = new DOMMatrixReadOnly(cs.transform);
      const currentX = matrix.m41 || 0;

      // Stop animation, reset transform, set scrollLeft to match where the animation was
      track.style.animation = 'none';
      track.style.transform = 'none';
      stage.classList.add('is-interactive');
      stage.scrollLeft = -currentX;

      updateArrowState();
    }

    // ---- Pointer drag to scroll ----
    let isDown = false, startX = 0, scrollStart = 0, hasMoved = false;

    stage.addEventListener('pointerdown', (e) => {
      activate();
      isDown = true;
      hasMoved = false;
      startX = e.pageX;
      scrollStart = stage.scrollLeft;
      stage.classList.add('is-dragging');
      // Prevent text/image selection while dragging
      stage.setPointerCapture(e.pointerId);
    });

    stage.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 4) hasMoved = true;
      stage.scrollLeft = scrollStart - dx;
    });

    function endDrag(e) {
      if (!isDown) return;
      isDown = false;
      stage.classList.remove('is-dragging');
      try { stage.releasePointerCapture(e.pointerId); } catch (err) {}
      updateArrowState();
    }

    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('pointerleave', endDrag);

    // Prevent click-through after a drag (so accidental drags don't trigger card interactions)
    stage.addEventListener('click', (e) => {
      if (hasMoved) {
        e.stopPropagation();
        e.preventDefault();
      }
    }, true);

    // ---- Wheel scroll: convert vertical wheel to horizontal scroll inside the stage ----
    stage.addEventListener('wheel', (e) => {
      if (!interactive) return;
      // If the user is actually scrolling vertically (with intent), don't hijack
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) < 30) return;
      // Otherwise, route any horizontal-ish wheel to scrollLeft
      if (Math.abs(e.deltaX) > 0 || Math.abs(e.deltaY) > 0) {
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        stage.scrollLeft += delta;
        e.preventDefault();
      }
    }, { passive: false });

    // ---- Arrow buttons ----
    function arrowScroll(dir) {
      activate();
      const card = stage.querySelector('.film-card');
      const cardWidth = card ? card.offsetWidth + 32 : 320; // 32 = gap
      stage.scrollBy({ left: dir * cardWidth * 1.5, behavior: 'smooth' });
      setTimeout(updateArrowState, 350);
    }

    prev.addEventListener('click', () => arrowScroll(-1));
    next.addEventListener('click', () => arrowScroll(1));

    // Update arrow disabled state at edges
    function updateArrowState() {
      const max = stage.scrollWidth - stage.clientWidth;
      prev.setAttribute('aria-disabled', stage.scrollLeft <= 2 ? 'true' : 'false');
      next.setAttribute('aria-disabled', stage.scrollLeft >= max - 2 ? 'true' : 'false');
    }

    stage.addEventListener('scroll', () => {
      // Throttle a bit
      clearTimeout(stage._scrollTimer);
      stage._scrollTimer = setTimeout(updateArrowState, 80);
    });

    // ---- Keyboard support ----
    stage.setAttribute('tabindex', '0');
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); arrowScroll(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); arrowScroll(1); }
    });
  });
})();
