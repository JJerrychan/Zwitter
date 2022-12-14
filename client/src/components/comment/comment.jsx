import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { v4 } from 'uuid';
import { collection,
  query,
  where,
  getDocs,
  doc,
  setDoc, 
  Timestamp,
  orderBy
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { auth, db, storage } from "../../firebase";
import { async } from "@firebase/util";
import AddComment from "./addComment";

const Comment = ({closeDetail, post}) => {
  const { currentUser } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    getComments();
  }, []);
  
  async function getComments() {
    let commentList = []
    try {
      const q = query(collection(db, "comments"), where("postId", "==", post.id), orderBy("commentDate", "desc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        // doc.data() is never undefined for query doc snapshots
        const comment = doc.data()
        comment.id = doc.id
        commentList.push(comment)
      });

      //get all reply
      for (let i = 0; i < commentList.length; i++) {
        
        const q2 = query(collection(db, "comments"), where("parentId", "==", commentList[i].id), orderBy("commentDate", "desc"));
        const querySnapshot2 = await getDocs(q2);
        let subComments = []
        querySnapshot2.forEach(doc => {
          const subComment = doc.data()
          subComment.id = doc.id
          subComments.push(subComment)
        })
        commentList[i].reply = subComments
      }
      
      // console.log("comment: ", commentList);
      setComments(commentList)
    } catch (e) {
      console.log(e);
    }
  }

  function showAddComment() {
    setShow(true)
  }

  function closeAddComment() {
    setShow(false)
  }

  function replyComment(parentComment) {
    setComment(parentComment)
    showAddComment()
  }

  return (
    <div>
        {
          !show &&
          <button onClick={showAddComment}>Add comment</button>
        }
        
        {show &&
          <AddComment closeAddComment={closeAddComment} post={post} refresh={getComments} parentComment={comment}></AddComment>
        }
        
        {comments.map((comment) => {     
          return (
            <div key={comment.id}>
              {/* <p><b>{currentUser.displayName}</b></p> */}
              <p>{comment.content}</p>
              <button onClick={() => replyComment(comment)}>reply</button>
              {
                comment.reply.length > 0 &&
                comment.reply.map((item) => {        
                  return (
                    <div key={item.id}>
                      {/* <p><b>{currentUser.displayName}</b></p> */}
                      <p>{item.content}</p>  
                      <hr></hr>        
                    </div>
                  );
                })
              }
              <hr style={{height: '5px',color:'black'}}></hr>
            </div>
          );
        })}
    </div>
  );
};

export default Comment;
