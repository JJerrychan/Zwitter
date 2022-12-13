import "./Messenger.css";
import Conversation from "./Conversations";
import Message from "./Message";
import ChatOneline from "./ChatOnline";
import React, { useContext, useEffect, useState } from 'react';
import { Card, CardActionArea, Grid, Link, TextField, Typography } from "@mui/material";
// import { format } from "timeago.js";

const Messenger = () => {
  // const [conversations, setConversations] = useState([]);
  const [conversationsRoom, setconversationsRoom] = useState({});
  //const [allRoomsGroup, setAllRoomsGroup] = useContext(RoomsContext);
  return (
    <Grid >
            <Card variant='outlined'>
                <Card>
                    <h1>Create Chat Room:</h1>
                    <TextField id="roomName" label="roomName" variant="outlined" />
                    {/*<TextField id="roomPassword" label="roomPassword" variant="outlined" />*/}
                    < br/>
                    < br/>
                    <form  className='form' id='add-Room'
                        onSubmit={(e) => {
                            e.preventDefault();
                            const chatRoomName = document.getElementById('roomName').value.trim();
                            //const chatRoomPassword = document.getElementById('roomPassword').value.trim();
                            if (chatRoomName === "") {
                                alert("chatRoomName should not be empty!");
                                return;
                            }
                            /*
                            if (chatRoomPassword === "") {
                                alert("chatRoomPassword should not be empty!");
                                return;
                            }
                            */
                            setconversationsRoom({ ...conversationsRoom, [chatRoomName]: [], /*[chatRoomPassword]:[]*/ });
                        }}
                    >
                        <button className='button' type='submit'>
                            Create Room
                        </button>
                    </form>
                    < br/>
                </Card>
                < br/>
                {
                    Object.keys(conversationsRoom).map((roomName) => {
                        return(
                            <Grid container key={roomName}>
                                <Grid container>
                                <Typography gutterBottom variant='h6' component='h2'>Chat room: {roomName} 
                                    < br/>
                                    <Link className='showlink' href='http://localhost:3000/messages'>JoinRoom</Link>
                                    < br/>
                                </Typography>
                                </Grid>
                            </Grid>
                        );
                    })
                }
                < br/>
            </Card>
        </Grid>
  );
};

export default Messenger;
