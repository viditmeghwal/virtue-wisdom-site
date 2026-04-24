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
      const hero = document.querySelector('.hero');
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

    // HEAD-probe the file so we only activate real videos; missing files stay placeholders.
    fetch(url, { method: 'HEAD' })
      .then(r => {
        if (!r.ok) throw new Error('not found');
        source.setAttribute('src', url);
        source.removeAttribute('data-src');
        videoEl.load();
        const card = videoEl.closest('.film-card, .film-tile');
        if (card) card.classList.remove('film-card--placeholder', 'film-tile--placeholder');
        videoEl.play().catch(() => { /* autoplay blocked — silent fail */ });
        if (card && card.classList.contains('film-card')) card.classList.add('is-playing');
      })
      .catch(() => { /* leave as placeholder */ });
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
