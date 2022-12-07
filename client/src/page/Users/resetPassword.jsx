import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";

const Password = () => {
  const navigate = useNavigate();

  const handleSubmit1 = async (e) => {
    try {
      const email = e.target[0].value;
      if (email == null) throw "Please input an email";

      //send password reset email
      sendPasswordResetEmail(auth, email)
        .then(() => {
          signOut(auth);
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <p>change password</p>
      <form target="iFrame" onSubmit={handleSubmit1}>
        <input required type="text" placeholder="email"></input>
        <button type="submit">Submit</button>
      </form>
      <iframe id="iFrame" name="iFrame" title="navigation" style={{ display: "none" }}></iframe>
    </div>
  );
};

export default Password;
