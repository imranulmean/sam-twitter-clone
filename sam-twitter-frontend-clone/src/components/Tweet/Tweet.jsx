import axios from "axios";
import React, { useState } from "react";
import formatDistance from "date-fns/formatDistance";
import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Tweet = ({ tweet, setData, userObj}) => {
  
  const { currentUser } = useSelector((state) => state.user);
  const [userData, setUserData] = useState();
  const [liking,setLiking] = useState(false);
  const dateStr = formatDistance(new Date(tweet.createdAt), new Date());
  const location = useLocation().pathname;
  const { id } = useParams();
  const [deleting, setDeleting]= useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        /// Get User Data ///////
        // const findsUserUrl=`https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/getuser/${tweet.userId}`;
        // // const findsUserUrl=import.meta.env.findsUserUrl+tweet.userId;
        // const findUser = await fetch(findsUserUrl,{
        //   method:"GET",
        //   headers:{
        //     Authorization:currentUser.token
        //   }
        // });
        // const userData1=await findUser.json();
        // setUserData(userData1.Items[0]);
        setUserData(userObj);
      } catch (err) {
        console.log("error", err);
      }
    };

   fetchData();
  }, [tweet.userId, tweet.likes]);

  const handleLike = async (e) => {
    e.preventDefault();
    setLiking(true);
    try {
      let likeObj={userId:tweet.userId, tweetId:tweet._id, userId2:currentUser._id};
      const likeUrl="https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/tweets/like";
      // const likeUrl=import.meta.env.likeUrl;
      const likeData= await fetch(likeUrl,{
        method:"POST",
        headers:{
          Authorization:currentUser.token
        },        
        body: JSON.stringify(likeObj)
      })
      setLiking(false);

      if (location.includes("profile")) {        
        const getCurrentUserTweetUrl=`https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/tweets/timeline/${id}`;
        // const getCurrentUserTweetUrl=import.meta.env.getCurrentUserTweetUrl+id;
        const timelineTweets= await fetch(getCurrentUserTweetUrl,{
          method:"GET",
          headers:{
            Authorization:currentUser.token
          }
        });
        
        const timelineTweetsData=await timelineTweets.json();
        setData(timelineTweetsData.Items);
      } else if (location.includes("explore")) {

        const exploreTweetsUrl=`https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/tweets/explore`;
        // const exploreTweetsUrl=import.meta.env.exploreTweetsUrl;
        const newData = await fetch(exploreTweetsUrl,{
          method:"GET",
          headers:{
            Authorization:currentUser.token
          }
        });
        setData(await newData.json());
      } else {
        /// get Current User Tweets
        const getCurrentUserTweetUrl=`https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/tweets/timeline/${currentUser._id}`;
        // const getCurrentUserTweetUrl=import.meta.env.getCurrentUserTweetUrl+id;
        const timelineTweets= await fetch(getCurrentUserTweetUrl,{
          method:"GET",
          headers:{
            Authorization:currentUser.token
          }
        });
        
        const timelineTweetsData=await timelineTweets.json();
        setData(timelineTweetsData.Items);
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  const deleteTweet = async (userId, tweetId) => {
    setDeleting(true);
    const deleteTweetUrl="https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/tweets/deleteTweet";
    const deleteTweetObj={userId, tweetId}
    const deleteTweetres= await fetch(deleteTweetUrl, {
      method:"POST",
      headers:{
        Authorization:currentUser.token
      },
      body: JSON.stringify(deleteTweetObj)
    });
    setDeleting(false);
    window.location.reload(false);
  }

  return (
    <div>
      {userData && (
        <>
          <div className="flex space-x-2">
            {/* <img src="" alt="" /> */}
            <Link to={`/profile/${userData._id}`}>
              <h3 className="font-bold">{userData.username}</h3>
            </Link>

            <span className="font-normal">@{userData.username}</span>
            <p> - {dateStr}</p>            
          </div>
          {tweet.tweetPic !="" &&<img src={tweet.tweetPic} className="h-21 w-21"/>}
          <p>Tweet User Id: {tweet.userId}</p>
          <p>Tweet Id: {tweet._id}</p>
          <p>{tweet.description}</p>         
          
          {
            liking ? <button>Liking....</button> : 
              <button onClick={handleLike}>
                {tweet.likes.includes(currentUser._id) ? (
                  <FavoriteIcon className="mr-2 my-2 cursor-pointer"></FavoriteIcon>
                ) : (
                  <FavoriteBorderIcon className="mr-2 my-2 cursor-pointer"></FavoriteBorderIcon>
                )}
                {tweet.likes.length}
             </button>            
          }
          {
            tweet.userId === currentUser._id && !deleting &&
              <button className='ml-20 bg-slate-500 p-1 rounded-lg' onClick={()=>deleteTweet(currentUser._id,tweet._id)}>Delete</button>
          }
          {
            deleting &&
            <p>Deleting Please wait ....</p>
          }
        </>
      )}
    </div>
  );
};

export default Tweet;
