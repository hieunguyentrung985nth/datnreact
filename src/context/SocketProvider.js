import React, { useContext,createContext, useState, Children, useEffect, useMemo } from 'react'
import {io} from 'socket.io-client'
import AuthApi from '../Api/Auth/Auth';
import { UsersOnlineContext } from './UsersOnlineProvider';

const socket = io('http://localhost:3333')
export const SocketContext = createContext(socket); 

const SocketProvider = ({children, totalProp}) => {
    //const [socket, setSocket] = useState(io('http://localhost:3333'));

    console.count('start socket');
    const [myRooms, setMyRooms] = useState([]);
    const [totalUnseenMessages, setTotalUnseenMessages] = useState(0);
  
    useEffect(() => {
      socket.on("getRooms", (data) => {
        setMyRooms(data.rooms);
        console.log('Get rooms');
        const total =data.rooms.reduce((total, current) => {
          return total + current.unseenCount;
        },0);
        console.log('TOTAL UNSEEN MESS', total);
        setTotalUnseenMessages(total);
      });
      return () => socket.off("getRooms");
    }, [myRooms]);
   
    useEffect(()=>{
      socket.on('privateChat',({message,room})=>{
        console.log({message,room, totalUnseenMessages});
        setTotalUnseenMessages(totalUnseenMessages+1);
      })
    })


  //       useEffect(() => {
  //   const handleTabClose = event => {
  //     event.preventDefault();
  //     socket.emit('disconnect','OFFLINE')
  //     return ()=> socket.off("disconnect");
  //   };

  //   window.addEventListener('beforeunload', handleTabClose);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleTabClose);
  //   };
  // }, []);
  return (
    <SocketContext.Provider value={{socket, totalUnseenMessages, setTotalUnseenMessages, myRooms,setMyRooms}}>
        {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider