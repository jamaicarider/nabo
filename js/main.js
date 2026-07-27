/**
 * nabō | mídias sociais — formulário de qualificação → WhatsApp
 */

(function () {
  "use strict";

  const WHATSAPP_PHONE = "554196168447";
  const FEEDBACK_LABEL = "Abrindo WhatsApp...";
  const FEEDBACK_DURATION_MS = 2800;

  const toastEl = document.getElementById("toast");
  const yearEl = document.getElementById("year");
  const formEl = document.getElementById("lead-form");
  const submitBtn = document.getElementById("submit-btn");
  const servicoHint = document.getElementById("servico-hint");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /**
   * Monta URL wa.me com texto codificado corretamente.
   * @param {string} message
   * @returns {string}
   */
  function buildWhatsAppUrl(message) {
    return (
      "https://wa.me/" +
      WHATSAPP_PHONE +
      "?text=" +
      encodeURIComponent(message)
    );
  }

  /**
   * Formata a primeira mensagem com as respostas do cliente.
   * @param {Object} data
   * @returns {string}
   */
  function buildLeadMessage(data) {
    return (
      "Olá! Vim pelo site da nabō | mídias sociais e gostaria de conversar sobre um projeto.\n\n" +
      "*Nome:* " +
      data.nome +
      "\n" +
      "*Marca:* " +
      data.marca +
      "\n" +
      "*Instagram:* " +
      data.instagram +
      "\n" +
      "*E-mail:* " +
      data.email +
      "\n" +
      "*Serviço(s) de interesse:* " +
      data.servicos +
      "\n" +
      "*O que você busca:* " +
      data.objetivo
    );
  }

  /**
   * @param {string} text
   */
  function showToast(text) {
    if (!toastEl) return;
    toastEl.textContent = text;
    toastEl.hidden = false;
    toastEl.classList.add("is-visible");
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(function () {
      toastEl.classList.remove("is-visible");
      window.setTimeout(function () {
        toastEl.hidden = true;
      }, 320);
    }, FEEDBACK_DURATION_MS);
  }

  /**
   * @param {HTMLFormElement} form
   * @returns {{ valid: boolean, data?: Object }}
   */
  function readForm(form) {
    var nome = /** @type {HTMLInputElement} */ (
      form.elements.namedItem("nome")
    ).value.trim();
    var marca = /** @type {HTMLInputElement} */ (
      form.elements.namedItem("marca")
    ).value.trim();
    var instagram = /** @type {HTMLInputElement} */ (
      form.elements.namedItem("instagram")
    ).value.trim();
    var email = /** @type {HTMLInputElement} */ (
      form.elements.namedItem("email")
    ).value.trim();
    var objetivo = /** @type {HTMLTextAreaElement} */ (
      form.elements.namedItem("objetivo")
    ).value.trim();

    var servicoInputs = form.querySelectorAll('input[name="servico"]:checked');
    var servicos = Array.prototype.map
      .call(servicoInputs, function (input) {
        return input.value;
      })
      .join(", ");

    if (!nome || !marca || !instagram || !email || !objetivo) {
      form.reportValidity();
      return { valid: false };
    }

    if (!servicos) {
      if (servicoHint) servicoHint.hidden = false;
      return { valid: false };
    }

    if (servicoHint) servicoHint.hidden = true;

    if (!instagram.startsWith("@")) {
      instagram = "@" + instagram.replace(/^@+/, "");
    }

    return {
      valid: true,
      data: {
        nome: nome,
        marca: marca,
        instagram: instagram,
        email: email,
        servicos: servicos,
        objetivo: objetivo,
      },
    };
  }

  /**
   * @param {HTMLButtonElement} button
   * @param {string} message
   */
  function openWhatsAppWithFeedback(button, message) {
    var defaultLabel =
      button.getAttribute("data-default-label") || button.textContent || "";

    button.disabled = true;
    button.classList.add("is-loading");
    button.textContent = FEEDBACK_LABEL;
    showToast(FEEDBACK_LABEL);

    var url = buildWhatsAppUrl(message);

    window.setTimeout(function () {
      window.open(url, "_blank", "noopener,noreferrer");
    }, 400);

    window.setTimeout(function () {
      button.disabled = false;
      button.classList.remove("is-loading");
      button.textContent = defaultLabel;
    }, FEEDBACK_DURATION_MS);
  }

  function initForm() {
    if (!formEl || !submitBtn) return;

    formEl.addEventListener("submit", function (event) {
      event.preventDefault();
      var result = readForm(formEl);
      if (!result.valid || !result.data) return;

      var message = buildLeadMessage(result.data);
      openWhatsAppWithFeedback(submitBtn, message);
    });

    formEl.querySelectorAll('input[name="servico"]').forEach(function (input) {
      input.addEventListener("change", function () {
        if (servicoHint && formEl.querySelector('input[name="servico"]:checked')) {
          servicoHint.hidden = true;
        }
      });
    });
  }

  function initReveal() {
    var reveals = document.querySelectorAll(".reveal");
    if (!reveals.length) return;

    if (!("IntersectionObserver" in window)) {
      reveals.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  function init() {
    initReveal();
    initForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
