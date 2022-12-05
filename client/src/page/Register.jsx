import React from "react";
import axios from "axios";

const Register = () => {
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const account = e.target[0].value;
      const displayName = e.target[1].value;
      const password = e.target[2].value;
      const email = e.target[3].value;
      const file = e.target[4].files[0];
      const user = {
        account: e.target[0].value,
        displayName: e.target[1].value,
        password: e.target[2].value,
        email: e.target[3].value,
        file: e.target[4].files[0],
        isAdmin: false,
      };
      console.log(user);
      const url = `http://localhost:4000/users/signup`;
      await axios.post(url, user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">zwitter</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="account" />
          <input required type="text" placeholder="display name" />
          <input required type="password" placeholder="password" />
          <input required type="email" placeholder="email" />
          <input required  type="file" id="file" />
          <button type="submit"> Sign up</button>
        </form>
        <p>You do have an account? Login</p>
      </div>
    </div>
  );
};

export default Register;
