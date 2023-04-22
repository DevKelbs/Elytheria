class ElementalMastery {
    constructor() {
        this.level = 1;
        this.spells = [];
        this.activeElement = null;
    }

    unlockSpell(spell) {
        this.spells.push(spell);
    }

    changeActiveElement(element) {
        this.activeElement = element;
    }
}
