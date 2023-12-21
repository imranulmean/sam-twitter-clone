import React, { useState } from "react";
import TimelineTweet from "../TimelineTweet/TimelineTweet";

import { useSelector } from "react-redux";
import axios from "axios";

const MainTweet = () => {
  const [tweetText, setTweetText] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading]= useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(tweetText===''){
      alert("please write something")
      return;
    }      
    setLoading(true);    
    const createTweetObj={
      userId: currentUser._id,
      description: tweetText,
    }
    try {
      // const createTweetUrl="https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/tweets"
      const createTweetUrl="https://wkhhxvubsg.execute-api.us-east-1.amazonaws.com/Prod/createTweet"
      
      const submitTweet= await fetch (createTweetUrl,{
        method:"POST",
        body: JSON.stringify(createTweetObj)
      });
      setLoading(false);
      window.location.reload(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {currentUser && (
        <p className="font-bold pl-2 my-2">{currentUser.username}</p>
      )}

      <form className="border-b-2 pb-6">
        <textarea
          onChange={(e) => setTweetText(e.target.value)}
          type="text"
          placeholder="What's happening"
          maxLength={280}
          className="bg-slate-200 rounded-lg w-full p-2"
        ></textarea>
        {
          !loading ?
            <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded-full ml-auto"
          >
            Create Tweet
          </button> : <button>Tweeting for you </button> 
        }

      </form>
      <TimelineTweet />
    </div>
  );
};

export default MainTweet;
