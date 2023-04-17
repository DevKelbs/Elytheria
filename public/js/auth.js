import { displayErrorMessage, displaySuccessMessage } from "./ui.js";

function isValidEmail(email) {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegex.test(email);
}

function validateUserInput(username, email, password, passwordConfirm) {
    const errors = [];

    if (!username || username.trim().length === 0) {
        errors.push('Username is required');
    }

    if (!email || !isValidEmail(email)) {
        errors.push('A valid email address is required');
    }

    if (!password || password.trim().length === 0) {
        errors.push('Password is required');
    }

    if (password !== passwordConfirm) {
        errors.push('Passwords do not match');
    }

    return errors;
}

export async function register(username, email, password, passwordConfirm) {
    const errors = validateUserInput(username, email, password, passwordConfirm);

    if (errors.length > 0) {
        alert(errors.join('\n'));
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
        } else {
            alert(`Error: ${data.msg}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert(error.message);
    }
}

export async function authenticate(username, password) {
    if (!username || username.trim().length === 0) {
        alert('Username is required');
        return;
    }

    if (!password || password.trim().length === 0) {
        alert('Password is required');
        return;
    }

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
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.user.username);
            localStorage.setItem("userId", data.user.id);
            displaySuccessMessage("Login successful!");
            setTimeout(() => {
                window.location.href = "/index.html";
            }, 1000);
        } else {
            alert(`Error: ${data.msg}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert(error.message);
    }
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");

    setTimeout(() => {
        window.location.href = "/welcome.html";
    }, 1000);
}

export function isAuthenticated() {
    return !!localStorage.getItem("token");
}
