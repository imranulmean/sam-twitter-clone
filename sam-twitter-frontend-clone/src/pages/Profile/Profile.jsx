import React, { useState, useEffect } from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import EditProfile from "../../components/EditProfile/EditProfile";
import formatDistance from "date-fns/formatDistance";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Tweet from "../../components/Tweet/Tweet";

import { following } from "../../redux/userSlice";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [userTweets, setUserTweets] = useState(null);
  const [userProfile, setUserProfile] = useState({});

  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading]=useState(true);
  const coverPhoto="https://firebasestorage.googleapis.com/v0/b/mern-estate-4e89d.appspot.com/o/new-day-quotes-zig-ziglar-yesterday-ende-9435.webp?alt=media&token=d9cda679-8c91-4054-bf3f-76250f10d6d9";

  useEffect(() => {
    const fetchData = async () => {
      try {
        /// Get Current User Tweets ////////
        const getCurrentUserTweetUrl=`https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/tweets/timeline/${id}`;
        const timelineTweets= await fetch(getCurrentUserTweetUrl,{
          method:"GET",
          headers:{
            Authorization:currentUser.token
          }
        });
        
        const timelineTweetsData=await timelineTweets.json();
        setLoading(false);
        setUserTweets(timelineTweetsData[0].tweetObj);
        setUserProfile(timelineTweetsData[0].userObj);
       
      } catch (err) {
        console.log("error", err);
      }
    };

    fetchData();
  }, []);

  const handleFollow = async () => {    
    try {
      let followObj={
        toFollowOrUnFollowId: id,
        you: currentUser._id
      };
      const followUnfollowUrl="https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/follow-unfollow";
      const followUnfollowData= await fetch(followUnfollowUrl, {
        method: "POST",
        headers:{
          Authorization:currentUser.token
        },
        body: JSON.stringify(followObj)
      });
      console.log(await followUnfollowData.json());
      
      dispatch(following(id));
    } catch (err) {
      console.log("error", err);
    }

  };

  return (
    <>
    { 
    loading ? <button className="bg-yellow-800">Loading Data ....</button> : 
        <div>
        <div>
          <img src={coverPhoto} className="h-64 w-full rounded-lg"/>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src={userProfile?.profilePicture} alt="Profile Picture" className="w-12 h-12 rounded-full" />
              <div className="ml-4">
                <p>{userProfile.username}</p>
                <p>Joined: {formatDistance(new Date(userProfile.Date), new Date()).toString()}</p>
                <p>Following:{userProfile.following.length}  Follower:{userProfile.followers.length}</p>
              </div>
            </div>
            {currentUser._id === id ? (
              <button
                className="px-4 -y-2 bg-blue-500 rounded-full text-white"
                onClick={() => setOpen(true)}
              >
                Edit Profile
              </button>
            ) : currentUser.following?.includes(id) ? (
              <button
                className="px-4 -y-2 bg-blue-500 rounded-full text-white"
                onClick={handleFollow}
              >
                Following
              </button>
            ) : (
              <button
                className="px-4 -y-2 bg-blue-500 rounded-full text-white"
                onClick={handleFollow}
              >
                Follow
              </button>
            )}
          </div>
          <div className="mt-6">
            {userTweets &&
              userTweets.map((tweet) => {
                return (
                  <div className="p-2" key={tweet._id}>
                    <Tweet tweet={tweet} userObj={userProfile} setData={setUserTweets} userTweets={userTweets}/>
                  </div>
                );
              })}
          </div>
        </div>
      </div>    
    }
      {open && <EditProfile setOpen={setOpen} />}
    </>
  );
};

export default Profile;
