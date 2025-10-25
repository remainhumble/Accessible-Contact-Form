const form = document.getElementById("form");
const consent = document.getElementById("consent");
const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const email = document.getElementById("email");
const errorMessage = document.querySelectorAll(".error-message");
const radios = document.querySelectorAll('input[name="query-type"]');
 const radioContainer = document.getElementById("query");

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
      element.id === "consent")
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

const handleSubmit = (event) => {
  event.preventDefault();
  clearError();
  if (validateInputs()) {
    form.submit();
  }
};

form.addEventListener("submit", handleSubmit);
