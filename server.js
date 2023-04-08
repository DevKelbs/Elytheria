/* This code sets up an Express.js server to serve your 
game files from the "public" folder and initializes a Socket.
IO server for real-time communication. */

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});