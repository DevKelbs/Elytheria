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

  if (username) {
    activeUsername.textContent = username;
  } else {
    activeUsername.textContent = "";
  }
}

// Check if the activeCharacter exists in local storage
if (localStorage.getItem('activeCharacter')) {
  // Retrieve the skill stats from local storage
  const characterStats = JSON.parse(localStorage.getItem('activeCharacter'));

  // Loop through each nav-main-item element
  const navMainItems = document.querySelectorAll('.nav-main-item');
  navMainItems.forEach(navMainItem => {
    // Get the skill name from the nav-main-link-name element
    const skillName = navMainItem.querySelector('.nav-main-link-name').textContent.toLowerCase();
    // Get the span element inside the small element
    const skillStatSpan = navMainItem.querySelector('.nav-main-link small span');

    // Update the text content of the span element with the corresponding skill stat
    if (characterStats.skills.hasOwnProperty(skillName)) {
      skillStatSpan.textContent = `${characterStats.skills[skillName]}`;
    }
  });
} else {
  console.error("No active character found in local storage.");
}


//set character level dynamically
// Check if the current page is index.html
if (window.location.pathname === '/index.html') {
  // Get the active character from local storage
  const activeCharacter = JSON.parse(localStorage.getItem('activeCharacter'));
  
  // Update the character level element with the active character's level
  const characterLevel = document.querySelector('.character-level');
  if (activeCharacter) {
    characterLevel.textContent = `Level:${activeCharacter.level}`;
  }
}




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
