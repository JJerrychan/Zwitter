import React from "react";
// import { useNavigate } from "react-router-dom";
// import { doc, updateDoc } from "firebase/firestore";
// import { db } from "../../firebase";
import { auth } from "../../firebase";
import { linkWithPopup, GoogleAuthProvider } from "firebase/auth";

const DisplayName = () => {
  const googleProvider = new GoogleAuthProvider();
//   const navigate = useNavigate();

  const LinkToGoogleAccount = async (e) => {
    try {
      linkWithPopup(auth.currentUser, googleProvider)
        .then((result) => {
          // Accounts successfully linked.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (credential) {
            // Accounts successfully linked.
            const user = result.user;
            console.log("success");
            // ...
          } else {
            console.log(2);
          }
        })
        .catch((error) => {
          // Handle Errors here.
          console.log(error);
          // ...
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button onClick={LinkToGoogleAccount}>Link to Google Account</button>
    </div>
  );
};

export default DisplayName;
