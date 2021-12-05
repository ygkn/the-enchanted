import ReactDOM from "react-dom";
import { WorkSwitcher } from "./component/WorkSwitcher";

const socket = new WebSocket(`wss://the-enchanted-server.herokuapp.com`);

function getTanDeg(deg: number) {
  return Math.tan((deg * Math.PI) / 180);
}

window.deviceCoords = { x: 0, y: 0 };

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

  console.log(jsonObject);

  if (jsonObject.type === "orientation") {
    window.deviceCoords = {
      x: -4 * getTanDeg(jsonObject.payload.alpha),
      y: 4 * getTanDeg(jsonObject.payload.beta),
    };
  }
});

ReactDOM.render(<WorkSwitcher />, document.getElementById("root"));
