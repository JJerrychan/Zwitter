import React, { useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./Messenger.css";
//import Password from "./users/resetPassword";
// import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  orderBy,
} from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Container,
  IconButton,
  Stack,
  Tab,
  Typography,
} from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { ArrowBack } from "@mui/icons-material";
import { v4 } from 'uuid';

const Chatroom1 = () => {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [state, setState] = useState({ name: "", roomNum: "", roomPassword: ""});
    const [stateMessage, setStateMessage] = useState({ message: "", name: "", roomNum: ""});
    const [chat, setChat] = useState([]);
    const [chatRoomList, setChatRoomList] = useState([]);

    const socketRef = useRef();

    useEffect(() => {
        console.log("useEffect1111");
        socketRef.current = io("ws://localhost:4000");
        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        console.log("useEffect2222");

        socketRef.current.on("message", ({ name, message, roomNum}) => {
            console.log("The server has sent some data to all clients");
            setChat([...chat, { name, message, roomNum}]);
            console.log("test2"+socketRef.current);
        });
        socketRef.current.on("user_join", function (data) {
        setChat([
            ...chat,
            { name: "ChatBot", message: `${data} has joined the chat` },
        ]);
        console.log("test3"+socketRef.current);
        });

        return () => {
            socketRef.current.off("message");
            socketRef.current.off("user-join");
        };
    }, [chat]);

    useEffect(() => {
        console.log("useEffect3333");
        async function getAllChatRoom() {
            await getAllCreatedRoom();
        }
        getAllChatRoom();
    }, []);

    const userjoin = (name, roomNum) => {
        console.log("userJoin");
        // socketRef.current.join(roomNum);
        socketRef.current.emit("user_join", name, roomNum);
    };

    const onMessageSubmit = (e) => {
        let msgEle = document.getElementById("message");
        console.log([msgEle.name], msgEle.value);
        setStateMessage({ ...state, [msgEle.name]: msgEle.value });

        socketRef.current.emit("message", {
            name: stateMessage.name,
            message: msgEle.value,
            roomNum: stateMessage.roomNum,
        });
        e.preventDefault();
        setStateMessage({ message: "", name: stateMessage.name, roomNum: stateMessage.roomNum});
        msgEle.value = "";
        msgEle.focus();
    };

    const onCreateRoomSubmit = async (e) => {
        try{
    /*
    const queryUserData = await getDocs(collection(db, "user"));
    const userData = await getDocs(queryUserData);
    userData.forEach((doc) => {
        const theUser = doc.data()
        //theUser.id = doc.uid
        if (theUser.id === currentUser.uid) {
          setState({
            name: theUser.displayName,
            roomNum: document.getElementById("roomNum").value,
          });
        }
      });
    */
            e.preventDefault();
            const q2 = query(collection(db, "chatRoom"), where("roomNum", "==", document.getElementById("roomNum").value));
            let querySnapshot = await getDocs(q2);
            querySnapshot.forEach((doc) => {
                console.log("room roomNum: " +doc.data().roomNum);
                console.log("room roomPassword: " +doc.data().roomPassword);
                console.log("room detail2: " +doc.data());
                alert("chat room is already exist");
                throw "chat room is already exist";
            });
            setState({
                name: currentUser.displayName,
                roomNum: document.getElementById("roomNum").value,
                roomPassword: document.getElementById("room_Password").value,
            });
            console.log(document.getElementById("roomNum").value);
            console.log(document.getElementById("room_Password").value);
            await setDoc(doc(db, "chatRoom", v4()), {
                uid: v4(),
                name: currentUser.displayName,
                roomNum: document.getElementById("roomNum").value,
                roomPassword: document.getElementById("room_Password").value,
                // isAdmin,
            });
            await getAllCreatedRoom();
        }catch (error) {
            console.log(error);
        }
    };

    const joinTheChatRoom = async (chatRooms) => {
        const q2 = query(collection(db, "chatRoom"), where("roomNum", "==", chatRooms.roomNum));
        let querySnapshot = await getDocs(q2);
        let tempCheck = false;
        querySnapshot.forEach((doc) => {
            if(chatRooms.roomPassword === doc.data().roomPassword){
                tempCheck = true;
            }
            console.log("room roomPassword for join: " +doc.data().roomPassword);
        });
        if(tempCheck === false){
            alert("chat room password is wrong");
            throw "chat room password is wrong";
        }
        console.log("temp name: " +chatRooms.name);
        console.log("temp password: " +chatRooms.roomNum);
        userjoin(
            chatRooms.name,
            chatRooms.roomNum,
        );
    };

    const getAllCreatedRoom = async (e) => {
        const chatRoomData = await getDocs(collection(db, "chatRoom"));
        const roomDataList = []
        chatRoomData.forEach((doc) => {
            const roomData = doc.data();
            roomData.id = doc.id;
            roomDataList.push(roomData);
        });
        setChatRoomList(roomDataList);
    };


    const renderChat = () => {
        return chat.map(({ name, message }, index) => (
            <div key={index}>
                <h3>
                    {name}: <span>{message}</span>
                </h3>
            </div>
        ));
    };

    return (
        <div>
            {stateMessage.name && (
                <div className="card">
                    <div className="render-chat">
                        <h1>Chat Log</h1>
                        {renderChat()}
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
                </div>
            )}

            {(
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
                {chatRoomList!==[]?
                    <div>
                        {chatRoomList.map((chatRooms) => {
                            return(
                                <div>
                                    <h1>Room Name: {chatRooms.roomNum}</h1>
                                    <h1>Current User Name: {chatRooms.name}</h1>
                                    <h1>Room password: {chatRooms.roomPassword}</h1>
                                    <label>
                                        <br />
                                        Room Password:
                                        <br />
                                        <input id="room_Password_Enter" />
                                    </label>
                                    <button onClick={() => joinTheChatRoom(chatRooms)}>Join Room</button>
                                </div>
                            )
                        })}
                    </div>:<p></p>}
            </div>
        </div>
    );
}

export default Chatroom1;

