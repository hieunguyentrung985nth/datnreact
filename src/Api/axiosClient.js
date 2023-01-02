import axios from 'axios'
import AuthApi from './Auth/Auth'

const token = localStorage.getItem('token') || null;


let axiosClient;

if(token) {
    axiosClient = axios.create({
        baseURL: 'https://localhost:44354/api/',
        headers:{
            Authorization: 'Bearer '+token
        }
    })
}
else{
    axiosClient = axios.create({
        baseURL: 'https://localhost:44354/api/',      
    })
}


export default axiosClient