import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { SocketContext } from './SocketProvider';

export const NotificationsContext = createContext({}); 


const NotificationsProvider = ({children}) => { 
    const {socket} = useContext(SocketContext);
    const [notification, setNotification] = useState([]);
    const [totalUnread, setTotalUnread] = useState(null);
    const [page, setPage] = useState(1);
    console.count('notification render');
    useEffect(() => {
      const handler = (data) => {
        setNotification(data.data);
        setTotalUnread(data.totalUnreads)
        console.log(data);
      };

      socket.on("getAllNotifications", handler);
      return () => socket.off("getAllNotifications");
    }, [socket, notification]);

    // const totalUnreadNotifications = useMemo(() => {
    //   return [...notification].filter((not) => {
    //     return not.not.read === "false";
    //   }).length;
    // }, [notification]);

  return (
    <NotificationsContext.Provider value={{socket,notification, setNotification, totalUnread, setTotalUnread, page, setPage}}>
    {children}
</NotificationsContext.Provider>
  )
}

export default NotificationsProvider