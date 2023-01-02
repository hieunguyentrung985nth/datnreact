import RouterProvider from './router/RouterProvider';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Main from './layout/main/Main';
import Login from './components/Auth/Login';
import { useContext, useEffect, useState } from 'react';
import AuthApi from './Api/Auth/Auth';
import useAuth from './hooks/useAuth';
import Profile from './components/User/Profile';
import RequireAuth from './components/RequireAuth';
import AddPost from './components/Staff/AddPost';
import Approve from './components/Manager/Approve';
import LayoutUser from './layout/layout-user/LayoutUser';
import MyPosts from './components/Staff/MyPosts';
import Notification from './components/User/Notification';
import Chat from './components/User/Chat';
import Header from './layout/header/Header';
import Footer from './layout/footer/Footer';
import RssFeed from './components/Home/RssFeed';
import NotFound from './components/NotFound/NotFound';
import Home from './components/Home/Home';
import Detail from './components/Home/Detail';
import addScript from './hooks/addScripts';
import AllPosts from './components/Manager/AllPosts';
import ViewCategory from './components/Manager/ViewCategory';
import Search from './components/Home/Search';
import ViewStaff from './components/Admin/ViewStaff';
import Register from './components/Auth/Register';


function App() {
  //const navigate = useNavigate();
  // const [isAuth, setIsAuth] = useContext();
  //   useEffect(() => {
  //     const checkAuth =async ()=>{
  //       const res = await AuthApi.checkAuth();
  //       setIsAuth(res);
  //       console.log(res);
  //     }
  //     checkAuth();
  //   }
  //   )

  const { setAuth } = useAuth();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} >
          <Route path="/" element={<Home />}>
            <Route path="/post" element={<Home />} />
          </Route>
          <Route path="/search" element={<Search />} />
          <Route path="/post/:slug" element={<Detail />} />
          <Route path="/rssfeed" element={<RssFeed />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<LayoutUser />}>
          <Route element={<RequireAuth role="Admin" />}>
            <Route path="/admin/viewstaff" element={<ViewStaff />} />
          </Route>
          <Route element={<RequireAuth role="Staff" />}>
            <Route path="/staff/addpost" element={<AddPost />} />
            <Route path="/staff/myposts" element={<MyPosts />} />
          </Route>
          <Route element={<RequireAuth role="Manager" />}>
            <Route path="/manager/viewcategory" element={<ViewCategory />} />
            <Route path="/manager/approve" element={<Approve />} />
            <Route path="/manager/allposts" element={<AllPosts />} />
          </Route>
          <Route element={<RequireAuth role="User" />}>
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/user/notification" element={<Notification />} />
            <Route path="/user/chat" element={<Chat />} />
          </Route>
        </Route>

      </Routes>
    </Router>

  );
}

export default App;
