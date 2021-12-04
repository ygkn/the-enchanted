import { requestPermission } from "./permission";

type Orientation = {
  alpha: number;
  beta: number;
  gamma: number;
};

const socket = new WebSocket(`wss://the-enchanted-server.herokuapp.com`);

const orientationKey = ["alpha", "beta", "gamma"] as const;

console.log(orientationKey);

socket.addEventListener("open", function () {
  console.log("connect");
});

function getTanDeg(deg: number) {
  return Math.tan((deg * Math.PI) / 180);
}

const position = document.querySelector<HTMLElement>(".position")!;
const startButton = document.querySelector<HTMLButtonElement>(".start-button")!;

let listening = false;

let positionZeroAlpha: number | null = null;

startButton.addEventListener("click", async () => {
  positionZeroAlpha = null;

  if (!listening) {
    await requestPermission();
    window.addEventListener("deviceorientation", (event) => {
      if (positionZeroAlpha === null) {
        positionZeroAlpha = event.alpha;
      }

      const serializedOrientation: Orientation = {
        alpha: event.alpha! - positionZeroAlpha!,
        beta: event.beta!,
        gamma: event.gamma!,
      };

      position.innerText = `(${
        -1 * getTanDeg(event.alpha! - positionZeroAlpha!)
      },${getTanDeg(event.beta!)})`;

      socket.send(
        JSON.stringify({
          type: "broadcast",
          payload: serializedOrientation,
        })
      );
    });
  }
});
