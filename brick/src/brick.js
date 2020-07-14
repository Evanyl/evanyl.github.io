export default class Brick {
	constructor(position) {
		this.image = new Image();
		this.image.src = `./assets/images/brick${Math.floor((Math.random() * 3) + 1)}.png`;
		this.width = 80;
		this.height = 20;
		this.position = {x: position.x, y: position.y};

		this.delete = false;
	}

	draw(ctx) {
		ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
	}

	update(deltaTime, game) {
		// Empty
	}

}
