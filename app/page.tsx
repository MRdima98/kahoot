"use client";
import { useState } from "react";

export default function Page() {
  const [counter, setCounter] = useState(0);

  const increase = () => {
    setCounter(count => count + 1);
  };

  const socket = new WebSocket('ws://localhost:8080');

  socket.addEventListener('open', (event) => {
      console.log('WebSocket connection opened:');
      });

  socket.addEventListener('message', (event) => {
      console.log('Received message:', event.data);
        if (event.data === 'giacomo') {
          increase();
          socket.send('risposta giusta');
          socket.close();
        }
      });

  socket.addEventListener('close', (event) => {
      console.log('WebSocket connection closed:');
      });

  socket.addEventListener('error', (event) => {
      console.error('WebSocket error:');
      });

  return(
      <div>
          <span>
              {counter}
          </span>
      </div>
      )

}
