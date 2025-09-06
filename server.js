require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const socket = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Security Middleware
app.use(helmet());
app.use(helmet.xssFilter());
app.use(helmet.noCache());
app.disable('x-powered-by');
app.use(function (req, res, next) {
  res.header("X-Powered-By", "PHP 7.4.3"); // Sets a custom value
  next();
});

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({ origin: '*' }));

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

// 404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;
let collectible = {};
// Set up server and tests
const server = app.listen(portNum, '0.0.0.0', () => {
  console.log(`Listening on port ${portNum}`);
  let uniqueId = generateRandomId();
  collectible = new (require('./public/Collectible'))({ x: 100, y: 150, value: 5, id: uniqueId });
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

const io = socket.listen(server);
const players = {};

io.on('connection', (socket) => {
  // console.log('a user connected');
  // ... your game logic
  socket.on('new player', (player) => {
    // console.log('new player joined', player);
    // ... your game logic
    player.color = getRandomColor();
    // console.log('new player color', player.color);
    players[player.id] = player;

    io.emit('state', {players, collectible});
  });
  socket.on('move player', (player) => {
    // console.log('player moved', player);
    // ... your game logic
    
    players[player.id] = player;
    // console.log('player moved')
    io.emit('state-move', {players, collectible}); // Send as an object
  });

  socket.on('collision', (player) => {
    // console.log('player collided', player);
    // ... your game logic
    players[player.id] = player;
    console.log(player.id, 'scored', collectible.value, 'points', 'new score:', player.score);
    // Create a new collectible
    let uniqueId = generateRandomId();
    collectible = new (require('./public/Collectible'))({ x: Math.floor(Math.random() * 620), y: Math.floor(Math.random() * 460), value: Math.floor(Math.random() * 100), id: uniqueId });
    let ranks = [];
    for (let player in players) {
      ranks.push({id: players[player].id, score: players[player].score});
    }
    socket.emit('rank', ranks);
  });

  socket.on('disconnect', () => {
    // console.log('user disconnected');
    delete players[socket.id];
    io.emit('state', {players, collectible});
  });
});

function generateRandomId() {
  return Math.random().toString(36).substring(2, 9); // Generates a 7-character alphanumeric string
}

function getRandomColor() {
  let r, g, b
  r = Math.floor(Math.random() * 256)
  g = Math.floor(Math.random() * 256)
  b = Math.floor(Math.random() * 256)
  return `rgb(${r}, ${g}, ${b})`
}

module.exports = app; // For testing
