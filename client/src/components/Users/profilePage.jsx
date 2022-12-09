import React, { useState, useContext } from "react";
// import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Password from "./resetPassword";
import Name from "./resetName";
import LinkToAccount from "./linkToAccount";

const User = () => {
  const { currentUser } = useContext(AuthContext);
  const [form1, setForm1] = useState(false);
  const [form2, setForm2] = useState(false);
  const [form3, setForm3] = useState(false);
  const handleName = () => {
    console.log(currentUser);
    setForm1(false);
    setForm2(true);
    setForm3(false);
  };
  const handlePassword = () => {
    setForm1(true);
    setForm2(false);
    setForm3(false);
  };
  const handleLink = () => {
    setForm1(false);
    setForm2(false);
    setForm3(true);
  };

  return (
    <div>
      <p style={{ display: currentUser != null ? "none" : "block" }}>
        Please login first
      </p>
      <div style={{ display: currentUser == null ? "none" : "block" }}>
        <p>Profile</p>
        <div>
          <button onClick={handlePassword}>reset password</button>
          <button onClick={handleName}>change name</button>
          <button onClick={handleLink}>Link to third-party Accounts</button>
          <div style={{ display: form1 ? "block" : "none" }}>
            <Password />
          </div>
          <div style={{ display: form2 ? "block" : "none" }}>
            <Name />
          </div>
          <div style={{ display: form3 ? "block" : "none" }}>
            <LinkToAccount />
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
