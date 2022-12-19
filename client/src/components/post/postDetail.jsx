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
      <div>
        <button onClick={closeDetail}>Back</button>
        <h1>Title: {post.title}</h1>
        <p>{post.content}</p>
        <img src={post.imgUrl} alt="" width="500" height="500"></img>
        <p>Like: {post.like.length}</p>
      </div>
      <div>
        {currentUser &&
          post.userId.includes(currentUser.uid) &&
          <button onClick={(e) => deletePost(e, post)}>Delete</button>
        }
      </div>
      <Comment post={post}></Comment>
    </div>
  );
};

export default PostDetail;
