import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
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
import { PhotoCamera } from "@mui/icons-material";

const ResetPhoto = ({ closeFunction }) => {
  const { currentUser } = useContext(AuthContext);
  const [errorDialog, setErrorDialog] = useState(false);
  const [error, setError] = useState();
  const [uploadURL, setUploadURL] = useState(null);

  const handlePreview = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const imageURL = URL.createObjectURL(file);
    setUploadURL(imageURL);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];

    try {
      const date = new Date().getTime();

      const storageRef = ref(storage, `${currentUser.displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef)
          .then(async (downloadURL) => {
            const displayName = currentUser.displayName;
            await updateProfile(currentUser, {
              displayName,
              photoURL: downloadURL,
            });
            const userRef = doc(db, "users", `${currentUser.uid}`);
            await updateDoc(userRef, {
              photoURL: downloadURL,
            });
          })
          .then(closeFunction);
      });
    } catch (e) {
      if (e.code != null) e = e.code;

      setError(e);
      setErrorDialog(true);
    }
  };

  return (
    <Box onSubmit={handleSubmit} component="form" minWidth={400}>
      <DialogContent>
        <Button
          fullWidth
          sx={{ marginY: 2 }}
          variant="contained"
          component="label"
          startIcon={<PhotoCamera />}
        >
          Change Photo
          <input
            onChange={handlePreview}
            hidden
            accept="image/*"
            type="file"
            required
            name="file"
            id="file"
          />
        </Button>
        {uploadURL && <img width={400} src={uploadURL} alt="preview" />}
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
    //
    //   <p>change profile photo</p>
    //   <form target="iFrame" onSubmit={handleSubmit}>
    //     <input required type="file"></input>
    //     <button type="submit">Submit</button>
    //   </form>
    //   <iframe
    //     id="iFrame"
    //     name="iFrame"
    //     title="navigation"
    //     style={{ display: "none" }}
    //   ></iframe>
    // </div>
  );
};

export default ResetPhoto;
