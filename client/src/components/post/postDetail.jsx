import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Comment from "../comment/comment";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  deleteDoc
} from "firebase/firestore";
import { Typography , CardMedia, Button, Box, CardContent } from "@mui/material";

const PostDetail = ({ closeDetail, post }) => {
  const { currentUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  async function deletePost(e, post) {
    e.stopPropagation();
    //check login
    if (currentUser == null) {
      throw "Please login first";
    }

    //check already like
    if (post.userId === currentUser.uid) {
      await deleteDoc(doc(db, "posts", post.id))
      console.log(post);
      alert("Post deleted!");
      window.location.reload();
      // await getPosts();
    }
  }

  return (
    <div>
      <Button variant="text" onClick={closeDetail}>Go Back</Button>
      <Box sx={{ width: '100%', maxWidth: 500 }}>
        <Typography variant="h1" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {post.content}
        </Typography>
        <CardMedia
          sx={{
            border: 0.1,
            borderColor: "#cfd9de",
            borderRadius: 3,
            borderStyle: "solid",
          }}
          component={"img"}
          src={post.imgUrl}
          alt={""}
        />
      </Box>
      <div>
        {currentUser &&
          post.userId.includes(currentUser.uid) &&
          <Button variant="contained" color="error" onClick={(e) => deletePost(e, post)}>Delete post</Button>
        }
      </div>
      <Comment post={post}></Comment>
    </div>
  );
};

export default PostDetail;
