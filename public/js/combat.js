import {
  checkLevelUp,
  getCurrentSkillLevel,
  updateSkillInfo,
} from "./skilling.js";

function canFightMonster(monsterType) {
    const activeCharacter = JSON.parse(localStorage.getItem("activeCharacter"));
    const level = activeCharacter[`level`];
  
    switch (monsterType) {
      case "Goblin":
        return level >= 1;
      case "Orc":
        return level >= 15;
      case "Troll":
        return level >= 30;
      default:
        return false;
    }
  }

// function updateMonsterVisibility() {
//     const activeCharacter = JSON.parse(localStorage.getItem("activeCharacter"));
//     const level = activeCharacter[`level`];
//     console.log(level);
  
//     const monsters = [
//       { id: 'Goblin', requiredLevel: 1 },
//       { id: 'Orc', requiredLevel: 15 },
//       { id: 'Troll', requiredLevel: 30 },
//       // Add other trees with their required levels
//     ];
  
//     monsters.forEach(monster => {
//         const elements = document.querySelectorAll(`[data-monster-type="${monster.id}"]`);
//         elements.forEach(element => {
//           if (level >= monster.requiredLevel) {
//             element.style.display = 'flex';
//           } else {
//             element.style.display = 'none';
//           }
//         });
//       });
//     }


// Combat skill

let currentTask = null;
const toast = document.querySelector(".toast");

function startCombat(monsterType) {
  if (!canFightMonster(monsterType)) {
    console.log(`Your level is not high enough to fight ${monsterType}.`);
    return;
  }

  if (currentTask !== null && currentTask.monsterType === monsterType) {
    // A task for the same monster is already running; stop it.
    currentTask.cancel();
    currentTask = null;
    return;
  } else if (currentTask !== null) {
    // A task for a different monster is already running; stop it.
    currentTask.cancel();
    currentTask = null;
  }

  let xpToAdd;
  let timeInSeconds;

  switch (monsterType) {
    // Add your own monsters and their respective xp and time values here
    case "Goblin":
      xpToAdd = 10;
      timeInSeconds = 1.5;
      break;
    case "Orc":
      xpToAdd = 15;
      timeInSeconds = 2;
      break;
    case "Troll":
      xpToAdd = 22;
      timeInSeconds = 2.5;
      break;
    // ...
    default:
      xpToAdd = 0;
      timeInSeconds = 0;
  }

  function runTask(resolve, reject) {
    let progressBarId = monsterType.replace(/\s+/g, "") + "Progress";
    let progressBar = document
      .getElementById(progressBarId)
      .querySelector(".progress-fill");
    progressBar.style.width = "0%";

    console.log(`Starting to fight ${monsterType}...`);

    let timeoutId = setTimeout(() => {
      let activeCharacter =
        JSON.parse(localStorage.getItem("activeCharacter")) || {};
      activeCharacter.combatxp = (activeCharacter.combatxp || 0) + xpToAdd;
      localStorage.setItem("activeCharacter", JSON.stringify(activeCharacter));

      // Add loot to the inventory
      const lootType = (monsterType + " Loot").replace(/\s+/g, "");
      // Display toast notification
      toast.textContent = `+1 ${lootType}!`;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 1000); // Hide toast after 3 seconds

      activeCharacter.inventory[lootType] =
        (activeCharacter.inventory[lootType] || 0) + 1;
      localStorage.setItem("activeCharacter", JSON.stringify(activeCharacter));

      console.log(
        `You gained ${xpToAdd} Combat XP from fighting the ${monsterType}.`
      );
      checkLevelUp("combat");
      updateSkillInfo("combat");
    //   updateMonsterVisibility();
      updateInventoryDisplay();
      resolve();
    }, timeInSeconds * 1000);

    // Update progress bar
    let progressInterval = setInterval(() => {
      let increment = 100 / (timeInSeconds * 20); // 20 updates per second
      progressBar.style.width =
        Math.min(parseFloat(progressBar.style.width) + increment, 100) + "%";
    }, 50); // Update every 50ms

    currentTask = {
      monsterType: monsterType,
      running: true,
      cancel: function () {
        progressBar.style.width = "0%"; // Reset progress bar value
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
          currentTask.monsterType === monsterType &&
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
    const combatLink = document.getElementById("combatContent");
    const activeCharacter = JSON.parse(localStorage.getItem("activeCharacter")) || {};
    const monstersContainer = document.getElementById("combatContainer");
    const fightStyleSelect = document.getElementById('fightStyle');
    const fightButton = document.getElementById('fightButton');
    let selectedMonster = null;
    let fightStyle = null;
    
    // Assuming you have a monsters array somewhere
    const monsters = ["Goblin", "Orc", "Troll"];
    const monsterList = document.getElementById('monsterList');
      
    // Generate the monster list
    monsters.forEach(monster => {
      const li = document.createElement('li');
      li.textContent = monster;
      li.classList.add('monster');
      li.dataset.monsterType = monster;
      monsterList.appendChild(li);
    });
  
    // combatLink.addEventListener("click", (event) => {
    //   event.preventDefault(); // Prevent default link behavior
    //   updateMonsterVisibility(activeCharacter);
    // });
  
    monstersContainer.addEventListener("click", (event) => {
      const monsterElement = event.target.closest(".monster");
  
      if (monsterElement) {
        selectedMonster = monsterElement.dataset.monsterType;
  
        // Highlight selected monster
        document.querySelectorAll('.monster').forEach(el => el.classList.remove('selected'));
        monsterElement.classList.add('selected');
    
        // Enable fight button only when both monster and style are selected
        fightButton.disabled = !selectedMonster || !fightStyle;
      }
    });
  
    fightStyleSelect.addEventListener('change', (event) => {
      fightStyle = event.target.value;
    
      // Enable fight button only when both monster and style are selected
      fightButton.disabled = !selectedMonster || !fightStyle;
    });
  
    fightButton.addEventListener('click', () => {
      if (selectedMonster && fightStyle) {
        console.log(`Fighting ${selectedMonster} with ${fightStyle} style...`);
        startCombat(selectedMonster, fightStyle);
      }
    });
  });
  