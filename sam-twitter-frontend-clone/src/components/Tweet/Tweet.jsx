import axios from "axios";
import React, { useState } from "react";
import formatDistance from "date-fns/formatDistance";

import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Tweet = ({ tweet, setData }) => {
  const { currentUser } = useSelector((state) => state.user);

  const [userData, setUserData] = useState();

  const dateStr = formatDistance(new Date(tweet.createdAt), new Date());
  const location = useLocation().pathname;
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        /// Get User Data ///////
        const findsUserUrl=`https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/getuser/${tweet.userId}`;
        const findUser = await fetch(findsUserUrl,{
          method:"GET"
        });
        const userData1=await findUser.json();
        setUserData(userData1.Items[0]);
      } catch (err) {
        console.log("error", err);
      }
    };

    fetchData();
  }, [tweet.userId, tweet.likes]);

  const handleLike = async (e) => {
    e.preventDefault();

    try {
      let likeObj={userId:tweet.userId, tweetId:tweet._id, userId2:currentUser._id};
      console.log(likeObj);
      const likeUrl="https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/tweets/like";
      const likeData= await fetch(likeUrl,{
        method:"POST",
        body: JSON.stringify(likeObj)
      })
      console.log(likeData);
      if (location.includes("profile")) {
        const newData = await axios.get(`/api/tweets/user/all/${id}`);
        setData(newData.data);
      } else if (location.includes("explore")) {

        const newData = await axios.get(`/api/tweets/explore`);
        setData(newData.data);
      } else {
        /// get Current User Tweets
        const getCurrentUserTweetUrl=`https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/tweets/timeline/${currentUser._id}`;
        const timelineTweets= await fetch(getCurrentUserTweetUrl,{
          method:"GET"
        });
        
        const timelineTweetsData=await timelineTweets.json();
        setData(timelineTweetsData.Items);
      }
    } catch (err) {
      console.log("error", err);
    }
  };

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
          <p>Tweet User Id: {tweet.userId}</p>
          <p>Tweet Id: {tweet._id}</p>
          <p>{tweet.description}</p>
          <button onClick={handleLike}>
            {tweet.likes.includes(currentUser._id) ? (
              <FavoriteIcon className="mr-2 my-2 cursor-pointer"></FavoriteIcon>
            ) : (
              <FavoriteBorderIcon className="mr-2 my-2 cursor-pointer"></FavoriteBorderIcon>
            )}
            {tweet.likes.length}
          </button>
        </>
      )}
    </div>
  );
};

export default Tweet;
