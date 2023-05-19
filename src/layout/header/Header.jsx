import React, { useRef } from "react";
import './index.css'
import logo from '../../assets/images/logo.png'
import { createSearchParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import AuthApi from "../../Api/Auth/Auth";
import HomeApi from "../../Api/Home/HomeApi";


const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  useEffect(()=>{
    setUser(AuthApi.getCurrentUser() ? AuthApi.getCurrentUser() : null);
    console.log(user);
  },[]);

  useEffect(() => {
    const fetchList = async () => {
      const res = await HomeApi.getAllCategories();
      setCategories(res.data.data);
      console.log(res.data.data);
    };
    fetchList();
  }, []);

  const logout = ()=>{
    AuthApi.logout();
    setUser(null);
  }
  const redirect = ()=>{
    if(user!=null){
      if(user.Role.includes('Staff'))
      navigate('/staff/addpost');
    else if(user.Role.includes('Manager'))
      navigate('/manager/approve');
    else if(user.Role.includes('Admin'))
      navigate('/admin/viewstaff');
    else navigate('/user');
    }
   
  }
  const searchText = useRef();
  const search = ()=>{
    navigate({
      pathname: '/search',
      search: createSearchParams({
        key: searchText.current.value
      }).toString()
    })
  }
  return (
    <>
      <div className="container-fluid">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-3 fh5co_padding_menu">
              <img
                src="/assets/images/logo.png"
                alt="img"
                className="fh5co_logo_width"
              />
            </div>
            <div className="col-12 col-md-9 align-self-center fh5co_mediya_right">
              <div style={{display:'inline-block',paddingRight:'20px'}}>
                <input type="text" ref={searchText}/>
                <button type="button" onClick={search}><i
                  className="fa fa-search"
                  style={{ paddingLeft: "5px", cursor: "pointer" }}
                ></i></button>
              </div>
              <div className="d-inline-block text-center dd_position_relative ">
                {!user &&   <button
                  className="btn btn-secondary"
                  style={{
                    display: "inline-block",
                    backgroundColor: "white !important",
                  }}
                >
                  <Link
                    to="/login"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    Đăng Nhập/Đăng Ký
                  </Link>
                </button>   }
             
                { user &&  <div className="dropdown" id="dropdownmenu">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Xin chào  {user.Email }
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{fontFamily:'sans-serif'}}>
                            <button type="button" onClick={redirect} className="dropdown-item">Quản lý tài khoản</button>
                            <button className="btn btn-link dropdown-item" id="logout" type="button" onClick={logout}>Đăng xuất</button>
                        </div>
                    </div> } 
                          
              </div>
              
              <div className="clearfix"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid bg-faded fh5co_padd_mediya padding_786">
        <div className="container padding_786">
          <nav className="navbar navbar-toggleable-md navbar-light ">
            <button
              className="navbar-toggler navbar-toggler-right mt-3"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="fa fa-bars"></span>
            </button>
            <a className="navbar-brand" href="#">
              <img
                src={logo}
                alt="img"
                className="mobile_logo_width"
              />
            </a>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                  <Link className="nav-link" to='/'>
                    Trang Chủ <span className="sr-only">(current)</span>
                  </Link>
                </li>
                <li className="nav-item ">
                  <a className="nav-link" href="blog.html">
                    Tin Mới <span className="sr-only">(current)</span>
                  </a>
                </li>

                <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="dropdownMenuButton2" data-toggle="dropdown"
                           aria-haspopup="true" aria-expanded="false">Danh Mục <span className="sr-only">(current)</span></a>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink_1">
                          {categories && categories.map((category)=>(
                            <Link to={"/category/" + category.slug} className="dropdown-item">
                              {category.title}
                            </Link>
                          ))}
                            {/* <a className="dropdown-item" href="#">PC/CONSOLE</a>
                            <a className="dropdown-item" href="#">Mobile</a> */}
                        </div>
                    </li>
                    <li className="nav-item">
                  <Link className="nav-link" to='/rssfeed'>
                    RSS Feed <span className="sr-only">(current)</span>
                  </Link>
                </li>
                <li className="nav-item ">
                  <a className="nav-link" href="Contact_us.html">
                    Về Chúng Tôi <span className="sr-only">(current)</span>
                  </a>
                </li>
                <li className="nav-item ">
                  <a className="nav-link" href="Contact_us.html">
                    Liên hệ <span className="sr-only">(current)</span>
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
