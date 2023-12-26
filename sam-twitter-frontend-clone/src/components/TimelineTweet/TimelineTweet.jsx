import React, { useEffect, useState } from "react";
import axios from "axios";

import { useSelector } from "react-redux";
import Tweet from "../Tweet/Tweet";

const TimelineTweet = () => {
  const [timeLine, setTimeLine] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading]=useState(true);
  const [userObj, setUserObj]= useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        /// Get Current User Tweets ////////
        const getCurrentUserTweetUrl=`https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/tweets/timeline/${currentUser._id}`;
        // const getCurrentUserTweetUrl=import.meta.env.getCurrentUserTweetUrl+currentUser._id;
        const timelineTweets= await fetch(getCurrentUserTweetUrl,{
          method:"GET",
          headers:{
            Authorization:currentUser.token
          }
        });
        
        const timelineTweetsData=await timelineTweets.json();
        setLoading(false);
        setTimeLine(timelineTweetsData[0].tweetObj);
        setUserObj(timelineTweetsData[0].userObj)
      } catch (err) {
        console.log("error", err);
      }
    };

    fetchData();
  }, [currentUser._id]);

  return (
    <>
      {
        loading ? <button className="bg-slate-500">Loading Data</button> :
          <div className="mt-6">
          {timeLine &&
            timeLine.map((tweet) => {
              return (
                <div key={tweet._id} className="p-2">
                  <Tweet tweet={tweet} userObj={userObj} setData={setTimeLine} userTweets={timeLine}/>
                </div>
              );
            })}
        </div>        
      
      }
    </>
  );
};

export default TimelineTweet;
