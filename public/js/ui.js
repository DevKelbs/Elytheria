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
    const username = localStorage.getItem("username");

    if (username) {
        usernameDisplay.textContent = `${username}`
    } else {
        usernameDisplay.textContent = "";
    }
}

export function setupCharacterInfoToggle() {
    const toggleButton = document.getElementById('toggle-character-info');
    const characterInfoContainer = document.querySelector('.character-info-container');

    toggleButton.addEventListener('click', () => {
        characterInfoContainer.classList.toggle('collapsed');
        toggleButton.classList.toggle('collapsed');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const toggleEye = document.querySelector(".far.fa-eye.text-muted.ml-2");
    const navMainItems = document.querySelectorAll(".nav-main-item");

    if (toggleEye) {
        toggleEye.addEventListener("click", () => {
            toggleEye.classList.toggle("fa-eye-slash");
            toggleEye.classList.toggle("fa-eye");
            toggleEye.classList.toggle("text-muted");

            navMainItems.forEach((item) => {
                if (item.style.display === "none") {
                    item.style.display = "list-item";
                } else {
                    item.style.display = "none";
                }
            });
        });
    }
});
