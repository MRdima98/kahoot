import WebSocket from "ws";

const wss = new WebSocket.Server({ port: 8080 });
let clients_count = 0;
const clients = {}
let master: WebSocket | null = null;

wss.on('connection', (ws: WebSocket) => {
  console.log("Client connected");

  ws.on('message', (message: string, isBinary) => {
    console.log(`Received: ${message}`);
    console.log(message);
    if (message.toString() === "master"){
      master = ws;
    }
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message, { binary: isBinary });
      }
    });
  });
  if (master && master != ws) {
    master.send("new_player");
  }

  ws.on('close', () => {
    console.log('Client disconnected');
    if (master && master != ws && wss.clients.size > 1) {
      master.send("player_gone");
    }
  });
});

console.log('WebSocket server started on port 8080');

