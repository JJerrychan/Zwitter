import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { sendSignInLinkToEmail, updatePassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";

const Password = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const handleSubmit1 = async (e) => {
    try {
      const email = e.target[0].value;
      if (email == null)
        throw "Please input an email"

      //send password reset email
      sendPasswordResetEmail(auth, email)   
      .then(() => {
        signOut(auth)
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    } catch (error) {
      console.log(error);
    }
    // try {
    //   sendSignInLinkToEmail(auth, currentUser.email, actionCodeSettings)
    //     .then(() => {
    //       // The link was successfully sent. Inform the user.
    //       // Save the email locally so you don't need to ask the user for it again
    //       // if they open the link on the same device.
    //       window.localStorage.setItem("emailForSignIn", email);
    //       // ...
    //     })
    //     .catch((error) => {
    //       const errorCode = error.code;
    //       const errorMessage = error.message;
    //       // ...
    //     });
    // } catch (error) {}
  };

  return (
    <div>
      <p>change password</p>
      <form target="iFrame" onSubmit={handleSubmit1}>
        <input required type="text" placeholder="email"></input>
        <button type="submit">Submit</button>
      </form>
      <iframe id="iFrame" name="iFrame" style={{ display: "none" }}></iframe>
    </div>
  );
};

export default Password;
