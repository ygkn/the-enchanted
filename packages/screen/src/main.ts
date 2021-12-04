const socket = new WebSocket(`wss://the-enchanted-server.herokuapp.com`);

type Orientation = {
  alpha: number;
  beta: number;
  gamma: number;
};

let deviceOrientation: Orientation = { alpha: 0, beta: 0, gamma: 0 };

socket.addEventListener("open", function () {
  console.log("connect");
  socket.send(
    JSON.stringify({
      type: "listen",
    })
  );
});

socket.addEventListener("message", async function (event) {
  deviceOrientation = JSON.parse(await event.data.text()).payload;
  //console.log(deviceOrientation);
});

const canvas = document.querySelector<HTMLCanvasElement>(".canvas")!;
const ctx = canvas.getContext("2d")!;
ctx.fillStyle = "#000";
ctx.fillRect(0, 0, 1000, 1000);

function getTanDeg(deg: number) {
  return Math.tan((deg * Math.PI) / 180);
}

ctx.fillStyle = "#000";
ctx.fillRect(0, 0, 1000, 1000);

const update = () => {
  const x = -500 * getTanDeg(deviceOrientation.alpha);
  const y = -500 * getTanDeg(deviceOrientation.beta);
  console.log(x, y);

  ctx.fillStyle = "rgb(0 0 0 / 10%)";
  ctx.fillRect(0, 0, 1000, 1000);

  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.ellipse(x + 500, y + 500, 10, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  requestAnimationFrame(update);
};

update();
