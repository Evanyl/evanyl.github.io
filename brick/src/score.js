export default class Score {
	constructor(game) {
		this.scoreElement = document.getElementById("score");
		this.game = game;
	}

	draw(ctx) {
		return;
	}

	update(deltaTime, game) {
		this.scoreElement.innerHTML = this.game.score;
	}
}
