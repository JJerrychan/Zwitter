import "./App.css";
import Register from "./page/Register";
import Login from "./page/Login";
import Home from "./page/Home";
import User from "./page/Users/profilePage";
import Signout from "./page/Signout";
import Password from "./page/Users/changePassword";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div>
        <header>
        <Link to="/">Home page&emsp;</Link>
        <Link to="/login">Log in&emsp;</Link>
        <Link to="/signout">Sign out&emsp;</Link>
        <Link to="/register">Register&emsp;</Link>
        <Link to="/user">Profile&emsp;</Link>
        <Link to="/">Upload Zwitter&emsp;</Link>
        <Link to="/">Chat</Link>
        </header>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signout" element={<Signout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<User />} />
        <Route path="/user/password" element={<Password />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
