import React, { useContext, useMemo, useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import AuthContext from "../../context/AuthProvider";
import { SocketContext } from "../../context/SocketProvider";
import { TestContext } from "../../context/TestProvider";
import { UsersOnlineContext } from "../../context/UsersOnlineProvider";
import Side from "../../layout/layout-user/Side";
import "./chat.css";
import "moment/locale/vi";
import { v4 as uuidv4 } from "uuid";
import Moment from "react-moment";
import "moment/locale/vi";
import moment from "moment/min/moment-with-locales";

var tim;

const Chat = () => {
  Moment.globalMoment = moment;
  Moment.globalLocale = "vi";
  Moment.globalLocal = true;
  //Moment.globalFormat = 'DD MM YYYY';
  Moment.startPooledTimer(60000);
  const { socket } = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const {
    onlineUsers,
    setOnlineUsers,
    onlineUsersTemp,
    setOnlineUsersTemp,
    myRooms,
    setMyRooms,
    totalUnseenMessages,
    setTotalUnseenMessages,
  } = useContext(UsersOnlineContext);
  const [offlineUsers, setOfflineUsers] = useState([]);
  const [currentRoomName, setCurrentRoomName] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [newRoom, setNewRoom] = useState(null);
  const [message, setMessage] = useState({
    senderId: user?.id,
    roomId: "",
    content: "",
  });

  const contentInput = useRef("");

  const [allMessages, setAllMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const scrollRef = useRef();
  const convertArrayToObject = (array, key) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
      return {
        ...obj,
        [item[key]]: item,
      };
    }, initialValue);
  };

  useEffect(() => {
    if (user) {
      socket.emit("getRoom", user.id);
      socket.on("getRooms", (data) => {
        setMyRooms(data.rooms);
        console.log("Get rooms");
        const total = data.rooms.reduce((total, current) => {
          return total + current.unseenCount;
        }, 0);
        console.log("TOTAL UNSEEN MESS", total);
        setTotalUnseenMessages(total);
      });
    }
    return () => socket.off("getRooms");
  }, [user, socket]);

  useEffect(() => {
    if (user && onlineUsers) {
      socket.emit("toChatRoom", user.id);
      socket.on("getAllStaffs", (data) => {
        console.log(data);
        setAllUsers(data);

        const q = myRooms
          .map((r) => r.participants.map((p) => p.id))
          .map((u) => u[0]);
        const final = data.filter(
          (u) => !onlineUsers.map((a) => a.id).includes(u.id)
        );
        const f = final?.filter((t) => !q.includes(t.id));
        setOfflineUsers(f);
      });
    }
    return () => {
      socket.off("toChatRoom");
      socket.off("getAllStaffs");
    };
  }, [user, socket, onlineUsers, myRooms]);
  // console.log("My rooms:", myRooms);
  // console.log("Online users:", onlineUsers);
  // console.log("Offline users:", offlineUsers);

  useEffect(() => {
    const handle = () => {
      const q = myRooms
        .map((r) => r.participants.map((p) => p.id))
        .map((u) => u[0]);
      console.log("qqq", q);
      const s = onlineUsers?.filter((u) => q.some((r) => r === u.id));
      console.log("SSS", s);
      //const t = onlineUsers?.filter(q=>!q.id.includes(s.map(t=>t.id)));
      const t = onlineUsers?.filter((t) => !q.includes(t.id));
      //const f = offlineUsers?.filter((t) => !q.includes(t.id));
      console.log("TTTT", t);
      //console.log("FFFF", f);
      //if(t?.length >0)
      setOnlineUsersTemp(t);
      //setOfflineUsers(f);
      //else setOnlineUsersTemp(onlineUsers);
    };
    handle();
    return () => {};
  }, [myRooms, onlineUsers, setOnlineUsersTemp]);

  const checkIfScroll = () => {
    const el = document.getElementById("msg_history");
    if (el.clientHeight < el.scrollHeight) return true;
  };

  useEffect(() => {
    socket.on("privateChat", (data) => {
      console.log(data);

      const index = myRooms.findIndex((r) => r.id === data.room.id);
      if (currentRoom?.id === data.room.id) {
        setAllMessages((prev) => [...prev, data.message]);
      }
      if(currentRoom?.id === data.room.id && data.message.senderId !== user.id){
        document.getElementById("seen").style.visibility = "hidden";
        
      }
      else {
        document.getElementById("seen").style.visibility = "visible";
      }
      let items = [...myRooms];
      let item = { ...myRooms[index] };
      item.latest = data.message;
      item.unseenCount += 1;
      items[index] = item;
      console.log("Items", items);
      console.log("Item", item);
      const newArr = array_move(items, index, 0);
      setMyRooms(newArr);
      setTotalUnseenMessages((prev) => prev + 1);
    });
    return () => socket.off("privateChat");
  }, [myRooms, socket, setMyRooms, currentRoom, setTotalUnseenMessages]);

  useEffect(()=>{
    socket.on('haveReadMessage',({receiveUser, roomId, ownerId,data})=>{
      const latestNot = data.messages.map(m=>m.message).map(m=>m.messNotification)[0];
      if(currentRoom && currentRoom.id === roomId && ownerId !== user.id && receiveUser.id === user.id && latestNot.ownerId !== user.id){
        document.getElementById("seen").style.visibility = "visible";
        console.log('CON CHOOOO');
      }
      else{
        document.getElementById("seen").style.visibility = "hidden";
      }
    })
    return () => socket.off("haveReadMessage");
  },[currentRoom, socket,user])

  const selectedUser = (userId, roomId) => {
    toTheBottom = false;
   
    if (roomId) {
      const room = myRooms.find((r) => r.id === roomId);
      console.log(room);
      if(room.unseenCount > 0){
        socket.emit("readMessage", {
          roomId: room?.id,
          ownerId: user.id,
          receiveId: room.participants[0].id,
        });
      }
      socket.emit("getMessages", {
        roomId: room.id,
        ownerId: user.id,
        participants: room.participants,
      });
      setTotalUnseenMessages((prev) => prev - room.unseenCount);
      room.unseenCount = 0;
      const selected = allUsers.find((x) => x.id === room.participants[0].id);
      setCurrentRoomName(selected);
      setCurrentRoom(room);
      setNewRoom(null);     
      setActiveChat(room);
      socket.on("getMessage", (data) => {
        const latestNot = data.messages.map(m=>m.message).map(m=>m.messNotification)[0];
        console.log(latestNot);
        console.log(data);
        const a = data.messages.map((d) => d.message).reverse();
        //console.log(a);
        if(latestNot.ownerId !== user.id && room?.id === data.room.id && latestNot.read !== "0001-01-01T00:00:00"){
          document.getElementById("seen").style.visibility = "visible";
          console.log('VISIBLEEEEE');
        }
        else{
          document.getElementById("seen").style.visibility = "hidden";
          console.log('HIDDENNNN');
        }  
        setAllMessages(a);
        
      });

      //socket.emit('joinRoom',roomId);
      return () => {
        socket.off("getMessages");
        socket.off("getMessage");
      };
    } else {
      const selected = allUsers.find((x) => x.id === userId);
      console.log("Selected", selected);
      setCurrentRoomName(selected);
      setNewRoom(selected);
      setActiveChat(selected)
      setCurrentRoom(null);
      setAllMessages([]);
      checkIfScroll();
    }
  };
  //console.log("Offline", offlineUsers);

  const sendMessage = (e) => {
    e.preventDefault();
    const currentDate = new Date();
    const id = uuidv4();
    console.log(currentRoom);
    if (currentRoom != null) {
      socket.emit("sendMessage", {
        id: id,
        senderId: user.id,
        roomId: currentRoom.id,
        content: contentInput.current.value,
        participants: currentRoom.participants,
      });
      const mess = {
        id: id,
        content: contentInput.current.value,
        createdAt: currentDate,
        name: user.name,
        roomId: currentRoom.id,
        senderId: user.id,
      };
      console.log(mess);
      setAllMessages((prev) => [...prev, mess]);
      const index = myRooms.findIndex((x) => x.id === currentRoom.id);
      let items = [...myRooms];
      let item = { ...myRooms[index] };
      item.latest = mess;
      items[index] = item;
      console.log("ITEMSS", items);
      const newArr = array_move(items, index, 0);
      setMyRooms(newArr);
      //setMyRooms((prev) => array_move(prev, index, 0));
      contentInput.current.value = "";
      document.getElementById("seen").style.visibility = "hidden";
      return () => socket.off("sendMessage");
    }
    const participants = [];
    console.log("newRoom", newRoom);
    const participantOnline = onlineUsers?.find((x) => x.id === newRoom.id);
    const participantOffline = offlineUsers?.find((x) => x.id === newRoom.id);

    participants.push(participantOnline || participantOffline);
    const roomId = uuidv4();

    const mess = {
      id: id,
      content: contentInput.current.value,
      createdAt: currentDate,
      name: user.name,
      roomId: roomId,
      senderId: user.id,
    };

    const newCreatedRoom = {
      createdAt: new Date(),
      group: false,
      id: roomId,
      latest: mess,
      messages: [mess],
      name: user.name,
      participants: participants,
      unseenCount: 0,
    };

    // console.log(newCreatedRoom);

    let items = [...myRooms];

    const newArr = [newCreatedRoom].concat(items);

    //console.log(newArr);

    setMyRooms(newArr);

    setCurrentRoom(newCreatedRoom);

    setAllMessages((prev) => [...prev, mess]);
    document.getElementById("seen").style.visibility = "hidden";
    socket.emit("sendMessageToNewRoom", {
      id: id,
      content: contentInput.current.value,
      createdAt: currentDate,
      name: user.name,
      roomId: roomId,
      senderId: user.id,
      participants,
    });

    contentInput.current.value = "";
    //console.log(mess);
    return () => socket.off("sendMessage");
  };
  //console.log('My ROOOMS',myRooms);

  useEffect(() => {
    socket.on("receivedNewMessageFromNewRoom", (res) => {
      //console.log('New chat',res);
      const newChatRoom = {
        createdAt: res.room.createdAt,
        group: false,
        id: res.room.id,
        latest: res.message,
        messages: [res.message],
        name: res.room.name,
        participants: res.participants,
        unseenCount: 1,
      };
      let items = [...myRooms];

      const newArr = [newChatRoom].concat(items);

      console.log(newArr);

      setMyRooms(newArr);
    });
    return () => socket.off("receivedNewMessageFromNewRoom");
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  let toTheBottom = false;

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.clientHeight <= e.target.scrollTop + 50;
    // console.log(
    //   bottom,
    //   e.target.scrollHeight,
    //   e.target.scrollTop,
    //   e.target.clientHeight
    // );
    if (bottom) {
      //console.log("BOTTM");
      toTheBottom = true;
      const index = myRooms.findIndex((x) => x.id === currentRoom?.id);
      //console.log(index);
      if (index > -1) {
        let items = [...myRooms];
        let item = { ...myRooms[index] };
        setTotalUnseenMessages((prev) => prev - item.unseenCount);
        item.unseenCount = 0;
        items[index] = item;
        setMyRooms(items);
        socket.emit("readMessage", {
          roomId: currentRoom?.id,
          ownerId: user.id,
          receiveId: item.participants[0].id,
        });

        return () => socket.off("readMessage");
      }
    }
  };

  // useEffect(() => {
  //   socket.on("haveReadMessage", ({receiveUser,roomId, ownerId}) => {
  //     if(currentRoom?.id === roomId && ownerId !== user.id)
  //       document.getElementById("seen").style.visibility = "visible";
  //     else document.getElementById("seen").style.visibility = "hidden";
  //   });
  //   return () => socket.off("haveReadMessage");
  // }, [socket,currentRoom, user]);

  // useEffect(()=>{
  //   if(currentRoom && currentRoom.unseenCount !== 0 ){
  //     document.getElementById("seen").style.visibility = "hidden";
  //   }
  // },[currentRoom])

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const array_move = (arr, old_index, new_index) => {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  };

  const showRoomName = (roomParts) => {
    const array = roomParts.participants.filter((p) => p.id !== user.id);
    if (array.length === 1) {
      return array[0].name;
    }
    return roomParts.name;
  };

  const checkOnline = (roomParts) => {
    const array = roomParts.participants.filter((p) => p.id !== user.id);
    //console.log(array);
    if (array.length === 1 && onlineUsers?.some((u) => u.id === array[0].id)) {
      return "Online";
    } else if (array.length > 1) {
      return "Group";
    }
    return "Offline";
  };

  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const sendTypingEvent = () => {
    socket.emit("sendTyping", {
      receiveId: currentRoom?.participants[0].id,
      senderId: user?.id,
    });

    return () => {
      socket.off("sendTyping");
    };
  };

  const [sender, setSender] = useState(null);
  const timFunc = () => {
    tim = setTimeout(() => {
      setSender(null);
    }, 3000);
  };

  const clearTim = () => {
    clearTimeout(tim);
  };

  //const [timeoutFunction, setTimeoutFunction] = useState(()=>tim());

  useEffect(() => {
    socket.on("typingSend", (senderr) => {
      if (currentRoom?.participants[0].id === senderr.id) {
        setSender(senderr);
        clearTim();
        timFunc();
      }
    });

    return () => {
      socket.off("typingSend");
    };
  }, [socket, currentRoom]);

  const [activeChat, setActiveChat] = useState(null);
  
  

  return (
    <>
      <div id="layoutSidenav">
        <Side />
        <div className="container">
          <h3 className="text-center">
            {currentRoomName
              ? `Đang trò chuyện với ${currentRoomName.name}`
              : "Chọn người để chat nào!"}
          </h3>
          {/* <h3 className="text-center">Choose a friend to CHAT</h3> */}
          <div className="messaging">
            <div className="inbox_msg">
              <div className="inbox_people">
                <div className="headind_srch">
                  <div className="recent_heading">
                    <h4>Danh sách người dùng</h4>
                  </div>
                  <div className="srch_bar">
                    <div className="stylish-input-group">
                      <input
                        type="text"
                        className="search-bar"
                        placeholder="Search"
                      />
                      <span className="input-group-addon">
                        <button type="button">
                          <i className="fa fa-search" aria-hidden="true"></i>
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="inbox_chat">
                  <div className="chat_list">
                    <div className="chat_people">
                      <div className="chat_img">
                        <img
                          src="/assets/images/user-profile.png"
                          alt="sunil"
                        />
                      </div>
                      <div className="chat_ib">
                        <span className="badge badge-pill badge-success float-right">
                          Online
                        </span>
                        <label className="form-check-label">
                          <h4>{user?.name}</h4>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div
                    // v-for="(user, index) in users"
                    // key="index"
                    className="chat_list"
                  >
                    <div>
                      {/* <h3 className="text-success"> Trực tuyến</h3> */}
                      {myRooms &&
                        myRooms.map((room, index) => (
                          <div
                            key={room.id}
                            className={room.id === activeChat?.id ? 'chat_people active_chat' : 'chat_people'}
                            onClick={() => selectedUser(null, room.id)}
                          >
                            <div className="chat_img">
                              <img
                                src="/assets/images/user-profile.png"
                                alt="sunil"
                              />
                            </div>
                            <div className="chat_ib">
                              <span
                                // v-if="user.status == true"
                                className={
                                  checkOnline(room) === "Online"
                                    ? "badge badge-pill badge-success float-right"
                                    : "badge badge-pill badge-secondary float-right"
                                }
                              >
                                {checkOnline(room)}
                              </span>
                              <input
                                className="form-check-input"
                                type="radio"
                                name="check"
                                style={{ display: "none" }}
                              />
                              <label className="form-check-label">
                                <h4>{showRoomName(room)}</h4>
                              </label>
                            </div>
                            <div className={room.unseenCount > 0 ? 'font-weight-bold chat_ib' : 'chat_ib'}>
                              {room.latest.senderId === user.id
                                ? "Bạn: " + room.latest.content
                                : room.latest.content}
                              {room.unseenCount > 0 && (
                                <div
                                  className="bg-danger"
                                  style={{
                                    width: "25px",
                                    textAlign: "center",
                                    marginLeft: "10px",
                                    display: "inline-block",
                                    float: "right",
                                  }}
                                >
                                  <span className="text-white">
                                    {room.unseenCount}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      {/* <hr /> */}
                    </div>
                    <div>
                      {/* <h3 className="text-success"> Trực tuyến</h3> */}
                      {onlineUsersTemp &&
                        onlineUsersTemp
                          .filter((u) => u.id !== user.id)
                          .map((user, index) => (
                            <div
                              key={user.id}
                              className={user.id === activeChat?.id ? 'chat_people active_chat' : 'chat_people'}
                              onClick={() => selectedUser(user.id, null)}
                            >
                              <div className="chat_img">
                                <img
                                  src="/assets/images/user-profile.png"
                                  alt="sunil"
                                />
                              </div>
                              <div className="chat_ib">
                                <span
                                  // v-if="user.status == true"
                                  className="badge badge-pill badge-success float-right"
                                >
                                  Online
                                </span>
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="check"
                                  style={{ display: "none" }}
                                />
                                <label className="form-check-label">
                                  <h4>{user.name}</h4>
                                </label>
                              </div>
                              <div className="chat_ib">&nbsp;</div>
                            </div>
                          ))}
                      {/* <hr /> */}
                    </div>
                    <div>
                      {/* <h3 className="text-danger">Ngoại tuyến</h3> */}
                      {offlineUsers &&
                        offlineUsers
                          .filter((u) => u.id !== user.id)
                          .map((user, index) => (
                            <div
                              key={user.id}
                              className={user.id === activeChat?.id ? 'chat_people active_chat' : 'chat_people'}
                              onClick={() => selectedUser(user.id)}
                            >
                              <div className="chat_img">
                                <img
                                  src="/assets/images/user-profile.png"
                                  alt="sunil"
                                />
                              </div>
                              <div className="chat_ib">
                                <span
                                  // v-else
                                  className="badge badge-pill badge-secondary float-right"
                                >
                                  Offline
                                </span>
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="check"
                                  style={{ display: "none" }}
                                />
                                <label className="form-check-label">
                                  <h4>{user.name}</h4>
                                </label>
                              </div>
                              <div className="chat_ib">&nbsp;</div>
                            </div>
                          ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mesgs" id="mesgs">
                <div
                  className="msg_history"
                  id="msg_history"
                  onScroll={handleScroll}
                >
                  <div className="incoming_msg">
                    {allMessages &&
                      (currentRoom || newRoom) &&
                      allMessages.map((message) => {
                        if (message.senderId === user.id) {
                          return (
                            <div key={message.id}>
                              <div className="outgoing_msg">
                                <div className="sent_msg">
                                  <p>{message.content}</p>
                                  <span className="time_date">
                                    <Moment fromNow date={message?.createdAt} />
                                  </span>
                                </div>
                              </div>

                              <div
                                style={{ float: "left", clear: "both" }}
                                ref={scrollRef}
                              ></div>
                            </div>
                          );
                        } else {
                          return (
                            <div key={message.id}>
                              <div className="incoming_msg_img">
                                <img
                                  src="/assets/images/user-profile.png"
                                  alt="sunil"
                                />
                              </div>
                              <div className="received_msg">
                                <div className="received_withd_msg">
                                  <p>{message.content}</p>
                                  <span className="time_date">
                                    <Moment fromNow date={message?.createdAt} />
                                  </span>
                                </div>
                                <div
                                  style={{ float: "left", clear: "both" }}
                                  ref={scrollRef}
                                ></div>
                              </div>
                            </div>
                          );
                        }
                      })}
                    <div
                      id="seen"
                      style={{ float: "right", marginRight: "5px", visibility:'hidden', height:'20px' }}
                    >
                      <i style={{ color: "green" }} className="fas fa-check">
                        Đã xem
                      </i>
                    </div>
                  </div>
                </div>
                <div className="type_msg">
                  <div className="input_msg_write">
                    <form onSubmit={sendMessage}>
                      <input
                        // v-model="newMessage"
                        // @keyup.enter="sendMessage()"
                        // @keydown="sendTypingEvent()"
                        ref={contentInput}
                        onKeyDown={sendTypingEvent}
                        //onChange = {(e) => setMessage(e.target.value)}
                        type="text"
                        className="write_msg"
                        placeholder="Type a message"
                      />
                      <button className="msg_send_btn" type="submit">
                        <i className="fas fa-paper-plane"></i>
                      </button>
                    </form>
                  </div>
                  {/* <span className="text-muted text-primary"> */}
                  <span className="text-primary">
                    {sender && sender.name + " is typing..."}
                  </span>
                </div>
              </div>
            </div>
            <h4>Loading...</h4>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
