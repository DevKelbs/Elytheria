// This file is the main entry point for the client-side code
// It is responsible for setting up the socket connection and handling the UI
// It also contains the code for the login and registration forms

// Import the socket.io-client module and the auth and player modules
import {
    authenticate,
    register,
    isAuthenticated,
    logout,
} from "./auth.js";
import {
    updateAuthButtons,
    updateUsernameDisplay,
    setupCharacterInfoToggle,
    displaySuccessMessage,
} from "./ui.js";

const socket = io();


// Check if the user is logged in and update the UI accordingly
function checkLoginStatus() {
    const isLoggedIn = isAuthenticated();
    updateAuthButtons(isLoggedIn);
    return isLoggedIn;
}


// When the socket connects to the server (i.e. when the page loads) run the following code
socket.on("connect", async () => {
    console.log("Connected to server");

    updateUsernameDisplay();

    try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            console.log("User not logged in");
            return;
        }

        const response = await fetch(`/api/characters/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const characters = data.characters;
        console.log(characters);
    } catch (err) {
        console.error("Error checking existing characters:", err);
    }
});


// When the socket receives the charactersData event, run the following code
socket.on("charactersData", (characters) => {
    console.log("Received characters data:", characters);
});

window.addEventListener("DOMContentLoaded", () => { // When the DOM is loaded, run the following code 

    // Redirect to the login page if the user is not authenticated
    //if (!isAuthenticated()) {
    //    window.location.href = "/welcome.html";
    //}
    setupCharacterInfoToggle(); // Set up the character info toggle button
    checkLoginStatus(); // Check if the user is logged in and update the UI accordingly

    document
        .getElementById("registration-form")
        .addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("registration-username").value;
            const email = document.getElementById("registration-email").value;
            const password = document.getElementById("registration-password").value;
            const passwordConfirm = document.getElementById(
                "registration-password-confirm"
            ).value;

            await register(username, email, password, passwordConfirm);
        });

    document
        .getElementById("authenticate-form")
        .addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("authenticate-username").value;
            const password = document.getElementById("authenticate-password").value;

            await authenticate(username, password);
        });

    document
        .getElementById("logout")
        .addEventListener("click", () => {
            logout();
            displaySuccessMessage("Logout successful!");
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        });
});
