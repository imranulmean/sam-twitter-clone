import React, { useState } from "react";
import axios from "axios";

import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailed } from "../../redux/userSlice";
import { useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import OAuth from '../../components/OAuth';



const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading,setLoading]= useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    setLoading(true);
    try {
      // const res = await axios.post("/api/auth/signin", { username, password });
      // const twitterSigninUrl="https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/twittersignin";
      const twitterSigninUrl=import.meta.env.twitterSigninUrl;
      
      const signinObj={email,password};
      const res= await fetch(twitterSigninUrl,{
        method:"POST",
        body: JSON.stringify(signinObj)
      })
      const loginData=await res.json();
      setLoading(false);
      //////////Getting User Follower Data
      // const findsUserUrl=`https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/getuser/${loginData._id}`;
      const findsUserUrl=`https://t906g0vdxc.execute-api.us-east-1.amazonaws.com/Prod/getuser/${loginData._id}`;
      
      const findUser = await fetch(findsUserUrl,{
        method:"GET",
        headers:{
          Authorization:loginData.token
        }
      });
      
      const userProfile =await findUser.json();
      userProfile.Items[0]["token"]=loginData.token;
      dispatch(loginSuccess(userProfile.Items[0]));
      navigate("/");
    } catch (err) {
      dispatch(loginFailed());
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(loginStart());

    try {
      // const res = await axios.post("/auth/signup", {
      //   username,
      //   email,
      //   password,
      // });
      const signUpObj={email,password}
      const twitterSignupUrl=" https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/twittersignup";
      const res = await fetch(twitterSignupUrl,{
        method:"POST",
        body:JSON.stringify(signUpObj)
      })
      console.log(await res.json());
      alert("Signup Complete Please Sign Now");
      setLoading(false);
      return ;
      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch (err) {
      dispatch(loginFailed());
    }
  };

  return (
    // <form className="bg-gray-200 flex flex-col py-12 px-8 rounded-lg w-8/12 md:w-6/12 mx-auto gap-10">
    //   <h2 className="text-3xl font-bold text-center">Sign in to Twitter</h2>
  
    //   <input
    //     onChange={(e) => setEmail(e.target.value)}
    //     type="text"
    //     placeholder="email"
    //     className="text-xl py-2 rounded-full px-4"
    //   />      
    //   <input
    //     onChange={(e) => setPassword(e.target.value)}
    //     type="password"
    //     placeholder="password"
    //     className="text-xl py-2 rounded-full px-4"
    //   />
    //   { !loading ?   
    //   <button
    //     className="text-xl py-2 rounded-full px-4 bg-blue-500 text-white"
    //     onClick={handleLogin}
    //   >
    //     Sign in
    //    </button> : <button>Loading .....</button>
    //   }
    //   <p className="text-center text-xl">Don't have an account?</p>

    //   <input
    //     onChange={(e) => setEmail(e.target.value)}
    //     type="email"
    //     placeholder="email"
    //     required
    //     className="text-xl py-2 rounded-full px-4"
    //   />
    //   <input
    //     onChange={(e) => setPassword(e.target.value)}
    //     type="password"
    //     placeholder="password"
    //     className="text-xl py-2 rounded-full px-4"
    //   />
    //   {!loading ? 
    //       <button
    //       onClick={handleSignup}
    //       className="text-xl py-2 rounded-full px-4 bg-blue-500 text-white"
    //       type="submit"
    //     >
    //       Sign up
    //     </button> : <button>Loading .....</button>

    //   }
    // </form>
     <div className="bg-gray-200 flex flex-col py-12 px-8 rounded-lg w-8/12 md:w-6/12 mx-auto gap-10">
       <h2 className="text-3xl font-bold text-center">Sign in to Twitter</h2>
      <OAuth/>
     </div>
  );
};

export default Signin;
