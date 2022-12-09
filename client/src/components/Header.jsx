import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import Signout from "./Signout";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div>
      <header>
        <Link
          style={{ display: currentUser == null ? "block" : "none" }}
          to="/login"
        >
          Log in
        </Link>
        <Link to="/register">Register&emsp;</Link>
        <Link to="/user">Profile&emsp;</Link>

        <Signout />
      </header>
    </div>
  );
};

export default Header;