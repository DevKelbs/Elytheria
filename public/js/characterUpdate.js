//function to write stats to DB
async function writeCharacterStatsToDB() {
    console.log('writing character to DB');
    const character = JSON.parse(localStorage.getItem('activeCharacter'));
    const url = `/api/characters/update/${character.id}`;
    const data = {
        level: character.level,
        experience: character.experience,
        skills: character.skills,
    };
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Character stats written to DB:', data);
        })
        .catch((error) => {
            console.error('Error writing character stats to DB:', error);
        });
}

// Run every minute
setInterval(() => {
    const characterId = JSON.parse(localStorage.getItem('activeCharacter')).id;
    writeCharacterStatsToDB(characterId);
}, 60 * 1000); // 60 seconds * 1000 milliseconds