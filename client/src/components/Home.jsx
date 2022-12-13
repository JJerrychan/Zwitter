import React, { useContext, useState, useEffect } from "react";
import NewPost from "./post/newPost";
import PostDetail from "./post/postDetail";
import { collection, query, where, getDocs, orderBy, doc, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
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
        setPosts(postList.push(post))
      });
      console.log(postList);
      setPosts(postList)
    } catch (e) {
      console.log(e);
    }
  }

  async function addLike(post) {
    console.log(post);
    //check login
    if (currentUser == null) {
      throw "Please login first";
    }

    //check already like
    if (!post.like.includes(currentUser.uid)) {
      post.like.push(currentUser.uid)
      console.log(post);
      await setDoc(doc(db, "posts", post.id), post);
      getPosts()
    }
  }

  function closeDetail() {
    // setShowDetail(false)
    setPost(null)
  }
  
  function showPostDetail(post) {
    // setShowDetail(true)
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
                  !post.like.includes(currentUser.uid) &&
                  <button onClick={() => addLike(post)}>like</button>
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
