import React, { useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
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
import { AuthContext } from "../../context/AuthContext";
import { v4 } from "uuid";
import {
  Box,
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Login, People } from "@mui/icons-material";

const Chatroom1 = () => {
  const { currentUser } = useContext(AuthContext);
  const [isJoin, setIsJoin] = useState(false);
  //const [isLeave, setIsLeave] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);

  const handleAlertOpen = (message) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertOpen(false);
  };

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
      socketRef.current = io("wss://zwitter.herokuapp.com", {
        transports: ["websocket", "polling", "flashsocket"],
      });
      socketRef.current.on("connect_error", (err) => {
        handleAlertOpen("something wrong with the server");
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
      const roomNum = document.getElementById("roomNum");
      const roomPassword = document.getElementById("room_Password");
      if (roomNum.value.trim() !== "") {
        const q2 = query(
          collection(db, "chatRoom"),
          where("roomNum", "==", roomNum.value)
        );
        let querySnapshot = await getDocs(q2);
        querySnapshot.forEach((doc) => {
          handleAlertOpen("chat room is already exist");
          throw "chat room is already exist";
        });
        setState({
          name: currentUser.displayName,
          roomNum: roomNum.value,
          roomPassword: roomPassword.value,
        });
        await setDoc(doc(db, "chatRoom", v4()), {
          uid: v4(),
          name: currentUser.displayName,
          roomNum: roomNum.value,
          roomPassword: roomPassword.value, //isAdmin,
        });
        roomNum.value = "";
        roomPassword.value = "";
        handleAlertOpen("chat room is created success");
        await getAllCreatedRoom();
      } else {
        handleAlertOpen("chat room name can not be empty");
        throw "chat room name can not be just space";
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
        handleAlertOpen("something wrong with the server");
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
        handleAlertOpen("chat room password is wrong");
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

  const leaveTheChatRoom = async () => {
    try {
      const roomName = stateMessage.roomNum;
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
      <Box key={index}>
        {currentRoom === roomNum && (
          <Typography variant={"h6"}>
            {name}: {message}
          </Typography>
        )}
      </Box>
    ));
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "97vh",
      }}
    >
      <Snackbar
        open={alertOpen}
        autoHideDuration={5000}
        onClose={handleAlertClose}
        message={alertMessage}
      />

      {currentUser ? (
        <>
          {stateMessage.name ? (
            <>
              <Typography component={"h1"} variant={"h4"} fontWeight={"bold"}>
                Chat Room in{"  "}
                <Typography
                  variant={"h4"}
                  fontWeight={"bold"}
                  component={"span"}
                  color={"secondary"}
                  fontStyle={"italic"}
                >
                  {stateMessage.roomNum}
                </Typography>
              </Typography>
              {renderChat(stateMessage.roomNum)}

              <Paper
                component={"form"}
                onSubmit={onMessageSubmit}
                sx={{ p: 2, mt: "auto" }}
              >
                <Stack>
                  <TextField
                    fullWidth
                    name="message"
                    id="message"
                    variant="outlined"
                    label="Message"
                    placeholder={"say something"}
                  />
                  <Box my={2} alignSelf={"end"}>
                    <Button onClick={leaveTheChatRoom}>Leave Room</Button>
                    <Button variant={"contained"} type={"submit"}>
                      Send Message
                    </Button>
                  </Box>
                </Stack>
              </Paper>
            </>
          ) : (
            <>
              <Typography component={"h1"} variant={"h5"} fontWeight={"bold"}>
                Chat Room
              </Typography>
              <Box
                my={2}
                p={2}
                component={"form"}
                onSubmit={onCreateRoomSubmit}
              >
                <Typography component={"h2"} variant={"h6"}>
                  Create a new room?
                </Typography>
                <Stack my={2} spacing={2} direction={"row"}>
                  <TextField
                    // margin={"dense"}
                    fullWidth
                    id="roomNum"
                    label="Room Name"
                    variant="outlined"
                    placeholder={"Room Name"}
                  />
                  <TextField
                    // margin={"dense"}
                    fullWidth
                    id="room_Password"
                    label="Room Password"
                    variant="outlined"
                    placeholder={"Room Password"}
                  />
                </Stack>
                <Button
                  sx={{}}
                  color={"secondary"}
                  variant={"outlined"}
                  type="submit"
                >
                  Create Room
                </Button>
              </Box>
            </>
          )}

          {!stateMessage.name && chatRoomList !== [] && (
            <List
              sx={{ width: "100%" }}
              subheader={<ListSubheader>online room list</ListSubheader>}
            >
              {chatRoomList.map((chatRooms) => {
                return (
                  <ListItem
                    sx={{ justifyContent: "center" }}
                    key={chatRooms.id}
                  >
                    <Stack
                      direction={"row"}
                      spacing={2}
                      component={"form"}
                      onSubmit={joinTheChatRoom}
                    >
                      <ListItemIcon>
                        <People fontSize={"large"} color={"success"} />
                      </ListItemIcon>
                      <ListItemText>
                        <TextField
                          InputLabelProps={{ sx: { color: "black" } }}
                          disabled
                          variant={"standard"}
                          label={"Room Name:"}
                          id="room_roomNum_Enter"
                          defaultValue={chatRooms.roomNum}
                        />
                      </ListItemText>
                      <TextField
                        variant={"standard"}
                        label={"Room Password:"}
                        id="room_Password_Enter"
                      />
                      <Tooltip title={`Join ${chatRooms.roomNum}`}>
                        <IconButton type={"submit"}>
                          <Login />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </ListItem>
                );
              })}
            </List>
          )}
        </>
      ) : (
        <>Please login first!</>
      )}
    </Container>
  );
};

export default Chatroom1;
