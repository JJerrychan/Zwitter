import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import User from "./components/Users/profilePage";
import Message from "./components/messages/Messenger";
import MessageTest from "./components/messages/MessengerTest";
import Password from "./components/Users/resetPassword";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import SideBar from "./components/left/SideBar";
import { Grid } from "@mui/material";
import RightPanel from "./components/right/RightPanel";
import Signout from "./components/Signout";
import Header from "./components/Header";

function App() {
  const { currentUser } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <Grid px={2} container direction="row" justifyContent="center">
        <Grid item component="header" xs={2}>
          <SideBar />
        </Grid>
        <Grid item component="main" xs={7}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signout" element={<Signout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user" element={<User />} />
            <Route path="/messages" element={<Message />} />
            <Route path="/messagesTest" element={<MessageTest />} />
            <Route path="/user/password" element={<Password />} />
          </Routes>
        </Grid>
        <Grid item component="footer" xs={3}>
          <RightPanel />
        </Grid>
      </Grid>
    </BrowserRouter>
  );
}

export default App;
