import { WebSocketServer, WebSocket } from "ws";
import { certificateFor } from "devcert";
import { createServer } from "https";

const main = async () => {
  const listeners: Set<WebSocket> = new Set();

  const server = createServer(await certificateFor("localhost"));
  const wss = new WebSocketServer({ server });

  wss.on("error", console.log);

  wss.on("connection", function (client: WebSocket) {
    client.on("message", function (message: string) {
      const obj = JSON.parse(message);

      if (typeof obj.type === "string" && obj.type === "listen") {
        listeners.add(client);
      }

      if (typeof obj.type === "string" && obj.type === "broadcast") {
        for (const listener of listeners) {
          listener.send(message);
        }
      }
    });

    client.on("close", () => {
      listeners.delete(client);
    });
  });

  server.listen(8080);
};

main();
