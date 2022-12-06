import React from "react";
import { getAuth, signOut } from "firebase/auth";
// import { Link } from "react-router-dom";

const Signout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
    // Sign-out successful.
    }).catch((error) => {
    // An error happened.
    });
  return (
    <div>
      <p>homepage</p>
    </div>
  );
};

export default Signout;
