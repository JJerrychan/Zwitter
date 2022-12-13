import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Password from "./resetPassword";
import Name from "./resetName";
import Photo from "./resetPhoto";
import { Container } from "@mui/material";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [form1, setForm1] = useState(false);
  const [form2, setForm2] = useState(false);
  const [form3, setForm3] = useState(false);
  const handleName = () => {
    // console.log(currentUser);
    setForm1(false);
    setForm2(true);
    setForm3(false);
  };
  const handlePassword = () => {
    setForm1(true);
    setForm2(false);
    setForm3(false);
  };
  const handleProfilephoto = () => {
    setForm1(false);
    setForm2(false);
    setForm3(true);
  };

  return (
    <Container>
      <div>
        <p style={{ display: currentUser != null ? "none" : "block" }}>
          Please login first
        </p>
        <div style={{ display: currentUser == null ? "none" : "block" }}>
          <p>Profile</p>
          <div>
            <button onClick={handlePassword}>reset password</button>
            <button onClick={handleName}>change name</button>
            <button onClick={handleProfilephoto}>Change Profile photo</button>
            <div style={{ display: form1 ? "block" : "none" }}>
              <Password />
            </div>
            <div style={{ display: form2 ? "block" : "none" }}>
              <Name />
            </div>
            <div style={{ display: form3 ? "block" : "none" }}>
              <Photo />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Profile;
