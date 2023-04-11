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
        update: update,
    },
};

const game = new Phaser.Game(config);

function preload() {
    // Load your game assets here
    this.load.image(
        "woodcutting_icon",
        "public/assets/icons/skill-icons/icon_woodcutting_elvish.png"
    );
}

function create() {
    // Initialize your game objects here
    this.add.image(400, 300, "woodcutting_icon");
}

function update() {
    // Update your game logic here
}

const socket = io();

// Functions related to authentication
function handleRegistrationModal() {
    const registerModal = document.getElementById("register-form");

    registerModal.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        const username = document.getElementById("register-username").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;

        // Send a fetch request to register the user
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

        const data = await response.json();

        if (data.success) {
            displaySuccessMessage("Registration successful!");
            document.getElementById("registration-modal").style.display = "none";
        } else {
            alert(`Error: ${data.msg}`);
        }
    });
}

function handleLoginModal() {
    const loginModal = document.getElementById("login-form");

    loginModal.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
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
                localStorage.setItem("token", data.token);
                localStorage.setItem("userID", data.user._id);
                localStorage.setItem("username", data.user.username); // Save the username to localStorage
                displaySuccessMessage("Login successful!");
                document.getElementById("login-modal").style.display = "none";
                // You can also add any action to perform after a successful login
                // Redirect to home page after 2 seconds
                setTimeout(() => {
                    window.location.href = "/";
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
    localStorage.removeItem("username"); // Remove the username from localStorage
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
        usernameDisplay.textContent = "Not logged in";
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
        const userId = localStorage.getItem("userID"); // Get the actual user ID from localStorage

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

// Run the functions after the DOM content has loaded
window.addEventListener("DOMContentLoaded", () => {
    handleRegistrationModal();
    handleLoginModal();

    const loginButton = document.getElementById("open-login-modal");
    loginButton.addEventListener("click", handleLoginModal);

    const logoutButton = document.getElementById("logout");
    logoutButton.addEventListener("click", logout);
});
