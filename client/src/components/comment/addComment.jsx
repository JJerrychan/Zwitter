import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { v4 } from 'uuid';
import { 
  doc,
  setDoc, 
  Timestamp 
} from "firebase/firestore";
import { db } from "../../firebase";

const AddComment = ({closeAddComment, post, refresh, parentComment}) => {
  const { currentUser } = useContext(AuthContext);
  const [content, setContent] = useState("")

  async function addComment() {
    if (currentUser == null) {
      throw "Please login first";
    }

    try {

      const parentId = parentComment ? parentComment.id : ""

      const comment = {
        useId: currentUser.uid,
        postUserName: currentUser.displayName,
        postId: post.id,
        content: content,
        parentId: parentId,
        commentDate: Timestamp.fromDate(new Date())
      }

      console.log("comment: ", comment);

      await setDoc(doc(db, "comments", v4()), comment);
      alert("Comment published!")
      closeAddComment()
      refresh()

    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(e) {
    setContent(e.target.value)
  }

  return (
    <div>
        <input id="reply" required type="text" onChange={handleChange} placeholder="comment"></input>
        <button onClick={addComment}>reply</button>
        <button onClick={closeAddComment}>cancle</button>
    </div>
  );
};

export default AddComment;
