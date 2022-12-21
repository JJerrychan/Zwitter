import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
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
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
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
import xss from "xss";


export default function AuthCard() {
  const navigate = useNavigate();
  const [emailDialog, setEmailDialog] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [isReg, setIsReg] = useState(true);
  const [errorDialog, setErrorDialog] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleDialogOpen = () => {
    setEmailDialog(true);
  };

  const handleDialogClose = () => {
    setEmailDialog(false);
  };
  
  const passwordDialogOpen = () => {
    setPasswordDialog(true);
    setEmailDialog(false);
  }

  const passwordDialogClose = () => {
    setPasswordDialog(false);
  }

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const email = xss(e.target[0].value);
      const password = xss(e.target[1].value);
      await signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          throw error.code;
        });
    } catch (error) {
      if (error === "auth/wrong-password" || error === "auth/user-not-found")
        setAuthError("Incorrect email address or password, please try again!");
      else setAuthError(error.substring(error.toString().indexOf("/") + 1));
      setErrorDialog(true);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const email = xss(e.target[0].value);
      if (email == null) throw new Error("Please input an email").message;

      //send password reset email
      await sendPasswordResetEmail(auth, email)
        .then(() => {
          setPasswordDialog(false);
        })
        .catch((error) => {
          throw error.code
        });
    } catch (error) {
      if (error === "auth/user-not-found")  setAuthError("email not exist");
      else setAuthError(error.toString().substring(error.indexOf("/") + 1));
      setErrorDialog(true);
    }
  };

  const handleSignup = async (e) => {
    try {
      e.preventDefault();
      const email = xss(e.target[0].value);
      const displayName = xss(e.target[1].value);
      const password = xss(e.target[2].value);
      // const file = e.target[3].files[0];

      // // Create user
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ).catch((error) => {
        throw error.code;
      });
      // Create a unique image name
      // const date = new Date().getTime();
      // const storageRef = ref(storage, `${displayName + date}`);

      await updateProfile(result.user, {
        displayName,
        photoURL: "",
      });
      //create user on firestore
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        displayName,
        email,
        // isAdmin,
        photoURL: "",
        numZwitter: 0,
      });

      // await uploadBytesResumable(storageRef, file).then(() => {
      //   getDownloadURL(storageRef).then(async (downloadURL) => {
      //     //Update profile
      //     await updateProfile(result.user, {
      //       displayName,
      //       photoURL: downloadURL,
      //     });
      //     //create user on firestore
      //     await setDoc(doc(db, "users", result.user.uid), {
      //       uid: result.user.uid,
      //       displayName,
      //       email,
      //       // isAdmin,
      //       photoURL: downloadURL,
      //       numZwitter:0
      //     });
      //     // //create empty user chats on firestore
      //     await setDoc(doc(db, "userChats", result.user.uid), {});
      //   });
      // });
    } catch (error) {
      if (error === "auth/weak-password")
        setAuthError("Password must be at least 6 characters");
      if (error === "auth/email-already-in-use")
        setAuthError("The email has already been used");
      else setAuthError(error.toString().substring(error.indexOf("/") + 1));
      setErrorDialog(true);
    }
  };

  const provider = new GoogleAuthProvider();

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, provider)
        .then((result) => {})
        .catch((error) => {
          // Handle Errors here.
          throw error.code;
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
        // const downloadURL =
        //   "https://firebasestorage.googleapis.com/v0/b/zwitter-e1db4.appspot.com/o/111670652146542?alt=media&token=3cb69685-ebcb-48b2-a4ae-7133b35485a1";

        try {
          //Update profile
          await updateProfile(user, {
            displayName,
            photoURL: "",
          });
          //create user on firestore
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            displayName,
            email,
            photoURL: "",
            numZwitter: 0,
          });

          // await setDoc(doc(db, "userChats", user.uid), {});
        } catch (error) {
          if (error === "auth/wrong-password")
            setAuthError("password is uncorrect");
          else if (error === "auth/user-not-found")
            setAuthError("user not found");
          else setAuthError(error);
          setErrorDialog(true);
        }
      }
    } catch (error) {}
  };

  return (
    <Box
      component="section"
      sx={{
        padding: "1rem",
        borderRadius: "1rem",
        border: "1px solid #eff3f4",
      }}
    >
      <Dialog open={emailDialog} onClose={handleDialogClose}>
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
              {/* <Button
                sx={{ marginTop: 2 }}
                variant="contained"
                component="label"
                endIcon={<PhotoCamera />}
              >
                Upload Avatar
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  required
                  name="file"
                  id="file"
                />
              </Button> */}
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center" }}>
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
            <DialogActions sx={{ justifyContent: "center" }}>
              <Button type="submit">Next</Button>
              <Button onClick={passwordDialogOpen}>Forget Password?</Button>
            </DialogActions>
          </Box>
        )}
      </Dialog>

      <Dialog open={passwordDialog} onClose={passwordDialogClose}>
        <Box onSubmit={handleResetPassword} component="form" minWidth={400}>
          <DialogContent>
            <DialogContentText>
              Please input your email address and a password reset email will be sent to your email address.
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
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button size="large"  color="success" onClick={passwordDialogClose}>
              Cancel
            </Button>
            <Button size="large" type="submit" color="error">
              Confirm
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={errorDialog} onClose={() => setErrorDialog(false)}>
        <Box maxWidth={400}>
          <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
            <DialogContentText
              fontSize="large"
              letterSpacing=".1rem"
              fontWeight="bold"
            >
              {authError}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button color="warning" onClick={() => setErrorDialog(false)}>
              Confirm
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Stack spacing={1}>
        <Typography fontWeight="bold" variant="h5" component="h1">
          New to Zwitter?
        </Typography>
        <Typography color="text.secondary" variant="body2" component="p">
          {"Sign up now to get your own personalized timeline!"}
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
          onClick={handleDialogOpen}
        >
          Sign up with Email
        </Button>
        <Typography
          color="text.secondary"
          fontSize="small"
          variant="body2"
          component="p"
        >
          {
            "By signing up, you agree to the Terms of Service and Privacy Policy, which includes the terms of use of cookies."
          }
        </Typography>
      </Stack>
    </Box>
  );
}
