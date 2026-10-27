/**
 * Align Interiors / Align Architecture & Interiors
 * Contact & Enquiry Form Handler (Vanilla JS)
 */

(function () {
  'use strict';

  function initContactForm() {
    var form = document.getElementById('enquiry-form');
    if (!form) return;

    var nameInput = document.getElementById('client-name');
    var phoneInput = document.getElementById('client-phone');
    var projectTypeSelect = document.getElementById('project-type');
    var budgetSelect = document.getElementById('budget-range');
    var messageInput = document.getElementById('project-message');
    var honeypotInput = document.getElementById('form-honeypot');
    var submitBtn = document.getElementById('submit-btn');
    var statusBox = document.getElementById('form-status-msg');

    // Indian phone number regex: Allows optional +91 or 0, followed by 10 digits starting with 6-9
    var indianPhoneRegex = /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6789]\d{9}$/;

    function showError(inputEl, errorId, message) {
      if (!inputEl) return;
      inputEl.classList.add('has-error');
      inputEl.setAttribute('aria-invalid', 'true');
      var errorEl = document.getElementById(errorId);
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('is-visible');
      }
    }

    function clearError(inputEl, errorId) {
      if (!inputEl) return;
      inputEl.classList.remove('has-error');
      inputEl.removeAttribute('aria-invalid');
      var errorEl = document.getElementById(errorId);
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('is-visible');
      }
    }

    // Live validation clears
    if (nameInput) nameInput.addEventListener('input', function () { clearError(nameInput, 'name-error'); });
    if (phoneInput) phoneInput.addEventListener('input', function () { clearError(phoneInput, 'phone-error'); });
    if (projectTypeSelect) projectTypeSelect.addEventListener('change', function () { clearError(projectTypeSelect, 'project-type-error'); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Check Honeypot for spam bot detection
      if (honeypotInput && honeypotInput.value.trim() !== '') {
        console.warn('Bot submission blocked via honeypot.');
        return;
      }

      var isValid = true;

      // 1. Validate Full Name
      var nameVal = nameInput ? nameInput.value.trim() : '';
      if (!nameVal || nameVal.length < 2) {
        showError(nameInput, 'name-error', 'Please enter your full name (at least 2 characters).');
        isValid = false;
      } else {
        clearError(nameInput, 'name-error');
      }

      // 2. Validate Phone Number
      var rawPhone = phoneInput ? phoneInput.value.replace(/[\s\-()]/g, '') : '';
      if (!rawPhone) {
        showError(phoneInput, 'phone-error', 'Please enter your phone number.');
        isValid = false;
      } else if (!indianPhoneRegex.test(rawPhone)) {
        showError(phoneInput, 'phone-error', 'Please enter a valid 10-digit Indian phone number.');
        isValid = false;
      } else {
        clearError(phoneInput, 'phone-error');
      }

      // 3. Validate Project Type
      var projectTypeVal = projectTypeSelect ? projectTypeSelect.value : '';
      if (!projectTypeVal) {
        showError(projectTypeSelect, 'project-type-error', 'Please select a project type.');
        isValid = false;
      } else {
        clearError(projectTypeSelect, 'project-type-error');
      }

      if (!isValid) {
        // Focus first invalid element
        var firstInvalid = form.querySelector('.has-error');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Prepare payload
      var payload = {
        name: nameVal,
        phone: rawPhone,
        projectType: projectTypeVal,
        budget: budgetSelect ? budgetSelect.value : 'Not specified',
        message: messageInput ? messageInput.value.trim() : '',
        timestamp: new Date().toISOString()
      };

      // Set Submitting State
      var originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Sending enquiry...';

      // Submit via Fetch
      fetch('/.netlify/functions/submit-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        // Form submitted successfully through live backend
        statusBox.className = 'form-status is-success';
        statusBox.innerHTML = '<strong>Thank you, ' + escapeHtml(payload.name) + '!</strong> Your enquiry has been received. Rakesh Dashpute and the Align Interiors team will review your requirements and call you back shortly.';
        form.reset();
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      })
      .catch(function (err) {
        // Check if serverless endpoint is not yet connected (e.g. running on simple static server or pre-deployment)
        console.info('Backend endpoint status:', err.message);

        // Friendly informative notification acknowledging valid frontend data
        statusBox.className = 'form-status is-info';
        statusBox.innerHTML = [
          '<strong>Enquiry Validated Successfully!</strong>',
          '<p style="margin: 0.5rem 0 0.25rem 0;">Your details (' + escapeHtml(payload.name) + ', ' + escapeHtml(payload.phone) + ', ' + escapeHtml(payload.projectType) + ') passed all validation checks.</p>',
          '<p style="font-size: 0.825rem; color: #645C55; margin: 0;"><em>Note for website administrator:</em> Static frontend mode is active. To enable live email dispatch to your inbox, configure your email credentials in <code>netlify/functions/submit-enquiry.js</code> and <code>.env</code> as detailed in the README.</p>'
        ].join('');

        // Also offer one-click WhatsApp send with the filled data so user inquiry is never lost!
        var waMessage = encodeURIComponent(
          "Hello Align Interiors! My name is " + payload.name + 
          ". I'm looking for an interior design consultation for: " + payload.projectType + 
          (payload.budget ? " (Budget: " + payload.budget + ")" : "") + 
          ". My phone: " + payload.phone + 
          (payload.message ? ". Details: " + payload.message : "")
        );
        var waBtn = document.createElement('div');
        waBtn.style.marginTop = '0.75rem';
        waBtn.innerHTML = '<a href="https://wa.me/919766045538?text=' + waMessage + '" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">Click here to send these details directly via WhatsApp</a>';
        statusBox.appendChild(waBtn);

        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      });
    });

    function escapeHtml(string) {
      var div = document.createElement('div');
      div.appendChild(document.createTextNode(string));
      return div.innerHTML;
    }
  }

  document.addEventListener('DOMContentLoaded', initContactForm);
})();
