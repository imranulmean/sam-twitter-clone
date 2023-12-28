import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const Chatting = ({setOpen, connections, setfetchAgain, sendMessage, lastMessage, loading}) =>{
    const [chatmessage, setChatMessage] = useState("");
    const [placeHolder, setplaceHolder]= useState("");

    const {currentUser}= useSelector((state)=>state.user);    
    let connectionsChat=connections;
    const chatFieldRef= useRef(null);

    useEffect(() => {
      
        if(lastMessage){
          setplaceHolder("");
          setTimeout(()=>{
              let parsedMessage=JSON.parse(lastMessage.data);
              let findConnectionIndex=connectionsChat.findIndex(i=>i.connectionId===parsedMessage.sender);
              console.log("findConnectionIndex",findConnectionIndex);

            if(parsedMessage.type && parsedMessage.type==="chat"){
              if(findConnectionIndex>-1){
                let newMessage=" " + parsedMessage.message;
                if(connectionsChat[findConnectionIndex]["chat"]){
                  connectionsChat[findConnectionIndex]["chat"]=connectionsChat[findConnectionIndex]["chat"].concat(newMessage);
                }
                else{
                  connectionsChat[findConnectionIndex]["chat"]=newMessage;
                }
                
                setplaceHolder("type your message here");
              }
            }
          },1000);
          // console.log(lastMessage.data);          

        }  
      }, [lastMessage]);    

    const handleClickSendMessage =(connectionId) => {
       
        let message={chatmessage,connectionId};
         sendMessage(JSON.stringify({"action":"sendMessage", "message":message}));
         setChatMessage("");
        chatFieldRef.current.value="";
      }
    return (
        <div className="absolute w-full h-full top-5 left-0 bg-transparent flex items-center justify-center">
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
                    {
                      !loading ? 
                        <div className="max-h-[400px] overflow-y-auto">
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
                                      <form onSubmit={(e) => e.preventDefault()}>
                                          <input ref={chatFieldRef} type="text" onChange={(e)=>{setChatMessage(e.target.value)}}  placeholder={placeHolder}/>
                                          <button onClick={()=>handleClickSendMessage(c.connectionId)} className='bg-blue-500 rounded-lg uppercase my-2'> Send Message</button>
                                      </form>
                                  </div>
                                }
                              </div>
                          </li>
                          ))}
                      </ul> 
                     </div>
                      :<p>Getting Data</p>
                    }

                </div>
        </div>
      </div>
    )
}
export default Chatting;