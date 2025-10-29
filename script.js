const form = document.getElementById("form");
const consent = document.getElementById("consent");
const checkmark = document.querySelector(".checkmark");
const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const email = document.getElementById("email");
const errorMessage = document.querySelectorAll(".error-message");
const radios = document.querySelectorAll('input[name="query-type"]');
const radioContainer = document.getElementById("query");
const successMessage = document.getElementById("success-message");

// helper: find the <p class="error-message"> that belongs to an element
const findErrorDisplay = (element) => {
  if (!element) return null;

  // common pattern: <input> followed by <p class="error-message">
  if (
    element.nextElementSibling &&
    element.nextElementSibling.classList &&
    element.nextElementSibling.classList.contains("error-message")
  ) {
    return element.nextElementSibling;
  }

  // sometimes the <p> is before the element
  if (
    element.previousElementSibling &&
    element.previousElementSibling.classList &&
    element.previousElementSibling.classList.contains("error-message")
  ) {
    return element.previousElementSibling;
  }

  // radio group: only return the p after #query when the element is inside (or is) #query
  const queryBlock = document.getElementById("query");
  if (
    queryBlock &&
    (element === queryBlock || (element.closest && element.closest("#query")))
  ) {
    const p = queryBlock.nextElementSibling;
    if (p && p.classList && p.classList.contains("error-message")) return p;
  }

  // consent has its own container with a p inside — prefer that when element is in/related to consent
  const consentContainer = document.getElementById("consent-container");
  if (
    consentContainer &&
    (element === consentContainer ||
      (element.closest && element.closest("#consent-container")) ||
      element.classList.contains("checkmark"))
  ) {
    const p = consentContainer.querySelector(".error-message");
    if (p) return p;
  }

  // fallback: first .error-message in the document
  return document.querySelector(".error-message");
};

const setError = (element, message) => {
  const errorDisplay = findErrorDisplay(element);
  if (!errorDisplay) return;
  errorDisplay.innerText = message;
  errorDisplay.style.display = "block";
  // add a simple state class to the related element's container (not using 'error-message' class)
  const container = element.parentElement ?? element;
  container.classList.add("error");
  container.classList.remove("success");
};

const setSuccess = (element) => {
  const errorDisplay = findErrorDisplay(element);
  if (errorDisplay) {
    errorDisplay.innerText = "";
    errorDisplay.style.display = "none";
  }
  const container = element.parentElement ?? element;
  container.classList.remove("error");
  container.classList.add("success");
};

const clearError = (element) => {
  if (element) {
    const errorDisplay = findErrorDisplay(element);
    if (errorDisplay) {
      errorDisplay.innerText = "";
      errorDisplay.style.display = "none";
    }
    return;
  }
  // clear all
  errorMessage.forEach((em) => {
    em.innerText = "";
    em.style.display = "none";
  });
};

const validateInputs = () => {
  const firstNameValue = firstName.value.trim();
  const lastNameValue = lastName.value.trim();
  const emailValue = email.value.trim();
  const isRadioChecked = Array.from(radios).some((radio) => radio.checked);
  const isConsentChecked = consent.checked;
  const textarea = document.getElementById("textarea");
  const messageValue = textarea ? textarea.value.trim() : "";

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  let isValid = true;

  if (!firstNameValue) {
    setError(firstName, "This field is required");
    isValid = false;
  } else {
    setSuccess(firstName);
  }

  if (!lastNameValue) {
    setError(lastName, "This field is required");
    isValid = false;
  } else {
    setSuccess(lastName);
  }

  if (!emailValue) {
    setError(email, "Email is required");
    isValid = false;
  } else if (!isValidEmail(emailValue)) {
    setError(email, "Please enter a valid email address");
    isValid = false;
  } else {
    setSuccess(email);
  }

  if (!isRadioChecked) {
    // pass the query block so findErrorDisplay finds the right <p>
    setError(radioContainer, "Please select a query type");
    isValid = false;
  } else {
    setSuccess(radioContainer);
  }

  if (!messageValue) {
    if (textarea) {
      setError(textarea, "This field is required");
      isValid = false;
    }
  } else if (textarea) {
    setSuccess(textarea);
  }

  if (!isConsentChecked) {
    setError(consent, "To submit this form, please consent to being contacted");
    isValid = false;
  } else {
    setSuccess(consent);
  }

  return isValid;
};

