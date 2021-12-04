import { certificateFor } from "devcert";
import { createServer } from "http";
import { createServer as createServerTLS } from "https";
import { WebSocket, WebSocketServer } from "ws";

const main = async () => {
  const listeners = new Set<WebSocket>();

  const server =
    process.env.NODE_ENV === "production"
      ? createServer()
      : createServerTLS(await certificateFor("localhost"));

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

  server.listen(
    parseInt(process.env.PORT ?? "8080"),
    process.env.HOST ?? "0.0.0.0"
  );
};

main();
