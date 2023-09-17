"use client";
import { useEffect, useRef, useState } from "react";
import { Quiz, Cool_message } from "@/custom_types";

export default function Home() {
    const [message, setMessage] = useState("message");
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [question, setQuestion] = useState<Quiz | null>(null);
    const ref1 = useRef<HTMLDivElement>(null);
    const ref2 = useRef<HTMLDivElement>(null);
    const ref3 = useRef<HTMLDivElement>(null);
    const ref4 = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const sock = new WebSocket("ws://localhost:8080");

        sock.addEventListener("open", () => {
            console.log("WebSocket connection opened:");
        });

        sock.addEventListener("message", (event: any) => {
            console.log("Received message:", event.data);
            const json = JSON.parse(event.data);
            if (json) {
                if (json["question"]) {
                    setQuestion(json);
                }
            }
        });

        sock.addEventListener("close", () => {
            console.log("WebSocket connection closed:");
        });

        sock.addEventListener("error", () => {
            console.error("WebSocket error:");
        });

        setSocket(sock);

        return () => {
            sock.close();
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.send(JSON.stringify({ answered: true }));
        }
    }, [message]);

    const messageHandler = (cool_message: Cool_message) => {
        if (cool_message.msg) {
            setMessage(cool_message.msg);
        }
        if (cool_message.msg && cool_message.msg == question?.correct) {
            if (cool_message.ref.current) {
                cool_message.ref.current.style.backgroundColor = "green";
            }
        } else {
            if (cool_message.ref.current) {
                cool_message.ref.current.style.backgroundColor = "red";
            }
        }
        if (cool_message.ref.current) {
            const isCorrect = cool_message.msg === question?.correct;
            const color = isCorrect ? "green" : "red";
            cool_message.ref.current.style.background = color;
        }
    };

    return (
        <div>
            <div
                ref={ref1}
                onClick={() =>
                    messageHandler({ msg: question?.answer1, ref: ref1 })
                }
            >
                {" "}
                {question?.answer1}
            </div>
            <div
                ref={ref2}
                onClick={() =>
                    messageHandler({ msg: question?.answer2, ref: ref2 })
                }
            >
                {" "}
                {question?.answer2}
            </div>
            <div
                ref={ref3}
                onClick={() =>
                    messageHandler({ msg: question?.answer3, ref: ref3 })
                }
            >
                {" "}
                {question?.answer3}
            </div>
            <div
                ref={ref4}
                onClick={() =>
                    messageHandler({ msg: question?.answer4, ref: ref4 })
                }
            >
                {" "}
                {question?.answer4}
            </div>
        </div>
    );
}
