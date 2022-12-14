import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./Messenger.css";


const Chatroom1 = () => {
  const [state, setState] = useState({ message: "", name: "", roomNum: ""});
  const [chat, setChat] = useState([]);

  const socketRef = useRef();

  useEffect(() => {
    console.log("useEffect1111");
    socketRef.current = io("/");
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log("useEffect2222");

    socketRef.current.on("message", ({ name, message, roomNum}) => {
      console.log("The server has sent some data to all clients");
      setChat([...chat, { name, message, roomNum}]);
    });
    socketRef.current.on("user_join", function (data) {
      setChat([
        ...chat,
        { name: "ChatBot", message: `${data} has joined the chat` },
      ]);
    });

    return () => {
      socketRef.current.off("message");
      socketRef.current.off("user-join");
    };
  }, [chat]);

  const userjoin = (name, roomNum) => {
    console.log("userJoin");
    // socketRef.current.join(roomNum);
    socketRef.current.emit("user_join", name, roomNum);
    // socketRef.current.emit("test", name, roomNum);
  };

  const onMessageSubmit = (e) => {
    let msgEle = document.getElementById("message");
    console.log([msgEle.name], msgEle.value);
    setState({ ...state, [msgEle.name]: msgEle.value });
    // console.log("send to : " + state.roomNum);

    socketRef.current.emit("message", {
      name: state.name,
      message: msgEle.value,
      roomNum: state.roomNum
    });
    e.preventDefault();
    setState({ message: "", name: state.name, roomNum: state.roomNum});
    msgEle.value = "";
    msgEle.focus();
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
      {state.name && (
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

      {!state.name && (
        <form
          className="form"
          onSubmit={(e) => {
            console.log(document.getElementById("username_input").value);
            console.log(document.getElementById("roomNum").value);
            e.preventDefault();
            setState({
              name: document.getElementById("username_input").value,
              roomNum: document.getElementById("roomNum").value,
            });
            // setState({ roomNum: document.getElementById("roomNum").value });
            userjoin(
              document.getElementById("username_input").value,
              document.getElementById("roomNum").value,
            );
            // userName.value = '';
          }}
        >
          <div className="form-group">
            <label>
              User Name:
              <br />
              <input id="username_input" />
            </label>
            <label>
              <br />
              Room Name:
              <br />
              <input id="roomNum" />
            </label>
            {/*
            <select id="roomNum">
              <option value="room1">Room1</option>
              <option value="room2">Room2</option>
            </select>
          */}
          </div>
          <br />

          <br />
          <br />
          <button type="submit"> Click to join</button>
        </form>
      )}
    </div>
  );
}

export default Chatroom1;

