import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Chatting = ({setOpen, connections, setfetchAgain, sendMessage, lastMessage}) =>{
    const [chatmessage, setChatMessage] = useState("");
    const {currentUser}= useSelector((state)=>state.user);
    const [chats, setChats]=useState([]);
    useEffect(() => {
    
        if(lastMessage){
            console.log(lastMessage.data);
            let parsedMessage=JSON.parse(lastMessage.data);
            console.log(parsedMessage.message);

            if(parsedMessage.type){
              setChats((prev)=>[...prev,parsedMessage.message]);          
            }
        }  
      }, [lastMessage]);    

    const handleClickSendMessage =(connectionId) => {
        let message={chatmessage,connectionId};
         sendMessage(JSON.stringify({"action":"sendMessage", "message":message}));
      }
    return (
        <div className="absolute w-full h-full top-0 left-0 bg-transparent flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-gray-200 rounded-lg p-8 flex flex-col gap-4 relative">
          <button onClick={() => setOpen(false)} className="absolute top-3 right-3 cursor-pointer">
            X
          </button>
                <div>
                    <p>Available People to Chat</p>
                    <button onClick={()=>setfetchAgain(true)}>Get Connected Friends</button>
                <ul>
                    {connections.map((c, index) => (
                    <li key={index}>
                       <div className="flex justify-left">
                           <div className="flex flex-col mr-10">
                                <img src={c.profilePicture}  className="w-12 h-12 rounded-full"/>
                                <p>{c.username}</p>
                                <p>{c.connectionId}</p>
                           </div>
                           {/* { */}
                           {/* currentUser._id != c._id && */}
                            <div className="flex flex-col justify-between">
                                <textarea className="bg-white rounded-lg w-full mb-5"  maxLength={280} readOnly value={chats}></textarea>
                                <input type="text" onChange={(e)=>setChatMessage(e.target.value)}/>
                                <button onClick={()=>handleClickSendMessage(c.connectionId)} className='bg-red-800 rounded-lg uppercase my-2'> Send Message</button>
                            </div>
                           {/* } */}
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