import { updateInventoryDisplay } from "./inventory.js";
import { checkLevelUp, getCurrentSkillLevel } from "./skilling.js";

function canCutTree(treeType) {
  const level = getCurrentSkillLevel("woodcutting");

  switch (treeType) {
    case "Normal Tree":
      return level >= 1;
    case "Oak Tree":
      return level >= 15;
    case "Willow Tree":
      return level >= 30;
    case "Teak Tree":
      return level >= 35;
    case "Maple Tree":
      return level >= 45;
    case "Mahogany Tree":
      return level >= 50;
    case "Yew Tree":
      return level >= 60;
    case "Magic Tree":
      return level >= 75;
    case "Redwood Tree":
      return level >= 90;
    default:
      return false;
  }
}

function updateTreeVisibility() {
  const level = getCurrentSkillLevel("woodcutting");

  const trees = [
    { id: 'normalTree', requiredLevel: 1 },
    { id: 'oakTree', requiredLevel: 15 },
    { id: 'willowTree', requiredLevel: 30 },
    { id: 'teakTree', requiredLevel: 35 },
    { id: 'mapleTree', requiredLevel: 45 },
    { id: 'mahoganyTree', requiredLevel: 50 },
    { id: 'yewTree', requiredLevel: 60 },
    { id: 'magicTree', requiredLevel: 75 },
    { id: 'redwoodTree', requiredLevel: 90 },
    // Add other trees with their required levels
  ];

  trees.forEach(tree => {
    const element = document.getElementById(tree.id);
    if (level >= tree.requiredLevel) {
      element.style.display = 'flex';
    } else {
      element.style.display = 'none';
    }
  });
}

//Woodcutting skill
let currentTask = null;
const toast = document.querySelector('.toast');

function startWoodcutting(treeType) {

  if (!canCutTree(treeType)) {
    console.log(`Your level is not high enough to cut ${treeType}.`);
    return;
  }

  if (currentTask !== null && currentTask.treeType === treeType) {
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

  switch (treeType) {
    case "Normal Tree":
      xpToAdd = 10;
      timeInSeconds = 1.5;
      break;
    case "Oak Tree":
      xpToAdd = 15;
      timeInSeconds = 2;
      break;
    case "Willow Tree":
      xpToAdd = 22;
      timeInSeconds = 2.5;
      break;
    case "Teak Tree":
      xpToAdd = 30;
      timeInSeconds = 3;
      break;
    case "Maple Tree":
      xpToAdd = 40;
      timeInSeconds = 4;
      break;
    case "Mahogany Tree":
      xpToAdd = 60;
      timeInSeconds = 5;
      break;
    case "Yew Tree":
      xpToAdd = 80;
      timeInSeconds = 6;
      break;
    case "Magic Tree":
      xpToAdd = 100;
      timeInSeconds = 9.8;
      break;
    case "Redwood Tree":
      xpToAdd = 180;
      timeInSeconds = 7.5;
      break;
    default:
      xpToAdd = 0;
      timeInSeconds = 0;
  }

  function runTask(resolve, reject) {
    let progressBarId = treeType.replace(/\s+/g, '') + "Progress";
    let progressBar = document.getElementById(progressBarId).querySelector(".progress-fill");
    progressBar.style.width = '0%';

    console.log(`Starting to cut ${treeType}...`);

    let timeoutId = setTimeout(() => {
      let activeCharacter = JSON.parse(localStorage.getItem("activeCharacter")) || {};
      activeCharacter.woodcuttingxp = (activeCharacter.woodcuttingxp || 0) + xpToAdd;
      localStorage.setItem("activeCharacter", JSON.stringify(activeCharacter));

      // Add logs to the inventory
      const logType = (treeType + " Log").replace(/\s+/g, '');
      // Display toast notification
      toast.textContent = `+1 ${logType}!`;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 1000); // Hide toast after 3 seconds

      activeCharacter.inventory[logType] = (activeCharacter.inventory[logType] || 0) + 1;
      localStorage.setItem("activeCharacter", JSON.stringify(activeCharacter));

      console.log(`You gained ${xpToAdd} Woodcutting XP from cutting the ${treeType}.`);
      checkLevelUp("woodcutting");
      updateTreeVisibility();
      updateInventoryDisplay();
      resolve();
    }, timeInSeconds * 1000);

    // Update progress bar
    let progressInterval = setInterval(() => {
      let increment = 100 / (timeInSeconds * 20); // 20 updates per second
      progressBar.style.width = Math.min(parseFloat(progressBar.style.width) + increment, 100) + "%";
    }, 50); // Update every 50ms

    currentTask = {
      treeType: treeType,
      running: true,
      cancel: function () {
        clearTimeout(timeoutId);
        clearInterval(progressInterval); // Clear progress interval when canceling
        progressBar.value = 0; // Reset progress bar value
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
          currentTask.treeType === treeType &&
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
  const woodcuttingLink = document.getElementById("woodcuttingContent");
  const activeCharacter = JSON.parse(localStorage.getItem("activeCharacter")) || {};
  const treesContainer = document.getElementById('woodcuttingContainer'); // Replace with the actual ID or selector for the parent element


  woodcuttingLink.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default link behavior
    updateTreeVisibility(activeCharacter);
  });

  treesContainer.addEventListener('click', (event) => {
    const treeElement = event.target.closest('.tree');

    if (treeElement) {
      const treeType = treeElement.dataset.treeType;
      startWoodcutting(treeType);
    }
  });
});