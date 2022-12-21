import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { v4 } from "uuid";
import xss from "xss";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { Button, Snackbar, Stack, TextField } from "@mui/material";

const AddComment = ({ closeAddComment, post, refresh, parentComment }) => {
  const { currentUser } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [alertbar, setAlertbar] = useState(false);

  const handleAlertClick = () => {
    setAlertbar(true);
  };

  const handleAlertbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertbar(false);
  };

  async function addComment() {
    if (currentUser == null) {
      throw new Error("Please login first").message;
    }

    //null validation
    if (!content.trim()) {
      handleAlertClick();
      // alert("Content cannot be empty!");
      return false;
    }

    try {
      const parentId = parentComment ? parentComment.id : "";
      const comment = {
        userId: currentUser.uid,
        postUserName: currentUser.displayName,
        postId: post.id,
        content: content.trim(),
        parentId: parentId,
        commentDate: Timestamp.fromDate(new Date()),
      };
      await setDoc(doc(db, "comments", v4()), comment);
      // alert("Comment published!");
      // handleAlertClick();
      closeAddComment();
      refresh();
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(e) {
    setContent(xss(e.target.value));
  }

  return (
    <Stack spacing={1}>
      <Snackbar
        open={alertbar}
        autoHideDuration={5000}
        onClose={handleAlertbarClose}
        message="Cannot be empty!!"
      />
      <TextField
        fullWidth
        multiline
        label="Comment"
        variant={"standard"}
        autoFocus
        id="reply"
        onChange={handleChange}
        placeholder="leave your friendly reply here..."
      />
      <Stack spacing={2} direction={"row"} justifyContent={"end"}>
        <Button
          size={"small"}
          variant="outlined"
          color="secondary"
          onClick={closeAddComment}
        >
          cancel
        </Button>
        <Button
          size={"small"}
          variant="outlined"
          color="success"
          onClick={addComment}
        >
          reply
        </Button>
      </Stack>
    </Stack>
  );
};

export default AddComment;
