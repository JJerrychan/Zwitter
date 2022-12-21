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
  TextField,
} from "@mui/material";
import xss from "xss";

const ResetName = ({ closeFunction }) => {
  const { currentUser } = useContext(AuthContext);
  const [errorDialog, setErrorDialog] = useState(false);
  const [error, setError] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const displayName = xss(e.target[0].value);
      if (currentUser == null) {
        throw "Please login first";
      }
      const washingtonRef = doc(db, "users", `${currentUser.uid}`);

      await updateProfile(currentUser, {
        displayName,
        photoURL: currentUser.photoURL,
      });
      await updateDoc(washingtonRef, {
        displayName: displayName,
      }).then(closeFunction);
    } catch (e) {
      if (e.code != null) e = e.code;

      setError(e);
      setErrorDialog(true);
    }
  };

  return (
    <Box onSubmit={handleSubmit} component="form" minWidth={400}>
      <DialogContent>
        <TextField
          autoFocus
          variant="standard"
          margin="normal"
          required
          fullWidth
          id="displayName"
          label="New Nickname"
          name="displayName"
          autoComplete="name"
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button size="large" type="submit" color="warning">
          Confirm
        </Button>
      </DialogActions>

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
            <Button color="error" onClick={() => setErrorDialog(false)}>
              Try Again
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
    // <div>
    //   <Dialog open={errorDialog} onClose={() => setErrorDialog(false)}>
    //     <Box maxWidth={400}>
    //       <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
    //         <DialogContentText
    //           fontSize="large"
    //           letterSpacing=".1rem"
    //           fontWeight="bold"
    //         >
    //           {error}
    //         </DialogContentText>
    //       </DialogContent>
    //       <DialogActions sx={{ justifyContent: "center" }}>
    //         <Button color="warning" onClick={() => setErrorDialog(false)}>
    //           Confirm
    //         </Button>
    //       </DialogActions>
    //     </Box>
    //   </Dialog>
    //   <Dialog open={successDialog} onClose={() => setSuccessDialog(false)}>
    //     <Box maxWidth={400}>
    //       <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
    //         <DialogContentText
    //           fontSize="large"
    //           letterSpacing=".1rem"
    //           fontWeight="bold"
    //         >
    //           Success!
    //         </DialogContentText>
    //       </DialogContent>
    //       <DialogActions sx={{ justifyContent: "center" }}>
    //         <Button color="warning" onClick={() => setSuccessDialog(false)}>
    //           Confirm
    //         </Button>
    //       </DialogActions>
    //     </Box>
    //   </Dialog>
    //   <DialogTitle>change displayName</DialogTitle>
    //   <form target="iFrame" onSubmit={handleSubmit}>
    //     <input required type="text" placeholder="new Name" />
    //     <button type="submit">Submit</button>
    //   </form>
    // </div>
  );
};

export default ResetName;
