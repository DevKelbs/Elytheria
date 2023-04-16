const characterNameInput = document.getElementById('character-name');
const characterClassSelect = document.getElementById('class-selection');
const hairColorInput = document.getElementById('hair-color');
const skinColorInput = document.getElementById('skin-color');
const eyeColorInput = document.getElementById('eye-color');

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
      throw new Error('Failed to create character');
    }

    const data = await response.json();
    console.log('Character created:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const openCharacterCreationButton = document.getElementById('open-character-creation');
  if (openCharacterCreationButton) {
    openCharacterCreationButton.addEventListener('click', () => {
      window.location.href = 'character_creation.html';
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
