import { updateInventoryDisplay } from "./inventory.js";
import { checkLevelUp, getCurrentSkillLevel } from "./skilling.js";

export function updateLogsDropdown() {
    const activeCharacter =
      JSON.parse(localStorage.getItem("activeCharacter")) || {};
    const inventory = activeCharacter.inventory || {};
    const logsDropdown = document.getElementById("logsDropdown");
  
    // Clear the logs dropdown
    logsDropdown.innerHTML = "";
  
    // Add an empty option to the dropdown
    const emptyOption = document.createElement("option");
    emptyOption.textContent = "Select a log";
    emptyOption.value = "";
    logsDropdown.appendChild(emptyOption);
  
    // Iterate through the inventory items and add log options
    for (const [item, quantity] of Object.entries(inventory)) {
      if (item.endsWith("Log")) {
        const logOption = document.createElement("option");
        logOption.textContent = item; // Display only the log name
        logOption.value = item;
        logsDropdown.appendChild(logOption);
      }
    }
  }

  export function updateSelectedLogQuantity(logName) {
    const activeCharacter = JSON.parse(localStorage.getItem("activeCharacter")) || {};
    const inventory = activeCharacter.inventory || {};
    const selectedLogQuantity = document.getElementById("selectedLogQuantity");
  
    if (logName) {
      const logQuantity = inventory[logName] || 0;
      selectedLogQuantity.textContent = `Quantity: ${logQuantity}`;
  
      if (logQuantity === 0) {
        // Update logs dropdown if the log quantity reaches 0
        updateLogsDropdown();
      }
    } else {
      selectedLogQuantity.textContent = "";
    }
  }
  
// Function to check if the player can burn a specific log
function canBurnLog(logType) {
    const activeCharacter =
      JSON.parse(localStorage.getItem("activeCharacter")) || {};
    const firemakingLevel = activeCharacter.firemaking || 1;
  
    let requiredLevel;
  
    switch (logType) {
      case "NormalTreeLog":
        requiredLevel = 1;
        break;
      case "OakTreeLog":
        requiredLevel = 15;
        break;
      case "WillowTreeLog":
        requiredLevel = 30;
        break;
      case "TeakTreeLog":
        requiredLevel = 35;
        break;
      case "MapleTreeLog":
        requiredLevel = 45;
        break;
      case "MahoganyTreeLog":
        requiredLevel = 50;
        break;
      case "YewTreeLog":
        requiredLevel = 60;
        break;
      case "MagicTreeLog":
        requiredLevel = 75;
        break;
      case "RedwoodTreeLog":
        requiredLevel = 90;
        break;
      default:
        return false;
    }
  
    return firemakingLevel >= requiredLevel;
  }
  

// Firemaking skill
let currentTask = null;

function startFiremaking(logType) {
  if (!canBurnLog(logType)) {
    console.log(`Your level is not high enough to burn ${logType}.`);
    return;
  }

  if (currentTask !== null && currentTask.logType === logType) {
    // A task for the same tree is already running; stop it.
    currentTask.running = false;
    currentTask = null;
    return;
  } else if (currentTask !== null) {
    // A task for a different tree is already running; stop it.
    currentTask.running = false;
    currentTask = null;
  }

  let xpToAdd;
  let timeInSeconds;

  switch (logType) {
    case "NormalTreeLog":
      xpToAdd = 10;
      timeInSeconds = 1.5;
      break;
    case "OakTreeLog":
      xpToAdd = 15;
      timeInSeconds = 2;
      break;
    case "WillowTreeLog":
      xpToAdd = 22;
      timeInSeconds = 2.5;
      break;
    case "TeakTreeLog":
      xpToAdd = 30;
      timeInSeconds = 3;
      break;
    case "MapleTreeLog":
      xpToAdd = 40;
      timeInSeconds = 4;
      break;
    case "MahoganyTreeLog":
      xpToAdd = 60;
      timeInSeconds = 5;
      break;
    case "YewTreeLog":
      xpToAdd = 80;
      timeInSeconds = 6;
      break;
    case "MagicTreeLog":
      xpToAdd = 100;
      timeInSeconds = 9.8;
      break;
    case "RedwoodTreeLog":
      xpToAdd = 180;
      timeInSeconds = 7.5;
      break;
    default:
      xpToAdd = 0;
      timeInSeconds = 0;
  }

  function runTask(resolve, reject) {
    console.log(`Starting to burn ${logType}...`);

    let progressBar = document.getElementById("progressBarFill");
    progressBar.style.width = "0%";

    let timeoutId = setTimeout(() => {
      let activeCharacter =
        JSON.parse(localStorage.getItem("activeCharacter")) || {};

      // Remove the burned log from the inventory
      if (activeCharacter.inventory[logType] > 0) {
        activeCharacter.inventory[logType]--;
        localStorage.setItem(
          "activeCharacter",
          JSON.stringify(activeCharacter)
        );
      } else {
        console.log(`You don't have any ${logType} in your inventory.`);
        return;
      }

      // Add XP to the Firemaking skill
      activeCharacter.firemakingxp =
        (activeCharacter.firemakingxp || 0) + xpToAdd;
      localStorage.setItem("activeCharacter", JSON.stringify(activeCharacter));

      console.log(
        `You gained ${xpToAdd} Firemaking XP from burning the ${logType}.`
      );
      checkLevelUp("firemaking");
      updateInventoryDisplay();
      updateSelectedLogQuantity(logType);
      resolve();
    }, timeInSeconds * 1000);

    // Update progress bar
    let progressInterval = setInterval(() => {
      let currentWidth = parseFloat(progressBar.style.width);
      let increment = 100 / (timeInSeconds * 20); // 20 updates per second
      let newWidth = currentWidth + increment;

      if (newWidth >= 100) {
        clearInterval(progressInterval);
        progressBar.style.width = "100%";
      } else {
        progressBar.style.width = newWidth + "%";
      }
    }, 50); // Update every 50ms

    currentTask = {
      logType: logType,
      running: true,
      cancel: function () {
        clearTimeout(timeoutId);
        clearInterval(progressInterval); // Clear progress interval when canceling
        progressBar.style.width = "0%"; // Reset progress bar width
        reject(new Error("Task canceled"));
      },
    };
  }

  function createTaskPromise() {
    return new Promise((resolve, reject) => {
      runTask(resolve, reject);
    });
  }

  (function loop() {
    if (currentTask && !currentTask.running) {
      return;
    }

    createTaskPromise()
      .then(() => {
        if (
          currentTask !== null &&
          currentTask.logType === logType &&
          currentTask.running
        ) {
          // If the current task is still the same and running, continue looping.
          loop();
        }
      })
      .catch((error) => {
        if (error.message !== "Task canceled") {
          console.error(`Error in task: ${error.message}`);
        }
      });
  })();
}

document.getElementById("logsDropdown").addEventListener("change", (event) => {
    const burnLogButton = document.getElementById("burnLogButton");
    burnLogButton.disabled = event.target.value === "";
  
    updateSelectedLogQuantity(event.target.value);
  });
  
  
  
  document.getElementById("burnLogButton").addEventListener("click", () => {
    const logsDropdown = document.getElementById("logsDropdown");
    const selectedLog = logsDropdown.value;
  
    if (canBurnLog(selectedLog)) {
      startFiremaking(selectedLog);
    } else {
      console.log(`Your level is not high enough to burn ${selectedLog}.`);
    }
  });