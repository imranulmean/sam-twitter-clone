import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import "./App.css";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Explore from "./pages/Explore/Explore";
import Signin from "./pages/Signin/Signin";
import Navbar from "./components/Navbar/Navbar";
import Error from "./pages/Error/Error";
import TweetPage from "./pages/tweetPage";
import LeftSidebar from "./components/LeftSidebar/LeftSidebar";
import RightSidebar from "./components/RightSidebar/RightSidebar";
import PrivateRoute from './components/PrivateRoute';
import { useSelector } from 'react-redux';
import GetOneComment from "./pages/GetOneComment";

// const Layout = () => {
//   return (
//     // <div className="md:w-8/12 mx-auto">
//     <div className="w-full mx-auto">
//       <Navbar />
//       <Outlet></Outlet>
//     </div>
//   );
// };

// const router = createBrowserRouter([
//   {
//     path: "/",
//     errorElement: <Error />,
//     element: <Layout />,
//     children: [
//       {
//         path: "/",
//         element: <Home />,
//       },
//       {
//         path: "/profile/:id",
//         element: <Profile />,
//       },
//       {
//         path: "/explore",
//         element: <Explore />,
//       },
//       {
//         path: "/signin",
//         element: <Signin />,
//       },
//       {
//         path: "/signout",
//         element: <Signin />,
//       },
//       {
//         path: "/tweet/:userId/:tweetId",
//         element: <TweetPage />,
//       }     
//     ],
//   },
// ]);

// function App() {
//   return (
//     <div>
//       <RouterProvider router={router}></RouterProvider>
//     </div>
//   );
// }

// export default App;

export default function App() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <BrowserRouter>
      <Navbar />
        <div className="grid grid-cols-1 md:grid-cols-4">
          <div className="px-6">
            {currentUser!==null && <LeftSidebar />}
          </div>
          <div className="col-span-2 border-x-2 border-t-slate-800 px-6">
            <Routes>     
              <Route path='/signin' element={<Signin />} />
              <Route element={<PrivateRoute />}>
                <Route path='/' element={<Home />} />
                <Route path='/explore' element={<Explore />} />
                <Route path='/signout' element={<Signin />} />
                <Route path='/profile/:id' element={<Profile />} />
                <Route path='/tweetPage/:userId/:tweetId' element={<TweetPage />} />
                {/* <Route path='/comment/:tweetId/:createdAt' element={<GetOneComment />} /> */}
              </Route>        
            </Routes>   
          </div>
          <div className="px-6">
            {currentUser !==null &&<RightSidebar />}
          </div>
        </div>
    </BrowserRouter>
  
  );
}
