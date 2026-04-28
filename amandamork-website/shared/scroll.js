/* ============================================================
   AMANDAMORK.COM — SHARED SCROLL BEHAVIOR
   Reveal triggers, counter animations, scroll progress, header.
   ============================================================ */

(function () {
  'use strict';

  // Respect reduced motion
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  document
    .querySelectorAll('.reveal, .reveal-stagger')
    .forEach((el) => revealObserver.observe(el));

  /* ---------- Counter animation ---------- */
  const formatNumber = (n, format) => {
    if (format === 'comma') return n.toLocaleString('en-US');
    if (format === 'k') {
      if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
      return Math.round(n).toString();
    }
    if (format === 'm') {
      return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (format === 'dollarM') {
      return '$' + (n / 1000000).toFixed(0) + 'M';
    }
    return Math.round(n).toString();
  };

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.target);
    const duration = parseInt(el.dataset.duration) || 1800;
    const format = el.dataset.format || 'plain';
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';

    if (reduceMotion) {
      el.textContent = prefix + formatNumber(target, format) + suffix;
      return;
    }

    const start = performance.now();
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);
      const current = target * eased;
      el.textContent = prefix + formatNumber(current, format) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + formatNumber(target, format) + suffix;
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  document
    .querySelectorAll('[data-counter]')
    .forEach((el) => counterObserver.observe(el));

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.querySelector('.scroll-progress > div');
  if (progressBar) {
    let ticking = false;
    const updateProgress = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      progressBar.style.width = pct + '%';
      ticking = false;
    };
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(updateProgress);
          ticking = true;
        }
      },
      { passive: true }
    );
    updateProgress();
  }

  /* ---------- Header backdrop on scroll ---------- */
  const header = document.querySelector('.header-strip');
  if (header) {
    let ticking = false;
    const updateHeader = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
      ticking = false;
    };
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(updateHeader);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* ---------- Parallax (subtle, transform-based) ---------- */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length && !reduceMotion) {
    let ticking = false;
    const updateParallax = () => {
      const sy = window.scrollY;
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        const rect = el.getBoundingClientRect();
        const offsetTop = rect.top + sy;
        const yOffset = (sy - offsetTop) * speed;
        el.style.transform = `translate3d(0, ${yOffset}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
    updateParallax();
  }

  /* ---------- Pinned section progress (for scrollytelling) ---------- */
  document.querySelectorAll('[data-pin-track]').forEach((track) => {
    const stages = track.querySelectorAll('[data-pin-stage]');
    if (!stages.length) return;
    const update = () => {
      const rect = track.getBoundingClientRect();
      const h = track.offsetHeight - window.innerHeight;
      if (h <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / h));
      const stageIndex = Math.min(
        stages.length - 1,
        Math.floor(progress * stages.length)
      );
      stages.forEach((s, i) => s.classList.toggle('active', i === stageIndex));
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  });
})();
