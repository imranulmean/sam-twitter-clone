import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import formatDistance from "date-fns/formatDistance";
import CommentsCards from "../components/CommentsCards";

const TweetPage = () =>{
    const { currentUser } = useSelector((state) => state.user);
    const { userId, tweetId}=useParams();
    const [tweetResult, setTweetResult]= useState({});
    const [userObj, setUserObj]=useState({});
    const [comments, setComments]= useState([]);
      // Get query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const createdAt = queryParams.get('createdAt');

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
          setTweetResult(result.tweetObj);
          setUserObj(result.userObj);
          await loadComments(result.tweetObj);
        } catch (error) {
          console.log(error);
        }
       }
       getTweet();
       if(createdAt){
         console.log("Get Comment:", createdAt)
       }
    },[tweetId])

    const loadComments=async (tweet)=>{      
      const loadCommentsUrl=`https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/get-comments/${tweet._id.S}`;
      const loadCommentsRes=await fetch (loadCommentsUrl,{
          method:"GET",
          headers:{
              Authorization: currentUser.token
          }
      });
      const result= await loadCommentsRes.json();
      console.log(result);
      setComments(result);
    }    

    return (
        <>
          {!currentUser ? (
            <Signin />
          ) : (            
              tweetResult?._id ? 
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
                    <CommentsCards comments={comments} setComments={setComments} currentUser={currentUser}/>
                </div>               
              </div>
                : <p>loading</p>
          )}
        </>
      );
}

export default TweetPage;
