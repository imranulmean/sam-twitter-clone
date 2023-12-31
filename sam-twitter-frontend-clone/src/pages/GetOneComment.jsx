import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import formatDistance from "date-fns/formatDistance";
import CommentsCards from "../components/CommentsCards";

const GetOneComment = () =>{
    const{tweetId, createdAt}= useParams();
    return (
        <>
                Get a Comment tweet Id : {tweetId} {createdAt}
        </>
      );
}

export default GetOneComment;
