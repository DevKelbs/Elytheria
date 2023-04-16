document.addEventListener('DOMContentLoaded', () => {
    const characterNameInput = document.getElementById('character-name');
    const characterClassSelect = document.getElementById('class-selection');
    const hairColorInput = document.getElementById('hair-color');
    const skinColorInput = document.getElementById('skin-color');
    const eyeColorInput = document.getElementById('eye-color');
    const createCharacterButton = document.getElementById('create-character-button');
    const openCharacterCreationButton = document.getElementById('open-character-creation');
  
    openCharacterCreationButton.addEventListener('click', () => {
      window.location.href = "character_creation.html";
    });
  
    createCharacterButton.addEventListener('click', async (event) => {
      event.preventDefault();
  
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
    });
  });
  