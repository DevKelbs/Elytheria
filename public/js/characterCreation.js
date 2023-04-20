import { Character } from '/js/character.js';

let lastElementID = '';
const characterNameInput = document.getElementById('character-name');
const characterClassSelect = document.getElementById('class-selection');
const hairColorInput = document.getElementById('hair-color');
const skinColorInput = document.getElementById('skin-color');
const eyeColorInput = document.getElementById('eye-color');
const characterCreationContent = document.getElementById('characterCreationContent');
const mainGameContent = document.getElementById('mainGameContent');

const form = document.getElementById('createCharacterForm');
const characterDisplay = document.getElementById('characterDisplay');
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

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = form.elements.name.value;
  const race = form.elements.race.value;
  const faction = form.elements.faction.value;

  const character = new Character(name, race, faction);
  addCharacterToStorage(character);

  displayCharacter(character);
});

function displayAllCharacters() {
  const characters = JSON.parse(localStorage.getItem('characters')) || [];

  characterDisplay.innerHTML = '';

  characters.forEach((characterData, index) => {
    console.log('Character data:', characterData);
    const character = Character.fromJSON(characterData);
    const characterElement = document.createElement('div');
    characterElement.classList.add('character');
    characterElement.innerHTML = `
      <h3>${character.name}</h3>
      <button>Select</button>
    `;

    characterElement.querySelector('button').addEventListener('click', () => {
      displayCharacter(character);
    });

    characterDisplay.appendChild(characterElement);
  });
}

function displayCharacter(character) {
  characterDisplay.innerHTML = `
  <button id="closeCharacterCreation">Close</button>
    <h2>${character.name}</h2>
    <p>Race: ${character.race}</p>
    <p>Faction: ${character.faction}</p>
    <p>Level: ${character.level}</p>
    <p>Experience: ${character.experience}</p>
    <p>Stats:</p>
    <ul>
      <li>Strength: ${character.stats.strength}</li>
      <li>Agility: ${character.stats.agility}</li>
      <li>Intelligence: ${character.stats.intelligence}</li>
      <li>Endurance: ${character.stats.endurance}</li>
    </ul>
    <!-- Add other relevant information here -->
    <button id="back-to-character-list">Back to character list</button>
    <button id="delete-character">Delete character</button>
    <button id="edit-character">Edit character</button>
    <button id="save-character">Save character</button>
  `;
}

function addCharacterToStorage(character) {
  let characters = JSON.parse(localStorage.getItem('characters')) || [];

  if (characters.length >= maxCharactersAllowed) {
    alert('You have reached the maximum number of characters allowed.');
    return;
  }

  characters.push(character);
  localStorage.setItem('characters', JSON.stringify(characters));
}

// Function to open the character creation content
function openCharacterCreationContent() {
  // Save the last element's ID
  lastElementID = document.activeElement.id;

  // Hide the main game content
  mainGameContent.style.display = 'none';

  // Show the character creation content
  characterCreationContentv2.style.display = 'block';
}

// Function to close the character creation form
function closeCharacterCreationContent() {
  // Hide the character creation form
  characterCreationContentv2.style.display = 'none';

  // If lastElementID has a value, show that element
  if (lastElementID) {
    document.getElementById(lastElementID).style.display = 'block';
  } else {
    // If lastElementID is empty, show the main game content
    mainGameContent.style.display = 'block';
  }
}

// Function to open the character creation content
function openCharacterDisplay() {
  // Save the last element's ID
  lastElementID = document.activeElement.id;

  // Hide the main game content
  mainGameContent.style.display = 'none';

  // Show the character creation content
  characterDisplay.style.display = 'block';
}

// Function to close the character creation form
function closeCharacterDisplay() {
  // Hide the character creation form
  characterDisplay.style.display = 'none';

  // If lastElementID has a value, show that element
  if (lastElementID) {
    document.getElementById(lastElementID).style.display = 'block';
  } else {
    // If lastElementID is empty, show the main game content
    mainGameContent.style.display = 'block';
  }
}

const createCharacter = async () => {
  const characterName = characterNameInput.value;
  const characterClass = characterClassSelect.value;
  const hairColor = hairColorInput.value;
  const skinColor = skinColorInput.value;
  const eyeColor = eyeColorInput.value;

  try {
    const response = await fetch('/api/characters/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        name: characterName,
        class: characterClass,
        hairColor: hairColor,
        skinColor: skinColor,
        eyeColor: eyeColor,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        throw new Error(errorData.message);
      } else {
        throw new Error('Failed to create character');
      }
    }

    const data = await response.json();
    console.log('Character created:', data);
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Error:', error);
    displayErrorMessage(`Error: ${error.message}`);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // const openCharacterCreationButton = document.getElementById('open-character-creation');
  // if (openCharacterCreationButton) {
  //   openCharacterCreationButton.addEventListener('click', () => {
  //     document.getElementById("characterCreationContent").style.display = "block";
  //   });
  // }

  const openCharacterCreationButton = document.getElementById('openCharacterCreation');
  if (openCharacterCreationButton) {
    openCharacterCreationButton.addEventListener('click', openCharacterCreationContent);
  }

  const closeCharacterCreationButton = document.getElementById('closeCharacterCreation');
  if (closeCharacterCreationButton) {
    closeCharacterCreationButton.addEventListener('click', closeCharacterCreationContent);
  }

  const openCharacterDisplayButton = document.getElementById('showCharacters');
  if (openCharacterDisplayButton) {
    openCharacterDisplayButton.addEventListener('click', openCharacterDisplay);
  }

  const createCharacterButton = document.getElementById('create-character-button');
  if (createCharacterButton) {
    createCharacterButton.addEventListener('click', async (event) => {
      event.preventDefault();
      createCharacter();
    });
  }

  const showCharactersButton = document.getElementById('showCharacters');
  if (showCharactersButton) {
    showCharactersButton.addEventListener('click', displayAllCharacters);
    displayAllCharacters();
  }
});
