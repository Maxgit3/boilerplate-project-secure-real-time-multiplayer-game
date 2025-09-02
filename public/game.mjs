import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
canvas.width = 640;
canvas.height = 480;
const context = canvas.getContext('2d');
context.fillStyle = 'gray';
context.fillRect(0, 0, 640, 480);
console.log("game file loaded")


socket.on('connect', function() {
    console.log("player")
})