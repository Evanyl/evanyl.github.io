const GAMESTATE = {
	PAUSED: 0,
	RUNNING: 1,
	BUILDLEVEL: 2,
	MENU: 3,
	GAMEOVER: 4
}

export default class InputHandler {
	constructor(game, htmlObject) {
		document.addEventListener("keydown", event => {
			// alert(event.keyCode);
			switch(event.keyCode) {
				case 37:
					if (game.gameState === GAMESTATE.RUNNING) {
						game.starting();
						game.paddle.moveLeft();
					}
					break;
				case 39:
					if (game.gameState === GAMESTATE.RUNNING) {
						game.starting();
						game.paddle.moveRight();
					}
					break;

				case 32:
					if (game.gameState === GAMESTATE.MENU) {
						game.reset();
					}
					break;

				case 27:
					game.togglePause();
					break;
					
				default:
					break;
			}
		});

		document.addEventListener("keyup", event => {
			switch(event.keyCode) {
				case 37:
					if (game.paddle.speed < 0) game.paddle.speed = 0;
					break;
				case 39:
					if (game.paddle.speed > 0) game.paddle.speed = 0;
					break;
				default:
					break;
			}
		});

		htmlObject.addEventListener('touchstart', (e) => {
			if (game.gameState === GAMESTATE.MENU) {
				game.reset();
				game.gameState = GAMESTATE.RUNNING;
			}
			if(e.touches[e.touches.length -1].clientX < 400) {
				if (game.gameState === GAMESTATE.RUNNING) {
					game.starting();
					game.paddle.moveLeft();
				}
			} else if (e.touches[e.touches.length -1].clientX > 600) {
				if (game.gameState === GAMESTATE.RUNNING) {
					game.starting();
					game.paddle.moveRight();
				}
			}
		});

		htmlObject.addEventListener('touchend', (e) => {
			if (e.touches.length === 0) game.paddle.speed = 0;
		});


	}
}