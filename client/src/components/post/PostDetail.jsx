import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import Comment from "../comment/Comment";
import { db } from "../../firebase";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  getDoc,
  deleteDoc
} from "firebase/firestore";
import { ArrowBack } from "@mui/icons-material";
import { ThumbUpAlt, ThumbUpOffAlt } from "@mui/icons-material";

// const PostDetail = async ({ closeDetail, post }) => {
const PostDetail = () => {
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const { postId } = useParams();
  const [post, setPost] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await getPost(postId);
    };
    fetchData();
  }, []);

  async function getPost(postId) {
    const docRef = doc(db, "posts", postId);
    const docSnap = await getDoc(docRef);
    const postData = docSnap.data();
    postData.user = await getPostUser(postData.userId);
    postData.id = postId;
    setPost(postData);
  }

  async function getPostUser(userId) {
    // const data = await db.collection('users').doc(userId)
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  }

  useEffect(() => {
    getMyPosts();
  }, []);

  async function getMyPosts() {
    let postList = [];
    try {
      const q = query(collection(db, "posts"), orderBy("postDate", "desc"));
      const querySnapshot = await getDocs(q);

      const docs = querySnapshot.docs;
      for (let i = 0; i < docs.length; i++) {
        const post = docs[i].data();

        post.id = docs[i].id;

        post.user = await getPostUser(post.userId);
        if (post.userId === currentUser.uid) {
          postList.push(post);
        }
      }
      setPosts(postList);
      // console.log(postList);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await getMyLikes();
    };
    fetchData();
  }, []);

  async function getMyLikes() {
    let postList = [];
    try {
      const q = query(collection(db, "posts"), orderBy("postDate", "desc"));
      const querySnapshot = await getDocs(q);

      const docs = querySnapshot.docs;
      for (let i = 0; i < docs.length; i++) {
        const post = docs[i].data();

        post.id = docs[i].id;

        post.user = await getPostUser(post.userId);
        if (post.like.includes(currentUser.uid)) {
          postList.push(post);
        }
      }
      setLikes(postList);
    } catch (e) {
      console.log(e);
    }
  }
  async function addLike(e, post) {
    e.stopPropagation();
    //check login
    if (currentUser == null) {
      throw new Error("Please login first").message
    }

    //check already like
    if (!post.like.includes(currentUser.uid)) {
      post.like.push(currentUser.uid);
      await setDoc(doc(db, "posts", post.id), post);
      getMyLikes();
    }
  }

  async function delLike(e, post) {
    e.stopPropagation();
    //check login
    if (currentUser == null) {
      throw new Error("Please login first")
    }

    //check already like
    if (post.like.includes(currentUser.uid)) {
      post.like.splice(post.like.indexOf(currentUser.uid));
      await setDoc(doc(db, "posts", post.id), post);
      getMyLikes();
    }
  }

  async function deletePost(e, post) {
    e.stopPropagation();
    //check login
    if (currentUser == null) {
      throw "Please login first";
    }

    //check already like
    if (post.userId === currentUser.uid) {
      await deleteDoc(doc(db, "posts", post.id));
      await minusNumZwitter(currentUser.uid)
      // console.log(post);
      alert("Post deleted!");
      // window.location.reload();
    }
  }

  async function minusNumZwitter(userId) {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    const num = data.numZwitter - 1;
    setDoc(docRef, { numZwitter: num }, { merge: true });
  }

  return (
    <Card elevation={0}>
      {/*{back && window.history.back(-1)}*/}
      <Stack direction={"row"} alignItems={"center"}>
        <Tooltip title={"back"}>
          <IconButton
            sx={{ marginRight: "2rem" }}
            size={"small"}
            onClick={() => navigate(-1)}
          // onClick={(closeDetail)}
          >
            <ArrowBack fontSize="large" />
          </IconButton>
        </Tooltip>
        <Typography
          display={"inline"}
          component={"h1"}
          variant={"h5"}
          fontWeight={"bold"}
        >
          Post
        </Typography>
      </Stack>
      {post && (
        <div>
          <CardHeader
            avatar={
              <Avatar
                sx={{ width: 56, height: 56 }}
                alt={post.user.displayName}
                src={post.user.photoURL}
              />
            }
            subheader={post.postDate.toDate().toLocaleString()}
            title={post.user.displayName}
          />
          <Box px={6} pb={2}>
            <CardContent sx={{ paddingTop: 0 }} component={"article"}>
              <Typography variant={"h4"} component={"h2"} gutterBottom>
                {post.title}
              </Typography>
              <Typography variant={"body1"}>{post.content}</Typography>
            </CardContent>
            <CardMedia
              sx={{
                border: 0.1,
                borderColor: "#cfd9de",
                borderRadius: 3,
                borderStyle: "solid",
              }}
              component={"img"}
              src={post.imgUrl}
              alt={post.title}
            />
          </Box>
          <CardActions>
            {currentUser && !post.like.includes(currentUser.uid) ? (
              <Button
                onClick={(e) => addLike(e, post)}
                color={"secondary"}
                startIcon={<ThumbUpOffAlt />}
              >
                {post.like.length}
              </Button>
            ) : (
              <Button
                onClick={(e) => delLike(e, post)}
                color={"secondary"}
                startIcon={<ThumbUpAlt />}
              >
                {post.like.length}
              </Button>
            )}
          </CardActions>
          <CardActions sx={{ flexDirection: "column", display: "contents" }}>
            {currentUser && post.userId.includes(currentUser.uid) && (
              <Link to='/'>
                <Button
                  sx={{ marginX: 2 }}
                  variant="contained"
                  color="error"
                  onClick={(e) => deletePost(e, post)}
                >
                  Delete post
                </Button>
              </Link>
            )}
            <Comment post={post} />
          </CardActions>

        </div>
      )}
    </Card>
  );
};

export default PostDetail;
