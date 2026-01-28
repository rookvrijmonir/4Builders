(function () {
  // --- 0. UTM Parameter Capture ---
  // Capture UTM params from URL on first landing, persist in sessionStorage
  (function () {
    var params = new URLSearchParams(window.location.search);
    var utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    // Only overwrite if URL contains at least one UTM param (first landing from ad)
    var hasUtm = utmKeys.some(function (k) { return params.has(k); });
    if (hasUtm) {
      utmKeys.forEach(function (k) {
        sessionStorage.setItem(k, params.get(k) || "");
      });
    }
  })();

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
      phone: (el) => {
        const v = String(el.value || "").trim();
        if (isEmpty(v)) return "Telefoonnummer is verplicht.";
        return /^[0-9+\s()-]{7,}$/.test(v) ? "" : "Vul een geldig telefoonnummer in.";
      },
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

    // Service radio group validator
    function validateServiceSelection(force) {
      var serviceError = document.getElementById("serviceError");
      var grid = form.querySelector(".service-radio-grid");
      if (!serviceError || !grid) return true;

      var checked = form.querySelector('input[name="service"]:checked');

      if (!force && !checked) {
        grid.classList.remove("has-error");
        serviceError.textContent = "";
        serviceError.classList.add("hidden");
        return true;
      }

      if (!checked) {
        grid.classList.add("has-error");
        var isEN = window.location.pathname.startsWith("/en");
        serviceError.textContent = isEN ? "Please select a service." : "Selecteer een dienst.";
        serviceError.classList.remove("hidden");
        return false;
      }

      grid.classList.remove("has-error");
      serviceError.textContent = "";
      serviceError.classList.add("hidden");
      return true;
    }

    // Combine service + details into uw_bericht for HubSpot
    function buildUwBericht(fd) {
      var service = fd.get("service") || "";
      var details = (fd.get("details") || "").trim();
      var bericht = "Dienst: " + service;
      if (details) bericht += "\n\nDetails: " + details;
      return bericht;
    }

    function validateForm() {
      let ok = true;
      form.querySelectorAll("input, textarea").forEach((el) => {
        if (el.name === "honeypot") return;
        if (el.name === "service") return;  // handled separately
        if (el.name === "details") return;  // optional
        const thisOk = validateField(el, { force: true });
        if (!thisOk) ok = false;
      });
      // Validate service selection
      if (!validateServiceSelection(true)) ok = false;
      return ok;
    }

    // Zet alles bij start neutraal (behalve honeypot, service, details)
    form.querySelectorAll("input, textarea").forEach((el) => {
      if (el.name === "honeypot" || el.name === "service" || el.name === "details") return;
      setNeutral(el);
    });

    // Live events (skip honeypot, service radios, details)
    form.querySelectorAll("input, textarea").forEach((el) => {
      if (el.name === "honeypot" || el.name === "service" || el.name === "details") return;

      el.addEventListener("input", () => {
        validateField(el, { force: false });

        const feedback = document.getElementById("formFeedback");
        if (feedback) feedback.classList.add("hidden");
      });

      el.addEventListener("blur", () => {
        validateField(el, { force: true });
      });
    });

    // --- Service Radio Card Logic ---
    var serviceRadios = form.querySelectorAll('input[name="service"]');
    var detailsWrapper = document.getElementById("detailsWrapper");

    serviceRadios.forEach(function (radio) {
      radio.addEventListener("change", function () {
        // Toggle .selected class on cards (fallback for :has())
        form.querySelectorAll(".service-radio-card").forEach(function (card) {
          card.classList.remove("selected");
        });
        var parentCard = radio.closest(".service-radio-card");
        if (parentCard) parentCard.classList.add("selected");

        // Show details textarea with animation
        if (detailsWrapper) {
          detailsWrapper.classList.remove("hidden");
          // Trigger reflow before adding visible class for transition
          detailsWrapper.offsetHeight;
          detailsWrapper.classList.add("visible");
        }

        // Clear service error
        validateServiceSelection(false);

        // Clear general feedback
        var feedback = document.getElementById("formFeedback");
        if (feedback) feedback.classList.add("hidden");
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

      // Retrieve stored UTM params
      var utmSource = sessionStorage.getItem("utm_source") || "";
      var utmMedium = sessionStorage.getItem("utm_medium") || "";
      var utmCampaign = sessionStorage.getItem("utm_campaign") || "";
      var utmContent = sessionStorage.getItem("utm_content") || "";
      var utmTerm = sessionStorage.getItem("utm_term") || "";

      const subData = {
        fields: [
          { name: "firstname", value: formData.get("firstname") || "" },
          { name: "lastname", value: formData.get("lastname") || "" },
          { name: "email", value: formData.get("email") || "" },
          { name: "phone", value: formData.get("phone") || "" },
          { name: "zip", value: String(formData.get("zip") || "").toUpperCase() },
          { name: "uw_bericht", value: buildUwBericht(formData) },
          { name: "utm_source", value: utmSource },
          { name: "utm_medium", value: utmMedium },
          { name: "utm_campaign", value: utmCampaign },
          { name: "utm_content", value: utmContent },
          { name: "utm_term", value: utmTerm },
        ],
        context: { pageUri: window.location.href, pageName: document.title },
      };

      // Helper: show success and reset form
      var isEN = window.location.pathname.startsWith("/en");
      const showSuccess = () => {
        // Fire GA4 generate_lead conversion event
        if (typeof gtag === "function") {
          var selectedService = formData.get("service") || "";
          gtag("event", "generate_lead", {
            currency: "EUR",
            value: 0,
            event_category: "form",
            event_label: selectedService,
            utm_source: utmSource,
            utm_medium: utmMedium,
            utm_campaign: utmCampaign,
          });
        }

        if (feedback) {
          feedback.innerText = isEN ? "Form submitted successfully!" : "Formulier succesvol verzonden!";
          feedback.className = "text-green-500 mt-4 block font-bold text-center";
          feedback.classList.remove("hidden");
        }
        try {
          form.reset();
          form.querySelectorAll("input, textarea").forEach((el) => {
            if (el.name === "honeypot") return;
            setNeutral(el);
          });
          // Reset service card visuals
          form.querySelectorAll(".service-radio-card").forEach(function (card) {
            card.classList.remove("selected");
          });
          // Hide details wrapper
          var dw = document.getElementById("detailsWrapper");
          if (dw) { dw.classList.add("hidden"); dw.classList.remove("visible"); }
          // Clear service error
          var se = document.getElementById("serviceError");
          if (se) { se.textContent = ""; se.classList.add("hidden"); }
          var sg = form.querySelector(".service-radio-grid");
          if (sg) sg.classList.remove("has-error");
        } catch (_) { /* ignore reset errors */ }
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.innerText = isEN ? "Submit Request" : "Verstuur aanvraag";
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
        // Network error — fetch to api.hsforms.com blocked (ad blocker / privacy tool)
        // Fallback 1: try sendBeacon via HubSpot v2 endpoint (different domain, no CORS preflight)
        console.warn("Fetch blocked, trying sendBeacon fallback:", networkErr);

        try {
          const beaconParams = new URLSearchParams();
          beaconParams.append("firstname", formData.get("firstname") || "");
          beaconParams.append("lastname", formData.get("lastname") || "");
          beaconParams.append("email", formData.get("email") || "");
          beaconParams.append("phone", formData.get("phone") || "");
          beaconParams.append("zip", String(formData.get("zip") || "").toUpperCase());
          beaconParams.append("uw_bericht", buildUwBericht(formData));

          const beaconSent = navigator.sendBeacon(
            `https://forms.hubspot.com/uploads/form/v2/${PORTAL_ID}/${FORM_ID}`,
            beaconParams
          );

          if (beaconSent) {
            console.log("sendBeacon fallback succeeded");
            showSuccess();
            return;
          }
        } catch (beaconErr) {
          console.error("sendBeacon fallback also failed:", beaconErr);
        }

        // Fallback 2: WhatsApp with all form data pre-filled
        console.error("All submission methods failed");
        const fd = new FormData(form);
        const name = ((fd.get("firstname") || "") + " " + (fd.get("lastname") || "")).trim();
        var serviceVal = fd.get("service") || "";
        var detailsVal = (fd.get("details") || "").trim();
        var projectInfo = serviceVal;
        if (detailsVal) projectInfo += " - " + detailsVal;

        var waText;
        if (isEN) {
          waText = "Hi, I\u2019d like to request a quote.\n\nName: " + name
            + "\nEmail: " + (fd.get("email") || "")
            + "\nPhone: " + (fd.get("phone") || "")
            + "\nPostcode: " + String(fd.get("zip") || "").toUpperCase()
            + "\nService: " + projectInfo;
        } else {
          waText = "Hallo, ik wil graag een offerte aanvragen.\n\nNaam: " + name
            + "\nE-mail: " + (fd.get("email") || "")
            + "\nTelefoon: " + (fd.get("phone") || "")
            + "\nPostcode: " + String(fd.get("zip") || "").toUpperCase()
            + "\nDienst: " + projectInfo;
        }

        var waUrl = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(waText);
        var errorMsg = isEN
          ? "Submission failed. Please try WhatsApp instead:"
          : "Verzenden mislukt. Probeer WhatsApp:";
        var linkLabel = isEN ? "Send via WhatsApp" : "Verstuur via WhatsApp";

        if (feedback) {
          feedback.innerHTML = errorMsg
            + ' <a href="' + waUrl + '" target="_blank" rel="noopener"'
            + ' class="underline text-[#25D366]">' + linkLabel + "</a>";
          feedback.className = "text-red-500 mt-4 block font-bold text-center";
          feedback.classList.remove("hidden");
        }
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.innerText = isEN ? "Try again" : "Opnieuw proberen";
        if (btnIcon) btnIcon.className = "ph ph-paper-plane-tilt text-xl";
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
        // Response received (request was sent) but body read failed — treat as success
        console.warn("Response read error (request was sent):", readErr);
        showSuccess();
      }
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    applyTranslations();
  });

  // --- 5. WhatsApp Prefilled Messages ---
  const WA_NUMBER = "31618922134";

  const waMessages = {
    nl: {
      general:
        "Hallo, ik wil graag een offerte aanvragen.\n\nKlus: \nPostcode: \nGewenste start: ",
      schilderwerk:
        "Hallo, ik wil graag een offerte voor schilderwerk.\n\nBinnen / buiten: \nPostcode: \nGewenste start: ",
      vloeren:
        "Hallo, ik wil graag een offerte voor vloeren.\n\nType vloer: \nOppervlakte (m\u00B2): \nPostcode: ",
      timmerwerk:
        "Hallo, ik wil graag een offerte voor timmerwerk.\n\nOmschrijving: \nPostcode: \nGewenste start: ",
      bestrating:
        "Hallo, ik wil graag een offerte voor bestrating.\n\nOmschrijving: \nPostcode: \nGewenste start: ",
      vve:
        "Hallo, ik wil graag een offerte voor VvE-onderhoud.\n\nType werk: \nAdres pand: \nAantal woningen: ",
    },
    en: {
      general:
        "Hi, I'd like to request a quote.\n\nType of work: \nPostcode: \nPreferred start: ",
      painting:
        "Hi, I'd like a quote for painting.\n\nInterior / exterior: \nPostcode: \nPreferred start: ",
      flooring:
        "Hi, I'd like a quote for flooring.\n\nFloor type: \nArea (m\u00B2): \nPostcode: ",
      carpentry:
        "Hi, I'd like a quote for carpentry.\n\nDescription: \nPostcode: \nPreferred start: ",
      paving:
        "Hi, I'd like a quote for paving.\n\nDescription: \nPostcode: \nPreferred start: ",
      "property-management":
        "Hi, I'd like a quote for building maintenance (VvE).\n\nType of work: \nBuilding address: \nNumber of units: ",
    },
  };

  function detectPageContext() {
    const p = window.location.pathname;
    if (p.startsWith("/schilderwerk")) return { lang: "nl", service: "schilderwerk" };
    if (p.startsWith("/vloeren")) return { lang: "nl", service: "vloeren" };
    if (p.startsWith("/timmerwerk")) return { lang: "nl", service: "timmerwerk" };
    if (p.startsWith("/bestrating")) return { lang: "nl", service: "bestrating" };
    if (p.startsWith("/vve")) return { lang: "nl", service: "vve" };
    if (p.startsWith("/en/painting")) return { lang: "en", service: "painting" };
    if (p.startsWith("/en/flooring")) return { lang: "en", service: "flooring" };
    if (p.startsWith("/en/carpentry")) return { lang: "en", service: "carpentry" };
    if (p.startsWith("/en/paving")) return { lang: "en", service: "paving" };
    if (p.startsWith("/en/property-management")) return { lang: "en", service: "property-management" };
    if (p.startsWith("/en")) return { lang: "en", service: "general" };
    return { lang: "nl", service: "general" };
  }

  function setupWhatsAppLinks() {
    const { lang, service } = detectPageContext();
    const msg = waMessages[lang]?.[service] || waMessages[lang]?.general || waMessages.nl.general;
    const url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);

    document.querySelectorAll('a[href*="wa.me"]').forEach(function (link) {
      link.href = url;
    });
  }

  // Form is loaded async via includes.js — wait for components-loaded event
  document.addEventListener("components-loaded", () => {
    setupCustomForm();
    setupWhatsAppLinks();

    // Scroll to hash target after async components are loaded
    // Fixes: browser tries to scroll before form/header are in DOM
    if (window.location.hash) {
      scrollToHash(window.location.hash);
    }
  });
})();
