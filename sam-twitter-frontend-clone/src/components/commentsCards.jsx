import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from "react-redux";
import formatDistance from "date-fns/formatDistance";
import { Link } from 'react-router-dom';

const CommentsCards = ({comments, setComments, currentUser}) => {

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
        <div class="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <div class="flex items-center justify-between mb-4">
                <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Comments</h5>
            </div>
            <div class="flow-root">
                    <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
                    {
                        comments.map((c,index)=>{
                        return(
                                <li class="py-3 sm:py-4" key={index}>
                                <div class="flex items-center">
                                    <div class="flex-shrink-0">
                                        <img class="w-8 h-8 rounded-full" src={c.userObj.profilePicture} alt="Neil image" />
                                    </div>
                                    <div class="flex-1 min-w-0 ms-4">
                                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                            {c.userObj.username}
                                        </p>
                                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                            {c.comment}
                                        </p>
                                        <div className='flex justify-between'>
                                            <Link to={`/tweetPage/${c.userObj._id}/${c.tweetId}?createdAt=${c.createdAt}`}> 
                                                <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                                    {formatDistance(new Date(c.createdAt), new Date())}
                                                </p>                                            
                                            </Link>
                                            {
                                                currentUser._id === c.userObj?._id && 
                                                <button onClick={()=>deleteComment(c)} disabled={deleting} type="button" class="p-1 text-xs font-medium text-center text-white rounded-lg bg-[#1da1f2] hover:bg-[#1da1f2]/90">Delete</button>
                                            }
                                        </div>

                                    </div>       
                                </div>
                            </li>
                        )
                        })
                    }
                    </ul>
            </div>
    </div>
  );
};

export default CommentsCards;