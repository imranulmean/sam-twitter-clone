import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

const signInApiURL2 = 'https://3elxti0c9b.execute-api.us-east-1.amazonaws.com/Stage/mernStatePost';
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
    'import.meta.env.SAM_SIGN_IN_API_URL': JSON.stringify(signInApiURL2),
  },  

  plugins: [react()],
});
