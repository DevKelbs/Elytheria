let lastElementID = '';
const characterNameInput = document.getElementById('character-name');
const characterClassSelect = document.getElementById('class-selection');
const hairColorInput = document.getElementById('hair-color');
const skinColorInput = document.getElementById('skin-color');
const eyeColorInput = document.getElementById('eye-color');
const characterCreationContent = document.getElementById('characterCreationContent');
const mainGameContent = document.getElementById('mainGameContent');


const displayErrorMessage = (message) => {
  const errorMessage = document.createElement("div");
  errorMessage.className = "error-message";
  errorMessage.innerText = message;

  document.body.appendChild(errorMessage);

  setTimeout(() => {
    errorMessage.remove();
  }, 3000);
};

// Function to open the character creation content
function openCharacterCreationContent() {
  // Save the last element's ID
  lastElementID = document.activeElement.id;

  // Hide the main game content
  mainGameContent.style.display = 'none';

  // Show the character creation content
  characterCreationContent.style.display = 'block';
}

// Function to close the character creation form
function closeCharacterCreationContent() {
  // Hide the character creation form
  characterCreationContent.style.display = 'none';

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
  const openCharacterCreationButton = document.getElementById('open-character-creation');
  if (openCharacterCreationButton) {
    openCharacterCreationButton.addEventListener('click', () => {
      document.getElementById("characterCreationContent").style.display = "block";
    });
  }

  const createCharacterButton = document.getElementById('create-character-button');
  if (createCharacterButton) {
    createCharacterButton.addEventListener('click', async (event) => {
      event.preventDefault();
      createCharacter();
    });
  }
});
