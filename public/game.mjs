import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
canvas.width = 640;
canvas.height = 480;
const context = canvas.getContext('2d');
// context.fillStyle = 'gray';
// context.fillRect(0, 0, 640, 480);
// console.log("game file loaded");
function drawShape(player) {
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
        // Draw your shape using its updated x, y, and other properties
        context.fillStyle = 'gray'; // Example fill style
        context.fillRect(player.x, player.y, 20, 20); // Example for a rectangle
    }

const players = {};
let player = null;
socket.on('connect', function() {
    player = new Player({x: Math.floor(Math.random() * canvas.width), y: Math.floor(Math.random() * canvas.height), score: 0, id: socket.id });
    players[socket.id] = player;
    // console.log(player);
    socket.emit('new player', player);
})
socket.on('state', function(serverPlayers) {
    // console.log('players', serverPlayers)
    Object.keys(serverPlayers).forEach(function(id) {
        if (players[id]) {
            players[id].x = serverPlayers[id].x;
            players[id].y = serverPlayers[id].y;
            players[id].score = serverPlayers[id].score;
        } else {
            players[id] = new Player(serverPlayers[id]);
        }
    
    });
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'gray';
    context.fillRect(0, 0, 640, 480);

    Object.keys(players).forEach(function(id) {
        const p = players[id];
        context.fillStyle = 'blue';
        context.fillRect(p.x, p.y, 20, 20);
        context.fillStyle = 'black';
        context.fillText(`Score: ${p.score}`, p.x, p.y - 10);
    });
})
    document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    console.log('keydown event\n\n' + 'key: ' + keyName);
    player.movePlayer(keyName, 5);
    // drawShape(player);
    socket.emit('move player', player);
    }, false);

socket.on('state-move', function(serverPlayers) {
    console.log('players moved');
    Object.keys(serverPlayers).forEach(function(id) {
        if (players[id]) {
            players[id].x = serverPlayers[id].x;
            players[id].y = serverPlayers[id].y;
            players[id].score = serverPlayers[id].score;
        } else {
            players[id] = new Player(serverPlayers[id]);
        }
    
    });
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'gray';
    context.fillRect(0, 0, 640, 480);

    Object.keys(players).forEach(function(id) {
        const p = players[id];
        context.fillStyle = 'blue';
        context.fillRect(p.x, p.y, 20, 20);
        context.fillStyle = 'black';
        context.fillText(`Score: ${p.score}`, p.x, p.y - 10);
    });
})
