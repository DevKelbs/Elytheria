//
export function disableUserInterface() {
  // Function body
}

export function enableUserInterface() {
  // Function body
}

export function displayErrorMessage(message) {
  // Function body
}

export function displaySuccessMessage(message) {
  const successMessage = document.createElement("div");
  successMessage.className = "success-message";
  successMessage.innerText = message;

  document.body.appendChild(successMessage);

  setTimeout(() => {
    successMessage.remove();
  }, 5000);
}

export function updateAuthButtons(isAuthenticated) {
  const createCharacter = document.getElementById("create-character-link");

  if (isAuthenticated) {
    createCharacter.classList.remove("hidden");
  } else {
    createCharacter.classList.add("hidden");
  }
}

export function updateUsernameDisplay() {
  const usernameDisplay = document.getElementById("username-display");
  const activeCharacter = JSON.parse(localStorage.getItem("activeCharacter"));

  if (activeCharacter) {
    usernameDisplay.textContent = activeCharacter.name;
  } else {
    usernameDisplay.textContent = "";
  }
}
export function updateDropdown() {
  const activeUsername = document.getElementById("activeUsername");
  const username = localStorage.getItem("username");

  if (username) {
    activeUsername.textContent = username;
  } else {
    activeUsername.textContent = "";
  }
}

// Check if the activeCharacter exists in local storage
export function updateSkillStats() {
  if (localStorage.getItem("activeCharacter")) {
    const characterStats = JSON.parse(localStorage.getItem("activeCharacter"));
    const navMainItems = document.querySelectorAll(".nav-main-item");
    navMainItems.forEach((navMainItem) => {
      const skillName = navMainItem.querySelector(".nav-main-link-name").textContent.toLowerCase();
      const skillStatSpan = navMainItem.querySelector(".nav-main-link small span");
      if (characterStats.hasOwnProperty(skillName)) {
        skillStatSpan.textContent = `${characterStats[skillName]}`;
      }
    });
  } else {
    console.error("No active character found in local storage.");
  }
}


//set character level dynamically
// Check if the current page is index.html
if (window.location.pathname === '/index.html') {
  // Get the active character from local storage
  const activeCharacter = JSON.parse(localStorage.getItem('activeCharacter'));

  // Update the character level element with the active character's level
  const characterLevel = document.querySelector('.character-level');
  if (activeCharacter) {
    characterLevel.textContent = `Level:${activeCharacter.level}`;
  }
}

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function showHeaderDropDown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function makeElementMoveable(element) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  element.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    let elementId = element.getAttribute("data-element-id");
    let userId = localStorage.getItem("userId"); // Retrieve current user's ID from local storage or your authentication system
    savePositionToDatabase(elementId, userId, element.offsetLeft, element.offsetTop);
  }  
}

//Save UI Positions

function savePositionToDatabase(elementId, userId, x, y) {
  const token = localStorage.getItem("token");
  fetch('/api/user/save_ui', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({elementId: elementId, position: {x: x, y: y}}),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Position saved');
    } else {
      console.error('Error saving position:', data.error);
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

//load UI Positions
export function loadUIPositions() {
  console.log('Placing UI...')
  const token = localStorage.getItem("token");
  fetch('/api/user/ui_positions', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const positions = data.element_positions;

      // Loop through the positions object and set the position for each element
      for (const elementId in positions) {
        const element = document.querySelector(`[data-element-id="${elementId}"]`);

        if (element) {
          const position = positions[elementId];
          element.style.top = position.y + "px";
          element.style.left = position.x + "px";
        }
      }
    } else {
      console.error('Error getting positions:', data.error);
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleEye = document.querySelector(".far.fa-eye.text-muted.ml-2.eye1");
  const navMainItemsCombat = document.querySelectorAll(".combat");
  const toggleEye2 = document.querySelector(".far.fa-eye.text-muted.ml-2.eye2");
  const navMainItemsNonCombat = document.querySelectorAll(".non-combat");
  const headerDropDown = document.getElementById("myDropdown");
  const headerDropDownButton = document.getElementById("activeUsername");

  const skillsNavElement = document.querySelector(".skillsNav");
  makeElementMoveable(skillsNavElement);

  if (headerDropDownButton) {
    headerDropDownButton.addEventListener("click", () => {
      headerDropDown.classList.toggle("show");
    });
  }

  if (toggleEye) {
    toggleEye.addEventListener("click", () => {
      toggleEye.classList.toggle("fa-eye-slash");
      toggleEye.classList.toggle("fa-eye");
      toggleEye.classList.toggle("text-muted");

      navMainItemsCombat.forEach((item) => {
        if (item.style.display === "none") {
          item.style.display = "list-item";
        } else {
          item.style.display = "none";
        }
      });
    });
  }
  if (toggleEye2) {
    toggleEye2.addEventListener("click", () => {
      toggleEye2.classList.toggle("fa-eye-slash");
      toggleEye2.classList.toggle("fa-eye");
      toggleEye2.classList.toggle("text-muted");

      navMainItemsNonCombat.forEach((item) => {
        if (item.style.display === "none") {
          item.style.display = "list-item";
        } else {
          item.style.display = "none";
        }
      });
    });
  }
  // New script to handle navigation
  const navItems = document.querySelectorAll("li a");
  const tabContents = document.querySelectorAll(".tab-content");

  navItems.forEach((navItem) => {
    navItem.addEventListener("click", (event) => {
      event.preventDefault();

      navItems.forEach((item) => item.classList.remove("active"));
      navItem.classList.add("active");

      const target = navItem.getAttribute("href");
      tabContents.forEach((content) => {
        if (content.id === target.substr(1)) {
          content.style.display = "block";
        } else {
          content.style.display = "none";
        }
      });

      const targetElement = document.querySelector(target);
      targetElement.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Set the first navigation item as active and its content visible
  if (navItems.length > 0 && tabContents.length > 0) {
    navItems[0].classList.add("active");
    tabContents[0].style.display = "block";
  }
});