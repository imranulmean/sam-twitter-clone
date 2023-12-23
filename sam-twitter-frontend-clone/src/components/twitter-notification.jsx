import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";

const TwitterNotification = () => {
  const [webSocket, setWebSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]); 
  const { currentUser } = useSelector((state) => state.user);
  
  useEffect(() => {
    // Create a WebSocket connection when the component mounts
    const url = `wss://51czt4rjh0.execute-api.us-east-1.amazonaws.com/production?extraData=${encodeURIComponent(JSON.stringify(currentUser))}`;
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('WebSocket connection opened');
      setReceivedMessages((prev)=>[...prev,'WebSocket connection opened'])
    };

    ws.onmessage = (event) => {
      const receivedMessage = event.data;
      setReceivedMessages((prev)=> [...prev,receivedMessage]);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setReceivedMessages((prev)=>[...prev, 'WebSocket connection closed']);
      ws.onopen = () => {
        console.log('WebSocket connection opened');
        setReceivedMessages((prev)=>[...prev,'WebSocket connection opened'])
      };      
    };

    // Save the WebSocket instance in the state
    setWebSocket(ws);

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []); // The empty dependency array ensures that this effect runs only once

 

  return (
    <>
    <h2>Notification Page</h2>
    
    <button className='bg-green-800 p-1 rounded-lg uppercase m-1' onClick={()=>setReceivedMessages([])} >Clear Notification</button>
      <ul>
        {receivedMessages.map((msg, index) => (
          <li key={index}>
            <Link to={`/tweet/${currentUser._id}/${msg}`}>Someone Liked your tweet {msg}</Link>
          </li>
        ))}
      </ul>    
    </>

  );
};

export default TwitterNotification;