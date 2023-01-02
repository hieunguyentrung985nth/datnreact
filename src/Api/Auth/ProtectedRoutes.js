import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoutes = ({auth})=>{
    return (auth === true ? <Outlet/> : <Navigate to='/login'/>)
}

export default ProtectedRoutes