import React, {useState,useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import AuthApi from '../../Api/Auth/Auth';
import './login.css'

const Login = () => {
    document.body.style.backgroundImage = "url('http://getwallpapers.com/wallpaper/full/a/5/d/544750.jpg')";
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const submit =async (e)=>{
        e.preventDefault();
        const auth = {email,password};
        await AuthApi.login(auth).then(res=>{
            console.log(res.data);
            localStorage.setItem('token', res.data.token);
            
            navigate('/',{replace:true});
        })
        .catch(e=>alert(e.response.data));
    }
    const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    const checkAuth =async ()=>{
      const res = await AuthApi.checkAuth();
      setIsAuth(res);
      console.log(res);
      if(res) navigate('/');
    }
    checkAuth();
  }, [isAuth])
  
  

  return (
    <>
    <div className="container">
    <div className="d-flex justify-content-center h-100">
        <div className="card">
            <div className="card-header">
                <h3>Đăng nhập</h3>
                <div className="d-flex justify-content-end social_icon">
                </div>
            </div>
            <div className="card-body">
               <div>
                {/* <span id="error" style={{display:'none !important'}} className="alert-danger alert d-block"></span> */}
               </div>
                <form onSubmit={submit}>
                    <div className="input-group form-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><i className="fas fa-user"></i></span>
                        </div>
                        <input onChange={(e)=>setEmail(e.target.value)} type="email" className="form-control" placeholder="Tên tài khoản" name="email" />
                    </div>
                    <div>
                        {/* <span 
                         className="alert alert-danger d-block">Hãy nhập email</span> */}
                      </div>
                    <div className="input-group form-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><i className="fas fa-key"></i></span>
                        </div>
                        <input onChange={(e)=>setPassword(e.target.value)} type="password" className="form-control" placeholder="Mật khẩu" name="password" />
                    </div>
                    <div>
                        {/* <span 
                         className="alert alert-danger d-block">Hãy nhập mật khẩu</span> */}
                      </div>
                    <div className="row align-items-center remember">
                        <input type="checkbox" name="remember"/>Nhớ mật khẩu
                    </div>
                    <div className="form-group">
                        <button type="submit" className="w-100 btn float-right login_btn text-center">Đăng nhập</button>
                    </div>
                </form>
            </div>
            <div className="card-footer">
                <div className="d-flex justify-content-center links">
                    Chưa có tài khoản?<Link to={'/register'}>Đăng ký ngay</Link>
                </div>
                <div className="d-flex justify-content-center">
                    <a href="/">Quên mật khẩu?</a>
                </div>
            </div>
        </div>
    </div>
</div>

    </>
  )
}

export default Login