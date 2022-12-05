import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <p>homepage</p>
      <p><Link to="/login">login</Link></p>
      <p><Link to="/register">register</Link></p>
    </div>
  );
};

export default Home;
