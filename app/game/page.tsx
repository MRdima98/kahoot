"use client";
import { useEffect, useState } from "react";
import { Quiz } from "@/custom_types";

export default function Page() {
    const [question, setQuestion] = useState<Quiz | null>(null);
    const [answers, setAnswers] = useState(0);
    const [players, setPlayers] = useState(0);
    const [readQuestion, setReadQuestion] = useState(true);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [timer, setTimer] = useState(5);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080/master");

        socket.addEventListener("open", () => {
            console.log("WebSocket connection opened:");
        });

        socket.addEventListener("message", (event: any) => {
            console.log(event.data);
            const json = JSON.parse(event.data);
            if (json["question"]) {
                setQuestion(json);
            }
            if (json["answered"]) {
                setAnswers(json["howMany"]);
            }
            if (json["score"] >= 0) {
                setReadQuestion(false);
                setTimeout( () => { setReadQuestion(true) }, 3000);
            }
            if (json.players_num) {
               setPlayers(json.players_num);
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

    useEffect( () => { 
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval( () => {
                setTimer( (timer) => (timer - 1));
            }, 1000);
        } else {
            socket?.send(JSON.stringify({ timeout: true }));
        }

        return () => clearInterval(interval);
    }, [timer]);

    useEffect( () => {
        setTimer(15);
    }, [question])

    return (
        <div>
            { readQuestion ? 
            (
            <div>
              <div> {question?.question}</div>
              <div> {question?.answer1}</div>
              <div> {question?.answer2}</div>
              <div> {question?.answer3}</div>
              <div> {question?.answer4}</div>
              <span>{ answers } </span> / <span>{ players }</span>
              <div> Stuff { timer } </div>
            </div>
            ): (
            <div> scoreboard </div>
            )
            }
        </div>
    );
}
