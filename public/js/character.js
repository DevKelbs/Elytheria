export class Character {
    constructor(name, race, faction) {
        this.name = name;
        this.race = race;
        this.faction = faction;
        this.level = 1;
        this.totalxp = 0;
        this.skills = {
            attack: 1,
            strength: 1,
            defence: 1,
            hitpoints: 1,
            ranged: 1,
            magic: 1,
            prayer: 1,
            slayer: 1,
            woodcutting: 1,
            fishing: 1,
            mining: 1,
            firemaking: 1,
            exploration: 1,
            elementalism: 1,
            alchemy: 1,
            trading: 1,
            taming: 1,
            artificery: 1,
            runesmithing: 1,
            archaeology: 1,
            blacksmithing: 1,
            tailoring: 1,
            tinkery: 1,
            cooking: 1,
            farming: 1,
            construction: 1,
            fletching: 1,
            crafting: 1,
            agility: 1,
            hunter: 1,
            thieving: 1,
        };
        this.xp = {
            attackxp: 0,
            strengthxp: 0,
            defencexp: 0,
            hitpointsxp: 0,
            rangedxp: 0,
            magicxp: 0,
            prayerxp: 0,
            slayerxp: 0,
            woodcuttingxp: 0,
            fishingxp: 0,
            miningxp: 0,
            firemakingxp: 0,
            explorationxp: 0,
            elementalismxp: 0,
            alchemyxp: 0,
            tradingxp: 0,
            tamingxp: 0,
            artificeryxp: 0,
            runesmithingxp: 0,
            archaeologyxp: 0,
            blacksmithingxp: 0,
            tailoringxp: 0,
            tinkeryxp: 0,
            cookingxp: 0,
            farmingxp: 0,
            constructionxp: 0,
            fletchingxp: 0,
            craftingxp: 0,
            agilityxp: 0,
            hunterxp: 0,
            thievingxp: 0,
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