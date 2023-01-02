import jwtDecode from "jwt-decode";
import { useState } from "react";
import axiosClient from "../axiosClient";

const AuthApi = {
    checkAuth(){
        const token = this.getToken();
        return token;
    },

    getToken(){
        return localStorage.getItem('token') || null;
    },

    getCurrentUser(){
        const token = this.getToken();
        if(token==null) return;
        const user = jwtDecode(token);
        return user;
    },
    login(auth){
        const url = 'login';
        return axiosClient.post(url, auth);
    },
    logout(){
        localStorage.removeItem('token');
    },
    getUser(){
        const user = this.getCurrentUser();
        const url = 'users/getoneuser';
        console.log(user);
        return axiosClient.get(url+'?id='+user.ID);
    }
}

export default AuthApi;