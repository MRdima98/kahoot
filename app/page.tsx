"use client"
import { useEffect, useState } from "react";

export default function Home(){
  const [message, setMessage] = useState('message');
  const [isMessageSent, setMessageSent] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
      const sock = new WebSocket('ws://localhost:8080');

      sock.addEventListener('open', () => {
          console.log('WebSocket connection opened:');
      });

      sock.addEventListener('message', (event: any) => {
          console.log('Received message:', event.data);
            if (event.data === "bruh"){
              alert('gotem');
            }
          });

      sock.addEventListener('close', () => {
          console.log('WebSocket connection closed:');
          });

      sock.addEventListener('error', () => {
          console.error('WebSocket error:');
          });

      setSocket(sock);

      return () => {
        sock.close()
      };
  }, []);

  useEffect(() => {
        console.log("clicled");
        if (socket && !isMessageSent){
          socket.send(message);
        }
        setMessageSent(true);
  }, [message]);

  const messageHandler = (msg: string) => {
    setMessage(msg);
    setMessageSent(false);
  };

  return (
      <div>
      Domanda 
      <div onClick={ () => messageHandler('giacomo') }>opzione 1</div>
      <div>opzione 2</div>
      <div>opzione 3</div>
      <div>opzione 4</div>
      </div>
      )
}

