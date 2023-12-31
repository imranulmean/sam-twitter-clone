import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from "react-redux";
import formatDistance from "date-fns/formatDistance";

const Comments = ({comments, setComments, currentUser}) => {

  const [deleting, setDeleting]= useState(false);  

  const deleteComment=async(comment) =>{
      
    setDeleting(true);
    const findIndex=comments.findIndex(i=> i.createdAt === comment.createdAt);
    const deleteCommentUrl="https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/deleteComment";
      const deleteCommentRes= await fetch(deleteCommentUrl,{
          method:"POST",
          headers:{
              Authorization:currentUser.token
          },
          body:JSON.stringify(comment)
      })
      const result= await deleteCommentRes.json();
      setComments((prev)=>{
          const newComments=[...prev];
          newComments.splice(findIndex,1);
          return newComments;          
      });
      setDeleting(false);

  }  

  return (
     <>
        {
         comments.map((c, index)=>{
             return (
                     c &&
                        <div id="index">
                            <div className='flex'>
                                <img src={c.userObj?.profilePicture} className="rounded-full h-10 w-10 mr-2"></img> 
                                <div className='p-2 border-2 border-gray-500 bg-slate-200 rounded-lg'>
                                <p className="font-bold">{c.userObj?.username}</p>
                                <p>{c.comment}</p>
                                </div>
                            </div>
                            <div className='flex mb-2 border-b-2 border-stone-200 ml-10 space-x-4'>
                                {
                                    c.createdAt &&
                                    <p className='text-sm'>{formatDistance(new Date(c.createdAt), new Date())}</p>
                                }
                                {
                                    currentUser._id === c.userObj?._id &&
                                        <button type="button" class="text-white bg-blue-700 font-medium rounded-lg text-sm p-1"
                                        onClick={()=>deleteComment(c)} disabled={deleting}>delete</button>
                                        
                                }

                            </div>
                        </div> 
                 

             )
         })
        }  
    </>
    
  );
};

export default Comments;