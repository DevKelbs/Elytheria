const socket = io();
const characterNameInput = document.getElementById('characterName');
const characterRaceSelect = document.getElementById('characterRace');

document.addEventListener("DOMContentLoaded", () => {
    const createCharacterButton = document.getElementById("createCharacter");

    createCharacterButton.addEventListener('click', () => {
        const characterName = characterNameInput.value;
        const characterRace = characterRaceSelect.value;

        if (!characterName || !characterRace) {
            alert('Please enter a character name and select a race.');
            return;
        }

        socket.emit('createCharacter', {
            userId: localStorage.getItem('userID'),
            name: characterName,
            race: characterRace,
        });
    });
});
