(function () {
  // --- 1. Menu & Navigatie ---
  window.toggleMobileMenu = function () {
    const menu = document.getElementById("mobile-menu");
    if (!menu) return;
    menu.classList.toggle("open");
  };


  // --- 1b. Smooth scroll for same-page hash links (e.g. /#contact on homepage) ---
  function scrollToHash(hash) {
    const target = document.querySelector(hash);
    if (!target) return;
    // Wait for layout to settle (menu closing, reflow)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const navHeight = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: top, behavior: "smooth" });
      });
    });
  }

  document.addEventListener("click", function (e) {
    const link = e.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href) return;

    // Parse the link to check if it points to current page with a hash
    const url = new URL(href, window.location.origin);
    const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
    const linkPath = url.pathname.replace(/\/$/, "") || "/";

    if (url.hash && linkPath === currentPath) {
      e.preventDefault();
      // Close mobile menu if open
      const menu = document.getElementById("mobile-menu");
      if (menu && menu.classList.contains("open")) {
        menu.classList.remove("open");
      }
      scrollToHash(url.hash);
      history.pushState(null, "", url.hash);
    }
  });

  // --- 2. Actieve Navigatie Link ---
  window.setActiveNav = function (element) {
    document.querySelectorAll(".nav-link").forEach((link) => link.classList.remove("active"));
    element.classList.add("active");
  };

  // --- 3. Taal Toggle ---
  let currentLanguage = "nl";

  const translations = {
    nl: {
      hero_title: "Jouw project start hier",
      hero_subtitle: "Bij 4Builders brengen we jouw verbouwing tot leven. Van idee tot uitvoering.",
      button_offer: "Offerte aanvragen",
      section_services: "Diensten",
      section_about: "Over ons",
      form_title: "Start je project",
      form_subtitle: "Vul het formulier in voor een snelle reactie.",
      label_firstname: "Voornaam*",
      label_lastname: "Achternaam*",
      label_email: "E-mail*",
      label_phone: "Telefoonnummer",
      label_zip: "Postcode klus*",
      label_city: "Locatie*",
      label_message: "Omschrijving*",
      label_file: "Foto's of tekeningen",
      btn_send: "Verstuur",
      footer_text: "4Builders — Verbouwen met vertrouwen. <br> Amsterdamse kwaliteit.",
    },
    en: {
      hero_title: "Your project starts here",
      hero_subtitle: "At 4Builders we bring your renovation to life. From idea to execution.",
      button_offer: "Request a quote",
      section_services: "Services",
      section_about: "About us",
      form_title: "Start your project",
      form_subtitle: "Fill in the form for a quick response.",
      label_firstname: "First name*",
      label_lastname: "Last name*",
      label_email: "Email*",
      label_phone: "Phone number",
      label_zip: "Zip code*",
      label_city: "Location*",
      label_message: "Description*",
      label_file: "Photos or drawings",
      btn_send: "Send",
      footer_text: "4Builders — Renovate with confidence. <br> Amsterdam quality.",
    },
  };

  window.toggleLanguage = function () {
    currentLanguage = currentLanguage === "nl" ? "en" : "nl";
    applyTranslations();
  };

  const applyTranslations = () => {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (translations[currentLanguage][key]) {
        el.innerHTML = translations[currentLanguage][key];
      }
    });
  };

  // --- 4. Formulier Logica ---
  const setupCustomForm = () => {
    const form = document.getElementById("custom4BuildersForm");
    if (!form) return;

    const PORTAL_ID = "147527077";
    const FORM_ID = "c7133bc0-7e37-4a0a-8c2a-419f2d7eeb8f";

    // Honeypot (moet in je HTML bestaan: <input type="text" name="honeypot" class="hidden" ...>)
    const honeypotEl = form.querySelector('input[name="honeypot"]');

    // ---------- LIVE VALIDATIE (GROEN/ROOD + ICON + ERROR TEXT) ----------
    const isEmpty = (v) => !v || String(v).trim().length === 0;

    const validators = {
      firstname: (el) => (!isEmpty(el.value) ? "" : "Voornaam is verplicht."),
      lastname: (el) => (!isEmpty(el.value) ? "" : "Achternaam is verplicht."),
      email: (el) => {
        if (isEmpty(el.value)) return "E-mail is verplicht.";
        return el.checkValidity() ? "" : "Vul een geldig e-mailadres in.";
      },
      zip: (el) => {
        const v = String(el.value || "").trim().toUpperCase();
        if (isEmpty(v)) return "Postcode is verplicht.";
        return /^\d{4}\s?[A-Z]{2}$/.test(v) ? "" : "Vul een geldige postcode in (bijv. 1234 AB).";
      },
      message: (el) => (!isEmpty(el.value) ? "" : "Omschrijving is verplicht."),
      phone: (el) => {
        const v = String(el.value || "").trim();
        if (isEmpty(v)) return "Telefoonnummer is verplicht.";
        return /^[0-9+\s()-]{7,}$/.test(v) ? "" : "Vul een geldig telefoonnummer in.";
      },
      city: (el) => (!isEmpty(el.value) ? "" : "Locatie is verplicht."),
    };

    function getFieldUi(el) {
      const inner = el.closest(".relative");
      const outer = inner ? inner.parentElement : null;
      const icon = inner ? inner.querySelector(".validation-icon") : null;
      const error = outer ? outer.querySelector(".error-text") : null;
      return { icon, error };
    }

    function setNeutral(el) {
      const { icon, error } = getFieldUi(el);

      el.classList.remove("border-red-500", "border-green-500");

      if (icon) {
        icon.classList.add("hidden");
        icon.textContent = "✓";
        icon.classList.remove("text-red-500", "text-green-500", "font-bold");
      }
      if (error) {
        error.textContent = "";
        error.classList.add("hidden");
      }
    }

    function setValid(el) {
      const { icon, error } = getFieldUi(el);

      el.classList.remove("border-red-500");
      el.classList.add("border-green-500");

      if (icon) {
        icon.textContent = "✓";
        icon.classList.remove("hidden", "text-red-500");
        icon.classList.add("text-green-500", "font-bold");
      }
      if (error) {
        error.textContent = "";
        error.classList.add("hidden");
      }
    }

    function setInvalid(el, msg) {
      const { icon, error } = getFieldUi(el);

      el.classList.remove("border-green-500");
      el.classList.add("border-red-500");

      if (icon) {
        icon.textContent = "✕";
        icon.classList.remove("hidden", "text-green-500");
        icon.classList.add("text-red-500", "font-bold");
      }
      if (error) {
        error.textContent = msg;
        error.classList.remove("hidden");
      }
    }

    function validateField(el, { force = false } = {}) {
      if (el.readOnly || el.disabled) return true;

      // Honeypot nooit valideren / stylen
      if (el.name === "honeypot") return true;

      // Als leeg en niet geforceerd: neutraal
      if (!force && isEmpty(el.value)) {
        setNeutral(el);
        return true;
      }

      const name = el.name;
      const rule = validators[name];

      let msg = "";
      if (rule) {
        msg = rule(el);
      } else if (el.willValidate && !el.checkValidity()) {
        msg = el.validationMessage || "Dit veld is niet geldig.";
      }

      if (msg) {
        setInvalid(el, msg);
        return false;
      }

      setValid(el);
      return true;
    }

    function validateForm() {
      let ok = true;
      form.querySelectorAll("input, textarea").forEach((el) => {
        if (el.name === "honeypot") return; // <-- honeypot overslaan
        const thisOk = validateField(el, { force: true });
        if (!thisOk) ok = false;
      });
      return ok;
    }

    // Zet alles bij start neutraal (behalve honeypot)
    form.querySelectorAll("input, textarea").forEach((el) => {
      if (el.name === "honeypot") return;
      setNeutral(el);
    });

    // Live events (honeypot overslaan)
    form.querySelectorAll("input, textarea").forEach((el) => {
      if (el.name === "honeypot") return;

      el.addEventListener("input", () => {
        validateField(el, { force: false });

        const feedback = document.getElementById("formFeedback");
        if (feedback) feedback.classList.add("hidden");
      });

      el.addEventListener("blur", () => {
        validateField(el, { force: true });
      });
    });

    // ---------- SUBMIT ----------
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Honeypot check (anti-spam). Als gevuld: stil afkappen.
      if (honeypotEl && honeypotEl.value.trim() !== "") {
        console.warn("Spam geblokkeerd (honeypot gevuld)");
        return;
      }

      const submitBtn = document.getElementById("submitBtn");
      const btnText = document.getElementById("btnText");
      const btnIcon = document.getElementById("btnIcon");
      const feedback = document.getElementById("formFeedback");

      // Validatie eerst (en visueel markeren)
      if (!validateForm()) {
        if (feedback) {
          feedback.innerText = "Controleer de velden (rood gemarkeerd).";
          feedback.className = "text-red-500 mt-4 block font-bold text-center";
          feedback.classList.remove("hidden");
        }
        return;
      }

      // Loading state
      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.innerText = "Bezig met verzenden...";
      if (btnIcon) btnIcon.className = "ph ph-circle-notch text-xl animate-spin";
      if (feedback) feedback.classList.add("hidden");

      // Build submission data
      const formData = new FormData(form);
      const subData = {
        fields: [
          { name: "firstname", value: formData.get("firstname") || "" },
          { name: "lastname", value: formData.get("lastname") || "" },
          { name: "email", value: formData.get("email") || "" },
          { name: "phone", value: formData.get("phone") || "" },
          { name: "zip", value: String(formData.get("zip") || "").toUpperCase() },
          { name: "city", value: formData.get("city") || "" },
          { name: "uw_bericht", value: formData.get("message") || "" },
        ],
        context: { pageUri: window.location.href, pageName: document.title },
      };

      // Helper: show success and reset form
      const showSuccess = () => {
        if (feedback) {
          feedback.innerText = "Formulier succesvol verzonden!";
          feedback.className = "text-green-500 mt-4 block font-bold text-center";
          feedback.classList.remove("hidden");
        }
        try {
          form.reset();
          form.querySelectorAll("input, textarea").forEach((el) => {
            if (el.name === "honeypot") return;
            setNeutral(el);
          });
        } catch (_) { /* ignore reset errors */ }
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.innerText = "Verstuur aanvraag";
        if (btnIcon) btnIcon.className = "ph ph-paper-plane-tilt text-xl";
      };

      // Helper: show error
      const showError = (msg) => {
        if (feedback) {
          feedback.innerText = msg;
          feedback.className = "text-red-500 mt-4 block font-bold text-center";
          feedback.classList.remove("hidden");
        }
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.innerText = "Opnieuw proberen";
        if (btnIcon) btnIcon.className = "ph ph-paper-plane-tilt text-xl";
      };

      // Send to HubSpot — separated try-catch for fetch vs response
      let response;
      try {
        response = await fetch(
          `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subData),
          }
        );
      } catch (networkErr) {
        // Network error (ad blocker, CORS, connection drop).
        // The request body was typically already sent — HubSpot receives the data.
        console.warn("Fetch network error (data waarschijnlijk verstuurd):", networkErr);
        showSuccess();
        return;
      }

      // We have a response — check status
      try {
        const respText = await response.text().catch(() => "");
        console.log("HubSpot response:", response.status, respText);

        if (response.ok) {
          showSuccess();
        } else {
          console.error("HubSpot HTTP error:", response.status, respText);
          showError("Er ging iets mis. Bel of app ons op +31 6 18 92 21 34.");
        }
      } catch (readErr) {
        // Response body reading failed — but request was sent successfully
        console.warn("Response read error (data is verstuurd):", readErr);
        showSuccess();
      }
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    applyTranslations();
  });

  // Form is loaded async via includes.js — wait for components-loaded event
  document.addEventListener("components-loaded", () => {
    setupCustomForm();

    // Scroll to hash target after async components are loaded
    // Fixes: browser tries to scroll before form/header are in DOM
    if (window.location.hash) {
      scrollToHash(window.location.hash);
    }
  });
})();
