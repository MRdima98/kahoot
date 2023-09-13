"use client";
import { useEffect, useState } from "react";
import { Quiz } from "@/custom_types";


export default function Page() {
    const [data, setData] = useState<Quiz>();
    const [counter, setCounter] = useState(0);

    useEffect(() => {
      fetch("/api/questions")
        .then((res) => res.json())
        .then((data) => {
          setData(data)
        })
    }, [])

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');

        socket.addEventListener('open', () => {
            console.log('WebSocket connection opened:');
            });

        socket.addEventListener('message', (event: any) => {
            if (event.data === "new_player"){
            setCounter(counter + 1);
            }
            if (event.data === "player_gone"){
            setCounter(counter - 1);
            }
            if (event.data === "giacomo"){
            socket.send("bruh")
            }
            });

        socket.addEventListener('close', () => {
            console.log('WebSocket connection closed:');
            });

        socket.addEventListener('error', () => {
            console.error('WebSocket error:');
            });

      return () => {
        socket.removeEventListener("message", socket);
        socket.removeEventListener('open', socket);
        socket.removeEventListener('close', socket);
        socket.removeEventListener('error', socket);
        // socket.close();
      }
    });


    return(
        <div>
            <div> { data?.question }</div>
            <div> { data?.answer1 }</div>
            <div> { data?.answer2 }</div>
            <div> { data?.answer3 }</div>
            <div> { data?.answer4 }</div>
            <span>
                {counter}
            </span>
        </div>
        )

}
