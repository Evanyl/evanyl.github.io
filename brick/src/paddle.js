export default class Paddle {
	constructor(game) {
		this.image = new Image();
		this.image.src = `./assets/images/paddle.png`;
		this.width = 140;
		this.height = 15;

		this.game = game;

		this.maxSpeed = 1500;
		this.speed = 0;

		this.position = {x: game.gameWidth / 2 - this.width / 2, y: 570};
	}

	draw(ctx) {
		//ctx.fillStyle = "#043d80";
		//ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
		ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
	}

	update(deltaTime) {
		this.position.x += this.speed * (deltaTime / 1000);
		// Check wall collisions
		if (this.position.x > this.game.gameWidth - this.width) this.position.x = this.game.gameWidth - this.width;
		if (this.position.x < 0) this.position.x = 0;
	}

	// Movement
	moveLeft() {
		this.speed = -this.maxSpeed;
	}

	moveRight() {
		this.speed = this.maxSpeed;
	}

}
