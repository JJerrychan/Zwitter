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
import { Email, ErrorSharp, Google } from "@mui/icons-material";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useNavigate } from "react-router-dom";

export default function AuthCard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isReg, setIsReg] = useState(true);
  const [openError, setOpenError] = useState(false);
  const [error, setError] = useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleErrorOpen = () => {
    setOpenError(true);
  };
  const handleErrorClose = () => {
    setOpenError(false);
  };

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const email = e.target[0].value;
      const password = e.target[1].value;
      await signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          throw errorCode;
        });
    } catch (error) {
      handleErrorOpen();
      if (error === "auth/wrong-password") setError("password is uncorrect");
      else if (error === "auth/user-not-found") setError("user not found");
      else setError(error);
    }
  };

  const handleSignup = async (e) => {
    try {
      e.preventDefault();
      const email = e.target[0].value;
      const displayName = e.target[1].value;
      const password = e.target[2].value;
      const file = e.target[3].files[0];
      
      
      const q2 = query(collection(db, "users"), where("email", "==", email));

      let querySnapshot = await getDocs(q2);
      querySnapshot.forEach((doc) => {
        throw "email exist";
      });

      console.log(password);
      // Create user
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ).catch((error) => {
        const errorCode = error.code;
        throw errorCode;
      });
      // Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
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
        });
      });
    } catch (error) {
      handleErrorOpen();
      if(error === "auth/weak-password") setError("Password must be at least 6 characters")
      else setError(error);
    }
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
          throw errorCode;
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
          handleErrorOpen();
          if (error === "auth/wrong-password")
            setError("password is uncorrect");
          else if (error === "auth/user-not-found") setError("user not found");
          else setError(error);
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
          <Box component="form" onSubmit={handleSignup} minWidth={600}>
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
              <input required type="file" id="file" />
            </DialogContent>
            <DialogActions sx={{ alignItems: "center" }}>
              <Button size="large" type="submit">
                Next
              </Button>
            </DialogActions>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleLogin} minWidth={600}>
            <DialogTitle>Sign in to Zwitter</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Don't hava an account?{" "}
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

      <Dialog open={openError} onClose={handleErrorClose}>
        <Box minWidth={400}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>{error}</DialogContent>
          <DialogActions sx={{ alignItems: "center" }}>
            <Button size="large" onClick={handleErrorClose}>
              Confirm
            </Button>
          </DialogActions>
        </Box>
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
