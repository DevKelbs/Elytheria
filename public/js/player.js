export const player = {
    level: 1,
    experience: 0,
    nextLevelExp: 100,
    experienceRate: 10,
    levelUp: function () {
        this.level++;
        this.experience -= this.nextLevelExp;
        this.nextLevelExp *= 1.25;
    },
};
