import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { v4 } from "uuid";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import { Button } from "@mui/material";

const NewPost = ({ refresh }) => {
  const { currentUser } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [imgUrl, setImgUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const title = e.target[0].value;
    const content = e.target[1].value;
    const file = e.target[2].files[0];

    try {
      const displayName = e.target[0].value;
      if (currentUser == null) {
        throw "Please login first";
      }

      //upload img
      const storageRef = ref(storage, file.name + new Date());

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            const post = {
              useId: currentUser.uid,
              title: title,
              content: content,
              imgUrl: downloadURL,
              postDate: Timestamp.fromDate(new Date()),
              like: [],
            };
            canclePost();
            await setDoc(doc(db, "posts", v4()), post);
            alert("Post created!");
            refresh();
          } catch (error) {
            console.log(error);
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  function newPostBtn() {
    setShow(true);
  }
  function canclePost() {
    setShow(false);
    setImgUrl("");
  }

  function imgChange(e) {
    console.log(e.target.files[0]);
    setImgUrl(URL.createObjectURL(e.target.files[0]));
  }

  function delImg(e) {
    e.preventDefault();
    setImgUrl("");
    e.target.reset();
  }

  return (
    <div>
      {!show && (
        <Button
            disableElevation
          variant={"contained"}
          size={"large"}
          onClick={newPostBtn}
        >
          New Post
        </Button>
      )}

      {show && (
        <div>
          <h1>New Post</h1>
          <form target="iFrame" onSubmit={handleSubmit}>
            <label>Title:</label>
            <input required type="text" id="title" placeholder="title"></input>
            <br />
            <label>Content:</label>
            <input required type="text" placeholder="content"></input>
            <br />
            <label>Picture:</label>
            <input
              required
              type="file"
              id="file"
              onChange={(e) => imgChange(e)}
            />
            {imgUrl !== "" && (
              <div>
                <img src={imgUrl} alt="" width="500" height="500"></img>
                <br />
                <button onClick={delImg}>Delete</button>
              </div>
            )}
            <br />
            <button type="submit">Submit</button>
            <button onClick={canclePost}>Cancle</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default NewPost;
