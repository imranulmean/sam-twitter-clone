import useWebSocket from 'react-use-websocket';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';

const ChattingMern= () =>{
    const {currentUser}= useSelector(state=> state.user);
    const socketUrl = `ws://localhost:5000/?extraData=${encodeURIComponent(JSON.stringify(currentUser))}`;       
    const [clients, setClients]=useState([]);
    const [chatMessage, setChatMessage]=useState('');
    const inputMessageRef= useRef(null);
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
      
      useEffect(()=>{
        if(lastMessage){
             console.log(lastMessage.data);
        }
      },[lastMessage])
const getConnetedClients= async ()=>{
    let getConnetedClientsRes= await fetch("http://localhost:5000/getConnectedClients");
    setClients(await getConnetedClientsRes.json());
}      

    const sendMessageToSocket=async (clientId)=>{
        let mesgObj={clientId,chatMessage,sender:currentUser.email};
        sendMessage(JSON.stringify(mesgObj));
        inputMessageRef.current.value='';
    }    
    
    return (
        <>
            <p>Chatting mern</p>
            <div className='flex flex-col'>
                <button onClick={getConnetedClients} className="rounded-lg bg-[#1da1f2] m-2">Get Connected Clients</button>
                {
                    clients.map((c,index)=>{
                        return(
                            <div key={index}>
                            { currentUser.email != c &&
                                <div key={index} className="border-b-2 m-2 p-2">
                                    Message:
                                    <div className='bg-[#1da1f2] rounded-lg'>
                                        {
                                            lastMessage?.data && JSON.parse(lastMessage?.data).sender==c &&
                                            <p>{JSON.parse(lastMessage?.data).chatMessage}</p>
                                        }
                                    </div>
                                    <p>{c}</p>
                                    <form onSubmit={(e)=>e.preventDefault()}>
                                        <input ref={inputMessageRef} type="text" placeholder='Message Here' onChange={(e)=>setChatMessage(e.target.value)}
                                            className="bg-transparent border-0 border-2"/>
                                        <button onClick={()=>sendMessageToSocket(c)}  className="rounded-lg bg-[#1da1f2]">sendMessage</button>
                                    </form>                        

                                </div>
                            }
                            </div>
                        )
                    })
                }                
            </div>

        </>
    );
}

export default ChattingMern;