// import axios from "axios";
// import React, { useState } from "react";
// import formatDistance from "date-fns/formatDistance";
// import { useEffect } from "react";
// import { Link, useLocation, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import ImagePasteTextArea from "../ImagePasteTextArea";
// import CommectSection from "../commetSection";

// const Tweet = ({ tweet, setData, userObj, userTweets}) => {
  
//   const { currentUser } = useSelector((state) => state.user);
//   const [userData, setUserData] = useState();
//   const [liking,setLiking] = useState(false);
//   const dateStr = formatDistance(new Date(tweet.createdAt), new Date());
//   const location = useLocation().pathname;
//   const { id } = useParams();
//   const [deleting, setDeleting]= useState(false);
//   const [deleted, setdeleted]= useState(false);

//   useEffect(() => {  
//     const fetchData = async () => {
//       try {
//         setUserData(userObj);
//       } catch (err) {
//         console.log("error", err);
//       }
//     };

//    fetchData();
//   }, [tweet.likes, tweet]);

//   const handleLike = async (e) => {
//     e.preventDefault();
//     setLiking(true);
//     try {
//       let likeObj={userId:tweet.userId, tweetId:tweet._id, userId2:currentUser._id};
//       const likeUrl="https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/tweets/like";
//       // const likeUrl=import.meta.env.likeUrl;
//       const likeData= await fetch(likeUrl,{
//         method:"POST",
//         headers:{
//           Authorization:currentUser.token
//         },        
//         body: JSON.stringify(likeObj)
//       })
     
//       let likeDataRes=await likeData.json();
//       tweet.likes=likeDataRes.Attributes.likes;
//       setLiking(false);
//     } catch (err) {
//       console.log("error", err);
//     }
//   };

//   const deleteTweet = async (userId, tweetId) => {
//     setDeleting(true);
//     const deleteTweetUrl="https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/tweets/deleteTweet";
//     const deleteTweetObj={userId, tweetId}
//     const deleteTweetres= await fetch(deleteTweetUrl, {
//       method:"POST",
//       headers:{
//         Authorization:currentUser.token
//       },
//       body: JSON.stringify(deleteTweetObj)
//     });
//     tweet={};
//     setDeleting(false);
//     setdeleted(true);   
    
//     // window.location.reload(false);
//   }

//   return (
//     <div>
//       {userData && (
        
//             !deleted &&
//             <>
//             <div className="flex space-x-2 mb-2">
//               <img src={userData.profilePicture} className="h-auto w-10 rounded-full"/>
//               <Link to={`/profile/${userData._id}`}>
//                 <h3 className="font-bold">{userData.username}</h3>
//               </Link>

//               <span className="font-normal">@{userData.username}</span>
//               <Link to={`/tweetPage/${userData._id}/${tweet._id}`} className="text-blue-500 no-underline">
//                   <p> - {dateStr}</p>
//               </Link>
//             </div>
//             <p className="font-normal text-gray-700 dark:text-gray-400">{tweet.description}</p>
//             {tweet.tweetPic !="" &&<img src={tweet.tweetPic} className="h-auto max-w-md mx-auto rounded-lg"/>}
//             <p className="font-normal text-gray-700 dark:text-gray-400">Tweet User Id: {tweet.userId}</p>
//             <p className="font-normal text-gray-700 dark:text-gray-400">Tweet Id: {tweet._id}</p>            
//             {
//               liking ? <button>Liking....</button> : 
//                 <button onClick={handleLike}>
//                   {tweet.likes?.includes(currentUser._id) ? (
//                     <FavoriteIcon className="mr-2 my-2 cursor-pointer"></FavoriteIcon>
//                   ) : (
//                     <FavoriteBorderIcon className="mr-2 my-2 cursor-pointer"></FavoriteBorderIcon>
//                   )}
//                   {tweet.likes?.length}
//               </button>            
//             }
//             {
//               tweet.userId === currentUser._id && !deleting &&
//                 <button className='ml-20 bg-slate-500 p-1 rounded-lg' onClick={()=>deleteTweet(currentUser._id,tweet._id)}>Delete</button>
//             }
//             {
//               deleting &&
//               <p>Deleting Please wait ....</p>
//             }            
//             <CommectSection tweet={tweet}/>
//           </>
//       )}
//     </div>
//   );
// };

// export default Tweet;

import axios from "axios";
import React, { useState } from "react";
import formatDistance from "date-fns/formatDistance";
import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ImagePasteTextArea from "../ImagePasteTextArea";
import CommectSection from "../commetSection";

const Tweet = ({ tweet, setData, userObj, userTweets}) => {
  
  const { currentUser } = useSelector((state) => state.user);
  const [userData, setUserData] = useState();
  const [liking,setLiking] = useState(false);
  const dateStr = formatDistance(new Date(tweet.createdAt), new Date());
  const location = useLocation().pathname;
  const { id } = useParams();
  const [deleting, setDeleting]= useState(false);
  const [deleted, setdeleted]= useState(false);

  useEffect(() => {  
    const fetchData = async () => {
      try {
        setUserData(userObj);
      } catch (err) {
        console.log("error", err);
      }
    };

   fetchData();
  }, [tweet.likes, tweet]);

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
     
      let likeDataRes=await likeData.json();
      tweet.likes=likeDataRes.Attributes.likes;
      setLiking(false);
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
    tweet={};
    setDeleting(false);
    setdeleted(true);   
    
    // window.location.reload(false);
  }

  return (
    <div>
      {userData && (
        
            !deleted &&
            <>
                <div class="max-w-lg bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">                        
                    <div class="p-5">
                        <div className="flex items-center">
                          <img src={userData.profilePicture} className="h-auto w-12"/>
                          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            <Link to={`/profile/${userData._id}`}><p>{userData.username}</p></Link>
                          </h5>
                        </div>
                        <img class="rounded-t-lg" src={tweet.tweetPic} alt="" />
                        <p class="mb-1 font-normal text-gray-700 dark:text-gray-400">{tweet.description}</p>
                        <div className="flex space-x-1 items-center">
                                {
                                liking ? <button>Liking....</button> : 
                                    <button onClick={handleLike}>
                                        {tweet.likes?.includes(currentUser._id) ? (
                                            <FavoriteIcon className="cursor-pointer"></FavoriteIcon>
                                        ) : (
                                            <FavoriteBorderIcon className="cursor-pointer"></FavoriteBorderIcon>
                                        )}
                                    </button>            
                                  }                            
                            <p class="font-normal text-sm text-gray-400 dark:text-gray-400">{tweet.likes?.length}</p>
                              <Link to={`/tweetPage/${userData._id}/${tweet._id}`}>
                                  <p class="font-normal text-sm text-blue-400 dark:text-gray-400">
                                    Posted:{formatDistance(new Date(tweet.createdAt), new Date())}
                                  </p>
                              </Link>
                          
                            {
                            tweet.userId === currentUser._id && !deleting &&
                                <button className='p-1 text-xs font-medium text-center text-white rounded-lg bg-[#1da1f2] hover:bg-[#1da1f2]/90' onClick={()=>deleteTweet(currentUser._id,tweet._id)}>Delete</button>
                            }                          
                        </div>
                    </div>
                    <CommectSection tweet={tweet}/>
                </div>           
          </>
      )}
    </div>
  );
};

export default Tweet;


 
