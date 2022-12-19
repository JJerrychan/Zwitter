import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import Comment from "../comment/Comment";
import { db } from "../../firebase";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
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
import { ArrowBack } from "@mui/icons-material";

// const PostDetail = async ({ closeDetail, post }) => {
const PostDetail = () => {
  const { currentUser } = useContext(AuthContext);
  const { postId } = useParams();
  const [post, setPost] = useState();
  const [back, setBack] = useState(false);
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
    postData.id = postId
    setPost(postData)
  }

  async function getPostUser(userId) {
    // const data = await db.collection('users').doc(userId)
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
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
      window.location.reload();
    }
  }

  async function minusNumZwitter(userId) {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data()
    const num = data.numZwitter - 1
    setDoc(docRef, { numZwitter: num }, { merge: true });
  }

  return (
    <Card elevation={0}>
      {back && <Navigate replace to="/" />}
      <Stack direction={"row"} alignItems={"center"}>
        <Tooltip title={"back"}>
          <IconButton
            sx={{ marginRight: "2rem" }}
            size={"small"}
            onClick={() => setBack(true)}
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
      {
        post &&
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
          <CardActions sx={{ flexDirection: "column", display: "contents" }}>
            {currentUser && post.userId.includes(currentUser.uid) && (
              <Button
                sx={{ marginX: 2 }}
                variant="contained"
                color="error"
                onClick={(e) => deletePost(e, post)}
              >
                Delete post
              </Button>
            )}
            <Comment post={post} />
          </CardActions>
        </div>
      }
    </Card>
  );
};

export default PostDetail;
