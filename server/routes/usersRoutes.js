const {
  createUserWithEmailAndPassword,
  updateProfile,
} = require("firebase/auth");
const { auth, db, storage } = require("../firebase");
const {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} = require("firebase/storage");
const {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} = require("firebase/firestore");

const express = require("express");
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const displayName = req.body.displayName;
    const email = req.body.email;
    const isAdmin = req.body.isAdmin;
    const password = req.body.password;
    const file = req.files[0];

    //Check user exist
    const q1 = query(collection(db, "users"), where("displayName", "==", displayName));
    const q2 = query(collection(db, "users"), where("email", "==", email));
    let querySnapshot = await getDocs(q1);

    querySnapshot.forEach((doc) => {
      throw "account exist";
    });
    querySnapshot = await getDocs(q2);
    querySnapshot.forEach((doc) => {
      throw "email exist";
    });

    // Create user
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Create a unique image name
    const date = new Date().getTime();
    const storageRef = ref(storage, `${displayName + date}`);

    await uploadBytesResumable(storageRef, file.buffer).then(() => {
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
            isAdmin,
            photoURL: downloadURL,
          });

          // //create empty user chats on firestore
          await setDoc(doc(db, "userChats", result.user.uid), {});
        } catch (error) {
          console.log(error);
        }
      });
    });
    res.status(200).json({email:email, displayName: displayName, isAdmin: isAdmin, file:file});
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
  } catch (error) {}
});

module.exports = router;
