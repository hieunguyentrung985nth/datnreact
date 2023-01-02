import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthApi from "../../Api/Auth/Auth";
import "./login.css";

const Register = () => {
  document.body.style.backgroundImage =
    "url('http://getwallpapers.com/wallpaper/full/a/5/d/544750.jpg')";
  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateInput(e);
  };
  const [err, setErr] = useState(true)


  const validateInput = (e) => {
    let { name, value } = e.target;
    setError((prev) => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "email":
          if (!value) {
            stateObj[name] = "Hãy nhập email";
          }
          break;

        case "password":
          if (!value) {
            stateObj[name] = "Hãy nhập mật khẩu";
          } else if (input.confirmPassword && value !== input.confirmPassword) {
            stateObj["confirmPassword"] =
              "Mật khẩu không trùng";
          } else {
            stateObj["confirmPassword"] = input.confirmPassword
              ? ""
              : error.confirmPassword;
          }
          break;

        case "confirmPassword":
          if (!value) {
            stateObj[name] = "Hãy nhập xác nhận mật khẩu";
          } else if (input.password && value !== input.password) {
            stateObj[name] = "Mật khẩu không trùng";
          }
          break;

        default:
          break;
      }
      return stateObj;
    });
  };
  
  const checkIfAnyErrors = useMemo(()=>{
   return Object.values(error).every(e=>e==='');
    // for (let key in error){
    //     console.log(error[key]);
    // }
  },[error])
  

  const submit = async (e) => {
    e.preventDefault();
    console.log(input);
    // const auth = {email,password};
    // await AuthApi.login(auth).then(res=>{
    //     console.log(res.data);
    //     localStorage.setItem('token', res.data.token);

    //     navigate('/',{replace:true});
    // })
    // .catch(e=>alert(e.response.data));
  };
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await AuthApi.checkAuth();
      setIsAuth(res);
      if (res) navigate("/");
    };
    checkAuth();
  }, [isAuth]);

  return (
    <>
      <div className="container">
        <div className="d-flex justify-content-center h-100">
          <div className="card">
            <div className="card-header">
              <h3>Đăng ký</h3>
              <div className="d-flex justify-content-end social_icon"></div>
            </div>
            <div className="card-body">
              <div>
                {/* <span id="error" style={{display:'none !important'}} className="alert-danger alert d-block"></span> */}
              </div>
              <form onSubmit={submit}>
                <div className="input-group form-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fas fa-user"></i>
                    </span>
                  </div>
                  <input
                    value={input.email}
                    onChange={onInputChange}
                    onBlur={validateInput}
                    type="email"
                    className="form-control"
                    placeholder="Tên tài khoản"
                    name="email"
                  />
                </div>
                <div>
                  {error.email && <span className="alert alert-danger d-block">{error.email}</span>}
                </div>
                <div className="input-group form-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fas fa-key"></i>
                    </span>
                  </div>
                  <input
                    value={input.password}
                    onChange={onInputChange}
                    onBlur={validateInput}
                    type="password"
                    className="form-control"
                    placeholder="Nhập lại mật khẩu"
                    name="password"
                  />
                </div>
                <div>
                  {error.password && (
                    <span className="alert alert-danger d-block">{error.password}</span>
                  )}
                </div>
                <div className="input-group form-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fas fa-key"></i>
                    </span>
                  </div>
                  <input
                    value={input.confirmPassword}
                    onChange={onInputChange}
                    onBlur={validateInput}
                    type="password"
                    className="form-control"
                    placeholder="Nhật lại mật khẩu"
                    name="confirmPassword"
                  />
                </div>
                <div>
                {error.confirmPassword && (
                  <span className="alert alert-danger d-block">{error.confirmPassword}</span>
                )}
                </div>
                <div className="form-group">
                  <button
                    type="submit"
                    className="w-100 btn float-right login_btn text-center"
                    disabled={checkIfAnyErrors ? false : true}
                  >
                    Đăng ký
                  </button>
                </div>
              </form>
            </div>
            <div className="card-footer">
              <div className="d-flex justify-content-center links">
                Đã có tài khoản?<Link to={'/login'}>Đăng nhập ngay</Link>
              </div>
              <div className="d-flex justify-content-center">
                <a href="/">Quên mật khẩu?</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
