const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
let clients_count = 0;
const clients = {}
let master;

wss.on('connection', (ws) => {
  console.log("Client connected");
  const bruh = Array.from(wss.clients);
  console.log(bruh[0]);
  bruh[0].send("bithc");


  ws.on('message', (message, isBinary) => {
    console.log(`Received: ${message}`);
    if (message === 'master'){
      master = wss.clients[wss.clients.length -1];
    }
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message, { binary: isBinary });
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server started on port 8080');

