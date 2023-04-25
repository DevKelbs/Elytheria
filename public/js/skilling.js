// let currentTask = null;
// console.log('top',currentTask);

// function startWoodcutting(treeType) {
//   if (currentTask !== null && currentTask.treeType === treeType) {
//     // A task for the same tree is already running; do nothing.
//     return;
//   } else if (currentTask !== null) {
//     // A task for a different tree is already running; cancel it.
//     currentTask.promise.cancel();
//   }

//   let xpToAdd;
//   let timeInSeconds;

//   switch (treeType) {
//     case "Normal Tree":
//       xpToAdd = 10;
//       timeInSeconds = 2;
//       break;
//     case "Oak Tree":
//       xpToAdd = 20;
//       timeInSeconds = 4;
//       break;
//     case "Willow Tree":
//       xpToAdd = 30;
//       timeInSeconds = 6;
//       break;
//     case "Teak Tree":
//       xpToAdd = 40;
//       timeInSeconds = 8;
//       break;
//     case "Maple Tree":
//       xpToAdd = 50;
//       timeInSeconds = 10;
//       break;
//     case "Mahogany Tree":
//       xpToAdd = 60;
//       timeInSeconds = 12;
//       break;
//     case "Yew Tree":
//       xpToAdd = 70;
//       timeInSeconds = 14;
//       break;
//     case "Magic Tree":
//       xpToAdd = 80;
//       timeInSeconds = 16;
//       break;
//     case "Redwood Tree":
//       xpToAdd = 90;
//       timeInSeconds = 18;
//       break;
//     default:
//       xpToAdd = 0;
//       timeInSeconds = 0;
//   }

//   console.log(`Starting to cut ${treeType}...`);
//   currentTask = {
//     treeType: treeType,
//     promise: new Promise((resolve, reject) => {
//       // Wait for the specified amount of time, then add XP to local storage
//       let timeoutId = setTimeout(() => {
//         let activeCharacter = JSON.parse(localStorage.getItem("activeCharacter")) || {};
//         activeCharacter.woodcuttingxp = (activeCharacter.woodcuttingxp || 0) + xpToAdd;
//         localStorage.setItem("activeCharacter", JSON.stringify(activeCharacter));
//         console.log(`You gained ${xpToAdd} Woodcutting XP from cutting the ${treeType}.`);
//         resolve();
//       }, timeInSeconds * 1000);

//       // Store the timeout ID on the promise object so we can cancel it later
//       currentTask.promise.cancel = function() {
//         clearTimeout(timeoutId);
//         reject(new Error("Task canceled"));
//       };
//     })
//   };

//   console.log(currentTask);

//   currentTask.promise.finally(() => {
//     if (currentTask !== null && currentTask.treeType === treeType) {
//       console.log(`Finished cutting ${treeType}`);
//       currentTask = null;
//     }
//   });
// }