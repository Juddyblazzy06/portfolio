/* ══════════════════════════════════════════════════
   ALEX MONROE PORTFOLIO — script.js
   Features: Preloader · Custom Cursor · Scroll Progress ·
   Reveal Animations · Typed Text · Counter Animation ·
   Particle Background · Work Filter · Lightbox ·
   Skill Bars · Tabs · Testimonial Slider ·
   Form Validation · Back to Top · Nav Active State
══════════════════════════════════════════════════ */

"use strict";

/* ── Helpers ── */
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

/* ══════════════════════════════════════════════════
   1. PRELOADER
══════════════════════════════════════════════════ */
(function initPreloader() {
  const loader = $('#preloader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1900);
  });
  document.body.style.overflow = 'hidden';
})();

/* ══════════════════════════════════════════════════
   2. CUSTOM CURSOR
══════════════════════════════════════════════════ */
(function initCursor() {
  const cursor = $('#cursor');
  const ring   = $('#cursor-ring');
  const label  = $('#cursor-label');
  if (!cursor) return;

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
    if (label) {
      label.style.left = (mx + 20) + 'px';
      label.style.top  = my + 'px';
    }
  });

  // Smooth ring follow
  (function animRing() {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  // Hover states
  function setHover(el) {
    const txt = el.dataset.cursor || '';
    ring.style.width  = '60px';
    ring.style.height = '60px';
    ring.style.borderColor = 'rgba(201,168,76,.8)';
    cursor.style.transform = 'translate(-50%,-50%) scale(0.4)';
    if (label && txt) { label.textContent = txt; label.classList.add('visible'); }
  }
  function clearHover() {
    ring.style.width  = '36px';
    ring.style.height = '36px';
    ring.style.borderColor = 'rgba(201,168,76,.55)';
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    if (label) { label.classList.remove('visible'); }
  }

  on(document, 'mouseover', e => {
    const t = e.target.closest('a, button, .work-card, .skill-card, .ts-prev, .ts-next, .filter-btn, .tab-btn, .exp-tab-btn');
    if (t) setHover(t); else clearHover();
  });
  on(document, 'mouseout', e => {
    const t = e.target.closest('a, button, .work-card, .skill-card, .ts-prev, .ts-next, .filter-btn, .tab-btn, .exp-tab-btn');
    if (t) clearHover();
  });

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; ring.style.opacity = '1'; });
})();

/* ══════════════════════════════════════════════════
   3. SCROLL PROGRESS BAR
══════════════════════════════════════════════════ */
(function initScrollProgress() {
  const bar = $('#scroll-progress');
  if (!bar) return;
  function update() {
    const h = document.documentElement;
    const pct = h.scrollTop / (h.scrollHeight - h.clientHeight);
    bar.style.transform = `scaleX(${pct})`;
  }
  on(window, 'scroll', update, { passive: true });
})();

