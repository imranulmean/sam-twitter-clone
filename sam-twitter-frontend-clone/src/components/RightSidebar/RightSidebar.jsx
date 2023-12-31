import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TwitterNotification from "../twitter-notification";
import { useSelector } from "react-redux";
import { responsiveProperty } from "@mui/material/styles/cssUtils";


const RightSidebar = () => {
  const {currentUser}= useSelector((state)=>state.user);
  const [connections, setConnections]=  useState([]);
  const [loading, setLoading]= useState(false);
  const [fetchAgain, setfetchAgain]= useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const getConncetionsURl="https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/getChatConnections";
        const getConncetionsRes= await fetch(getConncetionsURl,{
          method:"GET",
          headers:{
            Authorization:currentUser.token
          }
        });
         let res=await getConncetionsRes.json();
         setConnections(res);
         setfetchAgain(false);
         setLoading(false);
       
      } catch (err) {
        console.log("error", err);
      }
    };

    fetchData();
  },[fetchAgain]);
  return (
    <>
      {/* <div className="p-6 bg-slate-100 rounded-lg mx-4 space-y-4">
        <h2 className="font-medium">Trending</h2>
        <p className="font-bold">#gryffindor</p>
        <p className="font-bold">#hufflepuff</p>
        <p className="font-bold">#slytherin</p>
        <p className="font-bold">#ravenclaw</p>      
      </div> */}
      <div className="w-full">
       <TwitterNotification connections={connections} setfetchAgain={setfetchAgain} loading={loading}></TwitterNotification>
      </div>
      
    </>

  );
};

export default RightSidebar;
