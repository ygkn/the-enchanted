import { certificateFor } from "devcert";
import { createServer } from "http";
import { createServer as createServerTLS } from "https";
import { WebSocket, WebSocketServer } from "ws";
import express from "express";
import { nanoid } from "nanoid";

const PORT = parseInt(process.env.PORT ?? "8080");
const HOST = process.env.HOST ?? "0.0.0.0";

const main = async () => {
  const listeners = new Set<WebSocket>();
  const clientIds = new Map<WebSocket, string>();

  const app = express();

  app.get("/", (_, res) => res.send("hello"));

  const server =
    process.env.NODE_ENV === "production"
      ? createServer(app)
      : createServerTLS(await certificateFor("localhost"), app);

  const wss = new WebSocketServer({ server });

  wss.on("error", console.log);

  wss.on("connection", function (client: WebSocket) {
    clientIds.set(client, nanoid());

    client.on("message", function (message: string) {
      const obj = JSON.parse(message);

      if (typeof obj.type === "string" && obj.type === "listen") {
        listeners.add(client);
      }

      if (typeof obj.type === "string" && obj.type === "broadcast") {
        for (const listener of listeners) {
          listener.send(
            JSON.stringify({
              ...obj,
              uid: clientIds.get(client),
              type: "orientation",
            })
          );
        }
      }
    });

    client.on("close", () => {
      listeners.delete(client);
      for (const listener of listeners) {
        listener.send(
          JSON.stringify({
            uid: clientIds.get(client),
            type: "disconnect",
          })
        );
      }
    });
  });

  server.listen(PORT, HOST, () => {
    console.log(`listening on ${HOST}:${PORT}...`);
  });
};

main();
