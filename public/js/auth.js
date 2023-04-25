import { displayErrorMessage, displaySuccessMessage } from "./ui.js";
import { forceSave } from "./characterUpdate.js";


function isValidEmail(email) {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return emailRegex.test(email);
}

function validateUserInput(username, email, password, passwordConfirm) {
  const errors = [];

  if (!username || username.trim().length === 0) {
    errors.push("Username is required");
  }

  if (!email || !isValidEmail(email)) {
    errors.push("A valid email address is required");
  }

  if (!password || password.trim().length === 0) {
    errors.push("Password is required");
  }

  if (password !== passwordConfirm) {
    errors.push("Passwords do not match");
  }

  return errors;
}

export async function register(username, email, password, passwordConfirm) {
  console.log("Registering user...");
  const errors = validateUserInput(username, email, password, passwordConfirm);

  if (errors.length > 0) {
    alert(errors.join("\n"));
    return;
  }

  try {
    const verificationtoken = generateVerificationToken();
    console.log(verificationtoken);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        verificationtoken,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.success) {
        displaySuccessMessage("Please validate your email address!");
        // Log the user in after successful registration
        await sendVerificationEmail(email, verificationtoken);
        // setTimeout(() => {
        //   window.location.href = '/index.html';
        // }, 1000);
      } else {
        alert(`Error: ${data.msg}`);
      }
    } else {
      switch (response.status) {
        case 400:
          alert("Error: Bad Request. Invalid input provided.");
          break;
        case 500:
          alert("Error: Internal Server Error. Please try again later.");
          break;
        default:
          alert(`Error ${response.status}: ${response.statusText}`);
      }
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error: Network error. Please check your internet connection and try again.");
  }
}

//send verification email
async function sendVerificationEmail(email, verificationtoken) {
  const url = '/api/auth/send-verification-email';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, verificationtoken }),
  };
  const response = await fetch(url, options);
  const message = await response.text();
  console.log(message);
}


//Generates verification token to the user
function generateVerificationToken() {
  const tokenLength = 32;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let verificationtoken = '';

  for (let i = 0; i < tokenLength; i++) {
    verificationtoken += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return verificationtoken;
}

export async function authenticate(username, password, redirectTo = "/index.html") {
  console.log("Authenticating user...");
  if (!username || username.trim().length === 0) {
    alert("Username is required");
    return;
  }

  if (!password || password.trim().length === 0) {
    alert("Password is required");
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
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("userId", data.user.id);
      displaySuccessMessage("Login successful!");
      //checks if activeCharacter is available in localstorage before parsing it
      const activeCharacter = localStorage.getItem("activeCharacter") ? JSON.parse(localStorage.getItem("activeCharacter")) : null;
      //console.log("Active character:", activeCharacter);

      setTimeout(() => {
        window.location.href = redirectTo;
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
  forceSave('Your character has been saved to the cloud')
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("userId");
  localStorage.removeItem("user");

  setTimeout(() => {
    window.location.href = "/welcome.html";
  }, 1000);
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}
if (window.location.pathname === "/welcome.html") {
  window.addEventListener("DOMContentLoaded", () => {
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

        // Reload the page after successful registration
        setTimeout(() => {
          location.reload();
        }, 3000);
      });

    document
      .getElementById("authenticate-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("authenticate-username").value;
        const password = document.getElementById("authenticate-password").value;

        await authenticate(username, password);
      });
  });
}
