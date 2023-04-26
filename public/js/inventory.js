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
    const activeCharacter = JSON.parse(localStorage.getItem("activeCharacter")) || {};
    const inventory = activeCharacter.inventory || {};
    const inventoryContainer = document.getElementById("inventoryView");
  
    // Clear the inventory container
    inventoryContainer.innerHTML = "";
  
    // Iterate through the inventory items
    for (const [item, quantity] of Object.entries(inventory)) {
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
      const itemName = document.createElement("div");
      itemName.classList.add("inventory-item-name");
      itemName.textContent = item;
      inventoryItem.appendChild(itemName);
  
      // Add item quantity
      const itemQuantity = document.createElement("div");
      itemQuantity.classList.add("inventory-item-quantity");
      itemQuantity.textContent = `Quantity: ${quantity}`;
      inventoryItem.appendChild(itemQuantity);
  
      // Append the inventory item to the container
      inventoryContainer.appendChild(inventoryItem);
    }
  }
  
  
  document.addEventListener("DOMContentLoaded", () => {
    updateInventoryDisplay();
  });
  
  // Call updateInventoryDisplay() after updating the inventory in the runTask function
  