// make the visual custom checkbox keyboard-accessible
if (checkmark && consent) {
  // ensure it's focusable and exposes checkbox semantics
  checkmark.setAttribute("tabindex", "0");
  checkmark.setAttribute("role", "checkbox");
  checkmark.setAttribute("aria-checked", consent.checked ? "true" : "false");

  // ensure clickable via mouse and keyboard even if CSS interferes
  checkmark.style.pointerEvents = "auto";
  checkmark.style.cursor = "pointer";
  consent.style.cursor = "pointer";

  const syncCheckmarkState = () => {
    checkmark.setAttribute("aria-checked", consent.checked ? "true" : "false");
    if (consent.checked) {
      setSuccess(consent);
    } else {
      // clear visual success when unchecked (don't show an error here)
      const err = findErrorDisplay(consent);
      if (err) {
        err.innerText = "";
        err.style.display = "none";
      }
      const container = consent.parentElement ?? consent;
      container.classList.remove("success");
      container.classList.remove("error");
    }
  };

  const toggleConsent = () => {
    consent.checked = !consent.checked;
    // notify other listeners
    consent.dispatchEvent(new Event("change", { bubbles: true }));
    syncCheckmarkState();
  };

  // keyboard: Enter or Space toggles the checkbox
  checkmark.addEventListener("keydown", (e) => {
    if (
      e.key === "Enter" ||
      e.key === " " ||
      e.code === "Space" ||
      e.key === "Spacebar"
    ) {
      e.preventDefault();
      toggleConsent();
    }
  });

  // click on the visual checkmark should also toggle
  checkmark.addEventListener("click", (e) => {
    toggleConsent();
  });

  // Also make the label or consent container toggle the checkbox when clicked
  const consentLabel = document.querySelector(`label[for="${consent.id}"]`);
  const consentContainer =
    document.getElementById("consent-container") || consent.parentElement;
  if (consentLabel) {
    consentLabel.style.cursor = "pointer";
    consentLabel.addEventListener("click", (e) => {
      // if the native checkbox itself was clicked let the browser handle it
      if (e.target === consent) return;
      toggleConsent();
    });
  } else if (consentContainer) {
    consentContainer.style.cursor = "pointer";
    consentContainer.addEventListener("click", (e) => {
      if (e.target === consent) return;
      // avoid toggling when clicking links inside the container
      if (e.target.tagName && e.target.tagName.toLowerCase() === "a") return;
      toggleConsent();
    });
  }

  // keep visual state in sync if the real input changes (e.g. label click)
  consent.addEventListener("change", syncCheckmarkState);

  // initial sync
  syncCheckmarkState();
}

const renderSuccess = () => {
  if (!successMessage) return;
  // Show the success message
  successMessage.classList.add("show");
  // Hide the message before submitting the form
  setTimeout(() => {
    successMessage.classList.remove("show");
    setTimeout(() => form.submit(), 300); // Give time for hide animation
  }, 6000); // Show for 6s then start hiding
};

const handleSubmit = (event) => {
  event.preventDefault();
  clearError();
  // guard: ensure form exists
  if (!form) return;

  const submitButton = form.querySelector("input[type='submit']");

  // disable submit to prevent double submits
  if (submitButton) {
    submitButton.disabled = true;
  }

  if (validateInputs()) {
    renderSuccess();
  } else {
    // re-enable if validation failed
    if (submitButton) submitButton.disabled = false;
  }
};
form.addEventListener("submit", handleSubmit);
