import React, { useContext, useState, useEffect } from "react";
import NewPost from "./post/newPost";
import PostDetail from "./post/postDetail";
import { collection, query, getDocs, orderBy, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
// import { Link } from "react-router-dom";

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([])
  // const [showDetail, setShowDetail] = useState(false)
  const [post, setPost] = useState(null)

  useEffect(() => {
    getPosts();
  }, []);

  async function getPosts() {
    let postList = []
    try {
      const q = query(collection(db, "posts"), orderBy("postDate", "desc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const post = doc.data()
        post.id = doc.id
        postList.push(post)
      });
      setPosts(postList)
    } catch (e) {
      console.log(e);
    }
  }

  async function addLike(e, post) {
    e.stopPropagation()
    //check login
    if (currentUser == null) {
      throw "Please login first";
    }

    //check already like
    if (!post.like.includes(currentUser.uid)) {
      post.like.push(currentUser.uid)
      await setDoc(doc(db, "posts", post.id), post);
      getPosts()
    }
  }

  async function delLike(e, post) {
    e.stopPropagation()
    //check login
    if (currentUser == null) {
      throw "Please login first";
    }

    //check already like
    if (post.like.includes(currentUser.uid)) {
      post.like.splice(post.like.indexOf(currentUser.uid))
      await setDoc(doc(db, "posts", post.id), post);
      getPosts()
    }
  }

  function closeDetail() {
    setPost(null)
  }

  function showPostDetail(post) {
    setPost(post)
  }

  return (
    <div>
      {
        post == null &&
        <div>
          <p>homepage</p>
          <button onClick={getPosts}>refresh</button>
          <NewPost refresh={getPosts}></NewPost>

          {posts.map((post) => {
            return (
              <div onClick={() => showPostDetail(post)} key={post.id}>
                <h1>Title: {post.title}</h1>
                <p>{post.content}</p>
                <img src={post.imgUrl} alt="" width="300" height="300"></img>
                <p>Like: {post.like.length}</p>
                {
                  currentUser &&
                    !post.like.includes(currentUser.uid) ?
                    <button onClick={(e) => addLike(e, post)}>like</button> :
                    <button onClick={(e) => delLike(e, post)}>cancel</button>
                }
              </div>
            );
          })}
        </div>
      }
      {
        post != null &&
        <PostDetail closeDetail={closeDetail} post={post}></PostDetail>
      }
    </div>
  );
};

export default Home;
