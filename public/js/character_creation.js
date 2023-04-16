document.addEventListener('DOMContentLoaded', () => {
    const characterNameInput = document.getElementById('characterName');
    const characterClassSelect = document.getElementById('characterRace');
    // Add the characterColorInput line if you added the element to your HTML
    // const characterColorInput = document.getElementById('character-color-input');
    const createCharacterButton = document.getElementById('open-character-creation');

    createCharacterButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const characterName = characterNameInput.value;
        const characterClass = characterClassSelect.value;
        // Uncomment the following line if you added the characterColorInput to your HTML
        // const characterColor = characterColorInput.value;

        try {
            const response = await fetch('/api/characters/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: characterName,
                    class: characterClass,
                    // Uncomment the following line if you added the characterColorInput to your HTML
                    // color: characterColor,
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
