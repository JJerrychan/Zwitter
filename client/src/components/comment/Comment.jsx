import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { collection, getDocs, orderBy, query, where, doc, getDoc } from "firebase/firestore";
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

const Comment = ({ closeDetail, post, onChange }) => {
  const { currentUser } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState(null);
  const [show, setShow] = useState(false);

  useEffect( () => {
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

        //user info
        commentList[i].user = await getPostUser(commentList[i].userId);

        //reply
        const q2 = query(
          collection(db, "comments"),
          where("parentId", "==", commentList[i].id),
          orderBy("commentDate", "desc")
        );
        const querySnapshot2 = await getDocs(q2);
        let subComments = [];
        querySnapshot2.forEach(async (doc) => {
          const subComment = doc.data();
          subComment.id = doc.id;
          subComment.user = await getPostUser(subComment.userId);
          subComments.push(subComment);
        });
        commentList[i].reply = subComments;
      }

      console.log("comment: ", commentList);
      setTimeout(() => {
        setComments(commentList);
      }, "500")
      // setComments(commentList);
    } catch (e) {
      console.log(e);
    }
  }

  async function getPostUser(userId) {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  }

  function showAddComment() {
    if (currentUser == null) {
      onChange()
      throw new Error("Please login first").message;
    }
    setShow(true);
  }

  function closeAddComment() {
    setComment()
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
                    alt={comment.user.displayName}
                    src={comment.user.photoURL}
                  />
                }
                subheader={comment.commentDate.toDate().toLocaleString()}
                title={comment.user.displayName}
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

              {/* {comment.reply.length > 0 && */}
              {
                comment?.reply.map((item) => {
                  return (
                    <Box pl={5} key={item.id}>
                      <CardHeader
                        avatar={
                          <Avatar
                            sx={{ width: 42, height: 42 }}
                            alt={item.user.displayName}
                            src={item.user.photoURL}
                          />
                        }
                        subheader={item.commentDate.toDate().toLocaleString()}
                        title={item.user.displayName}
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
