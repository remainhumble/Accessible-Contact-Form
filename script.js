const form = document.getElementById("form");
const consent = document.getElementById("consent");
const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const email = document.getElementById("email");
const errorMessage = document.querySelectorAll(".error-message");
const radios = document.querySelectorAll('input[name="query-type"]');

// helper: find the <p class="error-message"> that belongs to an element
const findErrorDisplay = (element) => {
  if (!element) return null;
  // common pattern in your HTML: <input> followed by <p class="error-message">
  if (
    element.nextElementSibling &&
    element.nextElementSibling.classList.contains("error-message")
  ) {
    return element.nextElementSibling;
  }
  // sometimes the <p> is before the element
  if (
    element.previousElementSibling &&
    element.previousElementSibling.classList.contains("error-message")
  ) {
    return element.previousElementSibling;
  }
  // radio group has the <p> right after the #query block
  const queryBlock = document.getElementById("query");
  if (
    queryBlock &&
    queryBlock.nextElementSibling &&
    queryBlock.nextElementSibling.classList.contains("error-message")
  ) {
    return queryBlock.nextElementSibling;
  }
  // consent has its own container with a p inside
  const consentContainer = document.getElementById("consent-container");
  if (consentContainer) {
    const p = consentContainer.querySelector(".error-message");
    if (p) return p;
  }
  // fallback: first .error-message
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
    setError(firstName, "First name is required");
    isValid = false;
  } else {
    setSuccess(firstName);
  }

  if (!lastNameValue) {
    setError(lastName, "Last name is required");
    isValid = false;
  } else {
    setSuccess(lastName);
  }

  if (!emailValue) {
    setError(email, "Email is required");
    isValid = false;
  } else if (!isValidEmail(emailValue)) {
    setError(email, "Email is not valid");
    isValid = false;
  } else {
    setSuccess(email);
  }

  if (!isRadioChecked) {
    // pass the query block so findErrorDisplay finds the right <p>
    const radioContainer = document.getElementById("query");
    setError(radioContainer, "Please select a query type");
    isValid = false;
  } else {
    const radioContainer = document.getElementById("query");
    setSuccess(radioContainer);
  }

  if (!messageValue) {
    if (textarea) {
      setError(textarea, "Message is required");
      isValid = false;
    }
  } else if (textarea) {
    setSuccess(textarea);
  }

  if (!isConsentChecked) {
    setError(consent, "You must give consent");
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
