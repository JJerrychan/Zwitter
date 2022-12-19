import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { v4 } from 'uuid';
import {
    doc,
    onSnapshot,
    setDoc,
    Timestamp
} from "firebase/firestore";
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { db, storage } from "../../firebase";

const NewPost = ({ refresh }) => {
    const { currentUser } = useContext(AuthContext);
    const [show, setShow] = useState(false);
    //   const [imgUrl, setImgUrl] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();

        // const title = e.target[0].value
        // const content = e.target[1].value
        // const file = e.target[2].files[0]

        try {
            const displayName = e.target[0].value;
            if (currentUser == null) {
                throw "Please login first";
            }

            //upload img
            // const storageRef = ref(storage, file.name + new Date());

            const unSub = onSnapshot(doc(db, "posts", post.id), (doc) => {
                doc.exists() && doc.remove();
            });
            // await uploadBytesResumable(storageRef, file).then(() => {
            //     getDownloadURL(storageRef).then(async () => {
            //         try {
            //             post.remove();
            //             await setDoc(doc(db, "posts", post.id), post);
            //             alert("Post deleted!")
            //             refresh()
            //         } catch (error) {
            //             console.log(error);
            //         }
            //     });
            // });
        } catch (error) {
            console.log(error);
        }
    };


    //   function imgChange(e) {
    //     console.log(e.target.files[0]);
    //     setImgUrl(URL.createObjectURL(e.target.files[0]))
    //   }

    //   function delImg(e) {
    //     e.preventDefault();
    //     setImgUrl("")
    //     e.target.reset()
    //   }

    return (
        <div>
            {show &&
                <div>
                </div>}
        </div>
    );
};

export default NewPost;
