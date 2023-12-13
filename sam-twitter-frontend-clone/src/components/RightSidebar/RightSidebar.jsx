import React from "react";
import { Link } from "react-router-dom";

const RightSidebar = () => {
  return (
    <div className="p-6 bg-slate-100 rounded-lg mx-4 space-y-4">
      <h2 className="font-medium">Trending</h2>
      <p className="font-bold">#gryffindor</p>
      <p className="font-bold">#hufflepuff</p>
      <p className="font-bold">#slytherin</p>
      <p className="font-bold">#ravenclaw</p>
      <Link to ="twitterNotification">Notification Page</Link>
    </div>
  );
};

export default RightSidebar;
