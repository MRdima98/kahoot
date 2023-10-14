"use client";
import { useEffect, useState } from "react";
import { Player, Quiz } from "@/custom_types";

export default function Page() {
    const [question, setQuestion] = useState<Quiz | null>(null);
    const [answers, setAnswers] = useState(0);
    const [players, setPlayers] = useState(0);
    const [readQuestion, setReadQuestion] = useState(true);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [timer, setTimer] = useState(5);
    const [scoreboard, setScoreboard] = useState<Array<Player>>([]);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080/master");

        socket.addEventListener("open", () => {
            console.log("WebSocket connection opened:");
        });

        socket.addEventListener("message", (event: any) => {
            const json = JSON.parse(event.data);
            if (json["question"]) {
                setQuestion(json);
                console.log(json.question.picture_path);
            }
            if (json["answered"]) {
                setAnswers(json["howMany"]);
            }
            if (json.players_num) {
                setPlayers(json.players_num);
            }
            if (json.scoreboard) {
                setReadQuestion(false);

                setTimeout(() => {
                    setReadQuestion(true);
                    socket?.send(JSON.stringify({ reset: true }));
                }, 3000);
                setScoreboard(json.scoreboard);
                console.log(json.scoreboard);
                console.log(scoreboard);
            }
            if (json.last) {
                setReadQuestion(false);
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

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((timer) => timer - 1);
            }, 1000);
        } else {
            socket?.send(JSON.stringify({ timeout: true }));
        }

        return () => clearInterval(interval);
    }, [timer]);

    useEffect(() => {
        setTimer(60);
    }, [question]);

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="bg-gray-200 p-6 w-4/5 h-4/5 text-4xl">
                {readQuestion ? (
                    <div className="flex flex-col justify-between items-center w-full h-full">
                        <div
                            className="flex justify-center items-center font-bold p-4 bg-blue-200 w-full
                              py-8
              "
                        >
                            {question?.question}
                        </div>
                        <div className="flex justify-around items-center w-full">
                            <div className="flex flex-col justify-center items-center">
                                <span>{answers}</span>
                                <span>Risposte</span>
                            </div>
                            <img
                                className="p-4"
                                src={question?.path}
                                width={200}
                                height={200}
                            />
                            <div className="w-16 h-16 bg-red-500 rounded-full flex justify-center items-center ">
                                {timer}
                            </div>
                        </div>
                        <div className="flex gap-2 w-full justify-around">
                            <div className="bg-kahootRed w-full h-full flex justify-center gap-5 py-8">
                                <img src="svgs/1.svg" width={40} height={40} />
                                {question?.answer1}
                            </div>
                            <div className="bg-kahootBlue w-full flex justify-center py-8 gap-5">
                                <img src="svgs/2.svg" width={40} height={40} />
                                {question?.answer2}
                            </div>
                        </div>
                        <div className="flex gap-2 w-full justify-around">
                            <div className="bg-kahootGreen w-full h-full flex justify-center py-8 gap-5">
                                <img src="svgs/3.svg" width={40} height={40} />
                                {question?.answer3}
                            </div>
                            <div className="bg-kahootYellow w-full flex justify-center py-8 gap-5">
                                <img src="svgs/4.svg" width={40} height={40} />
                                {question?.answer4}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center ">
                        <div className="flex flex-col bg-blue-400 w-full">
                            <div className="text-5xl font-bold">
                                scoreboard
                            </div>
                            { scoreboard?.map((player) => (
                                <div key={player.nick_name} className="bg-yellow-300 w-full">
                                    {player.nick_name} {player.score}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
