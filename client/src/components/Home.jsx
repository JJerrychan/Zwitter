import React, { useContext, useEffect, useState } from "react";
import NewPost from "./post/newPost";
import PostDetail from "./post/postDetail";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
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

  useEffect(() => {
    const fetchData = async () => {
      await getPosts();
    };
    fetchData();
  }, []);

  async function getPosts() {
    let postList = [];
    try {
      const q = query(collection(db, "posts"), orderBy("postDate", "desc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const post = doc.data();
        post.id = doc.id;
        postList.push(post);
      });
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

  function closeDetail() {
    setPost(null);
  }

  function showPostDetail(post) {
    setPost(post);
  }

  return (
    <Container>
      {!post && (
        <Box>
          <Typography component={"h1"} variant={"h5"} fontWeight={"bold"}>
            Home
          </Typography>
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
          <NewPost refresh={getPosts} />

          <Stack spacing={2} divider={<Divider variant={"middle"} />}>
            {posts.map((post) => {
              return (
                <Card key={post.id} elevation={0} square>
                  <CardActionArea onClick={() => showPostDetail(post)}>
                    <CardHeader
                      avatar={
                        <Avatar
                          sx={{ width: 56, height: 56 }}
                          alt={""}
                          src={""}
                        />
                      }
                      subheader={post.postDate.toDate().toLocaleString()}
                      title={`post by ${post.userId}`}
                    />
                    <CardContent>
                      <Typography variant={"h5"} component={"h2"}>
                        title: {post.title}
                      </Typography>
                      {post.content}
                    </CardContent>
                    <Box marginX={6}>
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
                  <CardActions>
                    {currentUser && !post.like.includes(currentUser.uid) ? (
                      <Button
                        onClick={(e) => addLike(e, post)}
                        color={"secondary"}
                        startIcon={<ThumbUpAlt />}
                      >
                        {post.like.length}
                      </Button>
                    ) : (
                      <Button
                        onClick={(e) => delLike(e, post)}
                        color={"secondary"}
                        startIcon={<ThumbUpOffAlt />}
                      >
                        {post.like.length}
                      </Button>
                    )}
                  </CardActions>

                  {/*<div onClick={() => showPostDetail(post)} key={post.id}>*/}
                  {/*  <h1>Title: {post.title}</h1>*/}
                  {/*  <p>{post.content}</p>*/}
                  {/*  <img src={post.imgUrl} alt="" width="300" height="300" />*/}
                  {/*  <p>Like: {post.like.length}</p>*/}
                  {/*{currentUser && !post.like.includes(currentUser.uid) ? (*/}
                  {/*  <button onClick={(e) => addLike(e, post)}>like</button>*/}
                  {/*) : (*/}
                  {/*  <button onClick={(e) => delLike(e, post)}>cancel</button>*/}
                  {/*)}*/}
                  {/*</div>*/}
                </Card>
              );
            })}
          </Stack>
        </Box>
      )}
      {post != null && <PostDetail closeDetail={closeDetail} post={post} />}
    </Container>
  );
};

export default Home;
