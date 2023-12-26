import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Chatting = ({setOpen, connections, setfetchAgain, sendMessage, lastMessage, loading}) =>{
    const [chatmessage, setChatMessage] = useState("");
    const {currentUser}= useSelector((state)=>state.user);
    const [placeholder, setPlaceholder]= useState("Type your message here");
    let connectionsChat=connections;

    useEffect(() => {
      
        if(lastMessage){
          console.log("From other end:",lastMessage.data );
            let parsedMessage=JSON.parse(lastMessage.data);
            console.log("parsedMessage:", parsedMessage)            
            let findConnectionIndex=connectionsChat.findIndex(i=>i.connectionId===parsedMessage.sender);
            console.log("findConnectionIndex",findConnectionIndex);
           if(parsedMessage.type && parsedMessage.type==="chat"){

            if(findConnectionIndex>-1){
              let newMessage=parsedMessage.message;
              connectionsChat[findConnectionIndex]["chat"]=newMessage;
              setPlaceholder("type your message here");
              console.log("connectionsChat",connectionsChat);
            }
          }
        }  
      }, [lastMessage]);    

    const handleClickSendMessage =(connectionId) => {
        let message={chatmessage,connectionId};
         sendMessage(JSON.stringify({"action":"sendMessage", "message":message}));
         setChatMessage("");
         setPlaceholder("");
      }
    return (
        <div className="absolute w-full h-full top-0 left-0 bg-transparent flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-gray-200 rounded-lg p-8 flex flex-col gap-4 relative">
          <button onClick={() => setOpen(false)} className="absolute top-3 right-3 cursor-pointer">
            X
          </button>
                <div>
                    <p>Available People to Chat</p>
                    {
                      !loading ?
                      <button onClick={()=>setfetchAgain(true)} className='bg-blue-500 p-1 rounded-lg uppercase m-1' >Get Connected Friends</button>
                      :<p>Getting Data</p>
                    }
                <ul>
                    {connectionsChat.map((c, index) => (
                    <li key={index}>
                       <div className="flex justify-left border-b-2 border-stone-500 mb-5">
                           <div className="flex flex-col mr-10">
                                <img src={c.profilePicture}  className="w-12 h-12 rounded-full"/>
                                <p>{c.username}</p>
                                <p>{c._id}</p>
                                <p>{c.connectionId}</p>
                           </div>
                           {
                           currentUser._id != c._id &&
                            <div className="flex flex-col justify-between">
                                {/* <textarea className="bg-white rounded-lg w-full mb-5"  maxLength={280} readOnly value={c.chat}></textarea> */}
                                <p>Message: {c.chat}</p>
                                <input type="text" onChange={(e)=>setChatMessage(e.target.value)} value={chatmessage} placeholder={placeholder}/>
                                <button onClick={()=>handleClickSendMessage(c.connectionId)} className='bg-blue-500 rounded-lg uppercase my-2'> Send Message</button>
                            </div>
                           }
                        </div>
                    </li>
                    ))}
                </ul>
                </div>
        </div>
      </div>
    )
}
export default Chatting;