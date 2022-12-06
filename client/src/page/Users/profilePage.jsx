import React, { useState } from "react";
// import { Link } from "react-router-dom";

const User = () => {
//   const { form1 } = this.state;
  const [form1, setForm1] = useState(false);
  const handlePassword = () => {
    setForm1(true);
  };
  return (
    <div>
      <p>Profile</p>
      <div>
        {/* <Link to="/user/password">forgot password&emsp;</Link> */}
        <button onClick={handlePassword}>forgot password</button>
        <form style={{ display: form1 ? "block" : "none" }}>
            <p>11</p>
        </form>
      </div>
      {/* <Link to="/login">Login&emsp;</Link> */}
    </div>
  );
};

export default User;
