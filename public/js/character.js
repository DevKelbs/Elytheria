export class Character {
    constructor(name, race, faction) {
        this.name = name;
        this.race = race;
        this.faction = faction;
        this.level = 1;
        this.experience = 0;
        this.stats = {
            strength: 0,
            agility: 0,
            intelligence: 0,
            endurance: 0
        };
        this.skills = {
            // Non-combat skills
            mining: 1,
            fishing: 1,
            woodcutting: 1,
            explortation: 1,
            elementalism: 1,
            alchemy: 1,
            trading: 1,
            taming: 1,
            artificery: 1,
            runesmithing: 1,
            archaeology: 1,
            blacksmithing: 1,
            tailoring: 1,
            tinkerery: 1,
            cooking: 1,
            firemaking: 1,
            farming: 1,
            construction: 1,
            fletching: 1,
            crafting: 1,
            slayer: 1,
            hunter: 1,
            thieving: 1,
            // Combat skills
            range: 1,
            prayer: 1,
            attack: 1,
            defense: 1,
            magic: 1,
            agility: 1,
            strength: 1,
            hitpoints: 1,
        };
        this.equipment = {
            weapon: null,
            armor: null,
            // ... and any other equipment slots
        };
        this.inventory = [];
        this.quests = {
            completed: [],
            inProgress: []
        };
        this.activeAbilities = [];

        this.applyRaceBonuses(race);
        this.applyFactionBonuses(faction);
        this.setStartingEquipment(race);

        setInterval(() => {
            writeCharacterStatsToDB(this);
        }, 5 * 60 * 1000); // 5 minutes
    }

    applyRaceBonuses(race) {
        switch (race) {
            case 'Solarian Knights':
                this.stats.strength += 2;
                this.stats.endurance += 2;
                this.activeAbilities.push('Searing Light');
                break;
            case 'Feyborn':
                this.stats.intelligence += 3;
                this.stats.agility += 1;
                this.activeAbilities.push('Nature\'s Wrath');
                break;
            // ... and other race bonuses
            default:
                break;
        }
    }

    applyFactionBonuses(faction) {
        switch (faction) {
            case 'Order of the Sun':
                this.stats.strength += 1;
                this.stats.endurance += 1;
                this.activeAbilities.push('Sunrise Blessing');
                break;
            case 'Nature\'s Guardians':
                this.stats.intelligence += 2;
                this.stats.agility += 1;
                this.activeAbilities.push('Healing Breeze');
                break;
            // ... and other faction bonuses
            default:
                break;
        }
    }

    setStartingEquipment(race) {
        switch (race) {
            case 'Solarian Knights':
                this.equipment.weapon = 'Training Sword';
                this.equipment.armor = 'Rusty Chainmail';
                break;
            case 'Feyborn':
                this.equipment.weapon = 'Novice Wand';
                this.equipment.armor = 'Woven Robe';
                break;
            // ... and other starting equipment
            default:
                break;
        }
    }

    static fromJSON(characterData) {
        const character = new Character();
        Object.assign(character, characterData);
        return character;
    }
    
}
//function to write stats to DB
function writeCharacterStatsToDB() {
    console.log('writing character to DB')
    const url = '/api/stats/create';
    const character = JSON.parse(localStorage.getItem("activeCharacter"));
    const data = {
        name: character.name,
        race: character.race,
        faction: character.faction,
        level: character.level,
        experience: character.experience,
        stats: character.stats,
        skills: character.skills
    };
    fetch(url, {
        method: 'POST',
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
