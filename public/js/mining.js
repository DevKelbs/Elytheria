import { updateInventoryDisplay } from "./inventory.js";
import { checkLevelUp, getCurrentSkillLevel, updateSkillInfo } from "./skilling.js";

// Function to check if the player can burn a specific log
function canMine(oreType) {
  const activeCharacter = JSON.parse(localStorage.getItem("activeCharacter")) || {};
  const miningLevel = activeCharacter.mining || 1;

  let requiredLevel;

  switch (oreType) {
    case "Clay Ore":
      requiredLevel = 1;
      break;
    case "Copper Ore":
      requiredLevel = 1;
      break;
    case "Tin Ore":
      requiredLevel = 1;
      break;
    case "Iron Ore":
      requiredLevel = 15;
      break;
    case "Silver Ore":
      requiredLevel = 20;
      break;
    case "Coal Ore":
      requiredLevel = 30;
      break;
    case "Gold Ore":
      requiredLevel = 40;
      break;
    case "Mithril Ore":
      requiredLevel = 55;
      break;
    case "Adamantite Ore":
      requiredLevel = 70;
      break;
    case "Runite Ore":
      requiredLevel = 85;
      break;
    default:
      return false;
  }

  return miningLevel >= requiredLevel;
}

function updateOreVisibility() {
    const level = getCurrentSkillLevel("mining");
  
    const ores = [
      { id: 'clayOre', requiredLevel: 1 },
      { id: 'copperOre', requiredLevel: 1 },
      { id: 'tinOre', requiredLevel: 1 },
      { id: 'ironOre', requiredLevel: 15 },
      { id: 'silverOre', requiredLevel: 20 },
      { id: 'coalOre', requiredLevel: 30 },
      { id: 'goldOre', requiredLevel: 40 },
      { id: 'mithrilOre', requiredLevel: 55 },
      { id: 'adamantiteOre', requiredLevel: 70 },
      { id: 'runiteOre', requiredLevel: 85 },
      // Add other trees with their required levels
    ];
  
    ores.forEach(ore => {
      const element = document.getElementById(ore.id);
      if (level >= ore.requiredLevel) {
        element.style.display = 'flex';
      } else {
        element.style.display = 'none';
      }
    });
  }
  

// Firemaking skill
let currentTask = null;
const toast = document.querySelector(".toast");

function startMining(oreType) {
  if (!canMine(oreType)) {
    console.log(`Your level is not high enough to mine ${oreType}.`);
    return;
  }

  if (currentTask !== null && currentTask.oreType === oreType) {
    // A task for the same tree is already running; stop it.
    currentTask.cancel();
    currentTask = null;
    return;
  } else if (currentTask !== null) {
    // A task for a different tree is already running; stop it.
    currentTask.cancel();
    currentTask = null;
  }

  let xpToAdd;
  let timeInSeconds;

  switch (oreType) {
    case "Clay Ore":
      xpToAdd = 10;
      timeInSeconds = 1.5;
      break;
    case "Copper Ore":
      xpToAdd = 15;
      timeInSeconds = 2;
      break;
    case "Tin Ore":
      xpToAdd = 22;
      timeInSeconds = 2.5;
      break;
    case "Iron Ore":
      xpToAdd = 30;
      timeInSeconds = 3;
      break;
    case "Silver Ore":
      xpToAdd = 40;
      timeInSeconds = 4;
      break;
    case "Coal Ore":
      xpToAdd = 60;
      timeInSeconds = 5;
      break;
    case "Gold Ore":
      xpToAdd = 80;
      timeInSeconds = 6;
      break;
    case "Mithril Ore":
      xpToAdd = 100;
      timeInSeconds = 9.8;
      break;
    case "Adamantite Ore":
      xpToAdd = 180;
      timeInSeconds = 7.5;
      break;
    case "Runite Ore":
      xpToAdd = 180;
      timeInSeconds = 7.5;
      break;
    default:
      xpToAdd = 0;
      timeInSeconds = 0;
  }

  function runTask(resolve, reject) {
    let progressBarId = oreType.replace(/\s+/g, '') + "Progress";
    let progressBar = document.getElementById(progressBarId).querySelector(".progress-fill");
    progressBar.style.width = '0%';

    console.log(`Starting to cut ${oreType}...`);

    let timeoutId = setTimeout(() => {
      let activeCharacter = JSON.parse(localStorage.getItem("activeCharacter")) || {};
      activeCharacter.miningxp = (activeCharacter.miningxp || 0) + xpToAdd;
      localStorage.setItem("activeCharacter", JSON.stringify(activeCharacter));

      // Add logs to the inventory
      const ore = (oreType).replace(/\s+/g, '');
      // Display toast notification
      toast.textContent = `+1 ${ore}!`;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 1000); // Hide toast after 3 seconds

      activeCharacter.inventory[ore] = (activeCharacter.inventory[ore] || 0) + 1;
      localStorage.setItem("activeCharacter", JSON.stringify(activeCharacter));

      console.log(`You gained ${xpToAdd} Mining XP from mining the ${ore}.`);
      checkLevelUp("mining");
      updateSkillInfo("mining");
      updateOreVisibility();
      updateInventoryDisplay();
      resolve();
    }, timeInSeconds * 1000);

    // Update progress bar
    let progressInterval = setInterval(() => {
      let increment = 100 / (timeInSeconds * 20); // 20 updates per second
      progressBar.style.width = Math.min(parseFloat(progressBar.style.width) + increment, 100) + "%";
    }, 50); // Update every 50ms

    currentTask = {
        oreType: oreType,
      running: true,
      cancel: function () {
        console.log('Task cancelled...')
        progressBar.style.width = '0%'; // Reset progress bar value
        clearTimeout(timeoutId);
        clearInterval(progressInterval); // Clear progress interval when canceling
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
          currentTask.oreType === oreType &&
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


document.addEventListener("DOMContentLoaded", () => {
  const miningLink = document.getElementById("miningContent");
  const activeCharacter = JSON.parse(localStorage.getItem("activeCharacter")) || {};
  const treesContainer = document.getElementById("miningContainer"); // Replace with the actual ID or selector for the parent element

  miningLink.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default link behavior
    updateOreVisibility(activeCharacter);
  });

  treesContainer.addEventListener("click", (event) => {
    const oreElement = event.target.closest(".ore");

    if (oreElement) {
      const oreType = oreElement.dataset.oreType;
      console.log(oreType);
      startMining(oreType);
    }
  });
});
