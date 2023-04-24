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
      // Get the data for the selected character from the database
      const characterId = character.id;
      console.log('selecting char...');
      console.log(characterId);
      getCharacterData(characterId)
        .then((data) => {
          // Create a new Character instance from the retrieved data
          const selectedCharacter = Character.fromJSON(data);

          // Update the UI to reflect the selected character
          const selectedCharacterElement = document.querySelector(".selected-character");
          if (selectedCharacterElement) {
            selectedCharacterElement.classList.remove("selected-character");
          }
          characterElement.classList.add("selected-character");
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Error selecting character. Please try again later.");
        });
    }

    async function getCharacterData(characterId) {
      console.log('getting char data...')
      const token = localStorage.getItem("token");
        
      const response = await fetch(`/api/characters/${characterId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
        
      const data = await response.json();
      console.log(data); // Log the data to the console
      const activeCharacter = data.characters.find(character => character.id === characterId);
      localStorage.setItem("activeCharacter", JSON.stringify(activeCharacter));
      const indexUrl = 'index.html'; // Replace this with the URL of your index page
      window.location.replace(indexUrl); // Redirect to index page
      return activeCharacter;
    }
    
  } catch (error) {
    console.error("Error:", error);
    alert("Error fetching characters. Please try again later.");
  }
}


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
  const openCharacterCreationButton = document.getElementById(
    "createCharacterButton"
  );
  if (openCharacterCreationButton) {
    openCharacterCreationButton.addEventListener(
      "click",
      openCharacterCreationContent
    );
  }

  const openCharacterDisplayButton = document.getElementById(
    "selectCharacterButton"
  );
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

  const showCharactersButton = document.getElementById("selectCharacterButton");
  if (showCharactersButton) {
    showCharactersButton.addEventListener("click", displayAllCharacters);
    displayAllCharacters();
  }
});
