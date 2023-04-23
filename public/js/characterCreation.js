import { Character } from "/js/character.js";

let lastElementID = "";
const characterNameInput = document.getElementById("name");
const characterRaceSelect = document.getElementById("race");
const characterFactionSelect = document.getElementById("faction");
const characterCreationContentv2 = document.getElementById(
  "characterCreationContentv2"
);
const mainGameContent = document.getElementById("mainGameContent");

const form = document.getElementById("createCharacterForm");
const characterDisplay = document.getElementById("characterDisplay");
const maxCharactersAllowed = 5;

const displayErrorMessage = (message) => {
  const errorMessage = document.createElement("div");
  errorMessage.className = "error-message";
  errorMessage.innerText = message;

  document.body.appendChild(errorMessage);

  setTimeout(() => {
    errorMessage.remove();
  }, 3000);
};

// form.addEventListener('submit', (event) => {
//   event.preventDefault();

//   const name = form.elements.name.value;
//   const race = form.elements.race.value;
//   const faction = form.elements.faction.value;

//   const character = new Character(name, race, faction);
//   addCharacterToStorage(character);

//   displayCharacter(character);
// });

async function displayAllCharacters() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (!token || !userId) {
    return;
  }

  try {
    const response = await fetch(`/api/characters/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    const characters = data.characters;

    characterDisplay.innerHTML = "";

    characters.forEach((characterData, index) => {
      console.log("Character data:", characterData);
      const character = Character.fromJSON(characterData);
      const characterElement = document.createElement("div");
      characterElement.classList.add("character");
      characterElement.innerHTML = `
        <h3>Name: ${character.name}</h3>
        <p>Level: ${character.level}</p>
        <p>Race: ${character.race}</p>
        <p>Faction: ${character.faction}</p>
        <button>Select</button>
      `;

      characterElement.querySelector("button").addEventListener("click", () => {
        selectCharacter(character, characterElement);
      });

      characterDisplay.appendChild(characterElement);
    });

    function selectCharacter(character, characterElement) {
      // Set the selected character as the active character
      // (this is just an example, you would need to implement this logic)
      setActiveCharacter(character);
      window.location.href = "index.html";

      // Update the UI to reflect the selected character
      const selectedCharacter = document.querySelector(".selected-character");
      if (selectedCharacter) {
        selectedCharacter.classList.remove("selected-character");
      }
      characterElement.classList.add("selected-character");
    }
    function setActiveCharacter(character) {
      localStorage.setItem("activeCharacter", JSON.stringify(character));
      console.log("Selected character:", character);
    }    
  } catch (error) {
    console.error("Error:", error);
    alert("Error fetching characters. Please try again later.");
  }
}

// function addCharacterToStorage(character) {
//   let characters = JSON.parse(localStorage.getItem('characters')) || [];

// if (characters.length >= maxCharactersAllowed) {
//   alert('You have reached the maximum number of characters allowed.');
//   return;
// }

// Function to open the character creation content
function openCharacterCreationContent() {
  // Save the last element's ID
  lastElementID = document.activeElement.id;

  // Hide the main game content
  mainGameContent.style.display = "none";

  // Show the character creation content
  characterCreationContentv2.style.display = "block";
}

// Function to close the character creation form
function closeCharacterCreationContent() {
  // Hide the character creation form
  characterCreationContentv2.style.display = "none";
  mainGameContent.style.display = "block";
}

// Function to open the character creation content
function openCharacterDisplay() {
  // Save the last element's ID
  lastElementID = document.activeElement.id;

  // Hide the main game content
  mainGameContent.style.display = "none";

  // Show the character creation content
  characterDisplay.style.display = "block";
}

// Function to close the character creation form
function closeCharacterDisplay() {
  // Hide the character creation form
  characterDisplay.style.display = "none";

  // If lastElementID has a value, show that element
  if (lastElementID) {
    document.getElementById(lastElementID).style.display = "block";
  } else {
    // If lastElementID is empty, show the main game content
    mainGameContent.style.display = "block";
  }
}

const createCharacter = async () => {
  const characterName = characterNameInput.value;
  const characterRace = characterRaceSelect.value;
  const characterFaction = characterFactionSelect.value;

  try {
    console.log("sending character create request...");
    const response = await fetch("/api/characters/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: characterName,
        race: characterRace,
        faction: characterFaction,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        throw new Error(errorData.message);
      } else {
        throw new Error("Failed to create character");
      }
    }

    const character = await response.json();
    console.log("created character:");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error creating character:", error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // const openCharacterCreationButton = document.getElementById('open-character-creation');
  // if (openCharacterCreationButton) {
  //   openCharacterCreationButton.addEventListener('click', () => {
  //     document.getElementById("characterCreationContent").style.display = "block";
  //   });
  // }

  const openCharacterCreationButton = document.getElementById(
    "openCharacterCreation"
  );
  if (openCharacterCreationButton) {
    openCharacterCreationButton.addEventListener(
      "click",
      openCharacterCreationContent
    );
  }

  // const closeCharacterCreationButton = document.getElementById(
  //   "closeCharacterCreation"
  // );
  // if (closeCharacterCreationButton) {
  //   closeCharacterCreationButton.addEventListener(
  //     "click",
  //     closeCharacterCreationContent
  //   );
  // }

  const openCharacterDisplayButton = document.getElementById("showCharacters");
  if (openCharacterDisplayButton) {
    openCharacterDisplayButton.addEventListener("click", openCharacterDisplay);
  }

  const createCharacterButton = document.getElementById(
    "create-character-button"
  );
  if (createCharacterButton) {
    createCharacterButton.addEventListener("click", async (event) => {
      event.preventDefault();
      createCharacter();
    });
  }

  const showCharactersButton = document.getElementById("showCharacters");
  if (showCharactersButton) {
    showCharactersButton.addEventListener("click", displayAllCharacters);
    displayAllCharacters();
  }
});
