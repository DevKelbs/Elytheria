// This file is the main entry point for the client-side code
// It is responsible for setting up the socket connection and handling the UI
// It also contains the code for the login and registration forms

// Import the socket.io-client module and the auth and player modules
import { isAuthenticated, logout } from "./auth.js";
import {
  updateAuthButtons,
  updateUsernameDisplay,
  displaySuccessMessage,
  updateDropdown,
  updateSkillStats,
} from "./ui.js";

const socket = io();

// function show(elementId) {
//   document.getElementById("mainGameContent").style.display = "block";
// }

// function hide(elementId) {
//   document.getElementById("mainGameContent").style.display = "none";
// }

// Check if the user is logged in and update the UI accordingly
// function checkLoginStatus() {
//   const isLoggedIn = isAuthenticated();
//   updateAuthButtons(isLoggedIn);
//   return isLoggedIn;
// }

// When the socket connects to the server (i.e. when the page loads) run the following code
socket.on("connect", async () => {
  console.log("Connected to server");

  updateUsernameDisplay();
  updateDropdown();
  updateSkillStats();

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
  } catch (err) {
    console.error("Error checking existing characters:", err);
  }
});

// When the socket receives the charactersData event, run the following code
socket.on("charactersData", (characters) => {
  console.log("Received characters data:", characters);
});

window.addEventListener("DOMContentLoaded", () => {
  // When the DOM is loaded, run the following code

  // Redirect to the login page if the user is not authenticated

  if (!isAuthenticated()) {
    window.location.href = "/welcome.html"; // Redirect to the login page if the user is not authenticated
  } else {
    document.getElementById("mainGameContent").style.display = "block"; // Show the page content once the DOM is loaded and the user is authenticated (i.e. the page is ready to be displayed)
  }

  // if (!localStorage.getItem('activeCharacter')){
  //   document.getElementById("mainGameContent").style.display = "none";
  //   document.getElementById("characterDisplay").style.display = "block"; 
  // }else{
  //   console.log('no character selected')
  // }

  // checkLoginStatus(); // Check if the user is logged in and update the UI accordingly

  document
    .getElementById("logoutButton") // Get the logout button element from the DOM
    .addEventListener("click", () => {
      // Add a click event listener to the logout button
      logout(); // Log the user out
      displaySuccessMessage("Logout successful!"); // Display a success message
    });
});
