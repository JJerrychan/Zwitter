import "./App.css";
import Home from "./components/Home";
import Profile from "./components/users/Profile";
import Message from "./components/messages/Messenger";
import MessageTest from "./components/messages/MessengerTest";
import ChatRoom from "./components/messages/ChatRoom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import SideBar from "./components/left/SideBar";
import { Container, Grid } from "@mui/material";
import RightPanel from "./components/right/RightPanel";

function App() {
  const { currentUser } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <Container maxWidth={"xl"}>
        <Grid container direction="row" justifyContent="center">
          <Grid item component="header" xs={2}>
            <SideBar />
          </Grid>
          <Grid
            item
            sx={{
              borderLeft: "1px solid #eff3f4",
              borderRight: "1px solid  #eff3f4",
            }}
            component="main"
            xs={7}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/user" element={<Profile />} />
              <Route path="/messages" element={<Message />} />
              <Route path="/messagesTest" element={<MessageTest />} />
              <Route path="/chatRoom" element={<ChatRoom />} />
            </Routes>
          </Grid>
          <Grid item component="footer" xs={3}>
            <RightPanel />
          </Grid>
        </Grid>
      </Container>
    </BrowserRouter>
  );
}

export default App;
