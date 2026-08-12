/* =========================================================
   GOCHEZ RESTO NIGERIA LIMITED — app.js
   ========================================================= */

(function () {
  'use strict';

  var EMAIL_ADDRESS = 'infogochezrestoltd@gmail.com';

  var preloaderShown = Date.now();

  document.addEventListener('DOMContentLoaded', function () {
    initYear();
    initNavToggle();
    initScrollReveal();
    initCustomSelects();
    initQuoteBar();
    initRequestForm();
    initNewsletterForm();
    initFaqAccordion();
    hidePreloader();
  });

  window.addEventListener('load', function () {
    hidePreloader();
  });

  /* ---------- Preloader ---------- */
  function hidePreloader() {
    var preloader = document.getElementById('preloader');
    var container = preloader ? preloader.querySelector('.preloader-container') : null;
    if (!preloader || !container) return;
    
    var elapsed = Date.now() - preloaderShown;
    var minDuration = 3000;
    var duration = Math.max(minDuration, elapsed);
    var delay = Math.max(0, minDuration - elapsed);
    
    // Set CSS custom property for animation duration (convert ms to seconds)
    container.style.setProperty('--preload-duration', (duration / 1000) + 's');
    
    setTimeout(function () {
      preloader.classList.add('hide');
      setTimeout(function () {
        preloader.style.display = 'none';
      }, 500);
    }, delay);
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Mobile nav toggle ---------- */
  function initNavToggle() {
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('mainNav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll reveal ----------
     Elements are visible by default. Only opt them into the
     hidden -> revealed transition if IntersectionObserver is
     available, so a missing/broken script never hides content. */
  function initScrollReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) {
      el.classList.add('reveal-ready');
      observer.observe(el);
    });
  }

  /* ---------- Custom dropdowns ---------- */
  function initCustomSelects() {
    document.querySelectorAll('.custom-select').forEach(function (select) {
      var trigger = select.querySelector('.custom-select__trigger');
      var options = select.querySelectorAll('.custom-select__option');
      if (!trigger || !options.length) return;

      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        document.querySelectorAll('.custom-select.open').forEach(function (openSelect) {
          if (openSelect !== select) {
            openSelect.classList.remove('open');
            var otherTrigger = openSelect.querySelector('.custom-select__trigger');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });

        var isOpen = select.classList.toggle('open');
        trigger.setAttribute('aria-expanded', String(isOpen));
      });

      options.forEach(function (option) {
        option.addEventListener('click', function () {
          var value = option.getAttribute('data-value') || '';
          var label = option.textContent.trim();

          select.setAttribute('data-value', value);
          var labelEl = select.querySelector('.custom-select__label');
          if (labelEl) labelEl.textContent = label;

          select.querySelectorAll('.custom-select__option').forEach(function (item) {
            item.classList.toggle('is-selected', item === option);
          });

          select.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        });
      });
    });

    document.addEventListener('click', function () {
      document.querySelectorAll('.custom-select.open').forEach(function (openSelect) {
        openSelect.classList.remove('open');
        var openTrigger = openSelect.querySelector('.custom-select__trigger');
        if (openTrigger) openTrigger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function getSelectedDropdownValue(id) {
    var el = document.getElementById(id);
    if (!el) return '';
    if (el.tagName === 'SELECT') return el.value;
    return el.getAttribute('data-value') || '';
  }

  /* ---------- Hero quote bar -> Email submission ---------- */
  function initQuoteBar() {
    var form = document.getElementById('quoteBar');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var service = getSelectedDropdownValue('quoteService');
      var email = document.getElementById('quoteEmail') ? document.getElementById('quoteEmail').value.trim() : '';

      if (!service) {
        showToast('Please select a service to continue.');
        return;
      }
      if (!email) {
        showToast('Please enter your email address.');
        return;
      }

      var message = 'Hello Gochez Resto, I would like a quote for ' + service + '.';
      submitToEmail({
        name: 'Website Visitor',
        email: email,
        service: service,
        message: message
      }, 'Quote Request');
    });
  }

  /* ---------- Request / consultation form -> Email submission ---------- */
  function initRequestForm() {
    var form = document.getElementById('requestForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('reqName').value.trim();
      var service = getSelectedDropdownValue('reqService');
      var email = document.getElementById('reqEmail') ? document.getElementById('reqEmail').value.trim() : '';
      var tel = document.getElementById('reqTel') ? document.getElementById('reqTel').value.trim() : '';

      if (!service) {
        showToast('Please select a service to continue.');
        return;
      }
      if (!email) {
        showToast('Please enter your email address.');
        return;
      }

      var message = 'Hello Gochez Resto, my name/company is ' + (name || 'N/A') + '. I would like to request ' + service + '.' + (tel ? ' Phone: ' + tel + '.' : '');
      submitToEmail({
        name: name || 'Website Visitor',
        email: email,
        service: service,
        message: message + (tel ? '\nTelephone: ' + tel : '')
      }, 'Enquiry from Website');
    });
  }

  function submitToEmail(data, subject) {
    var params = new URLSearchParams();
    params.append('_subject', subject);
    params.append('_template', 'table');
    params.append('_captcha', 'false');
    params.append('_next', window.location.href);
    params.append('name', data.name || 'Website Visitor');
    if (data.email) params.append('email', data.email);
    if (data.service) params.append('service', data.service);
    if (data.location) params.append('location', data.location);
    params.append('message', data.message || '');

    showToast('Sending your request...');

    return fetch('https://formsubmit.co/ajax/' + EMAIL_ADDRESS, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: params
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Request failed');
        }
        return response.json().catch(function () {
          return {};
        });
      })
      .then(function () {
        showToast('Your request has been sent successfully.');
      })
      .catch(function () {
        showToast('Unable to send right now. Please email us directly at ' + EMAIL_ADDRESS + '.');
      });
  }

  /* ---------- Newsletter subscription ---------- */
  function initNewsletterForm() {
    var form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailInput = form.querySelector('input[type="email"]');
      var email = emailInput ? emailInput.value.trim() : '';
      var message = email ? 'Please add ' + email + ' to the newsletter list.' : 'Please add me to the newsletter list.';
      submitToEmail({
        name: 'Newsletter Subscriber',
        email: email,
        message: message
      }, 'Newsletter Subscription');
      form.reset();
    });
  }

  /* ---------- Toast ---------- */
  var toastTimer;
  function showToast(message) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 3200);
  }

  /* ---------- FAQ accordion ---------- */
  function initFaqAccordion() {
    document.querySelectorAll('.faq-list').forEach(function (list) {
      var items = list.querySelectorAll('.faq-item');
      items.forEach(function (item) {
        var question = item.querySelector('.faq-question');
        if (!question) return;
        question.addEventListener('click', function () {
          var isOpen = item.classList.contains('open');
          items.forEach(function (other) { other.classList.remove('open'); });
          if (!isOpen) item.classList.add('open');
        });
      });
    });
  }
})();
