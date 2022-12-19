import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
// import {
//     Avatar,
//     Box,
//     Button,
//     ButtonGroup,
//     Card,
//     CardContent,
//     CardHeader,
//     Container,
//     Dialog,
//     IconButton,
//     Stack,
//     Tab,
//     Typography,
// } from "@mui/material";
// import TabContext from "@mui/lab/TabContext";
// import TabList from "@mui/lab/TabList";
// import TabPanel from "@mui/lab/TabPanel";
// import { ArrowBack } from "@mui/icons-material";
// import PostDetail from "../post/postDetail";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";

const ProfileFunc = () => {
  const { currentUser } = useContext(AuthContext);
  // const [value, setValue] = useState("1");
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [post, setPost] = useState(null);

  async function getMyPosts() {
    let postList = [];
    try {
      const q = query(collection(db, "posts"), orderBy("postDate", "desc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const post = doc.data();
        post.id = doc.id;
        if (post.useId === currentUser.uid) {
          setPosts(postList.push(post));
        }
      });
      console.log(postList);
      setPosts(postList);
    } catch (e) {
      console.log(e);
    }
  }

  async function getMyLikes() {
    let postList = [];
    try {
      const q = query(collection(db, "posts"), orderBy("postDate", "desc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const post = doc.data();
        post.id = doc.id;
        if (post.like.includes(currentUser.uid)) {
          setLikes(postList.push(post));
        }
      });
      console.log(postList);
      setLikes(postList);
    } catch (e) {
      console.log(e);
    }
  }

  async function addLike(e, post) {
    e.stopPropagation();
    //check login
    if (currentUser == null) {
      throw "Please login first";
    }

    //check already like
    if (!post.like.includes(currentUser.uid)) {
      post.like.push(currentUser.uid);
      await setDoc(doc(db, "posts", post.id), post);
      getMyPosts();
    }
  }

  async function delLike(e, post) {
    e.stopPropagation();
    //check login
    if (currentUser == null) {
      throw "Please login first";
    }

    //check already like
    if (post.like.includes(currentUser.uid)) {
      post.like.splice(post.like.indexOf(currentUser.uid));
      await setDoc(doc(db, "posts", post.id), post);
      getMyPosts();
    }
  }

  function showPostDetail(post) {
    setPost(post);
  }

  function closeDetail() {
    setPost(null);
  }

  useEffect(() => {
    async function getPosts() {
      await getMyPosts();
    }

    getPosts();
  }, []);

  useEffect(() => {
    async function getLikes() {
      await getMyLikes();
    }

    getLikes();
  }, []);
};

export default ProfileFunc;
