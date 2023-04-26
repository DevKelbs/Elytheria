import { updateSkillStats } from "./ui.js";
import { updateInventoryDisplay } from "./inventory.js";

const Levels = [
  { level: 1, xp: 0 },
  { level: 2, xp: 83 },
  { level: 3, xp: 174 },
  { level: 4, xp: 276 },
  { level: 5, xp: 388 },
  { level: 6, xp: 512 },
  { level: 7, xp: 650 },
  { level: 8, xp: 801 },
  { level: 9, xp: 969 },
  { level: 10, xp: 1154 },
  { level: 11, xp: 1358 },
  { level: 12, xp: 1584 },
  { level: 13, xp: 1833 },
  { level: 14, xp: 2107 },
  { level: 15, xp: 2411 },
  { level: 16, xp: 2746 },
  { level: 17, xp: 3115 },
  { level: 18, xp: 3523 },
  { level: 19, xp: 3973 },
  { level: 20, xp: 4470 },
  { level: 21, xp: 5018 },
  { level: 22, xp: 5624 },
  { level: 23, xp: 6291 },
  { level: 24, xp: 7028 },
  { level: 25, xp: 7842 },
  { level: 26, xp: 8740 },
  { level: 27, xp: 9730 },
  { level: 28, xp: 10824 },
  { level: 29, xp: 12031 },
  { level: 30, xp: 13363 },
  { level: 31, xp: 14833 },
  { level: 32, xp: 16456 },
  { level: 33, xp: 18247 },
  { level: 34, xp: 20224 },
  { level: 35, xp: 22406 },
  { level: 36, xp: 24815 },
  { level: 37, xp: 27473 },
  { level: 38, xp: 30408 },
  { level: 39, xp: 33648 },
  { level: 40, xp: 37224 },
  { level: 41, xp: 41171 },
  { level: 42, xp: 45529 },
  { level: 43, xp: 50339 },
  { level: 44, xp: 55649 },
  { level: 45, xp: 61512 },
  { level: 46, xp: 67983 },
  { level: 47, xp: 75127 },
  { level: 48, xp: 83014 },
  { level: 49, xp: 91721 },
  { level: 50, xp: 101333 },
  { level: 51, xp: 111945 },
  { level: 52, xp: 123660 },
  { level: 53, xp: 136594 },
  { level: 54, xp: 150872 },
  { level: 55, xp: 166636 },
  { level: 56, xp: 184040 },
  { level: 57, xp: 203254 },
  { level: 58, xp: 224466 },
  { level: 59, xp: 247886 },
  { level: 60, xp: 273742 },
  { level: 61, xp: 302288 },
  { level: 62, xp: 333804 },
  { level: 63, xp: 368599 },
  { level: 64, xp: 407015 },
  { level: 65, xp: 449428 },
  { level: 66, xp: 496254 },
  { level: 67, xp: 547953 },
  { level: 68, xp: 605032 },
  { level: 69, xp: 668051 },
  { level: 70, xp: 737627 },
  { level: 71, xp: 814445 },
  { level: 72, xp: 899257 },
  { level: 73, xp: 992895 },
  { level: 74, xp: 1096278 },
  { level: 75, xp: 1210421 },
  { level: 76, xp: 1336443 },
  { level: 77, xp: 1475581 },
  { level: 78, xp: 1629200 },
  { level: 79, xp: 1798808 },
  { level: 80, xp: 1986068 },
  { level: 81, xp: 2192818 },
  { level: 82, xp: 2421087 },
  { level: 83, xp: 2673114 },
  { level: 84, xp: 2951373 },
  { level: 85, xp: 3258594 },
  { level: 86, xp: 3597792 },
  { level: 87, xp: 3972294 },
  { level: 88, xp: 4385776 },
  { level: 89, xp: 4842295 },
  { level: 90, xp: 5346332 },
  { level: 91, xp: 5902831 },
  { level: 92, xp: 6517253 },
  { level: 93, xp: 7195629 },
  { level: 94, xp: 7944614 },
  { level: 95, xp: 8771558 },
  { level: 96, xp: 9684577 },
  { level: 97, xp: 10692629 },
  { level: 98, xp: 11805606 },
  { level: 99, xp: 13034431 },
];

function checkLevelUp(skill) {
  console.log("checking for level up...");
  const activeCharacter = JSON.parse(localStorage.getItem("activeCharacter"));
  const currentXP = activeCharacter[`${skill}xp`] || 0;
  let currentLevel = 1;
  for (let i = 0; i < Levels.length; i++) {
    if (currentXP >= Levels[i].xp) {
      currentLevel = Levels[i].level;
    } else {
      break;
    }
  }
  if (currentLevel > activeCharacter[`${skill}`]) {
    activeCharacter[`${skill}`] = currentLevel;
    console.log(`Congratulations! You have leveled up to ${currentLevel} ${skill}.`);
  }
  localStorage.setItem("activeCharacter", JSON.stringify(activeCharacter));
  updateSkillStats();
}

function getCurrentSkillLevel(skill) {
  const activeCharacter = JSON.parse(localStorage.getItem("activeCharacter"));
  const currentXP = activeCharacter[`${skill}xp`] || 0;
  let currentLevel = 1;
  for (let i = 0; i < Levels.length; i++) {
    if (currentXP >= Levels[i].xp) {
      currentLevel = Levels[i].level;
    } else {
      break;
    }
  }
  return currentLevel;
}

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
      element.style.display = 'inline';
    } else {
      element.style.display = 'none';
    }
  });
}

//Woodcutting skill
let currentTask = null;

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
    console.log(`Starting to cut ${treeType}...`);

    let progressBar = document.getElementById("progressBarFill");
    progressBar.style.width = "0%";

    let timeoutId = setTimeout(() => {
      let activeCharacter = JSON.parse(localStorage.getItem("activeCharacter")) || {};
      activeCharacter.woodcuttingxp = (activeCharacter.woodcuttingxp || 0) + xpToAdd;
      localStorage.setItem("activeCharacter", JSON.stringify(activeCharacter));

      // Add logs to the inventory
      const logType = (treeType + " Log").replace(/\s+/g, '');
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
      treeType: treeType,
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