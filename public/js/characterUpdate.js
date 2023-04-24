//function to write stats to DB
async function writeCharacterStatsToDB() {
    console.log('writing character to DB');
    const character = JSON.parse(localStorage.getItem('activeCharacter'));
    const url = `/api/characters/update/${character.id}`;
    const data = {
        level: character.level,
        experience: character.experience,
        attack: character.skills.attack,
        strength: character.skills.strength,
        defense: character.skills.defense,
        hitpoints: character.skills.hitpoints,
        ranged: character.skills.ranged,
        magic: character.skills.magic,
        prayer: character.skills.prayer,
        slayer: character.skills.slayer,
        woodcutting: character.skills.woodcutting,
        fishing: character.skills.fishing,
        mining: character.skills.mining,
        firemaking: character.skills.firemaking,
        exploration: character.skills.exploration,
        elementalism: character.skills.elementalism,
        alchemy: character.skills.alchemy,
        trading: character.skills.trading,
        taming: character.skills.taming,
        artificery: character.skills.artificery,
        runesmithing: character.skills.runesmithing,
        archaeology: character.skills.archaeology,
        blacksmithing: character.skills.blacksmithing,
        tailoring: character.skills.tailoring,
        tinkery: character.skills.tinkery,
        cooking: character.skills.cooking,
        farming: character.skills.farming,
        construction: character.skills.construction,
        fletching: character.skills.fletching,
        crafting: character.skills.crafting,
        agility: character.skills.agility,
        hunter: character.skills.hunter,
        thieving: character.skills.thieving,
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

// Define a function to show the modal
function showNotification(message) {
    // Check if the Notification API is supported
    if ('Notification' in window) {
      // Request permission to show notifications
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          // Create a new notification
          const notification = new Notification('Character Saved', {
            body: message,
            icon: 'path/to/notification-icon.png',
          });
  
          // Hide the notification after a certain amount of time
          setTimeout(() => {
            notification.close();
          }, 3000);
        }
      });
    }
  }
  
  // Call the writeCharacterStatsToDB() function at the specified interval
  setInterval(() => {
    const characterId = JSON.parse(localStorage.getItem('activeCharacter')).id;
    writeCharacterStatsToDB(characterId);
  
    // Show the modal with the "saved" message
    showNotification('Your character has been saved to the cloud');
  }, 60 * 1000); // 60 seconds * 1000 milliseconds
  