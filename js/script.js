/* ===========================
   WAVEHOST — script.js
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar scroll ---- */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ---- Hamburger ---- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  hamburger?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    hamburger.classList.toggle('active');
    if (hamburger.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  /* ---- Scroll fade-up ---- */
  const fadeEls = document.querySelectorAll('.fade-up');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => io.observe(el));

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---- Cookie banner ---- */
  const banner = document.getElementById('cookieBanner');
  const COOKIE_KEY = 'wh_cookie_consent';
  if (banner && !localStorage.getItem(COOKIE_KEY)) {
    setTimeout(() => banner.classList.remove('hidden'), 800);
  } else if (banner) { banner.remove(); }

  document.getElementById('cookieAccept')?.addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    banner.classList.add('hidden');
    setTimeout(() => banner.remove(), 500);
  });
  document.getElementById('cookieReject')?.addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, 'rejected');
    banner.classList.add('hidden');
    setTimeout(() => banner.remove(), 500);
  });

  /* ---- Wave canvas animation ---- */
  const canvas = document.getElementById('waveCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, t = 0;

    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = 160; };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const drawWaves = () => {
      ctx.clearRect(0, 0, W, H);
      const waves = [
        { amp: 22, freq: 0.012, speed: 0.03, offset: 0,    alpha: 0.18, color: '#00c4e8' },
        { amp: 16, freq: 0.018, speed: 0.045, offset: 1.5, alpha: 0.12, color: '#1a7fd4' },
        { amp: 12, freq: 0.008, speed: 0.02, offset: 3,    alpha: 0.08, color: '#38bdf8' },
      ];
      waves.forEach(w => {
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let x = 0; x <= W; x += 4) {
          const y = H * 0.55 + Math.sin(x * w.freq + t * w.speed + w.offset) * w.amp
                             + Math.sin(x * w.freq * 1.7 + t * w.speed * 1.3) * (w.amp * 0.4);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
        ctx.fillStyle = w.color;
        ctx.globalAlpha = w.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      t += 1;
      requestAnimationFrame(drawWaves);
    };
    drawWaves();
  }

  /* ---- Floating particles ---- */
  const particleContainer = document.querySelector('.particles');
  if (particleContainer) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 2;
      p.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${Math.random() * 100}%;
        bottom: ${Math.random() * 20}%;
        animation-duration: ${8 + Math.random() * 14}s;
        animation-delay: ${Math.random() * 8}s;
      `;
      particleContainer.appendChild(p);
    }
  }

  /* ---- Hero text animation ---- */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(30px)';
    setTimeout(() => {
      heroTitle.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
      heroTitle.style.opacity = '1';
      heroTitle.style.transform = 'translateY(0)';
    }, 200);
  }
  const heroBtns = document.querySelector('.hero-btns');
  if (heroBtns) {
    heroBtns.style.opacity = '0';
    heroBtns.style.transform = 'translateY(20px)';
    setTimeout(() => {
      heroBtns.style.transition = 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s';
      heroBtns.style.opacity = '1';
      heroBtns.style.transform = 'translateY(0)';
    }, 200);
  }

  /* ---- Animated stat counters ---- */
  const statEls = document.querySelectorAll('.stat-value[data-count]');
  const statsIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = +el.dataset.count;
        const suffix = el.dataset.suffix || '';
        let start = 0;
        const step = target / 60;
        const tick = () => {
          start = Math.min(start + step, target);
          el.textContent = Math.floor(start) + suffix;
          if (start < target) requestAnimationFrame(tick);
          else el.textContent = target + suffix;
        };
        tick();
        statsIO.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statEls.forEach(el => statsIO.observe(el));

});
