import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

const twitterSigninUrl="https://j1168pmmug.execute-api.us-east-1.amazonaws.com/Prod/twitterSignin";
const findsUserUrl='https://j1168pmmug.execute-api.us-east-1.amazonaws.com/Prod/getuser/';
const getCurrentUserTweetUrl='https://j1168pmmug.execute-api.us-east-1.amazonaws.com/Prod/twitterTweetsByUserIdApi/';
const createTweetUrl="https://j1168pmmug.execute-api.us-east-1.amazonaws.com/Prod/createTweet";
const exploreTweetsUrl="https://j1168pmmug.execute-api.us-east-1.amazonaws.com/Prod/exploreTweets";
const likeUrl="https://j1168pmmug.execute-api.us-east-1.amazonaws.com/Prod/twitterLikeDislikeApi";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        secure: false,
      },
    },
  },
  define: {
    // Add the API URL as a Vite environment variable
    'import.meta.env.twitterSigninUrl': JSON.stringify(twitterSigninUrl),
    'import.meta.env.findsUserUrl': JSON.stringify(findsUserUrl),
    'import.meta.env.getCurrentUserTweetUrl': JSON.stringify(getCurrentUserTweetUrl),
    'import.meta.env.createTweetUrl': JSON.stringify(createTweetUrl),
    'import.meta.env.exploreTweetsUrl': JSON.stringify(exploreTweetsUrl),
    'import.meta.env.likeUrl': JSON.stringify(likeUrl),
  },  

  plugins: [react()],
});
