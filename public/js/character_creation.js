import io from './node_modules/socket.io-client/dist/socket.io.min.js';

const socket = io();
const createCharacterButton = document.getElementById('createCharacterButton');
const characterNameInput = document.getElementById('characterName');
const characterRaceSelect = document.getElementById('characterRace');

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
