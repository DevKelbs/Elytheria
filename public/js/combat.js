import {
  checkLevelUp,
  calculateCombatLevel,
  getCurrentSkillLevel,
  updateSkillInfo,
} from "./skilling.js";
import { monsters } from "./data/monsters.js";
import { updateInventoryDisplay } from "./inventory.js";

function canFightMonster(monsterType) {
  const activeCharacter = JSON.parse(localStorage.getItem("activeCharacter"));
  const level = activeCharacter.level;

  const monster = monsters.find(m => m.name === monsterType);

  if (!monster) {
    return false;
  }

  return level >= monster.requiredLevel;
}

function updateMonsterVisibility() {
  const activeCharacter = JSON.parse(localStorage.getItem("activeCharacter"));
  const level = activeCharacter["level"];

  // Use monsterTypes instead of the hardcoded monsters array
  monsters.forEach((monster) => {
    const elements = document.querySelectorAll(
      `[data-monster-type="${monster.name}"]`
    );
    elements.forEach((element) => {
      if (level >= monster.requiredLevel) {
        element.style.display = "flex";
      } else {
        element.style.display = "none";
      }
    });
  });
}


function getSkillFromFightStyle(fightStyle) {
  const skillMap = {
    power: "strength",
    offensive: "attack",
    defensive: "defence",
    magic: "magic",
    ranged: "ranged",
  };

  return skillMap[fightStyle];
}

// Combat skill

let currentTask = null;
const toast = document.querySelector(".toast");

function startCombat(monsterType, fightStyle) {
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

  const monster = monsters.find(m => m.name === monsterType);

  if (!monster) {
    console.log(`Monster not found: ${monsterType}`);
    return;
  }
  
  const { xpToAdd, timeInSeconds, drops, weaknesses } = monster;
  
  function runTask(resolve, reject) {

    console.log(`Starting to fight ${monsterType}...`);

    let timeoutId = setTimeout(() => {
      let activeCharacter =
        JSON.parse(localStorage.getItem("activeCharacter")) || {};
      const skill = getSkillFromFightStyle(fightStyle);
      console.log(skill);
      const skillXPKey = skill + 'xp';
      activeCharacter[skillXPKey] = (activeCharacter[skillXPKey] || 0) + xpToAdd;      
      localStorage.setItem("activeCharacter", JSON.stringify(activeCharacter));

      // Add loot to the inventory
      const droppedItems = {};

      drops.forEach(drop => {
        const { item, chance } = drop;
          
        // Check if the drop should occur based on the chance
        if (Math.random() * 100 < chance) {
          activeCharacter.inventory[item] =
            (activeCharacter.inventory[item] || 0) + 1;
          droppedItems[item] = (droppedItems[item] || 0) + 1;
        }
      });
      
      // Create a string listing dropped items and their quantities
      const dropList = Object.entries(droppedItems)
        .map(([item, quantity]) => `+${quantity} ${item}`)
        .join(", ");
      
      if (dropList !== "") {
        // Display toast notification
        toast.textContent = dropList + "!";
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 1000); // Hide toast after 1 second
      }
      
      localStorage.setItem("activeCharacter", JSON.stringify(activeCharacter));
      

      console.log(
        `You gained ${xpToAdd} ${skill} XP from fighting the ${monsterType}.`
      );
      checkLevelUp(skill);
      console.log(`Updating ${skill} info...`)
      calculateCombatLevel();
      updateMonsterVisibility();
      updateInventoryDisplay();
      resolve();
    }, timeInSeconds * 1000);

    currentTask = {
      monsterType: monsterType,
      running: true,
      cancel: function () {
        clearTimeout(timeoutId);
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
  const activeCharacter =
    JSON.parse(localStorage.getItem("activeCharacter")) || {};
  const monstersContainer = document.getElementById("combatContainer");
  const fightStyleSelect = document.getElementById("fightStyle");
  const fightButton = document.getElementById("fightButton");
  let selectedMonster = null;
  let fightStyle = null;

// Use the imported monsterTypes instead of the hardcoded monsters array
const monsterList = document.getElementById("monsterList");

// Generate the monster list
  monsters.forEach((monster) => {
  const li = document.createElement("li");
  li.textContent = monster.name;
  li.classList.add("monster");
  li.dataset.monsterType = monster.name;
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
      document
        .querySelectorAll(".monster")
        .forEach((el) => el.classList.remove("selected"));
      monsterElement.classList.add("selected");

      // Enable fight button only when both monster and style are selected
      fightButton.disabled = !selectedMonster || !fightStyle;
    }
  });

  fightStyleSelect.addEventListener("change", (event) => {
    fightStyle = event.target.value;

    // Enable fight button only when both monster and style are selected
    fightButton.disabled = !selectedMonster || !fightStyle;
  });

  fightButton.addEventListener("click", () => {
    if (selectedMonster && fightStyle) {
      console.log(`Fighting ${selectedMonster} with ${fightStyle} style...`);
      startCombat(selectedMonster, fightStyle);
    }
  });
});
