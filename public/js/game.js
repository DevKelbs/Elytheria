// Load the background image
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
    });
}

function loadImages(sources) {
    const promises = sources.map(src => loadImage(src));
    return Promise.all(promises);
}

async function startGame() {
    // Get a reference to the canvas element and its context
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const coveMain = document.getElementById('coveMain');

    // Load images
    // Load character sprite and tile images
    const characterSprite = await loadImage("assets/images/characters/character.png");
    const mapTilesImage = await loadImage("assets/images/tiles/Overworld.png");
    const backgroundImage = await loadImage('assets/images/backgrounds/2x/Asset1.png');
    const leafImages = await loadImages([
        'assets/images/objects/leaf1.png',
        'assets/images/objects/leaf2.png',
        'assets/images/objects/leaf3.png',
    ]);

    const mainMap = {
        image: mapTilesImage,
        columns: 40, // Number of columns in the tileset
        rows: 35, // Number of rows in the tileset
        tileSize: 16, // Size of each tile in pixels
    };

    // Initialize the character object and map array
    const character = {
        x: 100,
        y: 100,
        width: 16,
        height: 16,
    };

    const tileSize = 16; // Define the size of each tile

    const map = [
        [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
        [25, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 25],
        [25, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 25],
        [25, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 25],
        [25, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 25],
        [25, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 25],
        [25, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 25],
        [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
    ];

    // Specify the desired aspect ratio
    const aspectRatio = {
        width: 16,
        height: 9,
    };

    const wisps = createWisps(50);
    const leaves = createLeaves(20); // Create an array of 20 leaves

    function resizeCanvas() {
        const oldWidth = canvas.width;
        const oldHeight = canvas.height;

        // Calculate the new canvas width and height based on the window dimensions
        const newWidth = window.innerWidth;
        const newHeight = (window.innerWidth * aspectRatio.height) / aspectRatio.width;

        // Set the new canvas dimensions while maintaining the aspect ratio
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Update the wisp positions based on the new canvas size
        const scaleX = newWidth / oldWidth;
        const scaleY = newHeight / oldHeight;

        wisps.forEach((wisp) => {
            wisp.x *= scaleX;
            wisp.y *= scaleY;
        });

        // Update the leaf positions based on the new canvas size
        leaves.forEach((leaf) => {
            leaf.x *= scaleX;
            leaf.y *= scaleY;
        });
    }

    // Call resizeCanvas initially to set the canvas size
    resizeCanvas();

    // Add the event listener to call resizeCanvas when the window is resized
    window.addEventListener('resize', resizeCanvas);

    // Draw the background
    function drawBackground() {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    function createLeaves(count) {
        const leaves = [];

        for (let i = 0; i < count; i++) {
            const leaf = {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                width: 10 + Math.random() * 30, // Random size between 10 and 40
                height: 10 + Math.random() * 30, // Random size between 10 and 40
                dx: Math.random() * 0.5 - 0.25, // Random horizontal speed between -0.25 and 0.25
                dy: Math.random() * 0.5, // Random vertical speed between 0 and 0.5
                image: leafImages[Math.floor(Math.random() * leafImages.length)], // Random leaf image
                rotation: Math.random() * 360, // Random initial rotation
                rotationSpeed: Math.random() * 0.5 - 0.25, // Random rotation speed between -0.25 and 0.25
            };
            leaves.push(leaf);
        }

        return leaves;
    }

    function updateLeaf(leaf) {
        leaf.x += leaf.dx;
        leaf.y += leaf.dy;
        leaf.rotation += leaf.rotationSpeed;

        // Reset the leaf's position if it goes off the canvas
        if (leaf.x < -leaf.width || leaf.x > canvas.width || leaf.y > canvas.height) {
            leaf.x = Math.random() * canvas.width;
            leaf.y = -leaf.height;
        }
    }

    function drawLeaf(leaf) {
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate((leaf.rotation * Math.PI) / 180);
        ctx.drawImage(leaf.image, 0, 0, leaf.width, leaf.height);
        ctx.restore();
    }

    function createWisps(count) {
        const wisps = [];

        for (let i = 0; i < count; i++) {
            const wisp = {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 2 + Math.random() * 4, // Random size between 2 and 6
                opacity: 0.3 + Math.random() * 0.7 // Random opacity between 0.3 and 1.0
            };

            wisps.push(wisp);
        }

        return wisps;
    }

    function updateWisp(wisp, index) {
        const frequency = 0.1; // Adjust for faster or slower oscillation
        const amplitude = 5; // Adjust for larger or smaller oscillation range
        const angle = (index * 360 / wisps.length) + Date.now() * frequency;

        const originalX = wisp.originalX || wisp.x;
        const originalY = wisp.originalY || wisp.y;
        wisp.originalX = originalX;
        wisp.originalY = originalY;

        // Update wisp position based on the sine and cosine functions
        wisp.x = originalX + amplitude * Math.sin(2 * Math.PI * angle / 360);
        wisp.y = originalY + amplitude * Math.cos(2 * Math.PI * angle / 360);

        // Update wisp opacity based on the sine function
        wisp.opacity = 0.4 + 0.6 * (1 + Math.sin(2 * Math.PI * angle / 360)) / 2;
    }

    function drawWisp(wisp) {
        if (!isFinite(wisp.size) || !isFinite(wisp.opacity)) {
            console.error("Invalid wisp size:", wisp.size);
            return
        }

        ctx.beginPath();
        ctx.arc(wisp.x, wisp.y, wisp.size, 0, 2 * Math.PI);
        const gradient = ctx.createRadialGradient(wisp.x, wisp.y, 0, wisp.x, wisp.y, wisp.size);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${wisp.opacity})`); // White center
        gradient.addColorStop(0.5, `rgba(255, 160, 122, ${wisp.opacity * 1})`); // Soft orange
        gradient.addColorStop(1, `rgba(255, 105, 180, ${wisp.opacity * 0.5})`); // Pink
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    // Add the new functions for drawing the map and character
    function drawMap() {
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                // Get the tile index from the map data
                const tileIndex = map[y][x];

                // Calculate the tile's position in the mainMap image
                const mainMapX = (tileIndex % mainMap.columns) * mainMap.tileSize;
                const mainMapY = Math.floor(tileIndex / mainMap.columns) * mainMap.tileSize;

                // Draw the tile on the canvas
                ctx.drawImage(
                    mainMap.image,
                    mainMapX,
                    mainMapY,
                    mainMap.tileSize,
                    mainMap.tileSize,
                    x * tileSize,
                    y * tileSize,
                    tileSize,
                    tileSize
                );
            }
        }
    }

    function drawCharacter() {
        ctx.drawImage(characterSprite, character.x, character.y, character.width, character.height);
    }

    // Main game loop
    function gameLoop() {
        // Request the next animation frame
        requestAnimationFrame(gameLoop);

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the background, map, and character
        // drawBackground();
        drawMap();
        drawCharacter();

        // Update and draw the wisps
        wisps.forEach((wisp, index) => {
            updateWisp(wisp, index);
            drawWisp(wisp);
        });

        // Update and draw the leaves
        leaves.forEach((leaf) => {
            updateLeaf(leaf);
            drawLeaf(leaf);
        });
    }

    // Add the event listener for point-and-click character movement
    canvas.addEventListener("click", (event) => {
        const mouseX = event.clientX - canvas.offsetLeft;
        const mouseY = event.clientY - canvas.offsetTop;
        character.x = mouseX - (character.width / 2);
        character.y = mouseY - (character.height / 2);
    });

    // Start the game loop
    gameLoop();

}

async function hideLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');

    // Hide the loading screen after 2 seconds
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 2500);
}

document.addEventListener('DOMContentLoaded', async () => {
    await hideLoadingScreen();
    startGame();
});