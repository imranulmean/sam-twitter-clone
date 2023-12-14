import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

const TwitterNotification = () => {
  const [webSocket, setWebSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);

  const { currentUser } = useSelector((state) => state.user);
    
  useEffect(() => {
    // Create a WebSocket connection when the component mounts
    const url = `wss://51czt4rjh0.execute-api.us-east-1.amazonaws.com/production?extraData=${encodeURIComponent(JSON.stringify(currentUser))}`;    
    const ws = new WebSocket(url);

    // Set up event listeners for the WebSocket
    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      const receivedMessage = event.data;
      console.log(receivedMessage)
      setReceivedMessages((prev)=> [...prev,receivedMessage]);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Save the WebSocket instance in the state
    setWebSocket(ws);

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []); // The empty dependency array ensures that this effect runs only once

  return (
    <ul>
    {receivedMessages.map((msg, index) => (
      <li key={index}>{msg}</li>
    ))}
  </ul>
  );
};

export default TwitterNotification;