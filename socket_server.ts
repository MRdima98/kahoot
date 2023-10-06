import { IncomingMessage } from "http"
import { WebSocket, Server } from "ws";
import query from "./public/database.json";
import { Player } from "@/custom_types";

class Game {
    players: Player[];

    constructor() {
        this.players = [];
    }

    addPlayer(client: WebSocket, name: string) {
        const isLogged = this.players.find((el) => el.client == client);
        if (isLogged) return; 

        const player: Player = { nick_name: name, score: 0, client: client };
        this.players.push(player);
    }

    removePlayer(client: WebSocket) {
        this.players = this.players.filter((el) => el.client != client);
    }

    updateScore(points: number, client: WebSocket) {
        const player = this.players.find((el) => el.client == client);
        if (player){
            player.score += points;
        }
    }

    getPlayerScore(client: WebSocket) {
        const player = this.players.find((el) => el.client == client);
        return player?.score;
    }

    printPlayer() {
        this.players.forEach( (p) => {
            console.log(p.nick_name);
            console.log(p.score);
        });
    }
}

const wss = new WebSocket.Server({ port: 8080 });
let master: WebSocket | null = null;
let questionCount = 0;
let [current_question, questions] = Object.entries(query)[questionCount];
const game = new Game();

// wss.on("connection", (ws: WebSocket) => {
//     console.log("Client connected");
//     ws.send(JSON.stringify(questions), { binary: false });

//     getPlayersCount();

//     ws.on("message", (message: string) => {
//         const msg = JSON.parse(message);
//         console.log(`Received: ${message}`);
//         if (msg.master) {
//             master = ws;
//             getPlayersCount();
//         }
//         wss.clients.forEach((client) => {
//             if (client !== ws && client.readyState === WebSocket.OPEN) {
//                 if (msg.question || msg.player) {
//                     client.send(message, { binary: false });
//                 }
//             }
//         });
//         if (msg.answered && Object.keys(query).length - 1 != questionCount) {
//             [current_question, questions] = Object.entries(query)[++questionCount];
//             wss.clients.forEach((client) => {
//                 client.send(JSON.stringify(questions), { binary: false });
//             });
//         }
//         if (msg.correct){
//             game.updateScore(100, ws);
//             sendMessage( { score: game.getPlayerScore(ws) }, ws);
//         } 
//     });

//     ws.on("close", () => {
//         getPlayersCount();
//         if (ws == master) {
//             questionCount = 0;
//             [current_question, questions] = Object.entries(query)[questionCount];
//             wss.clients.forEach((client) => {
//                 client.send(JSON.stringify(questions), { binary: false });
//             });
//         }
//         game.removePlayer(ws);
//     });

// });


function sendMessage(message: Object, ws: WebSocket) {
    ws.send(JSON.stringify(message), { binary: false });
}

class MyDispatcher {
    master: WebSocket | null;
    wss: Server<typeof WebSocket, typeof IncomingMessage> = new WebSocket.Server({ port: 8080 });

    constructor() {
        this.dispatchClients();
        this.master = null;
    }

    dispatchClients() {
        this.wss.on("connection", (ws: WebSocket, req: Request) => { 
            ws.send(JSON.stringify(questions), { binary: false });

            if (req.url == "/master") {
                this.setMaster(ws);
            } else {
                this.addPlayer(ws, req.url);
            }
            this.getPlayersCount();

            ws.on("close", () => {
                game.removePlayer(ws);
                this.getPlayersCount();
            })
        });
    }

    setMaster(ws: WebSocket) {
        this.master = ws;
        this.getPlayersCount();
    }

    addPlayer(ws: WebSocket, name: string) {
        name = name.slice(1);
        console.log(name);
        game.addPlayer(ws, name);

        ws.on("message", (message: string) => {
            const msg = JSON.parse(message);
            if (msg.correct) {
                game.updateScore(100, ws);
            } 
            sendMessage( { score: game.getPlayerScore(ws) }, ws);
        })
    }

    broadcast_message(questions: any) {
        this.wss.clients.forEach((client) => {
            client.send(JSON.stringify(questions), { binary: false });
        });
    }

    getPlayersCount() {
        let players_count = this.wss.clients.size - 1;
        if (players_count < 0) players_count = 0; 

        this.master?.send(JSON.stringify({ player_count: players_count }), {
            binary: false,
        });
    }
}

const dispatcher = new MyDispatcher();

console.log("WebSocket server started on port 8080");