/* ══════════════════════════════════════════════════
   4. NAVBAR — scroll shadow + active link
══════════════════════════════════════════════════ */
(function initNavbar() {
  const nav   = $('#navbar');
  const links = $$('.nav-links a');
  const sects = $$('section[id]');

  function update() {
    const y = window.scrollY;
    nav && nav.classList.toggle('scrolled', y > 40);

    // active link
    let current = '';
    sects.forEach(s => {
      if (y >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });

    // back to top
    const btt = $('#backToTop');
    if (btt) btt.classList.toggle('visible', y > 400);
  }

  on(window, 'scroll', update, { passive: true });
  update();

  // Back to top
  on($('#backToTop'), 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ══════════════════════════════════════════════════
   5. MOBILE MENU
══════════════════════════════════════════════════ */
(function initMobileMenu() {
  const btn  = $('#menuBtn');
  const menu = $('#mobileMenu');
  if (!btn || !menu) return;

  on(btn, 'click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  $$('.mobile-link').forEach(a => {
    on(a, 'click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ══════════════════════════════════════════════════
   6. HERO PARTICLES
══════════════════════════════════════════════════ */
(function initParticles() {
  const container = $('#heroParticles');
  if (!container) return;
  const count = window.innerWidth < 700 ? 18 : 38;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const x    = Math.random() * 100;
    const y    = Math.random() * 100;
    const dur  = Math.random() * 8 + 6;
    const del  = Math.random() * 6;
    const op   = Math.random() * 0.25 + 0.05;
    Object.assign(p.style, {
      position: 'absolute',
      left: x + '%', top: y + '%',
      width: size + 'px', height: size + 'px',
      borderRadius: '50%',
      background: 'rgba(201,168,76,' + op + ')',
      animation: `floatParticle ${dur}s ${del}s ease-in-out infinite`,
      pointerEvents: 'none',
    });
    container.appendChild(p);
  }

  if (!document.getElementById('particleStyle')) {
    const style = document.createElement('style');
    style.id = 'particleStyle';
    style.textContent = `
      @keyframes floatParticle {
        0%,100% { transform: translateY(0) translateX(0) scale(1); opacity: 1; }
        33%      { transform: translateY(-30px) translateX(15px) scale(1.2); }
        66%      { transform: translateY(20px) translateX(-10px) scale(0.8); }
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ══════════════════════════════════════════════════
   7. TYPED TEXT EFFECT
══════════════════════════════════════════════════ */
(function initTyped() {
  const el = $('#typedText');
  if (!el) return;
  const phrases = [
    'Graphic Designer',
    'Brand Strategist',
    'Visual Storyteller',
    'Art Director',
    'Creative Thinker',
  ];
  let pIdx = 0, cIdx = 0, deleting = false;

  function tick() {
    const phrase = phrases[pIdx];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++cIdx);
      if (cIdx === phrase.length) { deleting = true; return setTimeout(tick, 2200); }
    } else {
      el.textContent = phrase.slice(0, --cIdx);
      if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 55 : 90);
  }
  setTimeout(tick, 1600);
})();

/* ══════════════════════════════════════════════════
   8. SCROLL REVEAL
══════════════════════════════════════════════════ */
(function initReveal() {
  const items = $$('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.transitionDelay = (i * 0.06) + 's';
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  items.forEach(el => obs.observe(el));
})();

/* ══════════════════════════════════════════════════
   9. STAT COUNTER ANIMATION
══════════════════════════════════════════════════ */
(function initCounters() {
  const nums = $$('.stat-num[data-count]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseInt(el.dataset.count);
      const dur = 1800;
      const step = 16;
      const inc  = end / (dur / step);
      let cur = 0;
      const timer = setInterval(() => {
        cur = Math.min(cur + inc, end);
        el.textContent = Math.floor(cur);
        if (cur >= end) clearInterval(timer);
      }, step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(el => obs.observe(el));
})();

/* ══════════════════════════════════════════════════
   10. ABOUT TABS
══════════════════════════════════════════════════ */
(function initAboutTabs() {
  const btns = $$('.tab-btn');
  btns.forEach(btn => {
    on(btn, 'click', () => {
      const id = btn.dataset.tab;
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      $$('.tab-content').forEach(tc => tc.classList.remove('active'));
      const target = $('#tab-' + id);
      if (target) target.classList.add('active');
    });
  });
})();

/* ══════════════════════════════════════════════════
   11. WORK FILTER
══════════════════════════════════════════════════ */
(function initWorkFilter() {
  const btns  = $$('.filter-btn');
  const cards = $$('.work-card');
  if (!btns.length) return;

  btns.forEach(btn => {
    on(btn, 'click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach((card, i) => {
        const cat = card.dataset.cat;
        const show = filter === 'all' || cat === filter;
        card.classList.remove('fade-in');
        if (show) {
          card.classList.remove('hidden');
          setTimeout(() => card.classList.add('fade-in'), i * 40);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ══════════════════════════════════════════════════
   12. LIGHTBOX
══════════════════════════════════════════════════ */
(function initLightbox() {
  const lb      = $('#lightbox');
  const overlay = $('#lightboxOverlay');
  const panel   = $('#lightboxPanel');
  const closeBtn= $('#lightboxClose');
  const content = $('#lightboxContent');
  if (!lb) return;

  const projects = {
    nova: {
      emoji: '<img src="images/Crest%20View%20School.jpeg" alt="Crest View Rebrand" loading="lazy" style="max-width:100%;height:auto;border-radius:8px;" />',
      cat: 'Brand Identity',
      title: 'Crest View Rebrand',
      meta: '2025 · Client: Crest View Schools',
      body: 'Crest View Schools partnered with us to create a modern, warm identity that reflects their commitment to academic excellence, community and joyful learning. We crafted a flexible visual system built around a refined crest-inspired mark, a friendly wordmark, and a palette of warm, grounded tones complemented by hand-drawn motifs referencing the school’s local heritage. The system was applied across signage, prospectuses, uniforms, wayfinding, digital templates and an accessible website. The result is a cohesive, human-centred brand that improves recognition, strengthens parent and student trust, and drove a notable uptick in open-day registrations and enquiries.',
      details: { Client: 'Crest View Schools', Year: '2025', Services: 'Branding, Identity, Environmental Design, Web', Tools: 'Figma, Illustrator, InDesign' }
    },
    artefact: {
      emoji: '<img src="images/Agro%20Super%20Image.jpeg" alt="Artefact Magazine" loading="lazy" style="max-width:100%;height:auto;border-radius:8px;" />',
      cat: 'Editorial Design',
      title: 'Artefact Magazine — Annual Edition',
      meta: '2024 · Client: Artefact Media',
      body: 'An 80-page annual edition of Artefact Magazine, a leading Nigerian publication covering culture, design, and innovation. The issue explored the theme of “Agro-Super” — the intersection of agriculture and urban life in Nigeria. The design combined bold typography, dynamic layouts, and vibrant imagery to create an engaging reading experience that celebrates the creativity and resilience of Nigerian urban farmers and food entrepreneurs.',
      details: { Client: 'Artefact Media', Year: '2024', Services: 'Editorial Design, Typography', Tools: 'InDesign, Illustrator, Lightroom' }
    },
    urban: {
      emoji: '<img src="images/unity%20Trust%20bank%202.jpeg" alt="Urban Roots Campaign" loading="lazy" style="max-width:100%;height:auto;border-radius:8px;" />',
      cat: 'Campaign Design',
      title: 'Urban Roots Campaign',
      meta: '2023 · Client: Unity Trust Bank',
      body: 'A campaign celebrating the resilience and creativity of Nigerian urban communities, designed for Unity Trust Bank. The campaign included striking OOH billboards, vibrant digital ads, and dynamic social media content. The visual language combined gritty textures, bold typography, and vibrant colors to capture the energy and spirit of the city.',
      details: { Client: 'Unity Trust Bank', Year: '2023', Services: 'Campaign, OOH, Digital', Tools: 'Photoshop, Illustrator, After Effects' }
    },
    ldw: {
      emoji: '<img src="images/Naija%20Bites.jpeg" alt="Naija Bites" loading="lazy" style="max-width:100%;height:auto;border-radius:8px;" />',
      cat: 'Event Branding',
      title: 'Naija Bites 2025',
      meta: '2023 · Client: Naija Bites',
      body: 'Full event identity for Naija Bites, encompassing stage design, wayfinding, print collateral, digital assets, and merchandise. The visual language — built around the concept of "intersection" — used overlapping geometric forms to represent the convergence of cultures, disciplines, and perspectives the festival embodies.',
      details: { Client: 'Naija Bites', Year: '2025', Services: 'Event Identity, Print, Signage', Tools: 'Illustrator, InDesign, Figma' }
    },
    terra: {
      emoji: '<img src="images/Marina Beauty and spa.jpeg" alt="Marina Beauty and Spa" loading="lazy" style="max-width:100%;height:auto;border-radius:8px;" />',
      cat: 'Packaging Design',
      title: 'Marina Beauty and Spa',
      meta: '2026 · Marina Beauty and Spa',
      body: 'A 12-SKU packaging system for Marina Beauty and Spa’s new line of skincare products. The design aimed to make natural beauty services feel more tangible and approachable, using bold colors, playful illustrations, and clear typography to communicate the benefits of each product. The system was designed for scalability, allowing for easy addition of new products while maintaining a cohesive brand identity.',
      details: { Client: 'Marina Beauty and Spa', Year: '2026', Services: 'Packaging, Branding, Illustration', Tools: 'Illustrator, Photoshop, InDesign' }
    },
    apex: {
      emoji: '📱',
      cat: 'Digital Design',
      title: 'NAIRA FLOW Fintech — App UI & Brand Assets',
      meta: '2026 · Client: Apex Financial Technologies',
      body: 'UI design and brand asset creation for Naia Flow, a Lagos-based fintech startup. Work encompassed onboarding screens, dashboard UI, icon set, and a comprehensive social media asset library. The design system was built in Figma with a focus on accessibility, clarity, and trust — key differentiators in the competitive Nigerian fintech market.',
      details: { Client: 'Apex Financial Technologies', Year: '2022', Services: 'UI Design, Brand Assets, Motion', Tools: 'Figma, Illustrator, After Effects' }
    },
  };

  function openLb(key) {
    const p = projects[key];
    if (!p || !content) return;
    const detailRows = Object.entries(p.details).map(([k,v]) =>
      `<div class="lb-detail"><div class="lbd-k">${k}</div><div class="lbd-v">${v}</div></div>`
    ).join('');
    content.innerHTML = `
      <div class="lb-img">${p.emoji}</div>
      <div class="lb-cat">${p.cat}</div>
      <h2 class="lb-title">${p.title}</h2>
      <div class="lb-meta">${p.meta}</div>
      <p class="lb-body">${p.body}</p>
      <div class="lb-details">${detailRows}</div>
    `;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  on(document, 'click', e => {
    const btn = e.target.closest('.wc-view-btn');
    if (btn) { openLb(btn.dataset.project); return; }
    const card = e.target.closest('.work-card');
    if (card) {
      const viewBtn = card.querySelector('.wc-view-btn');
      if (viewBtn) openLb(viewBtn.dataset.project);
    }
  });
  on(overlay, 'click', closeLb);
  on(closeBtn, 'click', closeLb);
  on(document, 'keydown', e => { if (e.key === 'Escape') closeLb(); });
})();

/* ══════════════════════════════════════════════════
   13. SKILL BARS ANIMATION
══════════════════════════════════════════════════ */
(function initSkillBars() {
  const bars = $$('.pb-fill');
  const pcts = $$('.pb-pct');
  let done = false;

  const obs = new IntersectionObserver(entries => {
    if (done) return;
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      done = true;
      bars.forEach((bar, i) => {
        const target = parseInt(bar.dataset.fill);
        const pctEl  = pcts[i];
        setTimeout(() => {
          bar.style.width = target + '%';
          if (pctEl) {
            let cur = 0;
            const inc = target / 60;
            const timer = setInterval(() => {
              cur = Math.min(cur + inc, target);
              pctEl.textContent = Math.round(cur) + '%';
              if (cur >= target) clearInterval(timer);
            }, 20);
          }
        }, i * 100);
      });
      obs.disconnect();
    });
  }, { threshold: 0.3 });

  const section = $('#skills');
  if (section) obs.observe(section);
})();

/* ══════════════════════════════════════════════════
   14. EXPERIENCE TABS
══════════════════════════════════════════════════ */
(function initExpTabs() {
  const btns = $$('.exp-tab-btn');
  btns.forEach(btn => {
    on(btn, 'click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.dataset.exp;
      $$('.exp-content').forEach(c => c.classList.add('hidden'));
      const target = $('#exp-' + key);
      if (target) {
        target.classList.remove('hidden');
        // re-trigger reveals inside newly shown section
        $$('.reveal', target).forEach(el => {
          el.classList.remove('visible');
          setTimeout(() => el.classList.add('visible'), 60);
        });
      }
    });
  });
})();

/* ══════════════════════════════════════════════════
   15. TESTIMONIAL SLIDER
══════════════════════════════════════════════════ */
(function initSlider() {
  const track  = $('#tsTrack');
  const prev   = $('#tsPrev');
  const next   = $('#tsNext');
  const dotsEl = $('#tsDots');
  if (!track) return;

  const cards = $$('.ts-card', track);
  let current = 0;
  let autoTimer;

  // Build dots
  cards.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'ts-dot' + (i === 0 ? ' active' : '');
    on(d, 'click', () => goTo(i));
    dotsEl && dotsEl.appendChild(d);
  });

  function getDots() { return dotsEl ? $$('.ts-dot', dotsEl) : []; }

  function goTo(n) {
    current = (n + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    getDots().forEach((d, i) => d.classList.toggle('active', i === current));
  }

  on(prev, 'click', () => { goTo(current - 1); resetAuto(); });
  on(next, 'click', () => { goTo(current + 1); resetAuto(); });

  function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 5500); }
  function resetAuto() { clearInterval(autoTimer); startAuto(); }
  startAuto();

  // Touch / swipe
  let touchX = 0;
  on(track, 'touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  on(track, 'touchend', e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
  });
})();

/* ══════════════════════════════════════════════════
   16. CONTACT FORM VALIDATION
══════════════════════════════════════════════════ */
(function initForm() {
  const form    = $('#contactForm');
  const submitBtn = $('#formSubmitBtn');
  const success = $('#formSuccess');
  if (!form) return;

  function showErr(id, msg) {
    const el = $('#err-' + id);
    const input = $('#' + id);
    if (el) el.textContent = msg;
    if (input) input.classList.add('error');
  }
  function clearErr(id) {
    const el = $('#err-' + id);
    const input = $('#' + id);
    if (el) el.textContent = '';
    if (input) input.classList.remove('error');
  }

  // Real-time clear
  ['fname','femail','fmessage'].forEach(id => {
    const el = $('#' + id);
    on(el, 'input', () => clearErr(id));
  });

  on(form, 'submit', e => {
    e.preventDefault();
    let valid = true;

    const name    = $('#fname');
    const email   = $('#femail');
    const message = $('#fmessage');

    clearErr('fname'); clearErr('femail'); clearErr('fmessage');

    if (!name || !name.value.trim()) { showErr('fname', 'Please enter your name.'); valid = false; }
    if (!email || !email.value.trim()) { showErr('femail', 'Please enter your email.'); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { showErr('femail', 'Please enter a valid email address.'); valid = false; }
    if (!message || !message.value.trim()) { showErr('fmessage', 'Please enter a message.'); valid = false; }

    if (!valid) return;

    // Simulate submission
    if (submitBtn) { submitBtn.classList.add('loading'); submitBtn.querySelector('span').textContent = '…'; }

    setTimeout(() => {
      if (submitBtn) { submitBtn.classList.remove('loading'); submitBtn.querySelector('span').textContent = '→'; }
      if (success) success.classList.add('visible');
      form.reset();
      setTimeout(() => success && success.classList.remove('visible'), 6000);
    }, 1400);
  });
})();

/* ══════════════════════════════════════════════════
   17. CARD TILT EFFECT (skill cards)
══════════════════════════════════════════════════ */
(function initTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch
  $$('[data-tilt]').forEach(card => {
    on(card, 'mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-2px)`;
    });
    on(card, 'mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateY(0) rotateX(0) translateY(0)';
    });
  });
})();

/* ══════════════════════════════════════════════════
   18. SMOOTH SCROLL for all internal links
══════════════════════════════════════════════════ */
(function initSmoothScroll() {
  on(document, 'click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();

/* ══════════════════════════════════════════════════
   19. DOWNLOAD CV BUTTON (placeholder)
══════════════════════════════════════════════════ */
(function initDownloadCV() {
  const btn = $('#downloadCV');
  if (!btn) return;
  on(btn, 'click', e => {
    e.preventDefault();
    // Replace with actual CV file link
    const toast = document.createElement('div');
    Object.assign(toast.style, {
      position: 'fixed', bottom: '2rem', right: '2rem',
      background: 'var(--bg2)', border: '1px solid var(--border)',
      padding: '.9rem 1.6rem', fontSize: '.8rem',
      color: 'var(--gold)', zIndex: '9000',
      animation: 'fadeUp .4s ease both',
    });
    toast.textContent = '📄 CV link not yet set — update #downloadCV href.';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  });
})();

/* ══════════════════════════════════════════════════
   20. PROCESS STEPS — animate on scroll
══════════════════════════════════════════════════ */
(function initProcessSteps() {
  const steps = $$('.proc-step');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const step = parseInt(e.target.dataset.step) || 1;
        e.target.style.transitionDelay = ((step - 1) * 0.12) + 's';
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  steps.forEach(s => {
    s.classList.add('reveal');
    obs.observe(s);
  });
})();

console.log('%c AM Portfolio loaded 🎨', 'color:#c9a84c; font-size:14px; font-weight:bold;');
