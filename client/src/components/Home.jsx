import React, { useContext, useState, useEffect } from "react";
import NewPost from "./post/newPost";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
// import { Link } from "react-router-dom";

const Home = () => {

  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function getPosts() {
      let postList = []
      try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          setPosts(postList.push(doc.data()))
        });
        console.log(postList);
        setPosts(postList)
      } catch (e) {
        console.log(e);
      }
    }
    getPosts();
  }, []);
  

  return (
    <div>
      <p>homepage</p>
      <NewPost></NewPost>

      {posts.map((post) => {
        
        console.log(post);
        
        return (
          <div>
            <h1>Title: {post.title}</h1>
            <p>{post.content}</p>w
            <img src={post.imgUrl} alt="" width="500" height="500"></img>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
