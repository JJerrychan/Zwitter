import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  IconButton,
  Stack,
  Tab,
  Typography,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { ArrowBack } from "@mui/icons-material";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import PostDetail from "../post/postDetail";
import ResetName from "./ResetName";
import ResetPhoto from "./ResetPhoto";
import ResetPassword from "./ResetPassword";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [value, setValue] = useState("1");
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [post, setPost] = useState(null);
  const [profileDialog, setProfileDialog] = useState(false);
  const [operations, setOperations] = useState(0);

  const handleDialogOpen = () => {
    setProfileDialog(true);
  };

  const handleDialogClose = () => {
    setProfileDialog(false);
  };

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
    e.stopPropagation()
    //check login
    if (currentUser == null) {
      throw "Please login first";
    }

    //check already like
    if (!post.like.includes(currentUser.uid)) {
      post.like.push(currentUser.uid)
      await setDoc(doc(db, "posts", post.id), post);
      getMyPosts()
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
      getMyPosts()
    }
  }

  function showPostDetail(post) {
    setPost(post);
  }

  function closeDetail() {
    setPost(null)
  }

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const dialogContent = () => {
    switch (operations) {
      case 0:
        return <ResetName closeFunction={handleDialogClose} />;
      case 1:
        return <ResetPhoto closeFunction={handleDialogClose} />;
      case 2:
        return <ResetPassword closeFunction={handleDialogClose} />;
    }
  };

  return (
    <Container>
      {currentUser ? (
        <Card elevation={0}>
          <CardHeader
            avatar={
              <IconButton size={"small"} sx={{ marginRight: "2rem" }}>
                <ArrowBack fontSize="large" />
              </IconButton>
            }
            title={currentUser.displayName}
            titleTypographyProps={{ fontSize: "1.2rem", fontWeight: "bold" }}
            subheader={`${currentUser.numZwitter} Posts`}
          />
          <CardContent>
            <Stack alignItems={"center"} spacing={3}>
              <Avatar
                sx={{ width: 120, height: 120 }}
                alt={currentUser.displayName}
                src={currentUser.photoURL}
              />
              <Typography variant={"h4"}>{currentUser.displayName}</Typography>
              <ButtonGroup
                color={"secondary"}
                disableElevation
                variant={"outlined"}
              >
                <Button
                  onClick={() => {
                    setOperations(0);
                    handleDialogOpen();
                  }}
                >
                  Change Name
                </Button>
                <Button
                  onClick={() => {
                    setOperations(1);
                    handleDialogOpen();
                  }}
                >
                  Update Photo
                </Button>
                <Button
                  onClick={() => {
                    setOperations(2);
                    handleDialogOpen();
                  }}
                >
                  Reset Password
                </Button>
              </ButtonGroup>
              <Dialog open={profileDialog} onClose={handleDialogClose}>
                {dialogContent()}
              </Dialog>
            </Stack>
          </CardContent>
          <TabContext value={value}>
            <Box
              sx={{ marginX: "auto", borderBottom: 1, borderColor: "divider" }}
            >
              <TabList onChange={handleTabChange} centered>
                <Tab label="My Posts" value="1" />
                <Tab label="My Likes" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              {posts.map((post) => {
                return (
                  <div onClick={() => showPostDetail(post)} key={post.id}>
                    <h1>Title: {post.title}</h1>
                    <p>{post.content}</p>
                    <img src={post.imgUrl} alt="" width="300" height="300" />
                    <p>Like: {post.like.length}</p>
                    {currentUser &&
                      !post.like.includes(currentUser.uid) ?
                      <button onClick={(e) => addLike(e, post)}>like</button> :
                      <button onClick={(e) => delLike(e, post)}>cancel</button>
                    }
                  </div>
                );
              })}
            </TabPanel>
            <TabPanel value="2">
              {likes.map((post) => {
                return (
                  <div onClick={() => showPostDetail(post)} key={post.id}>
                    <h1>Title: {post.title}</h1>
                    <p>{post.content}</p>
                    <img src={post.imgUrl} alt="" width="300" height="300" />
                    <p>Like: {post.like.length}</p>
                    {currentUser &&
                      !post.like.includes(currentUser.uid) ?
                      <button onClick={(e) => addLike(e, post)}>like</button> :
                      <button onClick={(e) => delLike(e, post)}>cancel</button>}
                  </div>
                );
              })}
            </TabPanel>
          </TabContext>
          {
            post != null &&
            <PostDetail closeDetail={closeDetail} post={post}></PostDetail>
          }
        </Card>
      ) : (
        <>Please login first!</>
      )}
    </Container>
  );
};

export default Profile;
