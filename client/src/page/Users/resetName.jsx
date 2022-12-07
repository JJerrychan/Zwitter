import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const DisplayName = () => {
  const { currentUser } = useContext(AuthContext);
  const handleSubmit = async (e) => {
    try {
      const displayName = e.target[0].value;
      if (currentUser == null) {
        throw "Please login first";
      }
      const washingtonRef = doc(db, "users", `${currentUser.uid}`);

      // Set the "capital" field of the city 'DC'
      await updateDoc(washingtonRef, {
        displayName: displayName,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <p>change displayName</p>
      <form target="iFrame" onSubmit={handleSubmit}>
        <input required type="text" placeholder="new Name"></input>
        <button type="submit">Submit</button>
      </form>
      <iframe
        id="iFrame"
        name="iFrame"
        title="navigation"
        style={{ display: "none" }}
      ></iframe>
    </div>
  );
};

export default DisplayName;
