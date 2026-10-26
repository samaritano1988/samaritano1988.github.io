(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js-enabled');
  const languageButtons = [...document.querySelectorAll('[data-set-lang]')];
  const search = document.getElementById('publication-search');
  const stage = document.getElementById('stage-filter');
  const entries = [...document.querySelectorAll('.publication')];
  const results = document.getElementById('results-count');
  const empty = document.getElementById('empty-results');
  const reset = document.getElementById('reset-filters');
  let language = 'pt';
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  function filter() {
    const terms = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    let count = 0;
    for (const entry of entries) {
      const matchesStage = !stage.value || entry.dataset.stage === stage.value;
      const text = normalize(entry.dataset.search);
      const visible = matchesStage && terms.every(term => text.includes(term));
      entry.hidden = !visible;
      if (visible) count++;
    }
    results.textContent = language === 'pt'
      ? `${count} de ${entries.length} registros`
      : `${count} of ${entries.length} records`;
    empty.hidden = count !== 0;
    reset.hidden = !search.value && !stage.value;
  }
  function setLanguage(value) {
    language = value === 'en' ? 'en' : 'pt';
    root.lang = language === 'en' ? 'en' : 'pt-BR';
    languageButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.setLang === language)));
    document.querySelectorAll('[data-text-pt]').forEach(element => {
      element.textContent = element.dataset[language === 'pt' ? 'textPt' : 'textEn'];
    });
    search.placeholder = language === 'pt' ? 'Buscar por título, tema ou DOI…' : 'Search by title, topic or DOI…';
    document.title = language === 'pt' ? 'Tiago Felippe — Pesquisa, trajetória e publicações' : 'Tiago Felippe — Research, history and publications';
    document.querySelector('meta[name="description"]').content = language === 'pt'
      ? 'Página de Tiago Felippe, pesquisador independente. Trajetória do programa GAP–GAPCOR, publicações com DOI e compromissos de transparência.'
      : 'Tiago Felippe, independent researcher. The GAP–GAPCOR research journey, publications with DOIs, and commitments to transparency.';
    try { localStorage.setItem('tiago-site-language', language); } catch (_) { /* Storage is optional. */ }
    filter();
  }
  languageButtons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.setLang)));
  search.addEventListener('input', filter);
  stage.addEventListener('change', filter);
  reset.addEventListener('click', () => { search.value = ''; stage.value = ''; filter(); search.focus(); });
  let preferred = 'pt';
  try { preferred = localStorage.getItem('tiago-site-language') || 'pt'; } catch (_) { /* Keep Portuguese default. */ }
  setLanguage(preferred);
})();
