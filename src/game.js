import Paddle from "./paddle.js";
import InputHandler from "./input.js";
import Ball from "./ball.js";
import Score from "./score.js";
import MultiplierHandler from "./multiplier.js";
import LevelHandler, {levels} from "./levels.js";

const GAMESTATE = {
	PAUSED: 0,
	RUNNING: 1,
	BUILDLEVEL: 2,
	MENU: 3,
	GAMEOVER: 4
}

export default class Game {
	constructor(gameWidth, gameHeight) {
		// Set game screen size
		this.gameWidth = gameWidth;
		this.gameHeight = gameHeight;

		// Initialize game objects
		this.paddle = new Paddle(this);
		this.levelHandler = new LevelHandler();
		this.scoreboard = new Score(this);
		this.multiplierHandler = new MultiplierHandler(this);

		// Initialize game variables
		this.essentialObjects = [];
		this.gameObjects = [];
		this.bricks = [];
		this.levels = levels;

		// Initialize game info
		this.gameState = GAMESTATE.MENU;
		this.level = 0;
		this.pauseTime = 0;
		this.notStarted = true;

		// Init input handler
		new InputHandler(this, document.getElementById("htmlObject"));
	}

	reset() {
		this.score = 0;
		this.multiplier = 1;
		this.totalBricksDestroyed = 0;
		this.deadBalls = 0;
		this.ball = new Ball(this);
		this.essentialObjects = [this.paddle, this.scoreboard, this.multiplierHandler, this.ball];
		this.baseObjects = this.essentialObjects.length - 1;
		this.loadLevel(0);
	}

	starting() {
		if (this.notStarted) {
			this.returnBallArray();
			for (let item = 0; item < this.ballArray.length; item++) {
				this.ballArray[item].setStartingSpeed(20 * item);
			}
			this.notStarted = false;
		}	
	}

	returnBallArray() {
		this.ballArray = [];
		this.gameObjects.forEach(object => {
			if (object.ballDelete !== undefined) {
				this.ballArray.push(object);
			}
		});
	}

	countBalls() {
		this.ballCount = 0;
		this.gameObjects.forEach(object => {
			if (object.ballDelete !== undefined) {
				this.ballCount++;
			}
		});

		return this.ballCount;
	}

	multiBallCheck(bricksDestroyed) {
		this.totalBricksDestroyed += bricksDestroyed;
		this.multiplier = Math.floor(this.totalBricksDestroyed / 15 + 1);
		if (this.countBalls() < this.multiplier && (this.countBalls() + this.deadBalls) !== this.multiplier) {
			this.ball2 = new Ball(this);
			this.ball2.position = {x: 500, y: 300};
			this.ball2.speed = {x: 400, y: -400};
			this.gameObjects.push(this.ball2);
		}

	}

	loadLevel(increment) {
		this.gameState = GAMESTATE.BUILDLEVEL;
		this.level += increment;
		this.bricks = this.levelHandler.buildLevel(this.levels[this.level]);
		this.gameObjects = [...this.essentialObjects, ...this.bricks];
		this.notStarted = true;
		this.levels.push(this.levelHandler.randomLevelGenerator());
	}

	// Draw screen
	draw(ctx) {
		ctx.clearRect(0,0,this.gameWidth, this.gameHeight);
		this.gameObjects.forEach(object => object.draw(ctx));
		// Game Menu
		switch (this.gameState) {
			case GAMESTATE.MENU:
				ctx.rect(0,0, this.gameWidth, this.gameHeight);
				ctx.fillStyle = "rgba(0,0,0,1)";
				ctx.fill();

				ctx.font = "30px monospace";
				ctx.fillStyle = "white";
				ctx.textAlign = "center";
				ctx.fillText(
					"Press SPACEBAR or TAP SCREEN To Start",
					this.gameWidth / 2,
					this.gameHeight / 2
				);
				ctx.font = "24px monospace";
				ctx.fillText(
					"Press esc at any time to pause",
					this.gameWidth / 2,
					this.gameHeight / 2 + 30
				);
				break;

			case GAMESTATE.PAUSED:
				ctx.rect(0,0,this.gameWidth, this.gameHeight);
				ctx.fillStyle = "rgba(0,0,0,0.5)";
				ctx.fill();

				ctx.font = "30px, monospace";
				ctx.fillStyle = "white";
				ctx.textAlign = "center";
				ctx.fillText("PAUSED", this.gameWidth / 2, this.gameHeight / 2);
				break;

			case GAMESTATE.BUILDLEVEL:
				ctx.rect(0,0,this.gameWidth, this.gameHeight);
				ctx.fillStyle = "rgba(0,0,0,1)";
				ctx.fill();

				ctx.font = "30px, monospace";
				ctx.fillStyle = "white";
				ctx.textAlign = "center";
				ctx.fillText(`Level: ${this.level + 1}`, this.gameWidth / 2, this.gameHeight / 2);
				break;

		}
	}

	stopBall() {
		if (this.notStarted) {
			this.returnBallArray();
			for (let item = 0; item < this.ballArray.length; item++) {
				this.ballArray[item].speed = {x: 0, y:0};
				this.ballArray[item].position.x = this.paddle.position.x + (this.paddle.width / 2) - this.ballArray[item].size / 2;
				this.ballArray[item].position.y = this.paddle.position.y - this.ballArray[item].size;
			}
		}

	}

	// Update all game objects if game is running
	update(deltaTime) {
		switch (this.gameState) {
			// Only if game is running will update
			case GAMESTATE.RUNNING:

				this.stopBall();

				this.gameObjects.forEach(object => object.update(deltaTime));

				// Add bricks destroyed to score
				this.bricksDestroyed = this.gameObjects.length - this.gameObjects.filter(object => !object.delete).length;
				this.score += this.bricksDestroyed;

				this.multiBallCheck(this.bricksDestroyed);

				// Now filter out deleted bricks
				this.gameObjects = this.gameObjects.filter(object => !object.delete);

				// Add dead balls to total
				this.deadBalls += this.gameObjects.length - this.gameObjects.filter(object => !object.ballDelete).length;
				// Filter out deleted balls
				this.gameObjects = this.gameObjects.filter(object => !object.ballDelete);
				// Check if level is complete
				if (this.gameObjects.length === this.baseObjects + this.countBalls()) {
					this.loadLevel(1);
				}

				// Check if game over
				if (this.countBalls() === 0) {
					this.reset();
				}
				break;

			// Building level pause
			case GAMESTATE.BUILDLEVEL:
				this.pauseTime += deltaTime;
				if (this.pauseTime > 1500) {
					this.gameState = GAMESTATE.RUNNING;
					this.pauseTime = 0;
				}
				break;

			default:
				break;

		}
	}

	// Toggle pause
	togglePause() {
		if (this.gameState === GAMESTATE.RUNNING) {
			this.gameState = GAMESTATE.PAUSED;
		} else if (this.gameState === GAMESTATE.PAUSED) {
			this.gameState = GAMESTATE.RUNNING;
		}
	}

}
