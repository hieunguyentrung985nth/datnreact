import React, { useContext, useEffect, useMemo } from "react";
import { useState } from "react";
import { io } from "socket.io-client";
import AuthApi from "../../Api/Auth/Auth";
import ManagerApi from "../../Api/Manager/ManagerApi";
import AuthContext from "../../context/AuthProvider";
import { NotificationsContext } from "../../context/NotificationsProvider";
import { SocketContext } from "../../context/SocketProvider";
import { UsersOnlineContext } from "../../context/UsersOnlineProvider";
import Side from "../../layout/layout-user/Side";
import { hideText, transDate } from "../../utils/Pipe";

let page = 1;

const Notification = () => {
  // const [socket, setSocket] = useState(io("http://localhost:3333",{
  //   'reconnectionAttempts':5,
  //   'reconnectionDelay':1000
  // }));
  const { socket, setSocket } = useContext(SocketContext);

  const { onlineUsers, setOnlineUsers } = useContext(UsersOnlineContext);

  const { notification, setNotification,totalUnread, setTotalUnread, page,setPage } = useContext(NotificationsContext);

  const {user} = useContext(AuthContext);

  // const sendNotification = (userId) => {
  //   socket.emit("sendNotification", {
  //     creator_id: userId,
  //     post_id: "Test notification",
  //     type: "newpost",
  //   });
  // };

  useEffect(() => {
    const handler = ({
      not: { id, post_id, creator_id, type, createdAt, read },
      post,
      author,
    }) => {
      console.log({
        not: { id, post_id, creator_id, type, createdAt, read },
        post,
        author,
      });
      const newArray = [
        {
          not: { id, post_id, creator_id, type, createdAt, read },
          post,
          author,
        },
        ...notification,
      ];
      setNotification(newArray);
      setTotalUnread((prev)=>prev+1);
    };
    socket.on("getNotification", handler);
    return () => socket.off("getNotification", handler);
  }, [socket, notification, setNotification, setTotalUnread]);

  const transformText = (author, type, title) => {
    let res = "";
    if (type === "newpost") {
      res = `${author} vừa đăng bài viết mới: ${hideText(title, 20)}`;
    }
    return res;
  };

  const readNotification = (not, index) => {
    console.log(not);
    socket.emit("readNotification", not.id);
    let items = [...notification];
    let item = { ...not };
    if (item.read === "true"){
      item.read = "false";
      setTotalUnread((prev)=> prev+1);
    } 
    else{
      item.read = "true";
      setTotalUnread((prev)=> prev-1);
    } 
    items[index].not = item;
    
    console.log(items);
    setNotification(items);
    return () => socket.off("readNotification");
  };

  const getMoreNotifications =()=>{   
    const handler = async ()=>{  
      setPage((prev)=>prev+1);
      const fetch = await ManagerApi.getMoreNotifications(user.id, page+1);
      console.log(fetch.data);
      setNotification((prev)=>[...prev,...fetch.data.data]);
      setTotalUnread(fetch.data.totalUnreads);
    }
    handler();
  }
  console.count('not render');

  return (
    <>
      <div id="layoutSidenav">
        <Side/>
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4" id="thongtin">
              <h1 className="mt-4">Thông báo</h1>
              <button
                // onClick={sendNotification}
                type="button"
                className="btn btn-primary"
              >
                Send notification
              </button>
              <table className="table">
                <thead></thead>
                <tbody>
                  {onlineUsers &&
                    onlineUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>
                          <button
                            // onClick={() => sendNotification(user.id)}
                            className="btn btn-success"
                            type="button"
                          >
                            Send Notifi
                          </button>
                        </td>
                      </tr>
                    ))}
                  {notification &&
                    notification?.map((not, index) => (
                      <tr
                        key={not.not.id}
                        style={{
                          backgroundColor:
                            not.not.read === "false" ? "rgb(135,206,250)" : "",
                        }}
                      >
                        <td>
                          {transformText(
                            not.author.name,
                            not.not.type,
                            not.post.title
                          )}
                        </td>
                        {/* <td>{not.post.title}</td>
                            <td>{not.not.type}</td> */}
                        <td>{transDate(not.not.createdAt)}</td>
                        <td>
                          <button
                            onClick={() => readNotification(not.not, index)}
                            className="btn-link"
                          >
                            {not.not.read === "false" ? "Đã đọc" : "Chưa đọc"}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td>
                      <button
                        type="button"
                        className="btn btn btn-outline-primary"
                        onClick={getMoreNotifications}
                      >
                        Hiện thêm thông báo
                      </button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Notification;
