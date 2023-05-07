export const monsters = [
    {
      name: "Goblin",
      xpToAdd: 10,
      timeInSeconds: 1.5,
      drops: [
        { item: "BronzeSword", chance: 10 },
        { item: "Bones", chance: 100 },
      ],
      weaknesses: ["Power", "Magic"]
    },
    {
      name: "Orc",
      xpToAdd: 15,
      timeInSeconds: 2,
      drops: [
        { item: "BronzeSword", chance: 5 },
        { item: "Bones", chance: 100 },
      ],
      weaknesses: ["Ranged"]
    },
    {
      name: "Troll",
      xpToAdd: 22,
      timeInSeconds: 2.5,
      drops: [
        { item: "BronzeSword", chance: 5 },
        { item: "Bones", chance: 100 },
      ],
      weaknesses: ["Magic"]
    }
    // Add more monsters here...
  ];
  