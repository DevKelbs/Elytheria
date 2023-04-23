//function to write stats to DB
async function writeCharacterStatsToDB(id) {
    console.log('writing character to DB')
    const url = `/api/characters/update/${JSON.parse(localStorage.getItem('activeCharacter')).id}`;
    const character = JSON.parse(localStorage.getItem('activeCharacter'));
    const data = {
        level: character.level,
        experience: character.experience,
        skills: character.skills
    };
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Character stats written to DB:', data);
    })
    .catch(error => {
        console.error('Error writing character stats to DB:', error);
    });
}

// Run every minute
// setInterval(() => {
//     writeCharacterStatsToDB();
//   }, 60 * 1000); // 60 seconds * 1000 milliseconds