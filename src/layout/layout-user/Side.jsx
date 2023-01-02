import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthApi from "../../Api/Auth/Auth";
import { NotificationsContext } from "../../context/NotificationsProvider";
import { UsersOnlineContext } from "../../context/UsersOnlineProvider";

const Side = () => {
  const navigate = useNavigate();
  const { totalUnread } = useContext(NotificationsContext);
  const { totalUnseenMessages } = useContext(UsersOnlineContext);

  const logout = () => {
    AuthApi.logout();
    navigate("/");
  };
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetch = async () => {
      const data = await AuthApi.getCurrentUser();
      setUser(data);
    };
    fetch();
  }, []);
  const checkRole = (role) => {
    if (user) {
      if (user && user.Role.includes(role)) {
        return true;
      }
      return false;
    }
    return false;
  };

  return (
    <>
      <div id="layoutSidenav_nav">
        <nav
          className="sb-sidenav accordion sb-sidenav-dark"
          id="sidenavAccordion"
        >
          <div className="sb-sidenav-menu">
            <div className="nav">
              <a className="nav-link" id="thongtintaikhoan">
                <div className="sb-nav-link-icon">
                  <i className="fas fa-tachometer-alt"></i>
                </div>
                Thông tin tài khoản
              </a>
              <a className="nav-link" id="doimatkhau">
                <div className="sb-nav-link-icon">
                  <i className="fas fa-table"></i>
                </div>
                Đổi mật khẩu
              </a>
              {checkRole("Admin") && (
                <Link
                  to="/admin/viewstaff"
                  className="nav-link"
                  id="doimatkhau"
                >
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-table"></i>
                  </div>
                  Quản lý nhân viên
                </Link>
              )}
              {checkRole("Manager") && (
                <Link
                  to="/manager/viewcategory"
                  className="nav-link"
                  id="doimatkhau"
                >
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-table"></i>
                  </div>
                  Quản lý danh mục
                </Link>
              )}
              {checkRole("Staff") && (
                <Link to="/staff/addpost" className="nav-link" id="doimatkhau">
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-table"></i>
                  </div>
                  Viết bài
                </Link>
              )}
              {checkRole("Staff") && (
                <Link to="/staff/myposts" className="nav-link" id="doimatkhau">
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-table"></i>
                  </div>
                  Bài viết của tôi
                </Link>
              )}
              {checkRole("Manager") && (
                <Link
                  to="/manager/approve"
                  className="nav-link"
                  id="doimatkhau"
                >
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-table"></i>
                  </div>
                  Duyệt bài
                </Link>
              )}
              {checkRole("Manager") && (
                <Link
                  to="/manager/allposts"
                  className="nav-link"
                  id="doimatkhau"
                >
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-table"></i>
                  </div>
                  Tất cả bài viết
                </Link>
              )}
              {checkRole("User") && (
                <Link
                  to="/user/notification"
                  className="nav-link"
                  id="doimatkhau"
                >
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-table"></i>
                  </div>
                  Thông báo{" "}
                  <div className="bg-danger" style={{ width:'25px',textAlign:'center',marginLeft:'10px' }}>
                    <span className="text-white">
                      {totalUnread}
                    </span>
                  </div>
                </Link>
              )}
              {checkRole("User") && (
                <Link to="/user/chat" className="nav-link" id="doimatkhau">
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-table"></i>
                  </div>
                  Trò chuyện <div className="bg-danger" style={{ width:'25px',textAlign:'center',marginLeft:'10px' }}>
                    <span className="text-white">
                      {totalUnseenMessages > 0 && totalUnseenMessages}
                    </span>
                  </div>
                </Link>
              )}
              <button
                type="button"
                onClick={logout}
                className="button-link"
                id="doimatkhau"
              >
                <div className="sb-nav-link-icon">
                  <i className="fas fa-power-off"></i>
                </div>
                Đăng xuất
              </button>
            </div>
          </div>
          <div className="sb-sidenav-footer">
            <div className="small">Đăng nhập bởi:</div>
            Admin
          </div>
        </nav>
      </div>
    </>
  );
};

export default Side;
