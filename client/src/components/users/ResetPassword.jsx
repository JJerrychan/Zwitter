import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import xss from "xss";

const ResetPassword = ({ closeFunction }) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = xss(e.target[0].value);
      if (email == null) throw new Error("Please input an email").message;

      //send password reset email
      await sendPasswordResetEmail(auth, email)
        .then(() => {
          closeFunction();
          signOut(auth);
          navigate("/");
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box onSubmit={handleSubmit} component="form" minWidth={400}>
      <DialogContent>
        <DialogContentText>
          A password reset email will be sent to your email address. Then you
          will be logged out.
        </DialogContentText>
        <input hidden defaultValue={currentUser.email}/>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button size="large" onClick={closeFunction} color="success">
          Cancel
        </Button>
        <Button size="large" type="submit" color="error">
          Confirm
        </Button>
      </DialogActions>
    </Box>
    // <div>
    //   <p>change password</p>
    //   <form target="iFrame" onSubmit={handleSubmit1}>
    //     <input required type="text" placeholder="email"></input>
    //     <button type="submit">Submit</button>
    //   </form>
    //   <iframe id="iFrame" name="iFrame" title="navigation" style={{ display: "none" }}></iframe>
    // </div>
  );
};

export default ResetPassword;
