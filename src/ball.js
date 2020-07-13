import {checkCollision} from "./collisions.js";

const STARTINGPOSITION = {x:300, y:500};
const STARTINGSPEED = {x: 200, y: -300};

export default class Ball {
	constructor(game) {
		this.image = new Image();
		this.image.src = "../assets/images/ball.png";
		this.position = {};
		this.speed = {};
		Object.assign(this.position, STARTINGPOSITION);
		Object.assign(this.speed, STARTINGSPEED);
		this.baseSpeed = 300;
		this.maxSpeedFluctuation = 200;

		this.game = game;

		this.ballDelete = false;

		this.size = 15;
	}

	draw(ctx) {
		ctx.drawImage(this.image, this.position.x, this.position.y, this.size, this.size);
	}

	setStartingSpeed(x) {
		Object.assign(this.speed, STARTINGSPEED);
		this.speed.x += x;
	}


	newSpeed() {
		if (Math.random() < 0.8) {
			this.changeDirection = Math.sign(this.speed.x);
			this.speedFluctuation = this.maxSpeedFluctuation;
		} else {
			this.changeDirection = -Math.sign(this.speed.x);
			this.speedFluctuation = this.maxSpeedFluctuation * 0.3;
		}

		this.speed.x = this.changeDirection * this.baseSpeed + this.changeDirection * Math.floor(Math.random() * this.speedFluctuation - this.maxSpeedFluctuation / 2);
		this.speed.y = -this.speed.y;
	}

	update(deltaTime) {
		// Add distance traveled
		this.position.x += this.speed.x * (deltaTime / 1000);
		this.position.y += this.speed.y * (deltaTime / 1000);

		// Check wall collisions
		this.checkWallCollisions();

		// Loop through all game objects
		this.checkAllGameObjects();
	}

	checkWallCollisions() {
		if (this.position.x < 0) {
			this.position.x = 0;
			this.speed.x = -this.speed.x;
		} else if (this.position.x > this.game.gameWidth - this.size) {
			this.position.x = this.game.gameWidth - this.size;
			this.speed.x = -this.speed.x;
		}
		if (this.position.y < 0) {
			this.position.y = 0;
			this.speed.y = -this.speed.y;
		} else if (this.position.y > this.game.gameHeight - this.size) {
			// THIS IS GAME OVER
			this.ballDelete = true;
		}
	}

	checkAllGameObjects() {
		let object;
		for (object of this.game.gameObjects) {
			// Branch where object is a brick
			if (object.delete !== undefined) {
				if (checkCollision(this, object)) {
					object.delete = true;
					this.speed.y = - this.speed.y;
				}
			}

			// Branch where object is a paddle
			if (object.maxSpeed !== undefined) {
				if (checkCollision(this, object)) {
					this.position.y = object.position.y - this.size;
					this.newSpeed();
				}
			}
		}
	}
}