import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Comment from "../comment/comment";

const PostDetail = ({closeDetail, post}) => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div>
      <div>
        <button onClick={closeDetail}>Back</button>
        <h1>Title: {post.title}</h1>
        <p>{post.content}</p>
        <img src={post.imgUrl} alt="" width="500" height="500"></img>
        <p>Like: {post.like.length}</p>
      </div>
      <Comment post={post}></Comment>
    </div>
  );
};

export default PostDetail;
