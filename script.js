const form = document.getElementById("form");
const errorMessage = document.querySelectorAll(".error-message");
const consent = document.getElementById("consent");
const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const email = document.getElementById("email");
const radios = document.querySelectorAll('input[name="query-type"]');

const validateInputs = () => {
  const firstNameValue = firstName.value.trim();
  const lastNameValue = lastName.value.trim();
  const emailValue = email.value.trim();
  const isRadioChecked = Array.from(radios).some((radio) => radio.checked);
  const isConsentChecked = consent.checked;

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  let valid = true;

  if (!firstNameValue) {
    // show error for first name
    setError(firstName, errorMessage[0].innerText);
    valid = false;
  } else {
    setSuccess(firstName);
  }

  if (!lastNameValue) {
    // show error for last name
    setError(lastName, errorMessage[1].innerText);
    valid = false;
  } else {
    setSuccess(lastName);
  }

  if (!emailValue) {
    // show error for email
    setError(email, errorMessage[1].innerText);
  } else if (!isValidEmail(emailValue)) {
    setError(email, errorMessage[1].innerText);
  } else {
    setSuccess(email);
  }

  if (!isRadioChecked) {
    // show error for query type
  }

  if (!errorMessage) {
    // show error for message
  }

  if (!isConsentChecked) {
    // show error for consent
  }

  return false; // prevent form submission if validation fails
};

// assign an error message to the form
const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error-message");
  errorDisplay.innerText = message;
  errorDisplay.style.display = "block";
};

// render the success state
const setSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error-message");
  errorDisplay.innerText = "";
  errorDisplay.style.display = "none";
};

const clearError = (element) => {
  // remove any success or error states for a specific form field
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error-message");
  errorDisplay.innerText = "";
  errorDisplay.style.display = "none";
};

const handleSubmit = (event) => {
  event.preventDefault();
  clearError();
};

form.addEventListener("submit", handleSubmit, validateInputs());
