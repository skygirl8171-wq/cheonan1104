'use strict';
(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const links = [...document.querySelectorAll('[data-nav]')];
  const nav = document.querySelector('.navigation');
  const menuBtn = document.querySelector('.menu-toggle');
  const prev = document.querySelector('#prevBtn');
  const next = document.querySelector('#nextBtn');
  const counter = document.querySelector('#slideCounter');
  const progress = document.querySelector('.progress');
  const progressFill = document.querySelector('#progressFill');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  const clamp = value => Math.max(0, Math.min(slides.length - 1, value));
  const pad = number => String(number).padStart(2, '0');
  const goto = (index, behavior) => {
    const target = slides[clamp(index)];
    if (!target) return;
    target.scrollIntoView({ behavior: behavior || (reducedMotion.matches ? 'instant' : 'smooth'), block: 'start' });
    nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false');
  };
  const select = index => {
    index = clamp(index);
    current = index;
    counter.innerHTML = `${pad(index + 1)} <small>/ ${pad(slides.length)}</small>`;
    progress.setAttribute('aria-valuenow', String(index + 1));
    progressFill.style.width = `${(index + 1) / slides.length * 100}%`;
    prev.disabled = index === 0; next.disabled = index === slides.length - 1;
    links.forEach((a, i) => { a.classList.toggle('active', i === index); if (i === index) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current'); });
    document.title = `${slides[index].dataset.title} | 천안시 생성형 AI의 세계`;
  };
  prev.addEventListener('click', () => goto(current - 1));
  next.addEventListener('click', () => goto(current + 1));
  menuBtn.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.setAttribute('aria-label', open ? '목차 닫기' : '목차 열기'); });
  document.addEventListener('click', e => { if (!nav.contains(e.target) && !menuBtn.contains(e.target)) { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); } });
  document.addEventListener('keydown', e => {
    const target = e.target;
    if (e.altKey || e.metaKey || e.ctrlKey || ['INPUT','TEXTAREA','SELECT','BUTTON'].includes(target.tagName) || target.isContentEditable) return;
    if (['ArrowRight','PageDown',' '].includes(e.key)) { e.preventDefault(); goto(current + 1); }
    if (['ArrowLeft','PageUp'].includes(e.key)) { e.preventDefault(); goto(current - 1); }
    if (e.key === 'Home') { e.preventDefault(); goto(0); }
    if (e.key === 'End') { e.preventDefault(); goto(slides.length - 1); }
    if (e.key === 'Escape') { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded','false'); }
  });
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); revealObserver.unobserve(e.target); } });
  }, { threshold: .12 });
  slides.forEach(s => revealObserver.observe(s));
  let updateFrame = 0;
  const updateActive = () => {
    cancelAnimationFrame(updateFrame);
    updateFrame = requestAnimationFrame(() => {
      const focusY = window.scrollY + window.innerHeight * .46;
      let index = 0;
      for (let i = 0; i < slides.length; i++) if (slides[i].offsetTop <= focusY) index = i;
      if (index !== current) select(index);
    });
  };
  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('resize', updateActive, { passive: true });
  select(0);
  // Recreate the original cover's blue-toned cityscape using CSS, avoiding external image services.
  const buildings = document.querySelector('#buildings');
  [65,88,112,81,145,99,129,72,108,146,94,82,119,77].forEach((height, i) => {
    const building = document.createElement('span');
    building.className = 'building';
    building.style.setProperty('--bh', `${height}px`);
    building.style.setProperty('--bc', ['#b1d6ff','#c9e5ff','#88baff'][i%3]);
    buildings.appendChild(building);
  });
  // Open anchor links on the correct slide even under nested GitHub Pages paths.
  if (location.hash) {
    const hashIndex = slides.findIndex(s => `#${s.id}` === location.hash);
    if (hashIndex >= 0) { requestAnimationFrame(() => { goto(hashIndex, 'instant'); select(hashIndex); }); }
  }
  updateActive();
})();
