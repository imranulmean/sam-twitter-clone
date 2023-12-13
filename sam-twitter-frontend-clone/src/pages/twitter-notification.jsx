import React, { useState, useEffect } from 'react';

const TwitterNotification = () => {
  const [webSocket, setWebSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);

  useEffect(() => {
    // Create a WebSocket connection when the component mounts
    const ws = new WebSocket('wss://iauhzffrq7.execute-api.us-east-1.amazonaws.com/dev');

    // Set up event listeners for the WebSocket
    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      setReceivedMessages((prevMessages) => [...prevMessages, receivedMessage]);
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

  const sendMessage = () => {
    alert("hello");
    if (webSocket && message.trim() !== '') {
      webSocket.send(JSON.stringify({ message }));
      setMessage('');
    }
  };

  return (
    <div>
      <ul>
        {receivedMessages.map((msg, index) => (
          <li key={index}>{msg.message}</li>
        ))}
      </ul>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};

export default TwitterNotification;