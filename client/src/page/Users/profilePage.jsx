import React, { useState, useContext } from "react";
// import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Password from "./resetPassword";
import Name from "./resetName";

const User = () => {
  const { currentUser } = useContext(AuthContext);
  const [form1, setForm1] = useState(false);
  const [form2, setForm2] = useState(false);
  const handleName = () => {
    setForm1(false);
    setForm2(true);
  };
  const handlePassword = () => {
    setForm1(true);
    setForm2(false);
  };

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
          <div style={{ display: form2 ? "block" : "none" }}>
            <Name style={{ display: form1 ? "block" : "none" }}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
