import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const email = e.target[0].value;
      const password = e.target[1].value;
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
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
        <p>
          {" "}
          <Link to="/">Home page</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
