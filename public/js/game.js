import { disableUserInterface, enableUserInterface, displayErrorMessage } from './utils.js';

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

const socket = io();

socket.on('connect', () => {
    console.log('Connected to server');
});

// Functions related to authentication
function handleRegistrationModal() {
    const registerModal = document.getElementById('register-form');

    registerModal.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        // Send a fetch request to register the user
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password,
            }),
        });

        const data = await response.json();

        if (data.success) {
            displaySuccessMessage('Registration successful!');
            document.getElementById('registration-modal').style.display = 'none';
        } else {
            alert(`Error: ${data.msg}`);
        }
    });
}

function handleLoginModal() {
    const loginModal = document.getElementById('login-form');

    loginModal.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.user.username); // Save the username to localStorage
                displaySuccessMessage('Login successful!');
                document.getElementById('login-modal').style.display = 'none';
                // You can also add any action to perform after a successful login
                // Redirect to home page after 2 seconds
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } else {
                alert(`Error: ${data.msg}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    });
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username'); // Remove the username from localStorage
    // Redirect to home page after 2 seconds
    setTimeout(() => {
        window.location.href = '/';
    }, 2000);
}

function updateAuthStatus() {
    const authStatus = document.getElementById('auth-status');

    if (localStorage.getItem('token')) {
        authStatus.textContent = 'Logged in';
    } else {
        authStatus.textContent = 'Not logged in';
    }
    updateUsernameDisplay(); // Update the username display
}

function updateUsernameDisplay() {
    const usernameDisplay = document.getElementById('username-display');
    const username = localStorage.getItem('username');

    if (username) {
        usernameDisplay.textContent = `Logged in as: ${username}`;
    } else {
        usernameDisplay.textContent = 'Not logged in';
    }
}

function displaySuccessMessage(message) {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerText = message;

    document.body.appendChild(successMessage);

    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}


// Run the functions after the DOM content has loaded
window.addEventListener('DOMContentLoaded', () => {
    handleRegistrationModal();
    handleLoginModal();

    const loginButton = document.getElementById('open-login-modal');
    loginButton.addEventListener('click', handleLoginModal);

    const logoutButton = document.getElementById('logout');
    logoutButton.addEventListener('click', logout);

    updateAuthStatus();
});