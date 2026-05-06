// ── KC Shah Academy — Shared JS ──

const STORAGE_KEY = 'kcs_academy_progress';

// ── Progress Helpers ──
function getProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}
function saveProgress(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}
function getCourseProgress(slug) {
  const all = getProgress();
  return all[slug] || { completed: [], total: 0 };
}
function setModuleCompleted(slug, moduleIdx, total) {
  const all = getProgress();
  if (!all[slug]) all[slug] = { completed: [], total };
  all[slug].total = total;
  if (!all[slug].completed.includes(moduleIdx)) all[slug].completed.push(moduleIdx);
  saveProgress(all);
}
function setModuleUncompleted(slug, moduleIdx) {
  const all = getProgress();
  if (!all[slug]) return;
  all[slug].completed = all[slug].completed.filter(i => i !== moduleIdx);
  saveProgress(all);
}

// ── Update progress bars on hub page ──
function updateHubProgressBars() {
  const all = getProgress();
  document.querySelectorAll('.course-card[data-slug]').forEach(card => {
    const slug = card.dataset.slug;
    const prog = all[slug];
    const fill = card.querySelector('.course-card-progress-fill');
    const label = card.querySelector('.course-progress-pct');
    const btn = card.querySelector('.course-card-btn');
    if (!prog || !prog.total || !fill) return;
    const pct = Math.round((prog.completed.length / prog.total) * 100);
    fill.style.width = pct + '%';
    if (label) label.textContent = pct + '%';
    if (btn && pct > 0) { btn.textContent = pct === 100 ? 'Review ✓' : 'Continue'; btn.classList.add('started'); }
  });
}

// ── Hub: Filter Tabs ──
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      filterCourses(cat, document.querySelector('.academy-search-input')?.value.trim().toLowerCase() || '');
    });
  });
}

