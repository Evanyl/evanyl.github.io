export default class MultiplierHandler {
	constructor(game) {
		this.multiplierElement = document.getElementById("multiplier");
		this.game = game;
	}

	draw(ctx) {
		return;
	}

	update(deltaTime) {
		this.multiplierElement.innerHTML = `Multiplier: ${this.game.multiplier}x`;
	}
}