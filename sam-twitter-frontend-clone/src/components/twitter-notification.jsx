import useWebSocket from 'react-use-websocket';
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import Chatting from './chatting';

const TwitterNotification = ({connections, setfetchAgain , loading}) => {
  
  const [receivedMessages, setReceivedMessages] = useState([]); 
  const { currentUser } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const socketUrl = `wss://51czt4rjh0.execute-api.us-east-1.amazonaws.com/production?extraData=${encodeURIComponent(JSON.stringify(currentUser))}`;
  const { sendMessage, sendJsonMessage, lastMessage, lastJsonMessage, readyState, getWebSocket,} = 
  useWebSocket(socketUrl, {
    onOpen: () =>{
      console.log('opened');
    } , 
    onError: (event) => {
      console.error('WebSocket error:', event);
      // const errorMessage = event.message || 'Unknown WebSocket error';
      // console.log('Error Message:', errorMessage);
  },       
    shouldReconnect: (closeEvent) => true,
  });
  
  useEffect(() => {
    
    if(lastMessage){

      let parsedMessage=JSON.parse(lastMessage.data);
        if(!parsedMessage.type){
          let messsageArray=[];
          messsageArray.push(lastMessage.data);
          setReceivedMessages((prev)=>[...prev,messsageArray[0]]);          
        }
        else{
          setOpen(true);
        }
    }  
  }, [lastMessage]);
return (
    <>
    <h2>Notification Page</h2>
    <button onClick={()=>setOpen(true)} className='bg-red-800 p-1 rounded-lg uppercase m-1' > Open Messagebox </button>
    <button className='bg-green-800 p-1 rounded-lg uppercase m-1' onClick={()=>setReceivedMessages([])} >Clear Notification</button>
      <ul>
        {receivedMessages.map((msg, index) => (
          <li key={index}>
            <Link to={`/tweetPage/${currentUser._id}/${msg}`}>Someone Liked your tweet {msg}</Link>
            
          </li>
        ))}
      </ul>    
      { open && <Chatting setOpen={setOpen} connections={connections} setfetchAgain={setfetchAgain} sendMessage={sendMessage} 
                lastMessage={lastMessage} receivedMessages={receivedMessages} setReceivedMessages={setReceivedMessages} loading={loading}/>}
    </>

  );
};

export default TwitterNotification;