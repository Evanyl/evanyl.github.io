import Game from "./game.js";

// Grabbing and initializing drawable canvas from index.html
let ctx = document.getElementById("gameScreen").getContext("2d");

// Game size
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

// Init game
let game = new Game(GAME_WIDTH, GAME_HEIGHT);

// Game Loop Begins
let lastTime = 0;
const gameLoop = timestamp => {
	let deltaTime = timestamp - lastTime;
	lastTime = timestamp;

	// Draw objects
	game.draw(ctx);
	
	// Update
	game.update(deltaTime);


	requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);