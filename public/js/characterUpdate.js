//function to write stats to DB
async function writeCharacterStatsToDB() {
    console.log('writing character to DB');
    const character = JSON.parse(localStorage.getItem('activeCharacter'));
    const url = `/api/characters/update/${character.id}`;
    const data = {
        level: character.level,
        totalxp: character.totalxp,
        attack: character.skills.attack,
        attackxp: character.xp.attackxp,
        strength: character.skills.strength,
        strengthxp: character.xp.strengthxp,
        defence: character.skills.defence,
        defencexp: character.xp.defencexp,
        hitpoints: character.skills.hitpoints,
        hitpointsxp: character.xp.hitpointsxp,
        ranged: character.skills.ranged,
        rangedxp: character.xp.rangedxp,
        magic: character.skills.magic,
        magicxp: character.xp.magicxp,
        prayer: character.skills.prayer,
        prayerxp: character.xp.prayerxp,
        slayer: character.skills.slayer,
        slayerxp: character.xp.slayerxp,
        woodcutting: character.skills.woodcutting,
        woodcuttingxp: character.xp.woodcuttingxp,
        fishing: character.skills.fishing,
        fishingxp: character.xp.fishingxp,
        mining: character.skills.mining,
        miningxp: character.xp.miningxp,
        firemaking: character.skills.firemaking,
        firemakingxp: character.xp.firemakingxp,
        exploration: character.skills.exploration,
        explorationxp: character.xp.explorationxp,
        elementalism: character.skills.elementalism,
        elementalismxp: character.xp.elementalismxp,
        alchemy: character.skills.alchemy,
        alchemyxp: character.xp.alchemyxp,
        trading: character.skills.trading,
        tradingxp: character.xp.tradingxp,
        taming: character.skills.taming,
        tamingxp: character.xp.tamingxp,
        artificery: character.skills.artificery,
        artificeryxp: character.xp.artificeryxp,
        runesmithing: character.skills.runesmithing,
        runesmithingxp: character.xp.runesmithingxp,
        archaeology: character.skills.archaeology,
        archaeologyxp: character.xp.archaeologyxp,
        blacksmithing: character.skills.blacksmithing,
        blacksmithingxp: character.xp.blacksmithingxp,
        tailoring: character.skills.tailoring,
        tailoringxp: character.xp.tailoringxp,
        tinkery: character.skills.tinkery,
        tinkeryxp: character.xp.tinkeryxp,
        cooking: character.skills.cooking,
        cookingxp: character.xp.cookingxp,
        farming: character.skills.farming,
        farmingxp: character.xp.farmingxp,
        construction: character.skills.construction,
        constructionxp: character.xp.constructionxp,
        fletching: character.skills.fletching,
        fletchingxp: character.xp.fletchingxp,
        crafting: character.skills.crafting,
        craftingxp: character.xp.craftingxp,
        agility: character.skills.agility,
        agilityxp: character.xp.agilityxp,
        hunter: character.skills.hunter,
        hunterxp: character.xp.hunterxp,
        thieving: character.skills.thieving,
        thievingxp: character.xp.thievingxp,
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
