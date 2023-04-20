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
            mining: 1,
            fishing: 1,
            woodcutting: 1,
            // ... and any other skills
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
