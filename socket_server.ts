import WebSocket from "ws";
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

wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected");
    ws.send(JSON.stringify(questions), { binary: false });
    game.addPlayer(ws, "jessica");

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
        if (msg.answered && Object.keys(query).length - 1 != questionCount) {
            [current_question, questions] = Object.entries(query)[++questionCount];
            wss.clients.forEach((client) => {
                client.send(JSON.stringify(questions), { binary: false });
            });
        }
        if (msg.correct){
            game.updateScore(100, ws);
            sendMessage( { score: game.getPlayerScore(ws) }, ws);
        } 
    });

    ws.on("close", () => {
        getPlayersCount();
        if (ws == master) {
            questionCount = 0;
            [current_question, questions] = Object.entries(query)[questionCount];
            wss.clients.forEach((client) => {
                client.send(JSON.stringify(questions), { binary: false });
            });
        }
        game.removePlayer(ws);
    });

});

function getPlayersCount(): void {
    if (!master) return;
    master.send(JSON.stringify({ player_count: wss.clients.size - 1 }), {
        binary: false,
    });
}

function sendMessage(message: Object, ws: WebSocket) {
    ws.send(JSON.stringify(message), { binary: false });
}
console.log("WebSocket server started on port 8080");


