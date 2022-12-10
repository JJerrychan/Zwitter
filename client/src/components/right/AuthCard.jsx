import React from "react";
import { Box, Stack, Typography, Button } from "@mui/material";
// import { Button } from "@mui/material-next";
import { Email, Google } from "@mui/icons-material";
import {
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../../firebase";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";

export default function AuthCard() {
  const provider = new GoogleAuthProvider();
  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(`${errorCode}:${errorMessage}`);
        });

      let user = auth.currentUser;
      const q2 = query(
        collection(db, "users"),
        where("email", "==", user.email)
      );
      let newAccount = true;
      let querySnapshot = await getDocs(q2);
      querySnapshot.forEach((doc) => {
        newAccount = false;
      });

      if (newAccount) {
        const displayName = user.displayName;
        const email = user.email;
        const downloadURL = "https://firebasestorage.googleapis.com/v0/b/zwitter-e1db4.appspot.com/o/111670652146542?alt=media&token=3cb69685-ebcb-48b2-a4ae-7133b35485a1"
        
        try {
          //Update profile
          await updateProfile(user, {
            displayName,
            photoURL: downloadURL,
          });
          //create user on firestore
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            displayName,
            email,
            photoURL: downloadURL,
          });

          await setDoc(doc(db, "userChats", user.uid), {});
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {}
  };

  return (
    <Box
      component="section"
      sx={{
        marginY: "10px",
        padding: "15px",
        borderRadius: "16px",
        border: "1px solid #eff3f4",
      }}
    >
      <Stack spacing={1}>
        <Typography fontWeight="bold" variant="h5" component="h2">
          New to Zwitter?
        </Typography>
        <Typography color="#536471" variant="body2" component="p">
          Sign up now to get your own personalized timeline!
        </Typography>
        <Button
          sx={{ fontWeight: "bold" }}
          size="small"
          variant="outlined"
          startIcon={<Google />}
          onClick={handleGoogle}
        >
          Sign in with Google
        </Button>
        <Button
          sx={{ fontWeight: "bold" }}
          size="small"
          variant="outlined"
          startIcon={<Email />}
        >
          Sign in with Email
        </Button>
        <Button
          sx={{ fontWeight: "bold" }}
          size="small"
          variant="outlined"
          startIcon={<Email />}
        >
          Sign up with Email
        </Button>
        <Typography
          color="#536471"
          fontSize="small"
          variant="body2"
          component="p"
        >
          By signing up, you agree to the Terms of Service and Privacy Policy,
          which includes the terms of use of cookies.
        </Typography>
      </Stack>
    </Box>
  );
}
