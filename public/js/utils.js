export function disableUserInterface() {
  // Disable all form elements
  const formElements = document.querySelectorAll('input, button, select, textarea');
  formElements.forEach((elem) => {
    elem.disabled = true;
  });

  // Show a loading spinner or message to indicate that the UI is disabled
  const loadingMessage = document.createElement('div');
  loadingMessage.classList.add('loading-message');
  loadingMessage.textContent = 'Please wait...';
  document.body.appendChild(loadingMessage);
}

export function enableUserInterface() {
  // Enable all form elements
  const formElements = document.querySelectorAll('input, button, select, textarea');
  formElements.forEach((elem) => {
    elem.disabled = false;
  });
}

export function displayErrorMessage(message) {
  const errorMessage = document.createElement('div');
  errorMessage.className = 'error-message';
  errorMessage.innerText = message;

  document.body.appendChild(errorMessage);

  setTimeout(() => {
    errorMessage.remove();
  }, 3000);
}