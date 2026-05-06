// ── KC Shah & Associates — Tools Shared Utilities ──

/* ── Currency Formatter (Indian system) ── */
function formatINR(num) {
  if (isNaN(num) || num === null) return '₹0';
  num = Math.round(num);
  const abs = Math.abs(num);
  let result;
  if (abs >= 10000000) result = (num / 10000000).toFixed(2) + ' Cr';
  else if (abs >= 100000) result = (num / 100000).toFixed(2) + ' L';
  else result = num.toLocaleString('en-IN');
  return '₹' + result;
}
function formatINRFull(num) {
  if (isNaN(num) || num === null) return '₹0';
  return '₹' + Math.round(num).toLocaleString('en-IN');
}
function formatPct(num, decimals = 2) {
  return (Math.round(num * 100) / 100).toFixed(decimals) + '%';
}
function parseINR(str) {
  return parseFloat(String(str).replace(/[₹,\s]/g, '')) || 0;
}

/* ── Toast Notification ── */
function showToast(msg, type = 'info') {
  let t = document.querySelector('.tool-toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'tool-toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = 'tool-toast ' + type;
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ── Web Share / Clipboard ── */
async function shareResult(title, text) {
  const url = window.location.href;
  if (navigator.share) {
    try { await navigator.share({ title, text, url }); return; } catch (_) {}
  }
  try {
    await navigator.clipboard.writeText(title + '\n' + text + '\n' + url);
    showToast('Result link copied to clipboard!', 'success');
  } catch (_) {
    showToast('Could not copy. Please copy the URL manually.', 'error');
  }
}

/* ── PDF Export ── */
function downloadPDF(elementId, filename) {
  const el = document.getElementById(elementId);
  if (!el) { showToast('Nothing to export.', 'error'); return; }
  if (typeof html2canvas === 'undefined' || typeof jspdf === 'undefined') {
    showToast('PDF library not loaded. Please try again.', 'error'); return;
  }
  showToast('Generating PDF…', 'info');
  html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' }).then(canvas => {
    const { jsPDF } = jspdf;
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = (canvas.height * pdfW) / canvas.width;
    // Header
    pdf.setFillColor(11, 29, 58);
    pdf.rect(0, 0, pdfW, 12, 'F');
    pdf.setTextColor(201, 168, 76);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('KC Shah & Associates — kcshah.com', 6, 8);
    pdf.addImage(imgData, 'PNG', 0, 14, pdfW, pdfH);
    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(100);
    pdf.text('Generated on ' + new Date().toLocaleDateString('en-IN') + ' | kcshah.com/tools', 6, pdf.internal.pageSize.getHeight() - 4);
    pdf.save(filename + '.pdf');
    showToast('PDF downloaded!', 'success');
  }).catch(() => showToast('PDF generation failed.', 'error'));
}

/* ── Donut Chart (Canvas) ── */
function drawDonut(canvasId, segments, labels, colors) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2, r = Math.min(W, H) / 2 - 10, ir = r * 0.58;
  ctx.clearRect(0, 0, W, H);
  const total = segments.reduce((a, b) => a + b, 0);
  if (total <= 0) return;
  let start = -Math.PI / 2;
  segments.forEach((val, i) => {
    const sweep = (val / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, start + sweep);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();
    start += sweep;
  });
  // Hole
  ctx.beginPath();
  ctx.arc(cx, cy, ir, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  // Center text
  ctx.fillStyle = '#0B1D3A';
  ctx.font = 'bold 13px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(formatPct((segments[0] / total) * 100, 1), cx, cy);
}

/* ── Bar Chart (Canvas) ── */
function drawBar(canvasId, labels, values, colors, maxVal) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const pad = { top: 16, bottom: 40, left: 10, right: 10 };
  const chartH = H - pad.top - pad.bottom;
  const barW = (W - pad.left - pad.right) / labels.length;
  const max = maxVal || Math.max(...values) || 1;
  values.forEach((val, i) => {
    const bh = (val / max) * chartH;
    const x = pad.left + i * barW + barW * 0.15;
    const y = pad.top + chartH - bh;
    const bw = barW * 0.7;
    // Bar
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, bw, bh, [4, 4, 0, 0]) : ctx.rect(x, y, bw, bh);
    ctx.fill();
    // Label
    ctx.fillStyle = '#6B7280';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + bw / 2, H - pad.bottom + 14);
  });
}

/* ── Range Slider Sync ── */
function syncSlider(sliderId, inputId, prefix, suffix) {
  const slider = document.getElementById(sliderId);
  const input = document.getElementById(inputId);
  if (!slider || !input) return;
  function update(val) {
    slider.value = val;
    input.value = val;
    const display = document.getElementById(sliderId + '-val');
    if (display) display.textContent = (prefix || '') + Number(val).toLocaleString('en-IN') + (suffix || '');
  }
  slider.addEventListener('input', () => update(slider.value));
  input.addEventListener('input', () => update(input.value));
  update(slider.value);
}

/* ── Newsletter Form ── */
function initNewsletterForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const email = form.querySelector('input[type="email"]').value;
    if (!email) return;
    btn.textContent = 'Subscribing…';
    btn.disabled = true;
    fetch('https://formspree.io/f/mkoklqgn', {
      method: 'POST',
      body: JSON.stringify({ email, source: window.location.pathname }),
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
    }).then(r => {
      if (r.ok) { btn.textContent = '✓ Subscribed!'; form.reset(); showToast('You\'re subscribed for tax updates!', 'success'); }
      else { btn.textContent = 'Subscribe'; btn.disabled = false; showToast('Try again.', 'error'); }
    }).catch(() => { btn.textContent = 'Subscribe'; btn.disabled = false; });
  });
}

/* ── Active Nav Highlight ── */
function setActiveNavLink() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') && path.includes('tools')) {
      if (a.getAttribute('href') && a.getAttribute('href').includes('tools')) a.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveNavLink();
  initNewsletterForm('newsletter-form');
  initNewsletterForm('sidebar-newsletter-form');

  // C2: Set inputmode on number inputs for correct mobile keyboard
  document.querySelectorAll('input[type="number"]:not([inputmode])').forEach(input => {
    input.setAttribute('inputmode', input.hasAttribute('data-int') ? 'numeric' : 'decimal');
  });
});
