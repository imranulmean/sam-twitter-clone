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
        <div className="w-[600px] h-[600px] bg-transparent rounded-lg p-8 flex flex-col gap-4 relative overflow-y-auto">
          <button onClick={() => setOpen(false)} className="absolute top-3 right-3 cursor-pointer">
            X
          </button>
            <div class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div class="flex items-center justify-between mb-4">
                    <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Available People to Chat</h5>
                    <button disabled={loading} onClick={()=>setfetchAgain(true)} className='mr-2 p-1 text-xs font-medium text-center text-white rounded-lg bg-[#1da1f2] hover:bg-[#1da1f2]/90' >
                      Get Connected Friends
                    </button>
              </div>
              <div class="flow-root">
                {
                  !loading ?
                    <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
                      {
                        connectionsChat.map((c,index)=>{
                          return(
                              <li class="py-3 sm:py-4">
                                  <div class="flex items-center">
                                      <div class="flex">
                                          <img class="w-8 h-8 rounded-full" src={c.profilePicture} />
                                      </div>
                                      <div class="flex-1">
                                          <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                              {c.username}
                                          </p>
                                          <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                              {c._id}
                                          </p>
                                          <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                              {c.connectionId}
                                          </p>                              
                                      </div>
                                      <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                            {
                                            currentUser._id != c._id &&
                                              <div className="flex flex-col justify-between">
                                                  {/* <textarea className="bg-white rounded-lg w-full mb-5"  maxLength={280} readOnly value={c.chat}></textarea> */}
                                                  <div class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                                                    <p className="text-sm font-medium">{c.chat}</p>
                                                  </div>                                                  
                                                  <form onSubmit={(e) => e.preventDefault()}>
                                                      <input ref={chatFieldRef} type="text" onChange={(e)=>{setChatMessage(e.target.value)}}  
                                                      class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder={placeHolder}/>
                                                      <button onClick={()=>handleClickSendMessage(c.connectionId)} className='mr-2 p-1 text-xs font-medium text-center text-white rounded-lg bg-[#1da1f2] hover:bg-[#1da1f2]/90'> 
                                                        Send Message
                                                      </button>
                                                  </form>
                                              </div>
                                            }
                                      </div>
                                  </div>
                              </li>
                          )
                        })
                      }

                    </ul> : <p>Getting Data</p>
                  }
              </div>
            </div>
        </div>
      </div>
    )
}
export default Chatting;