// ── Hub: Search ──
function initSearch() {
  const input = document.querySelector('.academy-search-input');
  const heroInput = document.querySelector('.academy-hero-search input');
  const syncSearch = (val) => {
    if (input) input.value = val;
    if (heroInput) heroInput.value = val;
    const activeTab = document.querySelector('.filter-tab.active');
    const cat = activeTab ? activeTab.dataset.cat : 'all';
    filterCourses(cat, val.trim().toLowerCase());
  };
  if (input) input.addEventListener('input', e => syncSearch(e.target.value));
  if (heroInput) heroInput.addEventListener('input', e => syncSearch(e.target.value));

  const heroBtn = document.querySelector('.academy-hero-search button');
  if (heroBtn) {
    heroBtn.addEventListener('click', () => {
      const val = heroInput ? heroInput.value : '';
      syncSearch(val);
      document.querySelector('.academy-filters')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
  if (heroInput) {
    heroInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        syncSearch(e.target.value);
        document.querySelector('.academy-filters')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

function filterCourses(cat, query) {
  let visibleCount = 0;
  document.querySelectorAll('.course-card[data-slug]').forEach(card => {
    const cardCat = card.dataset.cat || '';
    const title = (card.querySelector('.course-card-title')?.textContent || '').toLowerCase();
    const desc = (card.querySelector('.course-card-desc')?.textContent || '').toLowerCase();
    const catMatch = cat === 'all' || cardCat === cat;
    const queryMatch = !query || title.includes(query) || desc.includes(query);
    const show = catMatch && queryMatch;
    card.dataset.hidden = !show;
    if (show) visibleCount++;
  });

  // show/hide section headers
  document.querySelectorAll('.academy-section[data-cat]').forEach(section => {
    const sCat = section.dataset.cat;
    const catMatch = cat === 'all' || sCat === cat;
    const hasVisible = [...section.querySelectorAll('.course-card')].some(c => c.dataset.hidden !== 'true');
    section.style.display = (catMatch && hasVisible) ? '' : 'none';
  });

  const noResults = document.querySelector('.no-results');
  if (noResults) noResults.classList.toggle('visible', visibleCount === 0);
}

// ── Course Page: Module List ──
function initModuleList() {
  const courseSlug = document.body.dataset.course;
  if (!courseSlug) return;

  const items = document.querySelectorAll('.module-item');
  if (!items.length) return;

  const total = items.length;
  const prog = getCourseProgress(courseSlug);

  // Restore completed state
  items.forEach((item, idx) => {
    if (prog.completed.includes(idx)) markModuleCompleted(item, idx);
  });

  // First uncompleted = active
  let firstActive = false;
  items.forEach((item, idx) => {
    if (!item.classList.contains('completed') && !firstActive) {
      item.classList.add('active');
      firstActive = true;
      loadModule(item, idx);
    }
  });
  if (!firstActive) items[items.length - 1]?.classList.add('active');

  // Click handler
  items.forEach((item, idx) => {
    item.addEventListener('click', () => {
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      loadModule(item, idx);
    });

    const checkbox = item.querySelector('.module-checkbox');
    if (checkbox) {
      checkbox.addEventListener('change', e => {
        e.stopPropagation();
        if (checkbox.checked) {
          setModuleCompleted(courseSlug, idx, total);
          markModuleCompleted(item, idx);
        } else {
          setModuleUncompleted(courseSlug, idx);
          item.classList.remove('completed');
          const numEl = item.querySelector('.module-num');
          if (numEl) { numEl.innerHTML = `<span class="module-num-text">${idx + 1}</span>`; }
        }
        updateCourseProgress(courseSlug, total);
      });
    }
  });

  updateCourseProgress(courseSlug, total);
}

function markModuleCompleted(item, idx) {
  item.classList.add('completed');
  const numEl = item.querySelector('.module-num');
  if (numEl) numEl.innerHTML = '';
  const statusIcon = item.querySelector('.module-status-icon');
  if (statusIcon) { statusIcon.className = 'module-status-icon fa-solid fa-circle-check'; }
  const checkbox = item.querySelector('.module-checkbox');
  if (checkbox) checkbox.checked = true;
}

function loadModule(item, idx) {
  const youtubeId = item.dataset.youtube;
  const playerWrap = document.querySelector('.video-player-wrap');
  if (!playerWrap) return;

  if (youtubeId) {
    playerWrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1" title="${item.querySelector('.module-title')?.textContent || 'Lesson'}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  } else {
    const moduleTitle = item.querySelector('.module-title')?.textContent || 'This Module';
    playerWrap.innerHTML = `<div class="coming-soon-player">
      <div class="play-icon"><i class="fa-solid fa-play"></i></div>
      <h3>${moduleTitle}</h3>
      <p>Video for this module is coming soon. Check back shortly — we're uploading lessons weekly.</p>
    </div>`;
  }
}

function updateCourseProgress(slug, total) {
  const prog = getCourseProgress(slug);
  const completed = prog.completed.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Ring
  const circle = document.querySelector('.progress-ring-circle');
  if (circle) {
    const r = parseFloat(circle.getAttribute('r') || 36);
    const circ = 2 * Math.PI * r;
    circle.style.strokeDasharray = circ;
    circle.style.strokeDashoffset = circ - (circ * pct / 100);
  }
  const pctEl = document.querySelector('.progress-pct-val');
  if (pctEl) pctEl.textContent = pct + '%';
  const completedEl = document.querySelector('.prog-completed-count');
  if (completedEl) completedEl.textContent = completed;
  const totalEl = document.querySelector('.prog-total-count');
  if (totalEl) totalEl.textContent = total;

  // Unlock cert button
  const certBtn = document.querySelector('.cert-unlock-btn');
  const certHint = document.querySelector('.cert-unlock-hint');
  if (certBtn) {
    const quizPassed = sessionStorage.getItem('kcs_quiz_passed_' + slug) === '1';
    if (pct === 100 && quizPassed) {
      certBtn.disabled = false;
      if (certHint) certHint.textContent = 'Complete the quiz to unlock your certificate.';
    } else if (pct === 100) {
      certBtn.disabled = true;
      if (certHint) certHint.textContent = 'Complete the quiz below to unlock your certificate.';
    } else {
      certBtn.disabled = true;
      if (certHint) certHint.textContent = `Complete all ${total} modules + quiz to unlock.`;
    }
  }
}

// ── Quiz Engine ──
function initQuiz() {
  const courseSlug = document.body.dataset.course;
  const form = document.querySelector('.quiz-form');
  const submitBtn = document.querySelector('.quiz-submit-btn');
  const result = document.querySelector('.quiz-result');
  if (!form || !submitBtn) return;

  submitBtn.addEventListener('click', () => {
    const questions = form.querySelectorAll('.quiz-question');
    let correct = 0;
    let answered = 0;
    questions.forEach(q => {
      const chosen = q.querySelector('input[type="radio"]:checked');
      if (!chosen) return;
      answered++;
      const correctAns = parseInt(q.dataset.answer);
      const chosenVal = parseInt(chosen.value);
      q.querySelectorAll('.quiz-option').forEach((opt, i) => {
        if (i === correctAns) opt.classList.add('correct');
        else if (i === chosenVal && chosenVal !== correctAns) opt.classList.add('incorrect');
      });
      if (chosenVal === correctAns) correct++;
    });
    if (answered < questions.length) {
      // P11: Inline error instead of jarring alert()
      let toast = document.querySelector('.quiz-toast');
      if (!toast) { toast = document.createElement('div'); toast.className = 'quiz-toast'; form.parentElement.insertBefore(toast, submitBtn); }
      toast.textContent = '⚠ Please answer all questions before submitting.';
      toast.style.cssText = 'background:#fdecea;color:#c0392b;padding:12px 16px;border-radius:8px;font-size:0.88rem;font-weight:600;margin-bottom:12px;border:1px solid #f5c6c6;text-align:center;';
      setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3500);
      return;
    }

    const passed = correct >= 4;
    submitBtn.disabled = true;
    result.style.display = 'block';
    if (passed) {
      result.className = 'quiz-result pass';
      result.innerHTML = `<h4>🎉 Congratulations! You passed!</h4><p>Score: ${correct}/${questions.length} — You can now generate your certificate.</p>`;
      if (courseSlug) {
        sessionStorage.setItem('kcs_quiz_passed_' + courseSlug, '1');
        const total = document.querySelectorAll('.module-item').length;
        updateCourseProgress(courseSlug, total);
      }
    } else {
      result.className = 'quiz-result fail';
      result.innerHTML = `<h4>Not quite — Keep learning!</h4><p>Score: ${correct}/${questions.length}. You need 4/5 to pass. Review the modules and try again.</p>
        <button class="quiz-retake-btn" onclick="retakeQuiz()"><i class="fa-solid fa-rotate-left"></i> Try Again</button>`;
    }
  });
}

function retakeQuiz() {
  const form = document.querySelector('.quiz-form');
  const submitBtn = document.querySelector('.quiz-submit-btn');
  const result = document.querySelector('.quiz-result');
  if (!form) return;
  form.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
  form.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('correct', 'incorrect'));
  if (submitBtn) submitBtn.disabled = false;
  if (result) result.style.display = 'none';
}

// ── Certificate ──
function initCertificate() {
  const openBtn = document.querySelector('.cert-unlock-btn');
  const overlay = document.querySelector('.cert-modal-overlay');
  const closeBtn = document.querySelector('.cert-modal-close');
  const genBtn = document.querySelector('.cert-generate-btn');
  const printBtn = document.querySelector('.cert-print-btn');
  if (!openBtn || !overlay) return;

  openBtn.addEventListener('click', () => overlay.classList.add('visible'));
  if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.remove('visible'));
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('visible'); });

  if (genBtn) {
    genBtn.addEventListener('click', () => {
      const nameInput = document.querySelector('.cert-name-input');
      const name = nameInput?.value.trim();
      if (!name) { nameInput?.focus(); nameInput?.setAttribute('placeholder', 'Please enter your name'); return; }
      const cert = document.querySelector('.certificate');
      if (!cert) return;
      const recipientEl = cert.querySelector('.cert-recipient');
      if (recipientEl) recipientEl.textContent = name;
      const dateEl = cert.querySelector('.cert-date');
      if (dateEl) dateEl.textContent = 'Issued on ' + new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      const idEl = cert.querySelector('.cert-id');
      if (idEl) idEl.textContent = 'Certificate ID: KCS-' + Date.now().toString(36).toUpperCase();
      cert.classList.add('visible');
      cert.scrollIntoView({ behavior: 'smooth' });
    });
  }
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }
}

// ── Share ──
function initShare() {
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.share;
      const url = window.location.href;
      const title = document.title;
      if (type === 'wa') window.open(`https://api.whatsapp.com/send/?text=${encodeURIComponent(title + ' — Free course on KC Shah Academy: ' + url)}`, '_blank');
      if (type === 'li') window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
      if (type === 'copy') {
        navigator.clipboard.writeText(url).then(() => {
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
          setTimeout(() => { btn.innerHTML = '<i class="fa-solid fa-link"></i> Copy Link'; }, 2000);
        });
      }
    });
  });
}

// ── Init on DOM ready ──
document.addEventListener('DOMContentLoaded', () => {
  updateHubProgressBars();
  initFilterTabs();
  initSearch();
  initModuleList();
  initQuiz();
  initCertificate();
  initShare();
});
