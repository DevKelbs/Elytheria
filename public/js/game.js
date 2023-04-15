import {
    disableUserInterface,
    enableUserInterface,
    displayErrorMessage,
} from "./utils.js";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const player = {
    level: 1,
    experience: 0,
    nextLevelExp: 100,
    experienceRate: 10,
    levelUp: function () {
        this.level++;
        this.experience -= this.nextLevelExp;
        this.nextLevelExp *= 1.25;
    },
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/images/backgrounds/ground_tile_2.png');
    this.load.image('player', 'assets/characters/hero.png');
    this.load.image('enemy', 'assets/characters/monster.png');
}

function create() {
    this.levelUpButton = this.add.text(10, 50, 'Level Up', { font: '16px Arial', fill: '#ffffff' });
    this.levelUpButton.setInteractive();
    this.levelUpButton.on('pointerdown', () => {
        player.level++;
        this.levelText.setText(`Level: ${player.level}`);
    });

    // Create a save button using text
    this.saveButton = this.add.text(10, 100, 'Save', { font: '16px Arial', fill: '#ffffff' });

    // Make the text interactive
    this.saveButton.setInteractive();

    // Attach the saveGame function to the 'pointerdown' event
    this.saveButton.on('pointerdown', () => {
        saveGame();
    });
}

function update(time, delta) {
    player.experience += player.experienceRate * delta / 1000;
    if (player.experience >= player.nextLevelExp) {
        player.levelUp();
        this.levelText.setText(`Level: ${player.level}`);
    }
}

function updateAuthButtons(isAuthenticated) {
    const loginButton = document.getElementById("login-link");
    const logoutButton = document.getElementById("logout-link");
    const createCharacter = document.getElementById("create-character-link");
    const registerButton = document.getElementById("register-link");

    if (isAuthenticated) {
        loginButton.classList.add("hidden");
        logoutButton.classList.remove("hidden");
        createCharacter.classList.remove("hidden");
        registerButton.classList.add("hidden");
    } else {
        loginButton.classList.remove("hidden");
        logoutButton.classList.add("hidden");
        createCharacter.classList.add("hidden");
        registerButton.classList.remove("hidden");
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
        usernameDisplay.textContent = `${username}`
        usernameDisplay.style.color = "#d4af37";
        usernameDisplay.style.fontSize = "20px";
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
