import Player from './Player.mjs';
// import Collectible from './Collectible.mjs';
// import Server from 'socket.io';

const socket = io();
const canvas = document.getElementById('game-window');
canvas.width = 640;
canvas.height = 480;
const context = canvas.getContext('2d');
// context.fillStyle = 'gray';
// context.fillRect(0, 0, 640, 480);
// console.log("game file loaded");


const players = {};
let player = null;
let rank = null;
let color = 'blue';
// let collectible = null;
// Store pressed keys
// const keys = {};
socket.on('connect', function () {
    player = new Player({ x: Math.floor(Math.random() * canvas.width), y: Math.floor(Math.random() * canvas.height), score: 0, id: socket.id });
    players[socket.id] = player;
    // console.log(player);
    socket.emit('new player', player);
})
socket.on('state', function (Serverstate) {
    // console.log('players', serverPlayers)
    Object.keys(Serverstate.players).forEach(function (id) {
        if (players[id]) {
            players[id].x = Serverstate.players[id].x;
            players[id].y = Serverstate.players[id].y;
            players[id].score = Serverstate.players[id].score;
            players[id].color = Serverstate.players[id].color;
        } else {
            players[id] = new Player(Serverstate.players[id]);
        }

    });
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'gray';
    context.fillRect(0, 0, 640, 480);

    Object.keys(players).forEach(function (id) {
        const p = players[id];
        color = p.color;
        context.fillStyle = color;
        context.fillRect(p.x, p.y, 20, 20);
        context.fillStyle = 'black';
        context.fillText(`Score: ${p.score}`, p.x, p.y - 10);
    });
    // collectible = Serverstate.collectible;
})
document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    // console.log('keydown event\n\n' + 'key: ' + keyName);
    player.movePlayer(keyName, 20);
    socket.emit('move player', player);
    //   if (!keys[event.key]) { // Only emit once per key press
    //     keys[event.key] = true;
    //     socket.emit('move player', { ...player, key: event.key });
    // }
}, false);
// document.addEventListener('keyup', (event) => {
//     keys[event.key] = false;
// });

socket.on('state-move', function (serverState) {
    // console.log('players moved');
    // console.log('players', serverState)
    Object.keys(serverState.players).forEach(function (id) {
        if (players[id]) {
            players[id].x = serverState.players[id].x;
            players[id].y = serverState.players[id].y;
            players[id].score = serverState.players[id].score;
        } else {
            players[id] = new Player(serverState[id]);
        }
        // collectible = serverState.collectible;
    });



    // console.log(serverState.collectible);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'gray';
    context.fillRect(0, 0, 640, 480);

    Object.keys(players).forEach(function (id) {
        const p = players[id];
        context.strokeStyle = 'blue'; // Set stroke color to blue
        context.lineWidth = 5;       // Set stroke thickness to 5 pixels
        context.fillStyle = color;
        context.strokeRect(p.x, p.y, 20, 20); // Draw the blue border
        context.fillRect(p.x, p.y, 20, 20);
        context.fillStyle = 'black';
        context.fillText(`Score: ${p.score}`, p.x, p.y - 10);
    });

    if (rank) {
        context.fillStyle = 'black';
        context.fillText(`${rank}`, canvas.width/2, 20); 
    }
    context.fillStyle = 'green';
    context.fillRect(serverState.collectible.x, serverState.collectible.y, 30, 30);

    if (player.collision(serverState.collectible)) {
        console.log('collision detected');
        player.x = serverState.players[player.id].x;
        player.y = serverState.players[player.id].y;
        if (!player.score) player.score = 0;
        player.score += serverState.collectible.value;
        socket.emit('collision', player);
    }
})

socket.on('rank', function (data) {
    // console.log('rank data', data);
    // console.log('players', data.players);
    data.forEach(p => {
        if (p.id === player.id) {
            rank = player.calculateRank(data);
        }
    })
    });

// Animation loop for smooth rendering
// function animate() {
//     context.clearRect(0, 0, canvas.width, canvas.height);
//     context.fillStyle = 'gray';
//     context.fillRect(0, 0, 640, 480);

//     // Draw all players
//     Object.keys(players).forEach(function (id) {
//         const p = players[id];
//         context.strokeStyle = 'blue';
//         context.lineWidth = 5;
//         context.fillStyle = p.color || color;
//         context.strokeRect(p.x, p.y, 20, 20);
//         context.fillRect(p.x, p.y, 20, 20);
//         context.fillStyle = 'black';
//         context.fillText(`Score: ${p.score}`, p.x, p.y - 10);
//     });

//     // Draw collectible
//     if (collectible) {
//         context.fillStyle = 'green';
//         context.fillRect(collectible.x, collectible.y, 30, 30);
//     }

//     // Draw rank
//     if (rank) {
//         context.fillStyle = 'black';
//         context.fillText(`${rank}`, canvas.width / 2, 20);
//     }

//     requestAnimationFrame(animate);
// }

// animate();