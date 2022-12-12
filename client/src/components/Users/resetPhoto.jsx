import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";

const DisplayName = () => {
  const { currentUser } = useContext(AuthContext);
  const [errorDialog, setErrorDialog] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    const file = e.target[0].files[0];

    try {
      const date = new Date().getTime();

      const storageRef = ref(storage, `${currentUser.displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          const userRef = doc(db, "users", `${currentUser.uid}`);
          await updateDoc(userRef, {
            photoURL: downloadURL,
          });
        });
      });
    } catch (error) {
      console.log(error.code);
    }
  };

  return (
    <div>
      <p>change profile photo</p>
      <form target="iFrame" onSubmit={handleSubmit}>
        <input required type="file"></input>
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
