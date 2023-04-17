import {
    authenticate,
    register,
    isAuthenticated,
    logout,
} from "./auth.js";
import { player } from "./player.js";
import {
    updateAuthButtons,
    updateUsernameDisplay,
    setupCharacterInfoToggle,
    displaySuccessMessage,
} from "./ui.js";

const socket = io();

function checkLoginStatus() {
    const isLoggedIn = isAuthenticated();
    updateAuthButtons(isLoggedIn);
    return isLoggedIn;
}

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

socket.on("charactersData", (characters) => {
    console.log("Received characters data:", characters);
});

window.addEventListener("DOMContentLoaded", () => {
    setupCharacterInfoToggle();
    checkLoginStatus();

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
