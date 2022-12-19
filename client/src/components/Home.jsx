import React, { useContext, useEffect, useState } from "react";
import NewPost from "./post/NewPost";
import PostDetail from "./post/postDetail";
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
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Refresh, ThumbUpAlt, ThumbUpOffAlt } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  // const [showDetail, setShowDetail] = useState(false)
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState();

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

        post.user = await getPostUser(post.userId);

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
      throw "Please login first";
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
      throw "Please login first";
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

  function closeDetail() {
    setPost(null);
  }

  function showPostDetail(post) {
    setPost(post);
  }

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

        post.user = await getPostUser(post.userId);

        postList.push(post);
      }
      if (postList.length == 0) {
        alert("No more posts");
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
      {!post && (
        <Box>
          <Grid container>
            <Grid item xs={11}>
              <Typography component={"h1"} variant={"h5"} fontWeight={"bold"}>
                Home
              </Typography>
              <NewPost refresh={getPosts} />
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
              return (
                <Card key={post.id} elevation={0} square>
                  <CardActionArea onClick={() => showPostDetail(post)}>
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
                        <Typography variant={"h4"} component={"h2"}>
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
                      <Button
                        onClick={(e) => delLike(e, post)}
                        color={"secondary"}
                        startIcon={<ThumbUpAlt />}
                      >
                        {post.like.length}
                      </Button>
                    ) : (
                      <Button
                        onClick={(e) => addLike(e, post)}
                        color={"secondary"}
                        startIcon={<ThumbUpOffAlt />}
                      >
                        {post.like.length}
                      </Button>
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
      {post != null && <PostDetail closeDetail={closeDetail} post={post} />}
    </Container>
  );
};

export default Home;
