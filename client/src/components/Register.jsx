import React from "react";
// import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const displayName = e.target[0].value;
      const password = e.target[1].value;
      const email = e.target[2].value;
      const file = e.target[3].files[0];

      //Check user exist
      // const q1 = query(
      //   collection(db, "users"),
      //   where("displayName", "==", displayName)
      // );
      const q2 = query(collection(db, "users"), where("email", "==", email));
      // let querySnapshot = await getDocs(q1);

      // querySnapshot.forEach((doc) => {
      //   throw "account exist";
      // });
      let querySnapshot = await getDocs(q2);
      querySnapshot.forEach((doc) => {
        throw "email exist";
      });

      // Create user
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(result.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", result.user.uid), {
              uid: result.user.uid,
              displayName,
              email,
              // isAdmin,
              photoURL: downloadURL,
            });

            // //create empty user chats on firestore
            await setDoc(doc(db, "userChats", result.user.uid), {});
            navigate("/login");
          } catch (error) {
            console.log(error);
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Zwitter</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="display name" />
          <input required type="password" placeholder="password" />
          <input required type="email" placeholder="email" />
          <input required type="file" id="file" />
          <button type="submit"> Sign up</button>
        </form>
        <p>
          You do have an account? <Link to="/login">Login</Link>
        </p>
        <Link to="/user/password"> Forgot your password?</Link>
      </div>
    </div>
  );
};

export default Register;
