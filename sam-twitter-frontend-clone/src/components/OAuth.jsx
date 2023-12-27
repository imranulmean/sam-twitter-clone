import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import app from "../firebase";
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailed } from "../redux/userSlice";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading,setLoading]= useState(false);

  const handleGoogleClick = async () => {
    try {
      dispatch(loginStart());
      setLoading(true);      
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const {_tokenResponse} = await signInWithPopup(auth, provider);
      console.log(_tokenResponse);
      const email=_tokenResponse.email;
      const profilePicture=_tokenResponse.photoUrl;
      const type="google";
///////////////////////
        try {
          // const res = await axios.post("/api/auth/signin", { username, password });
          const twitterSigninUrl="https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/twittersignin";
          // const twitterSigninUrl=import.meta.env.twitterSigninUrl;
          const signinObj={email,profilePicture,type};

          const res= await fetch(twitterSigninUrl,{
            method:"POST",
            body: JSON.stringify(signinObj)
          })
          const loginData=await res.json();
          setLoading(false);
          dispatch(loginSuccess(loginData));
          navigate("/");
        } catch (err) {
          dispatch(loginFailed());
        }      
////////////////////////
      
    } catch (error) {
      console.log('could not sign in with google', error);
    }
  };

  return (
    <>
    {
     !loading ? 
      <button
        onClick={handleGoogleClick}
        type='button'
        className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
        >
        Login With google
      </button> : <button>Authenticating Wait ....</button>
    } 
    </>
  );
}


//////////////////////////
// const twitterSigninURL = "https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/twittersignin";
        
// try {
//   const response = await fetch(twitterSigninURL, {
//     method: 'GET', // Adjust the method based on your API configuration
//     headers: {
//       'Authorization': idToken,
//       'Content-Type': 'application/json',
//       // Add any other headers as needed
//     },
//   });

//   const data = await response.json();
//   console.log(data);
// } catch (error) {
//   console.error('Error calling API:', error);
// }

///////////////////////////  

// -------------------------------------------------
        // AWS.config.region = 'us-east-1';
        // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        //   IdentityPoolId: 'us-east-1:b0a755d9-bcfb-4784-929f-9742e02b4e64', // Replace with your Identity Pool ID
        //   Logins: {
        //     'accounts.google.com': googleToken.id_token,
        //   },
        // });
        
        // AWS.config.credentials.get(async function (err) {
        //   if (!err) {
        //     // Now AWS.config.credentials holds temporary credentials
        //     const twitterSigninURL = "https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/twittersignin";
        //     const response = await fetch(twitterSigninURL, {
        //       headers: {
        //         Authorization: AWS.config.credentials.params.Logins['cognito-idp.us-east-1.amazonaws.com/us-east-1_WGlDaLkZb'],
        //         // Include any additional headers if needed
        //       },
        //     });
        
        //     const data = await response.json();
        //     console.log(data);
        //   } else {
        //     console.log(err);
        //   }
        // });        