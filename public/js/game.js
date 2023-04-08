const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };
  
  const game = new Phaser.Game(config);
  
  function preload() {
    // Load your game assets here
  }
  
  function create() {
    // Initialize your game objects here
  }
  
  function update() {
    // Update your game logic here
  }

  const socket = io();

  socket.on('connect', () => {
    console.log('Connected to server');
  });