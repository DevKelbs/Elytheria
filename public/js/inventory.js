function getItemImageSrc(itemName) {
  switch (itemName) {
    case "NormalTreeLog":
      return "./assets/images/objects/leaf1.png";
    case "OakTreeLog":
      return "./assets/images/objects/leaf2.png";
    // Add more cases for different item names and their corresponding images
    default:
      return "./assets/icons/skill-icons/icon_woodcutting_elvish.png";
  }
}

export function updateInventoryDisplay() {
  const activeCharacter =
    JSON.parse(localStorage.getItem("activeCharacter")) || {};
  const inventory = activeCharacter.inventory || {};
  const inventoryContainer = document.getElementById("inventoryView");

  // Clear the inventory container
  inventoryContainer.innerHTML = "";
  
  // Filter out items with a quantity of 0
  const filteredInventory = Object.fromEntries(
    Object.entries(inventory).filter(([_, quantity]) => quantity > 0)
  );

  // Save the filtered inventory back to the active character
  activeCharacter.inventory = filteredInventory;
  localStorage.setItem("activeCharacter", JSON.stringify(activeCharacter));

  // Iterate through the filtered inventory items
  for (const [item, quantity] of Object.entries(filteredInventory)) {
    // Create an inventory item element
    const inventoryItem = document.createElement("li");
    inventoryItem.classList.add("inventory-item");

    // Add item image
    const itemImage = document.createElement("img");
    itemImage.src = getItemImageSrc(item);
    itemImage.alt = `${item} image`;
    itemImage.classList.add("inventory-item-image"); // Add a class for image styling
    inventoryItem.appendChild(itemImage);

    // Add item name
    // const itemName = document.createElement("div");
    // itemName.classList.add("inventory-item-name");
    // itemName.textContent = item;
    // inventoryItem.appendChild(itemName);

    // Add item quantity
    const itemQuantity = document.createElement("div");
    itemQuantity.classList.add("inventory-item-quantity");
    itemQuantity.textContent = `${quantity}`;
    inventoryItem.appendChild(itemQuantity);

    // Create tooltip container
    const tooltip = document.createElement("div");
    tooltip.classList.add("item-tooltip");

    // Add tooltip image
    const tooltipImage = document.createElement("img");
    tooltipImage.src = getItemImageSrc(item);
    tooltipImage.alt = `${item} image`;
    tooltipImage.classList.add("tooltip-image");
    tooltip.appendChild(tooltipImage);

    // Add tooltip text
    const tooltipText = document.createElement("span");
    tooltipText.classList.add("tooltip-text");
    tooltipText.textContent = item;
    tooltip.appendChild(tooltipText);

    // Add tooltip to the inventory item
    inventoryItem.appendChild(tooltip);

    // Append the inventory item to the container
    inventoryContainer.appendChild(inventoryItem);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateInventoryDisplay();
});

// Call updateInventoryDisplay() after updating the inventory in the runTask function
