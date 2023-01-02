import { createContext, useContext, useEffect, useState } from "react";
import AuthApi from "../Api/Auth/Auth";
import { SocketContext } from "./SocketProvider";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const {socket} = useContext(SocketContext);
    const [user, setUser] = useState(null);
    useEffect(() => {

      const fetch = async () => {
        AuthApi.getUser().then((res) => {
          setUser(res.data.data);
        });
      };
      fetch();
      return () => {};
    }, [socket]);

    useEffect(() => {
      if (socket != null && user != null) {

        socket.emit("newUser", user);
        socket.on('newUserOnline',(data)=>{
          console.log(data.name +' đã online!');
        })
        return () =>{socket.off("newUserOnline");socket.off("newUser")}
      }
    }, [socket, user]);

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;