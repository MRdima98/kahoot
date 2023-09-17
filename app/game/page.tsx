"use client";
import { useEffect, useState } from "react";
import { Quiz } from "@/custom_types";
let players_answers: number = 0;
let players_number: number = 0;

export default function Page() {
    const [question, setQuestion] = useState<Quiz | null>(null);
    const [counter, setCounter] = useState(0);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");

        socket.addEventListener("open", () => {
            console.log("WebSocket connection opened:");
            socket.send(JSON.stringify({ master: true }));
        });

        socket.addEventListener("message", (event: any) => {
            console.log(event.data);
            const json = JSON.parse(event.data);
            if (json) {
                if (json["player_count"]) {
                    setCounter(json["player_count"]);
                    players_number = json["player_count"];
                }
                if (json["player_answer"]) {
                    players_answers++;
                }
                if (json["question"]) {
                    setQuestion(json);
                }
            }
        });

        socket.addEventListener("close", () => {
            console.log("WebSocket connection closed:");
        });

        socket.addEventListener("error", () => {
            console.error("WebSocket error:");
        });

        setSocket(socket);
    }, []);

    return (
        <div>
            <div> {question?.question}</div>
            <div> {question?.answer1}</div>
            <div> {question?.answer2}</div>
            <div> {question?.answer3}</div>
            <div> {question?.answer4}</div>
            <span>{counter}</span>
        </div>
    );
}
