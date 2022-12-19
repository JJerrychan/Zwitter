import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import AddComment from "./AddComment";
import { Box, Button, Card, CardContent } from "@mui/material";

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

      {comments.map((comment) => {
        return (
          <div key={comment.id}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <p>
                  <b>{comment.postUserName}</b>
                </p>
                <p>{comment.content}</p>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => replyComment(comment)}
                >
                  reply
                </Button>
                {comment.reply.length > 0 &&
                  comment.reply.map((item) => {
                    return (
                      <div key={item.id}>
                        <p>
                          <b>{item.postUserName}</b>
                        </p>
                        <p>{item.content}</p>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </Box>
  );
};

export default Comment;
