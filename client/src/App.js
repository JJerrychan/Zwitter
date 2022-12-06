import "./App.css";
import Register from "./page/Register";
import Login from "./page/Login";
import Home from "./page/Home";
import User from "./page/Users/profilePage";
// import Signout from "./page/Signout";
import Header from "./page/Header";
import Password from "./page/Users/changePassword";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {

  const {currentUser} = useContext(AuthContext)
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/signout" element={<Signout />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<User />} />
        <Route path="/user/password" element={<Password />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
