import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { v4 } from "uuid";
import xss from "xss"
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../firebase";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grow,
  IconButton,
  Snackbar,
  TextField,
  Tooltip,
} from "@mui/material";
import { DeleteForever, PhotoCamera } from "@mui/icons-material";

const NewPost = ({ refresh, onChange }) => {
  const { currentUser } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState();
  const [alertbar, setAlertbar] = useState(false);

  const handleAlertClick = () => {
    setAlertbar(true);
  };

  const handleAlertbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertbar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (currentUser == null) {
        onChange();
        throw new Error("Please login first").message;
      }

      //null validation
      if (!title.trim()) {
        alert("Titile cannot be empty!");
        return false;
      }
      if (!content.trim()) {
        alert("Content cannot be empty!");
        return false;
      }
      if (!imgUrl.trim()) {
        alert("Please choose a Picture!");
        return false;
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
            await addNumZwitter(currentUser.uid);
            // alert("Post created!");
            handleAlertClick();
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

  async function addNumZwitter(userId) {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    const num = data.numZwitter + 1;
    setDoc(docRef, { numZwitter: num }, { merge: true });
  }

  function newPostBtn() {
    if (currentUser == null) {
      onChange();
      throw new Error("Please login first").message;
    }
    setShow(true);
  }

  function cancelPost() {
    setShow(false);
    setImgUrl("");
  }

  function imgChange(e) {
    if (e.target.files[0]) {
      setImgUrl(URL.createObjectURL(e.target.files[0]));
      setFile(e.target.files[0]);
    } else {
      setImgUrl("");
      setFile();
    }
  }

  function titleChange(e) {
    if (e.target.value) {
      setTitle(xss(e.target.value));
    } else setTitle("");
  }

  function contentChange(e) {
    if (e.target.value) {
      setContent(xss(e.target.value));
    } else setContent("");
  }

  function delImg(e) {
    e.preventDefault();
    setImgUrl("");
    setFile();
  }

  return (
    <>
      <Snackbar
        open={alertbar}
        autoHideDuration={5000}
        onClose={handleAlertbarClose}
        message="Post created!"
      />
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
        <Grow in={true}>
          <Card component={"form"} onSubmit={handleSubmit} sx={{ marginY: 2 }}>
            <CardContent>
              <TextField
                onChange={titleChange}
                size={"small"}
                label={"Title"}
                required
                margin={"dense"}
                color={"primary"}
                fullWidth
                placeholder={"What's Happening?"}
              />
              <TextField
                onChange={contentChange}
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
                  name="file"
                  id="file"
                />
              </Button>
            </CardContent>
            {imgUrl && (
              <Box paddingX={3}>
                <CardMedia
                  sx={{
                    borderRadius: 3,
                  }}
                  component={"img"}
                  src={imgUrl}
                  alt={"preview"}
                />
                <Tooltip title={"remove photo"}>
                  <IconButton color={"error"} size={"small"} onClick={delImg}>
                    <DeleteForever fontSize={"small"} />
                  </IconButton>
                </Tooltip>
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
        </Grow>
      )}
    </>
  );
};

export default NewPost;
