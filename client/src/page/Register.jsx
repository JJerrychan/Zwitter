import React from "react";
import axios, { toFormData } from "axios";

const Register = () => {
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const account = e.target[0].value;
      const displayName = e.target[1].value;
      const password = e.target[2].value;
      const email = e.target[3].value;
      const file = e.target[4].files[0];
      console.log(file)
      const formData = toFormData({
        account: account,
        displayName: displayName,
        password: password,
        email: email,
        isAdmin: false,
      });
      formData.append('file', file)
      // const user = {
      //   account: account,
      //   displayName: displayName,
      //   password: password,
      //   email: email,
      //   file: formData,
      //   isAdmin: false,
      // };
      const url = `http://localhost:4000/users/signup`;
      await axios.post(url, formData);
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
