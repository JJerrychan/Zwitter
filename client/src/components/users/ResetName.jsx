import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { updateProfile } from "firebase/auth";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";

const ResetName = () => {
  const { currentUser } = useContext(AuthContext);
  const [errorDialog, setErrorDialog] = useState(false);
  const [error, setError] = useState();
  const [successDialog, setSuccessDialog] = useState(false);
  const handleSubmit = async (e) => {
    try {
      const displayName = e.target[0].value;
      if (currentUser == null) {
        throw "Please login first";
      }
      const washingtonRef = doc(db, "users", `${currentUser.uid}`);

      await updateProfile(currentUser, {
        displayName,
        photoURL: currentUser.photoURL,
      });
      // Set the "capital" field of the city 'DC'
      await updateDoc(washingtonRef, {
        displayName: displayName,
      }).then(setSuccessDialog(true));
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
      <p>change displayName</p>
      <form target="iFrame" onSubmit={handleSubmit}>
        <input required type="text" placeholder="new Name"/>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ResetName;
