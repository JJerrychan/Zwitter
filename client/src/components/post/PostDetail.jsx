import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  Popover,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import {
  ArrowBack,
  DeleteForever,
  ThumbUpAlt,
  ThumbUpOffAlt,
} from "@mui/icons-material";

// const PostDetail = async ({ closeDetail, post }) => {
const PostDetail = () => {
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const { postId } = useParams();
  const [post, setPost] = useState();
  // const [back, setBack] = useState(false);
  const [errorDialog, setErrorDialog] = useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [alertbar, setAlertbar] = useState(false);

  const handleAlertClick = () => {
    setAlertbar(true);
  };

  const handleAlertbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertbar(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

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
    // postData.user = await getPostUser(postData.userId);
    // console.log(postData);
    const user = await getPostUser(postData.userId);
    postData.displayName = user.displayName;
    postData.photoURL = user.photoURL;
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

        const user = await getPostUser(post.userId);
        post.displayName = user.displayName;
        post.photoURL = user.photoURL;

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

        const user = await getPostUser(post.userId);
        post.displayName = user.displayName;
        post.photoURL = user.photoURL;

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
      setErrorDialog(true);
      throw new Error("Please login first").message;
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
      setErrorDialog(true);
      throw new Error("Please login first").message;
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
      setErrorDialog(true);
      throw new Error("Please login first").message;
    }

    //check already like
    if (post.userId === currentUser.uid) {
      await deleteDoc(doc(db, "posts", post.id));
      await minusNumZwitter(currentUser.uid);
      // console.log(post);
      handleAlertClick();
      navigate(-1);
      // window.location.reload();
    }
  }

  async function minusNumZwitter(userId) {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    // console.log(data);
    const num = data.numZwitter - 1;
    // console.log(num);
    setDoc(docRef, { numZwitter: num }, { merge: true });
  }

  return (
    <Container>
      <Snackbar
        open={alertbar}
        autoHideDuration={5000}
        onClose={handleAlertbarClose}
        message="Successfully deleted!"
      />

      <Dialog open={errorDialog} onClose={() => setErrorDialog(false)}>
        <Box maxWidth={400}>
          <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
            <DialogContentText
              fontSize="large"
              letterSpacing=".1rem"
              fontWeight="bold"
            >
              Please Login first.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button color="warning" onClick={() => setErrorDialog(false)}>
              Confirm
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      {post ? (
        <Card elevation={0}>
          {/*{back && <Navigate replace to="/" />}*/}
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

          <CardHeader
            avatar={
              <Avatar
                sx={{ width: 56, height: 56 }}
                alt={post.displayName}
                src={post.photoURL}
              />
            }
            subheader={post.postDate.toDate().toLocaleString()}
            title={post.displayName}
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
          <CardActions sx={{ justifyContent: "end" }}>
            <Popover
              sx={{ mt: 1 }}
              open={open}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Stack p={2}>
                <Typography fontWeight={"bold"} gutterBottom>
                  Confirm Delete?
                </Typography>
                <Button onClick={(e) => deletePost(e, post)} color={"error"}>
                  Confirm
                </Button>
              </Stack>
            </Popover>
            {currentUser && post.userId.includes(currentUser.uid) && (
              <IconButton color="error" onClick={(e) => handleClick(e)}>
                <DeleteForever />
              </IconButton>
            )}
            {currentUser && post.like.includes(currentUser.uid) ? (
              <Tooltip title={"Unlike"}>
                <Button
                  onClick={(e) => delLike(e, post)}
                  color={"secondary"}
                  startIcon={<ThumbUpAlt />}
                >
                  {post.like.length}
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title={"Like"}>
                <Button
                  onClick={(e) => addLike(e, post)}
                  color={"secondary"}
                  startIcon={<ThumbUpOffAlt />}
                >
                  {post.like.length}
                </Button>
              </Tooltip>
            )}
          </CardActions>
          <Comment post={post} onChange={() => setErrorDialog(true)} />
        </Card>
      ) : (
        <p>Invalid post!</p>
      )}
    </Container>
  );
};

export default PostDetail;
