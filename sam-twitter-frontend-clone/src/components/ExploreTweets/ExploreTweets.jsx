import React, { useEffect, useState } from "react";

import axios from "axios";
import { useSelector } from "react-redux";
import Tweet from "../Tweet/Tweet";

const ExploreTweets = () => {
  const [explore, setExplore] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading]= useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const exploreTweetsUrl='https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/tweets/explore';
        // const exploreTweetsUrl=import.meta.env.exploreTweetsUrl;
        
        const exploreTweetsData= await fetch(exploreTweetsUrl,{
          method:"GET",
          headers:{
            Authorization:currentUser.token
          }
        })
        const exploreTweetsRes= await exploreTweetsData.json();
        setExplore(exploreTweetsRes);
        setLoading(false);
      } catch (err) {
        console.log("error", err);
      }
    };
    fetchData();
  }, [currentUser._id]);
  return (
    <>
      {
      
        loading ? <button className="bg-slate-500">Loading Data ....</button> : 
        <div className="mt-6">
        {explore &&
          explore.map((tweet,index) => {
            return (
              <div key={index} className="p-2">
                <Tweet tweet={tweet.tweetObj} userObj={tweet.userObj} setData={setExplore} />
              </div>
            );
          })}
      </div>
      }

    </>
  );
};

export default ExploreTweets;
