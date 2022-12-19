import React, { useContext, useEffect, useState } from "react";
import { Navigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  CardHeader,
  Container,
  Dialog,
  IconButton,
  Stack,
  Tab,
  Typography,
  Tooltip,
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
  getDoc,
} from "firebase/firestore";
import PostDetail from "../post/PostDetail";
import ResetName from "./ResetName";
import ResetPhoto from "./ResetPhoto";
import ResetPassword from "./ResetPassword";
import { ThumbUpAlt, ThumbUpOffAlt } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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
    getMyPosts();
  }, [currentUser.uid, posts.length]);

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
      console.log(postList);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await getMyLikes();
    };
    fetchData();
  }, [currentUser.uid, likes.length]);

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
      throw "Please login first";
    }

    //check already like
    if (!post.like.includes(currentUser.uid)) {
      post.like.push(currentUser.uid);
      await setDoc(doc(db, "posts", post.id), post);
      getMyLikes();
    }
  }

  async function getPostUser(userId) {
    // const data = await db.collection('users').doc(userId)
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
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
      getMyLikes();
    }
  }

  function showPostDetail(post) {
    setPost(post);
  }

  function closeDetail() {
    setPost(null);
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
  const navigate = useNavigate();
  return (
    <Container>
      {currentUser ? (
        <Card elevation={0}>
          <CardHeader
            avatar={
              <Tooltip title={"back"}>
                <IconButton
                  onClick={() => navigate(-1)}
                  size={"small"}
                  sx={{ marginRight: "2rem" }}
                >
                  <ArrowBack fontSize="large" />
                </IconButton>
              </Tooltip>
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
                      <CardContent>
                        <Typography variant={"h5"} component={"h2"}>
                          {post.title}
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
                  </Card>
                );
              })}
            </TabPanel>
            <TabPanel value="2">
              {likes.map((post) => {
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
                      <CardContent>
                        <Typography variant={"h5"} component={"h2"}>
                          {post.title}
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
                  </Card>
                );
              })}
            </TabPanel>
          </TabContext>
        </Card>
      ) : (
        <>Please login first!</>
      )}
      {post != null && <Navigate replace to={"/post/"+ post.id} />}
    </Container>
  );
};

export default Profile;
