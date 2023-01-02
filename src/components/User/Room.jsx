// import React from 'react'

// const Room = ({room, setCurrentRoom}) => {
//     const selectedUser = (userId, roomId) => {
//         if(roomId==null){
//           const user = listUsers.find((u) => u.user.id === userId);
//           setCurrentRoom(user);
//         }
//         else{
//           const room = listUsers.find((u) => u.rooms.id === roomId);
//           setCurrentRoom(room);
//         }
//       }; 
//   return (
//     <>
//     <div
//                             key={room.id}                           
//                             className="chat_people"
//                             onClick={() => selectedUser(room.id)}
//                           >
//                             <div className="chat_img">
//                               <img
//                                 src="https://ptetutorials.com/images/user-profile.png"
//                                 alt="sunil"
//                               />
//                             </div>
//                             <div className="chat_ib">
//                               <span
//                                 // v-if="user.status == true"
//                                 className={checkOnline(room) ==='Online' ?'badge badge-pill badge-success float-right'  : 'badge badge-pill badge-danger float-right'}
//                               >
//                                 {checkOnline(room)}
//                               </span>
//                               <input
//                                 className="form-check-input"
//                                 type="radio"
//                                 name="check"
//                                 style={{ display: "none" }}
//                               />
//                               <label className="form-check-label">
//                                 <h4>{showRoomName(room)}</h4>
//                               </label>
//                             </div>
//                             <div className="chat_ib">Moi nhat</div>
//                           </div>
//     </>
//   )
// }

// export default Room