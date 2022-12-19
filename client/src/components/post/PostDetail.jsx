import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Comment from "../comment/Comment";
import { db } from "../../firebase";
import { deleteDoc, doc } from "firebase/firestore";
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

const PostDetail = ({ closeDetail, post }) => {
  const { currentUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  async function deletePost(e, post) {
    e.stopPropagation();
    //check login
    if (currentUser == null) {
      throw "Please login first";
    }

    //check already like
    if (post.userId === currentUser.uid) {
      await deleteDoc(doc(db, "posts", post.id));
      console.log(post);
      alert("Post deleted!");
      window.location.reload();
      // await getPosts();
    }
  }

  return (
    <Card elevation={0}>
      <Stack direction={"row"} alignItems={"center"}>
        <Tooltip title={"back"}>
          <IconButton
            sx={{ marginRight: "2rem" }}
            size={"small"}
            onClick={closeDetail}
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
      {/*<Box>*/}
      {/*  <Typography variant="h1" gutterBottom>*/}
      {/*    {post.title}*/}
      {/*  </Typography>*/}
      {/*  <Typography variant="body1" gutterBottom>*/}
      {/*    {post.content}*/}
      {/*  </Typography>*/}
      {/*  <CardMedia*/}
      {/*    sx={{*/}
      {/*      border: 0.1,*/}
      {/*      borderColor: "#cfd9de",*/}
      {/*      borderRadius: 3,*/}
      {/*      borderStyle: "solid",*/}
      {/*    }}*/}
      {/*    component={"img"}*/}
      {/*    src={post.imgUrl}*/}
      {/*    alt={post.title}*/}
      {/*  />*/}
      {/*</Box>*/}
      <CardActions sx={{ flexDirection: "column", display: "contents" }}>
        {currentUser && post.userId.includes(currentUser.uid) && (
          <Button
            sx={{ float: "right" }}
            variant="contained"
            color="error"
            onClick={(e) => deletePost(e, post)}
          >
            Delete post
          </Button>
        )}
        <Comment post={post} />
      </CardActions>
    </Card>
  );
};

export default PostDetail;
