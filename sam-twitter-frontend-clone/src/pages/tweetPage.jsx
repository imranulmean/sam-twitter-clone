import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import formatDistance from "date-fns/formatDistance";
import CommentsCards from "../components/CommentsCards";

const TweetPage = () =>{
    const { currentUser } = useSelector((state) => state.user);
    const { userId, tweetId, createdAt}=useParams();
    const [tweetResult, setTweetResult]= useState({});
    const [userObj, setUserObj]=useState({});
    const [comment, setComment]= useState('');
    const [comments, setComments]= useState([]);
    const [commenting, setCommenting]=useState(false);
    const commentBoxRef=useRef();
      // Get query parameters
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const createdAt = queryParams.get('createdAt');

    useEffect(()=>{
       const getTweet= async () =>{
        try {
          const getTweetUrl="https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/tweets/getTweet";
          const getTweetObj={userId, tweetId};
          const getTweetRes= await fetch(getTweetUrl,{
            method:"POST",
            headers:{
              Authorization:currentUser.token
            },
            body: JSON.stringify(getTweetObj)
          });
          let result=await getTweetRes.json();
          console.log(result)
          setTweetResult(result.tweetObj);
          setUserObj(result.userObj);          
          if(!createdAt){         
            await loadComments(result.tweetObj);           
          }
          if(createdAt){
            await loadOneComment();
          }
        } catch (error) {
          console.log(error);
        }
       }
        getTweet();
    },[tweetId, createdAt])

    const loadComments=async (tweet)=>{
      console.log("getting All Comments");
      const loadCommentsUrl=`https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/get-comments/${tweet._id.S}`;
      const loadCommentsRes=await fetch (loadCommentsUrl,{
          method:"GET",
          headers:{
              Authorization: currentUser.token
          }
      });
      const result= await loadCommentsRes.json();
      setComments(result);
    }

    const loadOneComment= async()=>{
      console.log("getting one Comment");
      
      const loadCommentObj={userId, tweetId, createdAt:new Date(parseInt(createdAt)).toISOString()};
      const loadCommentUrl=`https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/get-one-comment`;
      const loadCommentRes=await fetch (loadCommentUrl,{
          method:"POST",
          headers:{
              Authorization: currentUser.token
          },
          body:JSON.stringify(loadCommentObj)
      });
      const result2= await loadCommentRes.json();
      console.log(result2);
       setComments(result2);
      
    }

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Prevent inserting a newline
        submitComment();    // Manually trigger the form submission
      }
    };

    const submitComment=async ()=> {
      commentBoxRef.current.innerText="";
      setComment("");
      if(comment===""){
          alert("Write Something");
          return;
      }
        
        setCommenting(true);
        const submitCommentObj={tweetId:tweetResult._id.S,comment, userId:currentUser._id, commentPic:"", tweetCreator:tweetResult.userId.S};        
        const submitCommentUrl="https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/submitComment";
        const submitCommentRes= await fetch(submitCommentUrl, {
            method:"POST",
            headers:{
              Authorization:currentUser.token
            },
            body: JSON.stringify(submitCommentObj)
        });
        const result= await submitCommentRes.json();
        setCommenting(false);
          let obj={comment:result.comment, commentPic:result.commentPic, createdAt: result.createdAt, tweetId:result.tweetId,
                      userObj:{
                          _id:currentUser._id,
                          profilePicture:currentUser.profilePicture,
                          username:currentUser.username
                      } 
                  };             
          setComments((prev)=>[...prev,obj]);                
    }     

    return (
        <>
          {!currentUser ? (
            <Signin />
          ) : (            
              tweetResult?._id? 
              <div>
                <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <img class="rounded-t-lg" src={tweetResult.tweetPic?.S} alt="" />
                    <div class="p-5">
                        <div className="flex items-center">
                          <img src={userObj.profilePicture} className="h-auto w-12"/>
                          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            <Link to={`/profile/${userObj._id}`}><p>{userObj.username}</p></Link>
                          </h5>
                        </div>
                        <p class="mb-1 font-normal text-gray-700 dark:text-gray-400">{tweetResult.description.S}</p>
                        <div className="flex space-x-2 items-center">
                          <p class="mb-3 font-normal text-sm text-gray-400 dark:text-gray-400">Likes: {tweetResult.likes.L.length}</p>
                          <p class="mb-3 font-normal text-sm text-gray-400 dark:text-gray-400">
                            Posted:{formatDistance(new Date(tweetResult.createdAt.S), new Date())}
                          </p>
                        </div>
                    </div>
                    <CommentsCards tweetCreator={userObj._id} comments={comments} setComments={setComments} currentUser={currentUser}/>
                    <form onSubmit={(e)=> e.preventDefault()}>   
                        <div ref={commentBoxRef} contentEditable className="h-[50px] border-dotted border border-current overflow-y-auto rounded-lg" 
                                onInput={(e)=>setComment(e.target.innerText)} onKeyDown={handleKeyPress}>Type Comment Here
                        </div>
                        {
                            !commenting ? <button className='font-medium text-center text-white rounded-lg bg-[#1da1f2] hover:bg-[#1da1f2]/90 mt-2 rounded-full p-2' onClick={submitComment}>Submit Comment</button> 
                                        :<p>posting comment</p>
                        }
                        
                    </form>                    
                </div>               
              </div>
                : <p>loading</p>
          )}
        </>
      );
}

export default TweetPage;
