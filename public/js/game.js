import {
    disableUserInterface,
    enableUserInterface,
    displayErrorMessage,
} from "./utils.js";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent background
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

const game = new Phaser.Game(config);

function preload() {
    // Load your game assets here
}

function create() {
    // Initialize your game objects here
}

function update() {
    // Update your game logic here
}

function updateAuthButtons(isAuthenticated) {
    const loginButton = document.getElementById("open-authenticate-modal");
    const logoutButton = document.getElementById("logout");
    const createCharacter = document.getElementById("create-character");

    if (isAuthenticated) {
        loginButton.classList.add("hidden");
        logoutButton.classList.remove("hidden");
        createCharacter.classList.remove("hidden");
    } else {
        loginButton.classList.remove("hidden");
        logoutButton.classList.add("hidden");
        createCharacter.classList.add("hidden");
    }
}

function checkLoginStatus() {
    const token = localStorage.getItem("token");
    const isAuthenticated = !!token;
    updateAuthButtons(isAuthenticated);
}

const socket = io();

// Functions related to authentication
function handleRegistrationModal() {
    const registrationModal = document.getElementById("registration-form");

    registrationModal.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("registration-username").value;
        const email = document.getElementById("registration-email").value;
        const password = document.getElementById("registration-password").value;
        const passwordConfirm = document.getElementById(
            "registration-password-confirm"
        ).value;

        if (password !== passwordConfirm) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error(
                    `HTTP error ${response.status}: ${response.statusText}`
                );
            }

            const data = await response.json();

            if (data.success) {
                displaySuccessMessage("Registration successful!");
                document.getElementById("registration-modal").style.display =
                    "none";
                updateUsernameDisplay();
            } else {
                alert(`Error: ${data.msg}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        }
    });
}

function handleAuthenticateModal() {
    const authenticateModal = document.getElementById("authenticate-form");

    authenticateModal.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("authenticate-username").value;
        const password = document.getElementById("authenticate-password").value;

        try {
            const response = await fetch("/api/auth/authenticate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error(
                    `HTTP error ${response.status}: ${response.statusText}`
                );
            }

            const data = await response.json();

            if (data.success) {
                // Save the token and username to localStorage
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.user.username);
                localStorage.setItem("userId", data.user.id);
                displaySuccessMessage("Login successful!");
                document.getElementById("authenticate-modal").style.display =
                    "none";
                setTimeout(() => {
                    window.location.href = "/";
                    updateUsernameDisplay();
                }, 1000);
            } else {
                alert(`Error: ${data.msg}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        }
    });
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");// Remove the username from localStorage
    localStorage.removeItem("userId"); // Remove the user ID from localStorage

    // Redirect to home page after 2 seconds
    setTimeout(() => {
        window.location.href = "/";
    }, 1000);
}

function updateUsernameDisplay() {
    const usernameDisplay = document.getElementById("username-display");
    const username = localStorage.getItem("username");

    if (username) {
        usernameDisplay.textContent = `Logged in as: ${username}`;
    } else {
        usernameDisplay.textContent = "";
    }
}

function displaySuccessMessage(message) {
    const successMessage = document.createElement("div");
    successMessage.className = "success-message";
    successMessage.innerText = message;

    document.body.appendChild(successMessage);

    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}

function showCharacterCreationUI() {
    // Hide the main game container or any other elements currently displayed
    document.getElementById("gameContainer").style.display = "none";

    // Create an iframe to load the character creation page
    const iframe = document.createElement("iframe");
    iframe.src = "character_creation.html";
    iframe.id = "characterCreationIframe";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";

    // Add the iframe to the DOM
    document.body.appendChild(iframe);
}

socket.on("connect", async () => {
    console.log("Connected to server");

    updateUsernameDisplay();

    try {
        const userId = localStorage.getItem("userId"); // Get the actual user ID from localStorage

        if (!userId) {
            console.log("User not logged in");
            return;
        }

        const response = await fetch(`/api/characters/${userId}`);
        const data = await response.json();
        const characters = data.characters;

        if (characters.length === 0) {
            // If the user has no characters, show the character creation UI
            showCharacterCreationUI();
        } else {
            // If the user has existing characters, initialize the game
            // Example: loadCharacter(characters[0]);
        }
    } catch (err) {
        console.error("Error checking existing characters:", err);
    }
});

socket.on("charactersData", (characters) => {
    console.log("Received characters data:", characters);
});

// Run the functions after the DOM content has loaded
window.addEventListener("DOMContentLoaded", () => {
    handleRegistrationModal();
    handleAuthenticateModal();
    checkLoginStatus(); // Add this line to check the login status when the page loads

    const loginButton = document.getElementById("open-authenticate-modal");
    loginButton.addEventListener("click", handleAuthenticateModal);

    const logoutButton = document.getElementById("logout");
    logoutButton.addEventListener("click", logout);
});
