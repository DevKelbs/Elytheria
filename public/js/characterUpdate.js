//function to write stats to DB
async function writeCharacterStatsToDB() {
    console.log('writing character to DB');
    const character = JSON.parse(localStorage.getItem('activeCharacter'));
    const url = `/api/characters/update/${character.id}`;
    const data = {
        level: character.level,
        totalxp: character.totalxp,
        attack: character.attack,
        attackxp: character.attackxp,
        strength: character.strength,
        strengthxp: character.strengthxp,
        defence: character.defence,
        defencexp: character.defencexp,
        hitpoints: character.hitpoints,
        hitpointsxp: character.hitpointsxp,
        ranged: character.ranged,
        rangedxp: character.rangedxp,
        magic: character.magic,
        magicxp: character.magicxp,
        prayer: character.prayer,
        prayerxp: character.prayerxp,
        slayer: character.slayer,
        slayerxp: character.slayerxp,
        woodcutting: character.woodcutting,
        woodcuttingxp: character.woodcuttingxp,
        fishing: character.fishing,
        fishingxp: character.fishingxp,
        mining: character.mining,
        miningxp: character.miningxp,
        firemaking: character.firemaking,
        firemakingxp: character.firemakingxp,
        exploration: character.exploration,
        explorationxp: character.explorationxp,
        elementalism: character.elementalism,
        elementalismxp: character.elementalismxp,
        alchemy: character.alchemy,
        alchemyxp: character.alchemyxp,
        trading: character.trading,
        tradingxp: character.tradingxp,
        taming: character.taming,
        tamingxp: character.tamingxp,
        artificery: character.artificery,
        artificeryxp: character.artificeryxp,
        runesmithing: character.runesmithing,
        runesmithingxp: character.runesmithingxp,
        archaeology: character.archaeology,
        archaeologyxp: character.archaeologyxp,
        blacksmithing: character.blacksmithing,
        blacksmithingxp: character.blacksmithingxp,
        tailoring: character.tailoring,
        tailoringxp: character.tailoringxp,
        tinkery: character.tinkery,
        tinkeryxp: character.tinkeryxp,
        cooking: character.cooking,
        cookingxp: character.cookingxp,
        farming: character.farming,
        farmingxp: character.farmingxp,
        construction: character.construction,
        constructionxp: character.constructionxp,
        fletching: character.fletching,
        fletchingxp: character.fletchingxp,
        crafting: character.crafting,
        craftingxp: character.craftingxp,
        agility: character.agility,
        agilityxp: character.agilityxp,
        hunter: character.hunter,
        hunterxp: character.hunterxp,
        thieving: character.thieving,
        thievingxp: character.thievingxp,
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
        })
        .catch((error) => {
            console.error('Error writing character stats to DB:', error);
        });
}

function forceSave(message) {
  const popup = document.createElement('div');
  popup.classList.add('popup');
  popup.innerHTML = `<p>${message}</p>`;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 3000);

  const characterId = JSON.parse(localStorage.getItem('activeCharacter')).id;
  writeCharacterStatsToDB(characterId);
}

//updates character to DB every 10 minutes
setInterval(() => {
  const characterId = JSON.parse(localStorage.getItem('activeCharacter')).id;
  writeCharacterStatsToDB(characterId);
}, 10 * 60 * 1000); // 10 minutes * 60 seconds * 1000 milliseconds
  
document.addEventListener('DOMContentLoaded', () => {
  const forceSaveButton = document.getElementById('forceSaveButton');
  forceSaveButton.addEventListener('click', () => {
    forceSave('Your character has been saved to the cloud');
  });
});
