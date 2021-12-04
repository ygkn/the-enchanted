import {
  WebSocketClient,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.1.3/mod.ts";

const listeners: Set<WebSocketClient> = new Set();

const server = new WebSocketServer(8080);

server.on("error", console.log);

server.on("connection", function (client: WebSocketClient) {
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
