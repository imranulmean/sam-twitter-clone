import axios from "axios";
import React, { useState, useEffect } from "react";

import { useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const UserPlaceholder = ({ setUserData, userData }) => {
  // const { id } = useParams();
  const location = useLocation().pathname;
  const id=location.substring(location.lastIndexOf('/')+1);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        /// Get User Data ///////
        const findsUserUrl=`https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/getuser/${id}`;
        const findUser = await fetch(findsUserUrl,{
          method:"GET",
          headers:{
            Authorization:currentUser.token
          }
        });
        const userProfile =await findUser.json();
        setUserData(userProfile.Items[0]);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [id]);

  return <div>{userData?.username}</div>;
};

export default UserPlaceholder;
