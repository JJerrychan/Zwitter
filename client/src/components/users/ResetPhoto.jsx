import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";

const ResetPhoto = () => {
  const { currentUser } = useContext(AuthContext);
  const [errorDialog, setErrorDialog] = useState(false);
  const [error, setError] = useState();
  const [successDialog, setSuccessDialog] = useState(false);
  const handleSubmit = async (e) => {
    const file = e.target[0].files[0];

    try {
      const date = new Date().getTime();

      const storageRef = ref(storage, `${currentUser.displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          const displayName = currentUser.displayName;
          await updateProfile(currentUser, {
            displayName,
            photoURL: downloadURL,
          });
          const userRef = doc(db, "users", `${currentUser.uid}`);
          await updateDoc(userRef, {
            photoURL: downloadURL,
          });
        }).then(setSuccessDialog(true));
      });
    } catch (error) {
      if (error.code != null) error = error.code;

      setError(error);
      setErrorDialog(true);
    }
  };

  return (
    <div>
      <Dialog open={errorDialog} onClose={() => setErrorDialog(false)}>
        <Box maxWidth={400}>
          <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
            <DialogContentText
              fontSize="large"
              letterSpacing=".1rem"
              fontWeight="bold"
            >
              {error}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button color="warning" onClick={() => setErrorDialog(false)}>
              Confirm
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Dialog open={successDialog} onClose={() => setSuccessDialog(false)}>
        <Box maxWidth={400}>
          <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
            <DialogContentText
              fontSize="large"
              letterSpacing=".1rem"
              fontWeight="bold"
            >
              Success!
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button color="warning" onClick={() => setSuccessDialog(false)}>
              Confirm
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

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

export default ResetPhoto;
