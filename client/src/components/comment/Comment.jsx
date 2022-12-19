import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import AddComment from "./AddComment";
import {
  Avatar,
  Box,
  Button,
  CardHeader,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

const Comment = ({ closeDetail, post }) => {
  const { currentUser } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    getComments();
  }, []);

  async function getComments() {
    let commentList = [];
    try {
      const q = query(
        collection(db, "comments"),
        where("postId", "==", post.id),
        where("parentId", "==", ""),
        orderBy("commentDate", "desc")
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        // doc.data() is never undefined for query doc snapshots
        const comment = doc.data();
        comment.id = doc.id;
        commentList.push(comment);
      });

      //get all reply
      for (let i = 0; i < commentList.length; i++) {
        const q2 = query(
          collection(db, "comments"),
          where("parentId", "==", commentList[i].id),
          orderBy("commentDate", "desc")
        );
        const querySnapshot2 = await getDocs(q2);
        let subComments = [];
        querySnapshot2.forEach((doc) => {
          const subComment = doc.data();
          subComment.id = doc.id;
          subComments.push(subComment);
        });
        commentList[i].reply = subComments;
      }

      // console.log("comment: ", commentList);
      setComments(commentList);
    } catch (e) {
      console.log(e);
    }
  }

  function showAddComment() {
    setShow(true);
  }

  function closeAddComment() {
    setShow(false);
  }

  function replyComment(parentComment) {
    setComment(parentComment);
    showAddComment();
  }

  return (
    <Box paddingX={4}>
      {show ? (
        <AddComment
          closeAddComment={closeAddComment}
          post={post}
          refresh={getComments}
          parentComment={comment}
        />
      ) : (
        <Button variant="contained" color="success" onClick={showAddComment}>
          Add Comment
        </Button>
      )}
      <Stack spacing={1} divider={<Divider variant={"middle"} />}>
        {comments.map((comment) => {
          return (
            <Box key={comment.id}>
              <CardHeader
                avatar={
                  <Avatar
                    sx={{ width: 42, height: 42 }}
                    alt={comment.postUserName}
                    src={comment.postUserName}
                  />
                }
                subheader={comment.commentDate.toDate().toLocaleString()}
                title={comment.postUserName}
              />
              <Box paddingX={2}>
                <Typography variant={"body1"} gutterBottom>
                  {comment.content}
                </Typography>
                <Button
                  szie={"small"}
                  variant="text"
                  color="secondary"
                  onClick={() => replyComment(comment)}
                >
                  reply
                </Button>
              </Box>

              {comment.reply.length > 0 &&
                comment.reply.map((item) => {
                  return (
                    <Box pl={5} key={item.id}>
                      <CardHeader
                        avatar={
                          <Avatar
                            sx={{ width: 42, height: 42 }}
                            alt={item.postUserName}
                            src={item.postUserName}
                          />
                        }
                        subheader={item.commentDate.toDate().toLocaleString()}
                        title={item.postUserName}
                      />
                      <Box paddingX={2}>
                        <Typography variant={"body1"} gutterBottom>
                          {item.content}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default Comment;
