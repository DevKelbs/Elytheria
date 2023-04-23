//
export function disableUserInterface() {
  // Function body
}

export function enableUserInterface() {
  // Function body
}

export function displayErrorMessage(message) {
  // Function body
}

export function displaySuccessMessage(message) {
  const successMessage = document.createElement("div");
  successMessage.className = "success-message";
  successMessage.innerText = message;

  document.body.appendChild(successMessage);

  setTimeout(() => {
    successMessage.remove();
  }, 3000);
}

export function updateAuthButtons(isAuthenticated) {
  const createCharacter = document.getElementById("create-character-link");

  if (isAuthenticated) {
    createCharacter.classList.remove("hidden");
  } else {
    createCharacter.classList.add("hidden");
  }
}

export function updateUsernameDisplay() {
  const usernameDisplay = document.getElementById("username-display");
  const activeCharacter = JSON.parse(localStorage.getItem("activeCharacter"));

  if (activeCharacter) {
    usernameDisplay.textContent = activeCharacter.name;
  } else {
    usernameDisplay.textContent = "";
  }
}
export function updateDropdown() {
  const activeUsername = document.getElementById("activeUsername");
  const username = localStorage.getItem("username");
  console.log(username)

  if (username) {
    activeUsername.textContent = username;
  } else {
    activeUsername.textContent = "";
  }
}
//set active character to dropdown menu name



document.addEventListener("DOMContentLoaded", () => {
  const toggleEye = document.querySelector(".far.fa-eye.text-muted.ml-2.eye1");
  const navMainItemsCombat = document.querySelectorAll(".combat");
  const toggleEye2 = document.querySelector(".far.fa-eye.text-muted.ml-2.eye2");
  const navMainItemsNonCombat = document.querySelectorAll(".non-combat");

  if (toggleEye) {
    toggleEye.addEventListener("click", () => {
      toggleEye.classList.toggle("fa-eye-slash");
      toggleEye.classList.toggle("fa-eye");
      toggleEye.classList.toggle("text-muted");

      navMainItemsCombat.forEach((item) => {
        if (item.style.display === "none") {
          item.style.display = "list-item";
        } else {
          item.style.display = "none";
        }
      });
    });
  }
  if (toggleEye2) {
    toggleEye2.addEventListener("click", () => {
      toggleEye2.classList.toggle("fa-eye-slash");
      toggleEye2.classList.toggle("fa-eye");
      toggleEye2.classList.toggle("text-muted");

      navMainItemsNonCombat.forEach((item) => {
        if (item.style.display === "none") {
          item.style.display = "list-item";
        } else {
          item.style.display = "none";
        }
      });
    });
  }
});
