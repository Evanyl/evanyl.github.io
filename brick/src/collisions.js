export function checkCollision(ball, gameObject) {
	let bottomOfBall = ball.position.y + ball.size;
	let topOfBall = ball.position.y;
	let leftOfBall = ball.position.x;
	let rightOfBall = ball.position.x + ball.size;

	let topOfObject = gameObject.position.y;
	let bottomOfObject = gameObject.position.y + gameObject.height;
	let leftOfObject = gameObject.position.x;
	let rightOfObject = gameObject.position.x + gameObject.width;

	if (rightOfBall >= leftOfObject &&
		leftOfBall <= rightOfObject &&
		bottomOfBall >= topOfObject &&
		topOfBall <= bottomOfObject) {

		return true;
	} else {
		return false;
	}
}