import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Signout from "./Signout";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div>
      <header style={{display: "flex", position: "absolute", right: "0px"}}>
        <Link
          style={{ display: currentUser == null ? "block" : "none" }}
          to="/login"
        >
          Login
        </Link>
        <Link to="/register">Register</Link>

        <Signout />
      </header>
    </div>
  );
};

export default Header;
