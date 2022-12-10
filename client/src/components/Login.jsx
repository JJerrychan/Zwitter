import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const handleSubmit = async (e) => {
    try {
      if (currentUser != null) throw "Please log out first";
      e.preventDefault();
      const email = e.target[0].value;
      const password = e.target[1].value;
      try {
        // console.log(auth);
        await signInWithEmailAndPassword(auth, email, password)
          .then(() => {
            navigate("/");
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogle = async (e) => {
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          // console.log(1);
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    } catch (error) {}
  };

  return (
    <div>
      {/* <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} /> */}

      <p style={{ display: currentUser == null ? "none" : "block" }}>
        Please log out first
      </p>
      <div style={{ display: currentUser != null ? "none" : "block" }}>
        <span className="logo">Zwitter</span>
        <div>
          <form onSubmit={handleSubmit}>
            <input required type="text" placeholder="email" />
            <input required type="password" placeholder="password" />
            <button type="submit"> Login</button>
          </form>
          <Link onClick={handleGoogle}>Log in with Google account</Link>
        </div>
        <p>
          You don't have an account? <Link to="/register">Sign up</Link>
        </p>
        <Link to="/user/password"> Forgot your password?</Link>
      </div>
    </div>
  );
};

export default Login;
