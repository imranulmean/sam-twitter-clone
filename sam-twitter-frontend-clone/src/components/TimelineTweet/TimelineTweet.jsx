import React, { useEffect, useState } from "react";
import axios from "axios";

import { useSelector } from "react-redux";
import Tweet from "../Tweet/Tweet";

const TimelineTweet = () => {
  const [timeLine, setTimeLine] = useState(null);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getCurrentUserTweetUrl=`https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/tweets/timeline/${currentUser._id}`;
        const timelineTweets= await fetch(getCurrentUserTweetUrl,{
          method:"GET"
        });
        
        const timelineTweetsData=await timelineTweets.json();
        setTimeLine(timelineTweetsData.Items);
      } catch (err) {
        console.log("error", err);
      }
    };

    fetchData();
  }, [currentUser._id]);

  console.log("Timeline", timeLine);
  return (
    <div className="mt-6">
      {timeLine &&
        timeLine.map((tweet) => {
          return (
            <div key={tweet._id} className="p-2">
              <Tweet tweet={tweet} setData={setTimeLine} />
            </div>
          );
        })}
    </div>
  );
};

export default TimelineTweet;
