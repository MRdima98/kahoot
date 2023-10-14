"use client";
import { useEffect, useRef, useState } from "react";
import { Quiz, Cool_message } from "@/custom_types";

export default function Home() {
    const [message, setMessage] = useState("message");
    const [scoreboard, setScoreboard] = useState("0");
    const [getNickName, setNickNameGet] = useState(true);
    const [nickName, setNickName] = useState("");
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [question, setQuestion] = useState<Quiz | null>(null);
    const [clicked, setClicked] = useState(false);
    const ref1 = useRef<HTMLDivElement>(null);
    const ref2 = useRef<HTMLDivElement>(null);
    const ref3 = useRef<HTMLDivElement>(null);
    const ref4 = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!getNickName) {
            const sock = new WebSocket("ws://localhost:8080/" + nickName);

            sock.addEventListener("open", () => {
                console.log("WebSocket connection opened:");
            });

            sock.addEventListener("message", (event: any) => {
                const json = JSON.parse(event.data);
                if (json["question"]) {
                    setQuestion(json);
                }
                if (json.reset) {
                    if (ref1.current) ref1.current.style.backgroundColor = "";
                    if (ref2.current) ref2.current.style.backgroundColor = "";
                    if (ref3.current) ref3.current.style.backgroundColor = "";
                    if (ref4.current) ref4.current.style.backgroundColor = "";
                    setClicked(false);
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
        }
    }, [getNickName]);

    const messageHandler = (cool_message: Cool_message) => {
        if (cool_message.msg) {
            setMessage(cool_message.msg);
            if (cool_message.ref.current) {
                cool_message.ref.current.style.backgroundColor = "gray";
                setClicked(true);
            }
            console.log(cool_message.msg)
            console.log(question?.correct)
            if (cool_message.msg == question?.correct) {
                socket?.send(JSON.stringify({ correct: true }));
            }
            else {
                socket?.send(JSON.stringify({ correct: false }));
            }
        }
        // if (cool_message.msg && cool_message.msg == question?.correct) {
        //     if (cool_message.ref.current) {
        //         cool_message.ref.current.style.backgroundColor = "green";
        //         if (socket) {
        //             socket.send(JSON.stringify({ correct: true }));
        //         }
        //     }
        // } else {
        //     if (cool_message.ref.current) {
        //         cool_message.ref.current.style.backgroundColor = "red";
        //         if (socket) {
        //             socket.send(JSON.stringify({ correct: false }));
        //         }
        //     }
        // }
        // if (cool_message.ref.current) {
        //     const isCorrect = cool_message.msg === question?.correct;
        //     const color = isCorrect ? "green" : "red";
        //     cool_message.ref.current.style.background = color;
        // }
    };

    const onChangeHandler = (event: any) => {
        setNickName(event.target.value);
    };

    const submitValue = () => {
        setNickNameGet(false);
    };

    return (
        <div className="flex flex-col justify-center items-center h-96">
            {getNickName ? (
                <div className="flex flex-col gap-1 justify-center items-center h-full w-full">
                    <span> Kahoot per Saretta</span>
                    <span> Qual è il tuo nome? </span>
                    <input
                        type="text"
                        name="name"
                        onChange={onChangeHandler}
                        value={nickName}
                    />
                    <button className="bg-blue-800" onClick={submitValue}>
                        La accendiamo?
                    </button>
                </div>
            ) : (
                <div className="flex flex-col w-full gap-2">
                    <div className="flex justify-center items-center w-full gap-2">
                        <div
                            className="bg-kahootRed py-9 w-full h-full flex justify-center items-center"
                            ref={ref1}
                            onClick={
                                !clicked
                                    ? () =>
                                          messageHandler({
                                              msg: question?.answer1,
                                              ref: ref1,
                                          })
                                    : () => {}
                            }
                        >
                            <img src="svgs/1.svg" width={40} height={40} />
                        </div>

                        <div
                            className="bg-kahootBlue py-9 w-full h-full flex justify-center items-center"
                            ref={ref2}
                            onClick={
                                !clicked
                                    ? () =>
                                          messageHandler({
                                              msg: question?.answer2,
                                              ref: ref2,
                                          })
                                    : () => {}
                            }
                        >
                            <img src="svgs/2.svg" width={40} height={40} />
                        </div>
                    </div>
                    <div className="flex justify-center items-center w-full gap-2">
                        <div
                            className="bg-kahootGreen py-9 w-full h-full flex justify-center items-center"
                            ref={ref3}
                            onClick={
                              !clicked ? 
                              () =>
                                messageHandler({
                                    msg: question?.answer3,
                                    ref: ref3,
                                })
                                : () => {}
                            }
                        >
                            <img src="svgs/3.svg" width={40} height={40} />
                        </div>
                        <div
                            className="bg-kahootYellow py-9 w-full h-full flex justify-center items-center"
                            ref={ref4}
                            onClick={

                              !clicked ? 
                              () =>
                                messageHandler({
                                    msg: question?.answer4,
                                    ref: ref4,
                                })
                                : () => {}
                            }
                        >
                            <img src="svgs/4.svg" width={40} height={40} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
