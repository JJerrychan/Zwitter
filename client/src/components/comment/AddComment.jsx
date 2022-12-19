import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { v4 } from "uuid";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { Box, Button, Grid, Stack, TextField } from "@mui/material";

const AddComment = ({ closeAddComment, post, refresh, parentComment }) => {
  const { currentUser } = useContext(AuthContext);
  const [content, setContent] = useState("");

  async function addComment() {
    if (currentUser == null) {
      throw "Please login first";
    }

    try {
      const parentId = parentComment ? parentComment.id : "";
      const comment = {
        useId: currentUser.uid,
        postUserName: currentUser.displayName,
        postId: post.id,
        content: content,
        parentId: parentId,
        commentDate: Timestamp.fromDate(new Date()),
      };
      await setDoc(doc(db, "comments", v4()), comment);
      alert("Comment published!");
      closeAddComment();
      refresh();
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(e) {
    setContent(e.target.value);
  }

  return (
    <Stack spacing={1}>
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
