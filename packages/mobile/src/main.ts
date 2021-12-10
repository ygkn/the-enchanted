import { requestPermission } from "./permission";

type Orientation = {
  alpha: number;
  beta: number;
  gamma: number;
};

const searchParams = new URLSearchParams(location.search);
const useDevServer = searchParams.get("dev-server") === "true";

const socket = new WebSocket(
  useDevServer
    ? `wss://${location.hostname}:8080`
    : `wss://the-enchanted-server.herokuapp.com`
);

const orientationKey = ["alpha", "beta", "gamma"] as const;

console.log(orientationKey);

socket.addEventListener("open", function () {
  console.log("connect");
});

const startButton = document.querySelector<HTMLButtonElement>(".start-button")!;

let positionZeroAlpha: number | null = null;

startButton.addEventListener("click", async () => {
  positionZeroAlpha = null;

  await requestPermission();

  startButton.classList.add("started");

  window.addEventListener("deviceorientation", (event) => {
    if (positionZeroAlpha === null) {
      positionZeroAlpha = event.alpha;
    }

    const serializedOrientation: Orientation = {
      alpha: event.alpha! - positionZeroAlpha!,
      beta: event.beta!,
      gamma: event.gamma!,
    };

    socket.send(
      JSON.stringify({
        type: "broadcast",
        payload: serializedOrientation,
      })
    );
  });
});

setInterval(() => {
  socket.send(JSON.stringify({ type: "ping" }));
}, 1000);
