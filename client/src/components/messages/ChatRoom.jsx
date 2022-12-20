import React, { useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./Messenger.css";
//import Password from "./users/resetPassword";
// import Add from "../img/addAvatar.png";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { v4 } from "uuid";

const Chatroom1 = () => {
  const { currentUser } = useContext(AuthContext);
  const [isJoin, setIsJoin] = useState(false);
  //const [isLeave, setIsLeave] = useState(false);
  const navigate = useNavigate();
  const [state, setState] = useState({
    name: "",
    roomNum: "",
    roomPassword: "",
  });
  const [stateMessage, setStateMessage] = useState({
    message: "",
    name: "",
    roomNum: "",
  });
  const [chat, setChat] = useState([]);
  const [chatRoomList, setChatRoomList] = useState([]);

  const socketRef = useRef();

  useEffect(() => {
    try {
      //const URL = "http://localhost:4000";
      //socketRef.current = io(URL, { autoConnect: false });
      //socketRef.current.connect();
      //console.log(socketRef.current);
      socketRef.current = io("ws://zwitter.herokuapp.com", {
        transports: ["websocket", "polling", "flashsocket"],
      });
      socketRef.current.on("connect_error", (err) => {
        alert("something wrong with the server");
        console.log(`connect_error due to ${err.message}`);
        socketRef.current.disconnect();
      });
      return () => {
        socketRef.current.disconnect();
      };
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    try {
      if (isJoin) {
        socketRef.current.on("message", ({ name, message, roomNum }) => {
          console.log("The server has sent some data to all clients");
          setChat([...chat, { name, message, roomNum }]);
        });
        socketRef.current.on("user_join", function (dataName, dataRoom) {
          console.log(dataRoom);
          setChat([
            ...chat,
            {
              name: "ChatBot",
              message: `${dataName} has joined the chat`,
              roomNum: dataRoom,
            },
          ]);
        });
        /*
        if(isLeave===false){
          socketRef.current.on("leave_room", function (dataName, dataRoom){
            setChat([
              ...chat,
              { name: "ChatBot", message: `${dataName} has leave the chat`, roomNum: dataRoom },
            ]);
            setIsLeave(true);
          });
        }
        */
        return () => {
          socketRef.current.off("message");
          socketRef.current.off("user-join");
          //socketRef.current.off("leave_room");
        };
      }
    } catch (error) {
      console.log(error);
    }
  }, [chat, isJoin]);

  useEffect(() => {
    try {
      async function getAllChatRoom() {
        await getAllCreatedRoom();
      }

      getAllChatRoom();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const userjoin = (name, roomNum) => {
    try {
      // socketRef.current.join(roomNum);
      socketRef.current.emit("user_join", name, roomNum);
    } catch (error) {
      console.log(error);
    }
  };

  const userLeave = (name, roomNum) => {
    try {
      // socketRef.current.leave(roomNum);
      socketRef.current.emit("leave_room", name, roomNum);
    } catch (error) {
      console.log(error);
    }
  };

  const onMessageSubmit = (e) => {
    try {
      let msgEle = document.getElementById("message");
      setStateMessage({ ...stateMessage, message: msgEle.value });
      socketRef.current.emit("message", {
        name: stateMessage.name,
        message: msgEle.value,
        roomNum: stateMessage.roomNum,
      });
      e.preventDefault();
      setStateMessage({
        message: "",
        name: stateMessage.name,
        roomNum: stateMessage.roomNum,
      });
      msgEle.value = "";
      msgEle.focus();
    } catch (error) {
      console.log(error);
    }
  };

  const onCreateRoomSubmit = async (e) => {
    try {
      e.preventDefault();
      if(document.getElementById("roomNum").value !== ""){
        const q2 = query(
            collection(db, "chatRoom"),
            where("roomNum", "==", document.getElementById("roomNum").value)
          );
          let querySnapshot = await getDocs(q2);
          querySnapshot.forEach((doc) => {
            alert("chat room is already exist");
            throw "chat room is already exist";
          });
          setState({
            name: currentUser.displayName,
            roomNum: document.getElementById("roomNum").value,
            roomPassword: document.getElementById("room_Password").value,
          });
          await setDoc(doc(db, "chatRoom", v4()), {
            uid: v4(),
            name: currentUser.displayName,
            roomNum: document.getElementById("roomNum").value,
            roomPassword: document.getElementById("room_Password").value,
            //isAdmin,
          });
          alert("chat room is created success");
          await getAllCreatedRoom();
      }
      else{
        alert("chat room name should not be empty");
        throw "chat room name should not be empty";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const joinTheChatRoom = async (e) => {
    try {
      e.preventDefault();
      //console.log("check 1", socketRef.current.connected);
      if (socketRef.current.connected === false) {
        alert("something wrong with the server");
        throw "something wrong with the server";
      }
      const roomName = e.target[0].value;
      const password = e.target[1].value;
      const q2 = query(
        collection(db, "chatRoom"),
        where("roomNum", "==", roomName)
      );
      let querySnapshot = await getDocs(q2);
      let tempCheck = false;
      querySnapshot.forEach((doc) => {
        if (password === doc.data().roomPassword) {
          tempCheck = true;
        }
      });
      if (tempCheck === false) {
        alert("chat room password is wrong");
        throw "chat room password is wrong";
      } else {
        setIsJoin(true);
        //setIsLeave(false);
        setStateMessage({
          name: currentUser.displayName,
          roomNum: roomName,
        });
        userjoin(currentUser.displayName, roomName);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const leaveTheChatRoom = async (e) => {
    try {
      e.preventDefault();
      const roomName = e.target[0].value;
      //setIsLeave(true);
      userLeave(currentUser.displayName, roomName);
      setStateMessage({
        message: "",
        name: "",
        roomNum: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCreatedRoom = async (e) => {
    try {
      const chatRoomData = await getDocs(collection(db, "chatRoom"));
      const roomDataList = [];
      chatRoomData.forEach((doc) => {
        const roomData = doc.data();
        roomData.id = doc.id;
        roomDataList.push(roomData);
      });
      setChatRoomList(roomDataList);
    } catch (error) {
      console.log(error);
    }
  };

  const renderChat = (currentRoom) => {
    return chat.map(({ name, message, roomNum }, index) => (
      <div key={index}>
        {currentRoom === roomNum ? (
          <div>
            <h3>
              {name}: <span>{message}</span>
            </h3>
          </div>
        ) : (
          <></>
        )}
      </div>
    ));
  };

  return (
    <div>
      {currentUser ? (
        <div>
          {stateMessage.name && (
            <div className="card">
              <div className="render-chat">
                <h1>Room: {stateMessage.roomNum} Chat Log</h1>
                {renderChat(stateMessage.roomNum)}
              </div>
              <form onSubmit={onMessageSubmit}>
                <h1>Messenger</h1>
                <div>
                  <input
                    name="message"
                    id="message"
                    variant="outlined"
                    label="Message"
                  />
                </div>
                <button>Send Message</button>
              </form>
              <br />
              <br />
              <form onSubmit={leaveTheChatRoom}>
                <div>
                  <input
                    id="leave_room_name"
                    hidden
                    defaultValue={stateMessage.roomNum}
                  />
                </div>
                <button>Leave Room</button>
              </form>
            </div>
          )}

          {!stateMessage.name && (
            <div className="card">
              <form onSubmit={onCreateRoomSubmit}>
                <div className="form-group">
                  <label>
                    <br />
                    Room Name:
                    <br />
                    <input id="roomNum" />
                  </label>
                  <label>
                    <br />
                    Room Password:
                    <br />
                    <input id="room_Password" />
                  </label>
                </div>
                <button type="submit"> Create Room</button>
              </form>
            </div>
          )}

          <div>
            {!stateMessage.name &&
              (chatRoomList !== [] ? (
                <div>
                  {chatRoomList.map((chatRooms) => {
                    return (
                      <div key={chatRooms.id}>
                        <form onSubmit={joinTheChatRoom}>
                          <br />
                          <br />
                          <label>
                            Room Name: {chatRooms.roomNum}
                            <input
                              id="room_roomNum_Enter"
                              hidden
                              defaultValue={chatRooms.roomNum}
                            />
                            <br />
                            Room Password:
                            <br />
                            <input id="room_Password_Enter" />
                          </label>
                          <button type="submit">Join Room</button>
                          <br />
                          <br />
                        </form>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p></p>
              ))}
          </div>
        </div>
      ) : (
        <>Please login first!</>
      )}
    </div>
  );
};

export default Chatroom1;
