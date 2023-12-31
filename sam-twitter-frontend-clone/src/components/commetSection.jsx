import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from "react-redux";
import formatDistance from "date-fns/formatDistance";
import Comments from './comments';
import CommentsCards from './CommentsCards';

const CommectSection = ({tweet}) => {

  const commentBoxRef= useRef(null);
  const [comment, setComment]= useState('');
  const {currentUser}= useSelector((state)=>state.user)
  const [commenting, setCommenting]=useState(false);
  const [loading, setLoading]= useState(false);
  const [comments, setComments]=useState([]);
  const [commentsLoaded, setcommentsLoaded]= useState(false);

  const submitComment=async ()=> {
    commentBoxRef.current.innerText="";
    setComment("");
    if(comment===""){
        alert("Write Something");
        return;
    }
      
      setCommenting(true);
      const submitCommentObj={tweetId:tweet._id,comment, userId:currentUser._id, commentPic:"", tweetCreator:tweet.userId};
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

  const loadComments=async (tweet)=>{
    setcommentsLoaded(false);
    setLoading(true);
    const loadCommentsUrl=`https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/get-comments/${tweet._id}`;
    const loadCommentsRes=await fetch (loadCommentsUrl,{
        method:"GET",
        headers:{
            Authorization: currentUser.token
        }
    });
    const result= await loadCommentsRes.json();
    setLoading(false);
    setComments(result);    
    setcommentsLoaded(true);
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent inserting a newline
      submitComment();    // Manually trigger the form submission
    }
  };  

  return (
    <div className='border-b-2 mb-2 p-3'>
        {
            !loading ?
            <button onClick={()=>loadComments(tweet)} class="p-1 text-xs font-medium text-center text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 rounded-lg mb-2">Load Previous Comments</button>
            :<p class="font-bold">Loading Comments</p>
        }

        { 
        commentsLoaded &&  
            <div className='mb-3'>
                {/* <Comments comments={comments} setComments={setComments} currentUser={currentUser} /> */}
                <CommentsCards comments={comments} setComments={setComments} currentUser={currentUser}/>
            </div>        
        }    


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
    
  );
};

export default CommectSection;