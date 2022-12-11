import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Email, Google } from "@mui/icons-material";
import {
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AuthCard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isReg, setIsReg] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
        const downloadURL =
          "https://firebasestorage.googleapis.com/v0/b/zwitter-e1db4.appspot.com/o/111670652146542?alt=media&token=3cb69685-ebcb-48b2-a4ae-7133b35485a1";

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
      <Dialog open={open} onClose={handleClose}>
        {isReg ? (
          <Box component="form" onSubmit={handleClose} minWidth={600}>
            <DialogTitle>Sign up to Zwitter</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Already hava an account?{" "}
                <Link underline="hover" onClick={() => setIsReg(false)}>
                  Sign in
                </Link>
              </DialogContentText>
              <TextField
                variant="standard"
                margin="normal"
                required
                fullWidth
                type="email"
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                variant="standard"
                margin="normal"
                required
                fullWidth
                id="displayName"
                label="Nickname"
                name="displayName"
                autoComplete="name"
              />
              <TextField
                variant="standard"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </DialogContent>
            <DialogActions>
              <Button size="large" sx={{ margin: "auto" }} type="submit">
                Next
              </Button>
            </DialogActions>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleClose} minWidth={600}>
            <DialogTitle>Sign in to Zwitter</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Don't hava an account? {" "}
                <Link underline="hover" onClick={() => setIsReg(true)}>
                  Sign up
                </Link>
              </DialogContentText>
              <TextField
                  variant="standard"
                  margin="normal"
                  required
                  fullWidth
                  type="email"
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
              />
              <TextField
                variant="standard"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </DialogContent>
            <DialogActions>
              <Button type="submit">Next</Button>
              <Button onClick={handleClose}>Forget Password?</Button>
            </DialogActions>
          </Box>
        )}
      </Dialog>

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
          Sign up with Google
        </Button>
        <Button
          sx={{ fontWeight: "bold" }}
          size="small"
          variant="outlined"
          startIcon={<Email />}
          onClick={handleClickOpen}
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
