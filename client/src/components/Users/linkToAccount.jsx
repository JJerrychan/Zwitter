import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const DisplayName = () => {
  const { currentUser } = useContext(AuthContext);
  const LinkToFacebook = async (e) => {
    try {

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <p onClick={LinkToFacebook}>Link to Facebook</p>
    </div>
  );
};

export default DisplayName;
