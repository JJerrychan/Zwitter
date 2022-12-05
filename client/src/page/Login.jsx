import React from "react";
import axios from "axios";
import {Link } from "react-router-dom";

const Login = () => {
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const email = e.target[0].value;
      const password = e.target[1].value;

      const user = {
        email: email,
        password: password,
      };
      const url = `http://localhost:4000/users/login`;
      await axios.post(url, user);
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
        <p>You don't have an account? <Link to="/register">Sign up</Link></p>
        <p> <Link to="/">Home page</Link></p>
      </div>
    </div>
  );
};

export default Login;
