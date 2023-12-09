import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import app from "../firebase";
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailed } from "../redux/userSlice";
import { useNavigate } from 'react-router-dom';


export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const fireBaseGoogleResult = await signInWithPopup(auth, provider);
      await AWSCognitoId(fireBaseGoogleResult);      
       return; 
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(loginStart());
      navigate('/');
    } catch (error) {
      console.log('could not sign in with google', error);
    }
  };

  const AWSCognitoId= async(fireBaseGoogleResult) =>{

    //console.log('googleResult._tokenResponse.oauthIdToken',fireBaseGoogleResult._tokenResponse.oauthIdToken);  
    console.log(fireBaseGoogleResult);
    const twitterSigninURL = "https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/twittersignin";
    const twitterSigninData= await fetch(twitterSigninURL);
    console.log(await twitterSigninData.json());
}


  return (
    <>
      <button
        onClick={handleGoogleClick}
        type='button'
        className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
      >
        Login With google
      </button>  
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