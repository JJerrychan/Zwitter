import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NewPost from "./post/NewPost";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  Grid,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Refresh, ThumbUpAlt, ThumbUpOffAlt } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  // const [showDetail, setShowDetail] = useState(false)
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState();
  const map1 = new Map();
  const [userMap, setUserMap] = useState(new Map());
  const [errorDialog, setErrorDialog] = useState(false);
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

  useEffect(() => {
    const fetchData = async () => {
      await getPosts();
    };
    fetchData();
  }, []);

  async function getPosts() {
    let postList = [];
    try {
      const q = query(
        collection(db, "posts"),
        orderBy("postDate", "desc"),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      setLast(querySnapshot.docs[querySnapshot.docs.length - 1]);

      const docs = querySnapshot.docs;
      for (let i = 0; i < docs.length; i++) {
        const post = docs[i].data();
        post.id = docs[i].id;

        // const user = await getPostUser(post.userId);
        // post.displayName = user.displayName;
        // post.photoURL = user.photoURL;

        if (!userMap.has(post.userId)) {
          const user = await getPostUser(post.userId);
          userMap.set(post.userId, user);
        }
        postList.push(post);
      }
      setPosts(postList);
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
      await getPosts();
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
      await getPosts();
    }
  }

  async function getPostUser(userId) {
    // const data = await db.collection('users').doc(userId)
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  }

  // function closeDetail() {
  //   setPost(null);
  // }

  // function showPostDetail(post) {
  //   setPost(post);
  // }

  async function loadMore() {
    let postList = [];
    try {
      // Get the last visible document
      const next = query(
        collection(db, "posts"),
        orderBy("postDate", "desc"),
        startAfter(last),
        limit(10)
      );

      const querySnapshot = await getDocs(next);
      const docs = querySnapshot.docs;
      for (let i = 0; i < docs.length; i++) {
        const post = docs[i].data();
        post.id = docs[i].id;

        // const user = await getPostUser(post.userId);
        // post.displayName = user.displayName;
        // post.photoURL = user.photoURL;
        if (!userMap.has(post.userId)) {
          const user = await getPostUser(post.userId);
          userMap.set(post.userId, user);
        }

        postList.push(post);
      }
      if (postList.length === 0) {
        handleAlertClick();
        // alert("No more posts");
      } else {
        setLast(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setPosts(posts.concat(postList));
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Container>
      <Snackbar
        open={alertbar}
        autoHideDuration={5000}
        onClose={handleAlertbarClose}
        message="No more posts!"
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

      {!post && (
        <Box>
          <Grid container>
            <Grid item xs={11}>
              <Typography component={"h1"} variant={"h5"} fontWeight={"bold"}>
                Home
              </Typography>
              <NewPost
                refresh={getPosts}
                onChange={() => setErrorDialog(true)}
              />
            </Grid>
            <Grid item xs={1}>
              <LoadingButton
                color={"secondary"}
                size={"large"}
                sx={{ float: "right" }}
                loading={loading}
                loadingPosition="start"
                startIcon={<Refresh />}
                onClick={() => {
                  setLoading(true);
                  getPosts().then(() => setLoading(false));
                }}
              >
                refresh
              </LoadingButton>
            </Grid>
          </Grid>

          <Stack my={2} spacing={2} divider={<Divider variant={"middle"} />}>
            {posts.map((post) => {
              // const user = getPostUser(post.userId)
              return (
                <Card key={post.id} elevation={0} square>
                  <CardActionArea onClick={() => navigate("/post/" + post.id)}>
                    <CardHeader
                      avatar={
                        <Avatar
                          sx={{ width: 56, height: 56 }}
                          alt={userMap.get(post.userId).displayName}
                          src={userMap.get(post.userId).photoURL}
                        />
                      }
                      subheader={post.postDate.toDate().toLocaleString()}
                      title={userMap.get(post.userId).displayName}
                    />
                    <Box px={6} pb={2}>
                      <CardContent sx={{ paddingTop: 0 }} component={"article"}>
                        <Typography
                          variant={"h4"}
                          component={"h2"}
                          gutterBottom
                        >
                          {post.title}
                        </Typography>
                        <Typography variant={"body1"}>
                          {post.content}
                        </Typography>
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
                  </CardActionArea>
                  <CardActions sx={{ justifyContent: "end" }}>
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
                </Card>
              );
            })}
            <LoadingButton
              color={"secondary"}
              size={"large"}
              loading={loading}
              loadingPosition="start"
              startIcon={<Refresh />}
              onClick={() => {
                setLoading(true);
                loadMore().then(() => setLoading(false));
              }}
            >
              LOAD MORE
            </LoadingButton>
          </Stack>
        </Box>
      )}
      {/* {post != null && <PostDetail closeDetail={closeDetail} post={post} />} */}
      {/*{post != null && <Navigate replace to={"/post/" + post.id} />}*/}
    </Container>
  );
};

export default Home;
