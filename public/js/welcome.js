document.addEventListener("DOMContentLoaded", () => {
    const loginTab = document.getElementById("authenticate-modal");
    const registerTab = document.getElementById("registration-modal");
    const loginForm = document.getElementById("authenticate-form");
    const registerForm = document.getElementById("registration-form");

    loginTab.addEventListener("click", () => { // Change this line
        loginTab.classList.add("active");
        registerTab.classList.remove("active");
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
    });

    registerTab.addEventListener("click", () => { // Change this line
        registerTab.classList.add("active");
        loginTab.classList.remove("active");
        registerForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
    });
});
