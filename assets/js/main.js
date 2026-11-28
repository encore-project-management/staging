/* Encore Projects: the only JavaScript on the site.
   1. Puts the current year in the footer.
   2. Sends the contact form to Formspree without leaving the page,
      and shows a success or error message. */

(function () {
  'use strict';

  // 1. Current year in the footer
  var year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // 2. Contact form
  var form = document.getElementById('contact-form');
  if (!form || !window.fetch) {
    return; // No form on this page, or a very old browser: the form submits the normal way.
  }

  var status = document.getElementById('form-status');
  var button = form.querySelector('button[type="submit"]');

  function showStatus(message, kind) {
    status.textContent = message;
    status.className = 'form-status form-status--' + kind;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // The Formspree form ID has not been filled in yet (see TODO.md).
    if (form.action.indexOf('FORM_ID') !== -1) {
      showStatus('Your message could not be sent. The contact form is not set up yet.', 'error');
      return;
    }

    button.disabled = true;
    showStatus('Sending…', 'pending');

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Formspree returned ' + response.status);
        }
        form.reset();
        showStatus('Thank you. Your message has been sent.', 'success');
      })
      .catch(function () {
        showStatus('Your message could not be sent. Please try again.', 'error');
      })
      .then(function () {
        button.disabled = false;
      });
  });
})();
