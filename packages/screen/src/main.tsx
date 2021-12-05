import ReactDOM from "react-dom";
import { Vector2 } from "three";
import { WorkSwitcher } from "./component/WorkSwitcher";

const socket = new WebSocket(`wss://the-enchanted-server.herokuapp.com`);

function getTanDeg(deg: number) {
  return Math.tan((deg * Math.PI) / 180);
}

if (typeof window.isDebug === "undefined") {
  window.isDebug = false;
}

window.deviceCoords = new Vector2();

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
    window.deviceCoords.x = getTanDeg(jsonObject.payload.alpha) / -2;
    window.deviceCoords.y = getTanDeg(jsonObject.payload.beta) / 2;
  }
});

ReactDOM.render(<WorkSwitcher />, document.getElementById("root"));
