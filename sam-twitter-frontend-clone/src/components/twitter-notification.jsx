import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

const TwitterNotification = () => {
  const [webSocket, setWebSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]); 
  const { currentUser } = useSelector((state) => state.user);
  const [connected, setConnected]= useState(true);
  
  useEffect(() => {
    // Create a WebSocket connection when the component mounts
    const url = `wss://51czt4rjh0.execute-api.us-east-1.amazonaws.com/production?extraData=${encodeURIComponent(JSON.stringify(currentUser))}`;
    const ws = new WebSocket(url);

    // Set up event listeners for the WebSocket
    ws.onopen = () => {
      console.log('WebSocket connection opened');
      setReceivedMessages((prev)=>[...prev,'WebSocket connection opened'])
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const receivedMessage = event.data;
      console.log(receivedMessage)
      setReceivedMessages((prev)=> [...prev,receivedMessage]);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setReceivedMessages((prev)=>[...prev, 'WebSocket connection closed']);
      setConnected(false);
    };

    // Save the WebSocket instance in the state
    setWebSocket(ws);

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []); // The empty dependency array ensures that this effect runs only once


  const connectWebSocket = () => {
    const webSocketUrl = `wss://51czt4rjh0.execute-api.us-east-1.amazonaws.com/production?extraData=${encodeURIComponent(JSON.stringify(currentUser))}`;    
    const ws2 = new WebSocket(webSocketUrl);
    setWebSocket(ws2);

    ws2.onopen = () => {
      console.log('WebSocket connection opened');
      setReceivedMessages((prev)=>[...prev, 'WebSocket connection opened']);
      setConnected(true);
    };
  };
  const disconnectWebSocket = () => {
    if (webSocket) {
      webSocket.close();
      setWebSocket(null);
      setConnected(false);
    }
  };

  

  return (
    <>
    <h2>Notification Page</h2>
    {
      connected ? 
      <button className='bg-slate-500 p-1 rounded-lg uppercase m-1' onClick={disconnectWebSocket} >Disconnect Websocket</button>:
      <button type='button' className='bg-red-700 text-white p-1 rounded-lg uppercase m-1' onClick={connectWebSocket} >Connect Websocket</button>
    }
    
    
    <button className='bg-green-800 p-1 rounded-lg uppercase m-1' onClick={()=>setReceivedMessages([])} >Clear Notification</button>
      <ul>
        {receivedMessages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>    
    </>

  );
};

export default TwitterNotification;