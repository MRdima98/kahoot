"use client"
import { useEffect, useState } from "react";
let socket: WebSocket;

export default function Home(){
  const [gotem, setGotem] = useState<Function>();
  useEffect(() => {
      socket = new WebSocket('ws://localhost:8080');

      socket.addEventListener('open', () => {
          console.log('WebSocket connection opened:');
          socket.send('new_player');
          });

      socket.addEventListener('message', (event: any) => {
          console.log('Received message:', event.data);
          if (event.data === "bruh"){
          alert('gotem');
          }
          });
      socket.addEventListener('close', () => {
          console.log('WebSocket connection closed:');
          });

      socket.addEventListener('error', () => {
          console.error('WebSocket error:');
          });

      return () => {
        socket.removeEventListener('message', socket);
        socket.removeEventListener('open', socket);
        socket.removeEventListener('close', socket);
        socket.removeEventListener('error', socket);
        // socket.close();
      }
  });

  useEffect(() => {
    setGotem( function(msg) {
      if (socket) socket.send(msg);
    })
  });

  return (
      <div>
      Domanda 
      <div onClick={ () => gotem('giacomo') }>opzione 1</div>
      <div>opzione 2</div>
      <div>opzione 3</div>
      <div>opzione 4</div>
      </div>
      )
}

