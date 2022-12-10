import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import User from "./components/Users/profilePage";
import Message from "./components/messages/Messenger";
import Header from "./components/Header";
import Password from "./components/Users/resetPassword";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import SideBar from "./components/SideBar";
import { Grid, Link, Typography } from "@mui/material";
// import { Message } from "@mui/icons-material";

function App() {
  const { currentUser } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <Grid
        px={2}
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item component="header" xs={2}>
          <SideBar />
        </Grid>
        <Grid item component="main" xs={8}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/signout" element={<Signout />} /> */}
            <Route path="/register" element={<Register />} />
            <Route path="/user" element={<User />} />
            <Route path="/messages" element={<Message />} />
            <Route path="/user/password" element={<Password />} />
          </Routes>
        </Grid>
        <Grid item component="footer" xs={2}>
          <Typography component="span" fontSize={1}>
            © Zwitter Contributors ·{" "}
            <Link
              underline="hover"
              target="_blank"
              href="https://github.com/JJerrychan/Zwitter"
            >
              Link to Github
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </BrowserRouter>
  );
}

export default App;
