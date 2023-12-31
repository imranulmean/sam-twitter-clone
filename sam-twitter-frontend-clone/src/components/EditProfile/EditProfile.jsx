import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { changeProfile, logout } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import app from "../../firebase";
import ImagePasteTextArea from "../ImagePasteTextArea";

const EditProfile = ({ setOpen }) => {
  const { currentUser } = useSelector((state) => state.user);

  const [img, setImg] = useState(null);
  const [imgUploadProgress, setImgUploadProgress] = useState(0);
  const [liveImage, setLiveImage]=useState("");
  const [fileUploading, setFileUploading]= useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const uploadImg = (file, type) => {
    setFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed",(snapshot) => {
        const progress =(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgUploadProgress(Math.round(progress));
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          try {           
            const updateUserUrl="https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/updateUser";
            const updateUserObj={userId:currentUser._id, email:currentUser.email, profilePic:downloadURL, type};
            const updateUserRes= await fetch(updateUserUrl, {
              method:"POST",
              headers:{
                Authorization: currentUser.token
              },
              body:JSON.stringify(updateUserObj)
            });
            setFileUploading(false);
          } catch (error) {
            console.log(error);
          }
          dispatch(changeProfile(downloadURL));
        });
      }
    );
  };

  const handleDelete = async () => {
    const deleteProfile = await axios.delete(`/api/users/${currentUser._id}`);
    dispatch(logout());
    navigate("/signin");
  };

  useEffect(() => {    
    const selectedFile=img;
    
    if(selectedFile){
      const reader= new FileReader();
      reader.onload = (e) =>{
        setLiveImage(e.target.result);
      }
      reader.readAsDataURL(selectedFile);      
    }
  }, [img]);

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-transparent flex items-center justify-center">
      <div className="w-[600px] h-[600px] bg-slate-200 rounded-lg p-8 flex flex-col gap-4 relative">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 cursor-pointer"
        >
          X
        </button>
        <h2 className="font-bold text-xl">Edit Profile</h2>
        <p>Choose Your picture</p>
        <img src={liveImage} alt="Selected Picture" className="w-20 h-20"/>
        {imgUploadProgress > 0 ? (
          "Uploading " + imgUploadProgress + "%"
        ) : (
          <>
            <ImagePasteTextArea setTweetText={""} setImg={setImg} />
            <input type="file" className="bg-transparent border border-slate-500 rounded p-2" accept="image/*"
            onChange={(e) => setImg(e.target.files[0])} />
          </>
        )}
        {
          !fileUploading ? 
          <button
          className="bg-blue-500 text-white py-2 rounded-full"
          onClick={()=>uploadImg(img,"profilePic")}
        >
          Upload Profile Pic Now
        </button> : <p> "Uploading " {imgUploadProgress}  + "%"</p>
        }
        {
          !fileUploading ? 
          <button
          className="bg-green-800 text-white py-2 rounded-full"
          onClick={()=>uploadImg(img,"coverPhoto")}
        >
          Upload Cover Pic Now
        </button> : <p> "Uploading " {imgUploadProgress}  + "%"</p>
        }


        <p>Delete Account</p>
        <button
          className="bg-red-500 text-white py-2 rounded-full"
          onClick={handleDelete}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
