const { createUserWithEmailAndPassword, updateProfile } = require( "firebase/auth");
const { auth, db, storage } = require("../firebase");
const { ref, uploadBytesResumable, getDownloadURL } = require( "firebase/storage");
const { doc, setDoc } = require( "firebase/firestore");

const express = require("express");
const router = express.Router();

router.post("/signup", async (req, res) => {
  console.log(1)
  // try {
  //   console.log(req.body)
  //   const displayName = req.body.displayName;
  //   const email = req.body.email;
  //   const account = req.body.account;
  //   const isAdmin = req.body.isAdmin;
  //   const password = req.body.password;
  //   const file = req.body.file;
    
  //   // Create user
  //   // const res = await createUserWithEmailAndPassword(
  //   //   auth,
  //   //   email,
  //   //   password
  //   // );
  //   // Create a unique image name
  //   const date = new Date().getTime();
  //   const storageRef = ref(storage, `${account + date}`);
  //   // console.log(file);
  //   await uploadBytesResumable(storageRef, file).then(() => {
  //     getDownloadURL(storageRef).then(async (downloadURL) => {
  //       try {
  //         //Update profile
  //         await updateProfile(res.user, {
  //           account,
  //           photoURL: downloadURL,
  //         });
  //         //create user on firestore
  //         // await setDoc(doc(db, "users", res.user.uid), {
  //         //   uid: res.user.uid,
  //         //   account,
  //         //   displayName,
  //         //   email,
  //         //   isAdmin,
  //         //   photoURL: downloadURL,
  //         // });

  //         // //create empty user chats on firestore
  //         // await setDoc(doc(db, "userChats", res.user.uid), {});
  //         // navigate("/");
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     });
  //   });
  //   // res.status(200).send(res);
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).send(error);
  // }

});


module.exports = router;
