import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from '../firebase'
import { AuthContext } from '../context/AuthContext'


const Signout = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <button style={{ display: currentUser == null ? "none" : "block" }} onClick={() => signOut(auth)}>logout</button>
  );
};

export default Signout;
