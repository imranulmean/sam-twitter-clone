import React, { useEffect, useState } from "react";
import LeftSidebar from "../components/LeftSidebar/LeftSidebar";
import RightSidebar from "../components/RightSidebar/RightSidebar";
import { useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";

const TweetPage = () =>{
    const { currentUser } = useSelector((state) => state.user);
    const { userId, tweetId }=useParams();
    const [tweetResult, setTweetResult]= useState({});
    const [userObj, setUserObj]=useState({});

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
        } catch (error) {
          console.log(error);
        }
       }
       getTweet();
    },[tweetId])

    return (
        <>
          {!currentUser ? (
            <Signin />
          ) : (            
              tweetResult?._id ? 
              <div>
                <img src={tweetResult.tweetPic?.S} />
                <p>Description:{tweetResult.description.S}</p>
                <p>Created:{tweetResult.createdAt.S}</p>
                <p>Likes: {tweetResult.likes.L.length}</p>
                <Link to={`/profile/${userObj._id}`}><p>Creator: {userObj.username}</p></Link>
              </div>
                : <p>loading</p>
          )}
        </>
      );
}

export default TweetPage;