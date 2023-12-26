import React, { useEffect, useState } from "react";
import TimelineTweet from "../TimelineTweet/TimelineTweet";
import { useSelector } from "react-redux";
import axios from "axios";
import ImagePasteTextArea from "../ImagePasteTextArea";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import app from "../../firebase";


const MainTweet = () => {
  const [tweetText, setTweetText] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading]= useState(false);

  const [img, setImg] = useState('');
  const [imgUploadProgress, setImgUploadProgress] = useState(0);
  const [liveImage, setLiveImage]=useState("");
  const [fileUploading, setFileUploading]= useState(false);

  useEffect(()=>{
    const selectedFile=img;
    if(selectedFile){
      const reader= new FileReader();
      reader.onload = (e) =>{
        setLiveImage(e.target.result);
      }
      // Read the image as a data URL
      reader.readAsDataURL(selectedFile);      
    }    
  },[img]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(tweetText===''){
      alert("please write something")
      return;
    } 
    setLoading(true);
    if(img===''){
      const createTweetObj={
        userId: currentUser._id,
        description: tweetText,
        tweetPic:""     
      }
      try {
        const createTweetUrl="https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/tweets"
        // const createTweetUrl=import.meta.env.createTweetUrl;
        
        const submitTweet= await fetch (createTweetUrl,{
          method:"POST",
          body: JSON.stringify(createTweetObj)
        });
        setLoading(false);
        window.location.reload(false);
      } catch (err) {
        console.log(err);
      }
    }  
    else{
      await setImage();
    }  

  };

  const setImage = async() =>{
    const storage = getStorage(app);
    const fileName = new Date().getTime() + img.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, img);
    let tweetPic;
    uploadTask.on("state_changed",(snapshot) => {
        const progress =(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgUploadProgress(Math.round(progress));
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const createTweetObj={
            userId: currentUser._id,
            description: tweetText,
            tweetPic:downloadURL    
          }
          try {
            const createTweetUrl="https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/tweets"
            // const createTweetUrl=import.meta.env.createTweetUrl;
            
            const submitTweet= await fetch (createTweetUrl,{
              method:"POST",
              body: JSON.stringify(createTweetObj)
            });
            setLoading(false);
            window.location.reload(false);
          } catch (err) {
            console.log(err);
          }
        });
      }
    );   
  }

  return (
    <div className="top-20">
      {currentUser && (
        <p className="font-bold pl-2 my-2">{currentUser.username}</p>
      )}
      
      <form className="border-b-2 pb-6">
        {/* <textarea
          onChange={(e) => setTweetText(e.target.value)}
          type="text"
          placeholder="What's happening"
          maxLength={280}
          className="bg-slate-200 rounded-lg w-full p-2"
        ></textarea> */}
        {
          !loading ?
          <>
            <ImagePasteTextArea setTweetText={setTweetText} setImg={setImg}/>
            <button onClick={handleSubmit} className="bg-blue-500 text-white py-2 px-4 rounded-full ml-auto">
              Create Tweet
            </button>
            <input
            type="file"
            accept="image/*"
            onChange={(e) => setImg(e.target.files[0])} />
            <img src={liveImage} alt="Picture" className="w-20 h-20"/>
          </>
          : <button>Tweeting for you </button> 
          
        }

      </form>
      <TimelineTweet />
    </div>
  );
};

export default MainTweet;
