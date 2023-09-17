import WebSocket from "ws";
import query from "./public/database.json";
import { Quiz } from "@/custom_types";

const wss = new WebSocket.Server({ port: 8080 });
let master: WebSocket | null = null;
let questionCount = 0;
let [current_question, questions] = Object.entries(query)[questionCount];

wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected");

    ws.send(JSON.stringify(questions), {binary: false} );

    getPlayersCount();

    ws.on("message", (message: string) => {
        const msg = JSON.parse(message);
        console.log(`Received: ${message}`);
        if (msg.master) {
            master = ws;
            getPlayersCount();
        }
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                if (msg.question || msg.player) {
                    client.send(message, { binary: false });
                }
            }
        });
        if (msg.answered) {
          [current_question, questions] = Object.entries(query)[++questionCount];
          console.log(current_question);
          wss.clients.forEach((client) => {
            client.send(JSON.stringify(questions), {binary: false} );
          });
        }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      getPlayersCount();
      if (ws == master) questionCount = 0;
    });
});

function getPlayersCount(): void {
  if (!master) return;
  master.send(JSON.stringify({ player_count: wss.clients.size - 1 }), {
    binary: false,
  });
}
console.log("WebSocket server started on port 8080");
