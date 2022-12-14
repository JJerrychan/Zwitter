import React, { useContext, useState, useEffect } from "react";
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
  IconButton,
  Stack,
  Tab,
  Typography,
} from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { ArrowBack } from "@mui/icons-material";
import { db } from "../../firebase";
import { collection, query, getDocs, orderBy, doc, setDoc } from "firebase/firestore";


const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [value, setValue] = useState('1');
  const [posts, setPosts] = useState([])
  const [likes, setLikes] = useState([])
  const [post, setPost] = useState(null)

  useEffect(() => {
    getMyPosts();
  }, []);

  useEffect(() => {
    getMyLikes();
  }, []);

  async function getMyPosts() {
    let postList = []
    try {
      const q = query(collection(db, "posts"), orderBy("postDate", "desc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const post = doc.data()
        post.id = doc.id
        if (post.useId === currentUser.uid) {
          setPosts(postList.push(post))
        }
      });
      console.log(postList);
      setPosts(postList)
    } catch (e) {
      console.log(e);
    }
  }

  async function getMyLikes() {
    let postList = []
    try {
      const q = query(collection(db, "posts"), orderBy("postDate", "desc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const post = doc.data()
        post.id = doc.id
        if (post.like.includes(currentUser.uid)) {
          setLikes(postList.push(post))
        }
      });
      console.log(postList);
      setLikes(postList)
    } catch (e) {
      console.log(e);
    }
  }

  async function addLike(post) {
    if (currentUser == null) {
      throw "Please login first";
    }

    if (!post.like.includes(currentUser.uid)) {
      post.like.push(currentUser.uid)
      console.log(post);
      await setDoc(doc(db, "posts", post.id), post);
      getMyPosts()
    }
  }

  function showPostDetail(post) {
    setPost(post)
  }

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  // const [form1, setForm1] = useState(false);
  // const [form2, setForm2] = useState(false);
  // const [form3, setForm3] = useState(false);
  // const handleName = () => {
  //   // console.log(currentUser);
  //   setForm1(false);
  //   setForm2(true);
  //   setForm3(false);
  // };
  // const handlePassword = () => {
  //   setForm1(true);
  //   setForm2(false);
  //   setForm3(false);
  // };
  // const handleProfilephoto = () => {
  //   setForm1(false);
  //   setForm2(false);
  //   setForm3(true);
  // };

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
              <ButtonGroup color={"info"} disableElevation variant={"outlined"}>
                <Button>Change Name</Button>
                <Button>Update Photo</Button>
                <Button>Reset Password</Button>
              </ButtonGroup>
            </Stack>
          </CardContent>
          <TabContext value={value}>
            <Box sx={{ marginX: "auto", borderBottom: 1, borderColor: 'divider' }}>
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
                    <img src={post.imgUrl} alt="" width="300" height="300"></img>
                    <p>Like: {post.like.length}</p>
                    {
                      !post.like.includes(currentUser.uid) &&
                      <button onClick={() => addLike(post)}>like</button>
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
                    <img src={post.imgUrl} alt="" width="300" height="300"></img>
                    <p>Like: {post.like.length}</p>
                    {
                      !post.like.includes(currentUser.uid) &&
                      <button onClick={() => addLike(post)}>like</button>
                    }
                  </div>
                );
              })}
            </TabPanel>
          </TabContext>
        </Card>
      ) : (
        <>Please login first!</>
      )}
    </Container>
  );
};

export default Profile;