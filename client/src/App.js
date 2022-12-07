import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import User from "./components/Users/profilePage";
// import Signout from "./components/Signout";
import Header from "./components/Header";
import Password from "./components/Users/resetPassword";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "./context/AuthContext";

function App() {

    const {currentUser} = useContext(AuthContext)
    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                {/* <Route path="/signout" element={<Signout />} /> */}
                <Route path="/register" element={<Register/>}/>
                <Route path="/user" element={<User/>}/>
                <Route path="/user/password" element={<Password/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
