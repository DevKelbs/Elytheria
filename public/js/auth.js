import { displayErrorMessage, displaySuccessMessage } from "./ui.js";

export async function register(username, email, password, passwordConfirm) {
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
        } else {
            alert(`Error: ${data.msg}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert(error.message);
    }
}

export async function authenticate(username, password) {
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
                window.location.href = "/";
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
        window.location.href = "/";
    }, 1000);
}

export function isAuthenticated() {
    return !!localStorage.getItem("token");
}
