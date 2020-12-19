let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");

let lastTime = 0;
const loop = timestamp => {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fill();

  requestAnimationFrame(loop);
};

requestAnimationFrame(loop);