(() => {
  const $ = (s, r = document) => r.querySelector(s);

  // menu mobile
  const burger = $('#burger'), nav = $('#nav');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  nav.addEventListener('click', e => { if (e.target.closest('a')) { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); } });

  // revelar ao rolar; sem IntersectionObserver tudo aparece
  const items = document.querySelectorAll('.reveal');
  const init = () => { if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .12 });
    items.forEach((el, i) => { el.style.transitionDelay = (i % 3) * 80 + 'ms'; io.observe(el); });
  } else items.forEach(el => el.classList.add('in')); };
  setTimeout(init, 0);

  // contadores do hero
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-count]').forEach(el => {
      const end = +el.dataset.count, d = 1400; let t0 = 0;
      const tick = t => {
        t0 = t0 || t; const p = Math.min((t - t0) / d, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0';
      setTimeout(() => requestAnimationFrame(tick), 600);
    });
  }

  // formulário: validação no cliente; demonstração, nada é enviado
  const form = $('#form');
  const rules = {
    nome: v => v.trim().length >= 3 || 'Informe seu nome completo.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Informe um e-mail válido.',
    msg: v => v.trim().length >= 10 || 'Descreva o caso em pelo menos 10 caracteres.'
  };
  form.addEventListener('submit', e => {
    e.preventDefault();
    let first = null;
    for (const [id, check] of Object.entries(rules)) {
      const f = $('#' + id), r = check(f.value), msg = $('#e-' + id);
      msg.textContent = r === true ? '' : r;
      f.setAttribute('aria-invalid', r !== true);
      if (r !== true && !first) first = f;
    }
    if (first) return first.focus();
    form.reset();
    $('#ok').hidden = false;
  });
})();
