// ── KC Shah & Associates — Shared Scripts ──

document.addEventListener('DOMContentLoaded', () => {

  // ── Scroll Progress Bar ──
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.prepend(progressBar);

  // ── Sticky Header ──
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    // Progress bar
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
    // Header shadow
    if (header) header.classList.toggle('scrolled', scrollTop > 50);
  }, { passive: true });

  // ── Mobile Nav ──
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    const backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
    
    const toggleNav = (forceClose = false) => {
      const isOpen = forceClose ? false : !navLinks.classList.contains('open');
      navLinks.classList.toggle('open', isOpen);
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      backdrop.classList.toggle('active', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
    };

    navLinks.id = navLinks.id || 'primary-nav';
    hamburger.setAttribute('aria-controls', navLinks.id);
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.addEventListener('click', () => toggleNav());
    backdrop.addEventListener('click', () => toggleNav(true));
    // M7: Close nav when any link inside menu is clicked (but not parent toggles)
    navLinks.querySelectorAll('.dropdown-menu a').forEach(a => a.addEventListener('click', () => toggleNav(true)));
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-links') && !e.target.closest('.hamburger')) {
        if(navLinks.classList.contains('open')) toggleNav(true);
      }
    });

    // M9: Collapsible mobile sub-menus
    const isMobile = () => window.innerWidth <= 1024;
    navLinks.querySelectorAll(':scope > li').forEach(li => {
      const dropdown = li.querySelector('.dropdown-menu');
      if (!dropdown) return;
      const parentLink = li.querySelector(':scope > a');
      if (parentLink) {
        parentLink.addEventListener('click', (e) => {
          if (isMobile()) {
            e.preventDefault();
            // Close other expanded items
            navLinks.querySelectorAll(':scope > li.expanded').forEach(other => {
              if (other !== li) other.classList.remove('expanded');
            });
            li.classList.toggle('expanded');
          }
        });
      }
    });
  }

  // ── Scroll Reveal ──
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      let delayIndex = 0;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), delayIndex * 80);
          delayIndex++;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
  }

  // ── Animated Counter ──
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const duration = 2000;
          const start = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObserver.observe(el));
  }

  // ── FAQ Accordion ──
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });

  // ── Testimonial Slider ──
  const track = document.querySelector('.testimonial-track');
  const dots = document.querySelectorAll('.testimonial-dots .dot');
  if (track && dots.length) {
    let current = 0;
    const total = dots.length;
    const slide = (idx) => {
      current = idx;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };
    dots.forEach((d, i) => d.addEventListener('click', () => slide(i)));
    setInterval(() => slide((current + 1) % total), 5000);
  }

  // ── Smooth anchor scroll ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        navLinks && navLinks.classList.remove('open');
      }
    });
  });

  // ── Service page sidebar form handler ──
  document.querySelectorAll('.service-form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = form.querySelector('[type=submit]');
      const success = form.querySelector('.sf-success');
      const error = form.querySelector('.sf-error');
      const origText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(res => {
        if (res.ok) {
          form.reset();
          success.style.display = 'block';
          error.style.display = 'none';
          btn.innerHTML = '<i class="fa-solid fa-circle-check" style="margin-right:6px"></i>Sent!';
        } else {
          error.style.display = 'block';
          success.style.display = 'none';
          btn.textContent = origText;
          btn.disabled = false;
        }
      }).catch(() => {
        error.style.display = 'block';
        success.style.display = 'none';
        btn.textContent = origText;
        btn.disabled = false;
      });
    });
  });

  // ── C1: Auto-wrap blog tables in scroll container ──
  document.querySelectorAll('.blog-content table, table.deadline-table').forEach(table => {
    if (!table.parentElement.classList.contains('table-scroll')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-scroll';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    }
  });

  // ── M6: Hide sticky CTA when form inputs are focused (prevents keyboard overlap) ──
  const stickyCta = document.querySelector('.mobile-sticky-cta');
  if (stickyCta) {
    document.addEventListener('focusin', (e) => {
      if (e.target.matches('input, textarea, select')) stickyCta.style.display = 'none';
    });
    document.addEventListener('focusout', (e) => {
      if (e.target.matches('input, textarea, select')) {
        setTimeout(() => { stickyCta.style.display = ''; }, 200);
      }
    });
  }

  // ── Hide floating WhatsApp if sticky CTA is visible ──
  const waFloat = document.querySelector('.whatsapp-float');
  if (waFloat && stickyCta) {
    const checkWaVisibility = () => {
      const stickyStyle = window.getComputedStyle(stickyCta);
      if (stickyStyle.display !== 'none') {
        waFloat.style.display = 'none';
      } else {
        waFloat.style.display = 'flex';
      }
    };
    window.addEventListener('resize', checkWaVisibility);
    checkWaVisibility();
  }

});
