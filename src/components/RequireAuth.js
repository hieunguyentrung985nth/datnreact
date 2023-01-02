import { useLocation, Navigate, Outlet } from "react-router-dom";
import AuthApi from "../Api/Auth/Auth";
import useAuth from "../hooks/useAuth";
import jwtDecode, {jwt} from 'jwt-decode'

const RequireAuth = ({role})=>{
    const auth = AuthApi.checkAuth();
    if(auth==null) return <Navigate to='/login'/>;
    const user = jwtDecode(auth);
    console.log(user.Role,role, user.Role.includes(role));
    let result = false;
    if(auth!=null && user.Role.includes(role)) result = true;
    else result = false;
    
    return (
        result
        ? <Outlet/>
        : <Navigate to='/login'/>
    )
}

export default RequireAuth