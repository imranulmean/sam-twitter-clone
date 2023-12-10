import axios from "axios";
import React, { useState, useEffect } from "react";

import { useLocation, useParams } from "react-router-dom";

const UserPlaceholder = ({ setUserData, userData }) => {
  const { id } = useParams();
  const location = useLocation().pathname;

  useEffect(() => {
    const fetchData = async () => {
      try {
        /// Get User Data ///////
        const findsUserUrl=`https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/getuser/${id}`;
        const findUser = await fetch(findsUserUrl,{
          method:"GET"
        });
        const userProfile =await findUser.json();
        console.log(userProfile);
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
