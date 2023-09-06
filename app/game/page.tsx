"use client" 

function Home(){
  const socket = new WebSocket('ws://localhost:8080');

  socket.addEventListener('open', (event) => {
      console.log('WebSocket connection opened:');
      });

  socket.addEventListener('message', (event) => {
      console.log('Received message:', event.data);
      });

  socket.addEventListener('close', (event) => {
      console.log('WebSocket connection closed:');
      });

  socket.addEventListener('error', (event) => {
      console.error('WebSocket error:');
      });

  const gotem = (msg: string) => {
    socket.send(msg);
  }

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

export default Home;
