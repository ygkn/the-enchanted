import { Vector2 } from "three";

const deviceCoords: Vector2 = new Vector2();

const mousePosition: Vector2 = new Vector2();
const windowSize: Vector2 = new Vector2(window.innerWidth, window.innerHeight);
const mouseCoords: Vector2 = new Vector2();

const searchParams = new URLSearchParams(location.search);

const useMouse = searchParams.get("mouse") === "true";
const useDevServer = searchParams.get("dev-server") === "true";

const updateMouseCoords = () => {
  mouseCoords.set(
    mousePosition.x / windowSize.x - 0.5,
    -1 * (mousePosition.y / windowSize.y - 0.5)
  );
};

type Orientation = {
  alpha: number;
  beta: number;
  gamma: number;
};

type MessageObject =
  | {
      type: "orientation";
      uid: string;
      payload: Orientation;
    }
  | {
      type: "disconnect";
      uid: string;
    };

export const getWorldPointerPosition = (depth: number): Vector2 => {
  const position = new Vector2();
  position.copy(useMouse ? mouseCoords : deviceCoords);

  position.x *= depth;
  position.y *= depth;

  return position;
};

function getTanDeg(deg: number) {
  return Math.tan((deg * Math.PI) / 180);
}

export const listen = () => {
  const socket = new WebSocket(
    useDevServer
      ? `wss://${location.hostname}:8080`
      : `wss://the-enchanted-server.herokuapp.com`
  );

  socket.addEventListener("open", function () {
    console.log("connect");
    socket.send(
      JSON.stringify({
        type: "listen",
      })
    );
  });

  socket.addEventListener("message", async (event) => {
    const text =
      typeof event.data === "string" ? event.data : await event.data.text();
    const jsonObject: MessageObject = JSON.parse(text);

    if (jsonObject.type === "orientation") {
      deviceCoords.x = getTanDeg(jsonObject.payload.alpha) / -2;
      deviceCoords.y = getTanDeg(jsonObject.payload.beta) / 2;
    }
  });

  setInterval(() => {
    if (socket.readyState !== WebSocket.OPEN) {
      return;
    }
    socket.send(JSON.stringify({ type: "ping" }));
  }, 1000);

  document.addEventListener(
    "mousemove",
    (event) => {
      mousePosition.set(event.clientX, event.clientY);

      updateMouseCoords();
    },
    { passive: true }
  );

  document.addEventListener(
    "resize",
    () => {
      windowSize.set(window.innerWidth, window.innerHeight);

      updateMouseCoords();
    },
    { passive: true }
  );

  console.log("listen");
};
