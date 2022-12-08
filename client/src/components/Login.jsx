import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";

import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";

const Login = () => {
  // // Initialize the FirebaseUI Widget using Firebase.
  // const ui = new firebaseui.auth.AuthUI(firebase.auth());
  //
  // ui.start("#firebaseui-auth-container", {
  //   signInOptions: [
  //     {
  //       provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
  //     },
  //   ],
  // });

  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

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

  return (
    <div>
      <div id="#firebaseui-auth-container"></div>
      <p style={{ display: currentUser == null ? "none" : "block" }}>
        Please log out first
      </p>
      <div style={{ display: currentUser != null ? "none" : "block" }}>
        <span className="logo">Zwitter</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="email" />
          <input required type="password" placeholder="password" />
          <button type="submit"> Login</button>
        </form>
        <p>
          You don't have an account? <Link to="/register">Sign up</Link>
        </p>
        <Link to="/user/password"> Forgot your password?</Link>
      </div>
    </div>
  );
};

export default Login;
