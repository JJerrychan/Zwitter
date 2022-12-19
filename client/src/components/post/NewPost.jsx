import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { v4 } from "uuid";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../firebase";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  TextField,
} from "@mui/material";
import { DeleteForever, PhotoCamera } from "@mui/icons-material";

const NewPost = ({ refresh }) => {
  const { currentUser } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [imgUrl, setImgUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const title = e.target[0].value;
      const content = e.target[1].value;
      const file = e.target[2].files[0];

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
              userId: currentUser.uid,
              title: title,
              content: content,
              imgUrl: downloadURL,
              postDate: Timestamp.fromDate(new Date()),
              like: [],
            };
            cancelPost();
            await setDoc(doc(db, "posts", v4()), post);
            alert("Post created!");
            refresh();
          } catch (error) {
            console.error(error);
          }
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  function newPostBtn() {
    setShow(true);
  }

  function cancelPost() {
    setShow(false);
    setImgUrl("");
  }

  function imgChange(e) {
    if (e.target.files[0]) {
      setImgUrl(URL.createObjectURL(e.target.files[0]));
    } else setImgUrl("");
  }

  function delImg(e) {
    e.preventDefault();
    setImgUrl("");
    // e.target.reset();
  }

  return (
    <>
      {!show ? (
        <Button
          fullWidth
          sx={{ marginY: 2, paddingY: 1.5, textTransform: "none" }}
          variant={"contained"}
          size={"large"}
          onClick={newPostBtn}
        >
          Share Your Story
        </Button>
      ) : (
        <Card component={"form"} onSubmit={handleSubmit} sx={{ marginY: 2 }}>
          <CardContent>
            <TextField
              size={"small"}
              label={"Title"}
              required
              margin={"dense"}
              color={"primary"}
              fullWidth
              placeholder={"What's Happening?"}
            />
            <TextField
              label={"Content"}
              required
              margin={"dense"}
              color={"primary"}
              rows={4}
              fullWidth
              multiline
              autoFocus
              placeholder={"What's Happening?"}
            />
            <Button
              fullWidth
              sx={{ marginTop: 2 }}
              variant="contained"
              component="label"
              startIcon={<PhotoCamera />}
            >
              Share Photo
              <input
                onChange={imgChange}
                hidden
                accept="image/*"
                type="file"
                required
                name="file"
                id="file"
              />
            </Button>
          </CardContent>
          {/*<label>Title:</label>*/}
          {/*<Input required type="text" id="title" placeholder="title" />*/}

          {/*<label>Content:</label>*/}
          {/*<Input required type="text" placeholder="content" rows="3" />*/}

          {/*<label>Picture:</label>*/}
          {/*<input*/}
          {/*  required*/}
          {/*  type="file"*/}
          {/*  id="file"*/}
          {/*  onChange={(e) => imgChange(e)}*/}
          {/*/>*/}

          {imgUrl && (
            <Box paddingX={3}>
              <CardMedia
                sx={{
                  borderRadius: "1.5rem",
                }}
                component={"img"}
                src={imgUrl}
                alt={"preview"}
              />
              <IconButton
                color={"error"}
                size={"small"}
                onClick={delImg}
              >
                <DeleteForever fontSize={"small"} />
              </IconButton>
            </Box>
          )}
          <CardActions sx={{ justifyContent: "end" }}>
            <Button variant="contained" color="success" type="submit">
              Submit
            </Button>
            <Button variant="outlined" color="error" onClick={cancelPost}>
              Cancel
            </Button>
          </CardActions>
        </Card>
      )}
    </>
  );
};

export default NewPost;
