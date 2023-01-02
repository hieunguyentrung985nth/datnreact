import React, { useContext, useMemo, useState } from "react";
import { useEffect } from "react";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";
import AuthApi from "../../Api/Auth/Auth";
import Approve from "../../components/Manager/Approve";
import RequireAuth from "../../components/RequireAuth";
import AddPost from "../../components/Staff/AddPost";
import MyPosts from "../../components/Staff/MyPosts";
import Chat from "../../components/User/Chat";
import Notification from "../../components/User/Notification";
import Profile from "../../components/User/Profile";
import { AuthProvider } from "../../context/AuthProvider";
import NotificationsProvider from "../../context/NotificationsProvider";
import SocketProvider, { SocketContext } from "../../context/SocketProvider";
import { TestContext } from "../../context/TestProvider";
import UsersOnlineProvider, { UsersOnlineContext } from "../../context/UsersOnlineProvider";
import addScript from "../../hooks/addScripts";
import "./layoutuser.css";

const LayoutUser = () => {
  useEffect(() => {
    addScript("../../assets/jquery-3.6.0.min.js");
    //addScript("../../assets/user/js/scripts.js");
  });

  const navigate = useNavigate();
  const logout = () => {
    AuthApi.logout();
    navigate("/");
  };

  const [user, setUser] = useState(null);
  useEffect(() => {

    const fetch = async () => {
      AuthApi.getUser().then((res) => {
        setUser(res.data.data);
      });
    };
    fetch();
    return () => {};
  }, []);
  const {totalUnseenMessages} = useContext(UsersOnlineContext);

  return (
    <>
      <SocketProvider totalUnseenMessages = {totalUnseenMessages}>
        <AuthProvider>
        <UsersOnlineProvider>
          <NotificationsProvider>
            <TestContext.Provider value={{ user }}>
          <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            <Link className="navbar-brand ps-3" to="/">
              Trang Chủ
            </Link>
            <button
              className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
              id="sidebarToggle"
              href="#!"
            >
              <i className="fas fa-bars"></i>
            </button>
            <form
              className="
      d-none d-md-inline-block
      form-inline
      ms-auto
      me-0 me-md-3
      my-2 my-md-0
    "
            ></form>
            <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-user fa-fw"></i>
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdown"
                >
                  <li>
                    <button
                      type="button"
                      onClick={logout}
                      className="dropdown-item"
                    >
                      Đăng Xuất
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
          <Outlet/>
          {/* <Routes>
            <Route element={<RequireAuth role="User" />}>
              <Route index path="/user/profile" element={<Profile />} />
              <Route
                index
                path="/user/notification"
                element={<Notification />}
              />
                <Route
                path="/user/chat"
                element={<Chat />}
              />
            </Route>

            <Route element={<RequireAuth role="Staff" />}>
              <Route index path="/staff/addpost" element={<AddPost />} />
              <Route index path="/staff/myposts" element={<MyPosts />} />
            </Route>
            <Route element={<RequireAuth role="Manager" />}>
              <Route index path="/manager/approve" element={<Approve />} />
            </Route>
          </Routes> */}
          </TestContext.Provider>
          </NotificationsProvider>
        </UsersOnlineProvider>
        </AuthProvider>
      </SocketProvider>
    </>
  );
};

export default LayoutUser;
