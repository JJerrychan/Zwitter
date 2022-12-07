import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Password from "./resetPassword";

const User = () => {
  const { currentUser } = useContext(AuthContext);
  const [form1, setForm1] = useState(false);
  const handlePassword = () => {
    setForm1(true);
  };
  const handleName = () => {

  }
  return (
    <div>
      <p style={{ display: currentUser != null ? "none" : "block" }}>Please login first</p>
      <div style={{ display: currentUser == null ? "none" : "block" }}>
        <p>Profile</p>
        <div>
          <button onClick={handlePassword}>reset password</button>
          <button onClick={handleName}>change name</button>
          <div style={{ display: form1 ? "block" : "none" }}>
            <Password style={{ display: form1 ? "block" : "none" }}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
