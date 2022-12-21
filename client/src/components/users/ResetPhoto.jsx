import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { s3Config } from "../../config";
// aws
import AWS from "aws-sdk";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ResetPhoto = ({ closeFunction }) => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [errorDialog, setErrorDialog] = useState(false);
  const [error, setError] = useState();
  const [uploadURL, setUploadURL] = useState(null);

  // aws s3
  const S3_BUCKET = "zwitter11";
  AWS.config.update(s3Config);

  const handlePreview = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const imageURL = URL.createObjectURL(file);
    setUploadURL(imageURL);
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (e.target[0].value[0] == null)
        throw new Error("Please select a image").message;
      const file = e.target[0].files[0];
      const date = new Date().getTime();

      // const storageRef = ref(storage, `${currentUser.displayName + date}`);

      const fileName = currentUser.displayName + date;
      // aws s3
      const params = {
        ACL: "public-read",
        Body: file,
        Bucket: `${S3_BUCKET}/image`,
        Key: fileName,
      };

      const upload = new AWS.S3.ManagedUpload({ params });
      upload.promise().then(async (data) => {
        const displayName = currentUser.displayName;
        await updateProfile(currentUser, {
          displayName,
          photoURL: data.Location,
        });
        const userRef = doc(db, "users", `${currentUser.uid}`);
        await updateDoc(userRef, {
          photoURL: data.Location,
        }).then(closeFunction);
        navigate("/user");
      });
    } catch (error) {
      // if (error.code !== undefined) error = error.code;
      // if(error.message !== undefined) error = error.message;
      setError(error);
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
  );
};

export default ResetPhoto;
